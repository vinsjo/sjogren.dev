import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Octokit } from '@octokit/rest';
import { pick } from '../misc';

export type Repo = Awaited<
  ReturnType<Octokit['rest']['repos']['listForAuthenticatedUser']>
>['data'][number];

export type Owner = Repo['owner'];
export type License = Repo['license'];

const repoPropKeys = [
  'id',
  'name',
  'full_name',
  'description',
  'url',
  'html_url',
  'created_at',
  'updated_at',
  'pushed_at',
  'language',
  'homepage',
] as const satisfies Array<keyof Repo>;

export type PartialRepo = Pick<Repo, (typeof repoPropKeys)[number]> & {
  package_name: Nullable<string>;
};

type PackageJSON = Readonly<{
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  repository: Record<string, string>;
  type: string;
  source: string;
  main: string;
  module: string;
  types: string;
  exports: string;
  files: string[];
  browserslist: string[];
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
  dependencies: Record<string, string>;
  keywords: string[];
}>;

const PROFILE_REPO_NAME = 'vinsjo';
const THIS_REPO_NAME = 'sjogren.dev';

const { GH_UA, GH_AUTH } = process.env;

const devCacheDir = path.join(process.cwd(), 'data');
const devCacheFile = path.join(devCacheDir, 'repos.json');

async function fetchAllRepos(): Promise<Repo[]> {
  if (process.env.NODE_ENV === 'development') {
    if (fs.existsSync(devCacheFile)) {
      const data = await fs.promises.readFile(devCacheFile, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed as Repo[];
      }
    }
  }
  const octokit = new Octokit({
    auth: import.meta.env.GH_AUTH,
    userAgent: import.meta.env.GH_UA,
  });

  const response = await octokit.rest.repos.listForAuthenticatedUser({
    visibility: 'public',
    affiliation: 'owner',
    sort: 'created',
    direction: 'desc',
  });

  if (process.env.NODE_ENV === 'development') {
    await fs.promises.mkdir(devCacheDir, { recursive: true });
    await fs.promises.writeFile(devCacheFile, JSON.stringify(response.data));
  }

  return response.data;
}

function getPackageURL({ full_name, default_branch }: Repo): string | null {
  return !full_name || !default_branch
    ? null
    : `https://raw.githubusercontent.com/${full_name}/${default_branch}/package.json`;
}

function isPackageJsonLanguage(language: Maybe<string>): boolean {
  return (
    language != null &&
    ['TypeScript', 'JavaScript'].some(
      (lang) =>
        lang === language || lang.toLowerCase() === language.toLowerCase(),
    )
  );
}

async function fetchPackageJSON(
  repo: Repo,
): Promise<Partial<PackageJSON> | null> {
  const NO_URL_ERROR = 'NO_URL';
  const INVALID_LANGUAGE_ERROR = 'INVALID_LANGUAGE';

  try {
    if (!isPackageJsonLanguage(repo.language)) {
      throw INVALID_LANGUAGE_ERROR;
    }
    const url = getPackageURL(repo);

    if (!url) {
      throw NO_URL_ERROR;
    }

    const { data } = await axios.get<PackageJSON>(url, {
      headers: {
        'User-Agent': GH_UA,
        Authorization: `Bearer ${GH_AUTH}`,
      },
    });
    return data;
  } catch (err) {
    if (
      process.env.NODE_ENV !== 'production' &&
      err !== NO_URL_ERROR &&
      err !== INVALID_LANGUAGE_ERROR &&
      (!axios.isAxiosError(err) || err.response?.status !== 404)
    ) {
      console.error(err instanceof Error ? err.message : err);
    }
    return null;
  }
}

async function getPackageJsonName(repo: Repo): Promise<string | null> {
  const pkg = await fetchPackageJSON(repo);

  return (pkg && pkg.name) || null;
}

function filterRepos(repos: Repo[]) {
  return repos.filter(
    (repo): boolean =>
      // Exclude forked repos
      !repo.fork &&
      // Exclude "profile repo"
      repo.name !== PROFILE_REPO_NAME &&
      // Exclude school assignments
      !repo.topics?.includes('school-assignment') &&
      // Exclude repos missing description
      !!repo.description &&
      // Only include repos with at least three words in description
      /([\w.-@/!?&%]+(\s)+){2,}[\w.-@/!?&%]+/.test(repo.description),
  );
}

async function createPartialRepo(repo: Repo): Promise<PartialRepo> {
  const partialRepo: PartialRepo = {
    ...pick(repo, ...repoPropKeys),
    package_name: await getPackageJsonName(repo),
  };

  if (partialRepo.name === THIS_REPO_NAME) {
    partialRepo.description = 'This website';
    partialRepo.homepage = partialRepo.html_url;
  }

  return partialRepo;
}

function sortRepos<T extends Partial<Repo>>(repos: T[]) {
  return repos.sort((a, b) =>
    a.name === THIS_REPO_NAME ? 1 : b.name === THIS_REPO_NAME ? -1 : 0,
  );
}

export async function fetchRepos(): Promise<PartialRepo[]> {
  const repos = await fetchAllRepos();

  return await Promise.all(
    sortRepos(filterRepos(repos)).map(createPartialRepo),
  );
}
