import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { isRegularObject, isNumber } from 'x-is-type';
import { Octokit } from '@octokit/rest';

export type Repo = Awaited<
  ReturnType<Octokit['rest']['repos']['listForAuthenticatedUser']>
>['data'][number];

export type Owner = Repo['owner'];
export type License = Repo['license'];

/**
 * A subset of properties in response from GitHub API for repositories,
 * with added nullable `package_name` property (for repositories with a package.json file)
 */
export interface RepositoryInfo
  extends Pick<
    Repo,
    | 'name'
    | 'full_name'
    | 'description'
    | 'url'
    | 'html_url'
    | 'created_at'
    | 'updated_at'
    | 'pushed_at'
    | 'language'
    | 'homepage'
  > {
  package_name: Nullable<string>;
}

type PackageJSON = Readonly<{
  name: string;
  // version: string;
  // description: string;
  // author: string;
  // license: string;
  // repository: Record<string, string>;
  // type: string;
  // source: string;
  // main: string;
  // module: string;
  // types: string;
  // exports: string;
  // files: string[];
  // browserslist: string[];
  // scripts: Record<string, string>;
  // devDependencies: Record<string, string>;
  // dependencies: Record<string, string>;
  // keywords: string[];
}>;

type DevCacheContent = {
  updated_at: number;
  data: RepositoryInfo[];
};

const PROFILE_REPO_NAME = 'vinsjo';
const THIS_REPO_NAME = 'sjogren.dev';

const devCacheDir = path.join(process.cwd(), 'tmp', 'cache');
const devCacheFilePath = path.join(devCacheDir, 'repos.json');

async function fetchAllRepos(): Promise<Repo[]> {
  const octokit = new Octokit({
    auth: import.meta.env.GH_AUTH,
    userAgent: import.meta.env.GH_UA,
  });

  const response = await octokit.rest.repos.listForAuthenticatedUser({
    visibility: 'public',
    affiliation: 'owner',
    sort: 'updated',
    direction: 'desc',
  });

  return response.data;
}

function getPackageJsonURL({
  full_name,
  default_branch,
}: Pick<Repo, 'full_name' | 'default_branch'>): string | null {
  return !full_name || !default_branch
    ? null
    : `https://raw.githubusercontent.com/${full_name}/${default_branch}/package.json`;
}

function isPackageJsonLanguage(language: Maybe<string>): boolean {
  return !!language && /^(type|java)script$/i.test(language);
}

async function fetchPackageJSON(
  repo: Pick<Repo, 'full_name' | 'default_branch' | 'language'>,
): Promise<Partial<PackageJSON> | null> {
  try {
    const url = getPackageJsonURL(repo);

    if (!isPackageJsonLanguage(repo.language) || !url) return null;

    const response = await axios<Partial<PackageJSON>>({
      url,
      method: 'GET',
      headers: {
        'User-Agent': import.meta.env.GH_UA,
        Authorization: `Bearer ${import.meta.env.GH_AUTH}`,
      },
    });

    return response.data;
  } catch (err) {
    if (!axios.isAxiosError(err) || err.response?.status !== 404) {
      console.error(
        `Failed to fetch package.json for ${repo.full_name} from '${getPackageJsonURL(repo)}'`,
      );
      console.error(err instanceof Error ? err.message : err);
    }
    return null;
  }
}

const shouldIncludeRepo = (repo: Repo): boolean => {
  return (
    // Exclude forked repos
    !repo.fork &&
    // Exclude "profile repo"
    repo.name !== PROFILE_REPO_NAME &&
    // Exclude school assignments
    !repo.topics?.includes('school-assignment') &&
    // Exclude repos missing description
    !!repo.description?.trim() &&
    // Only include repos with at least three words in description
    repo.description.split(/\s+/).filter((word) => /\w+/.test(word)).length >= 3
  );
};

const getRepoInfo = async ({
  name,
  full_name,
  description,
  url,
  html_url,
  created_at,
  updated_at,
  pushed_at,
  language,
  homepage,
  default_branch,
}: Repo): Promise<RepositoryInfo> => {
  return {
    name,
    full_name,
    ...(name === THIS_REPO_NAME
      ? {
          description: 'This website',
          homepage: html_url,
        }
      : { description, homepage }),
    url,
    html_url,
    created_at,
    updated_at,
    pushed_at,
    language,
    package_name:
      (await fetchPackageJSON({ full_name, default_branch, language }))?.name ||
      null,
  };
};

const readDevCache = async (
  maxAge: number = 60_000 * 5,
): Promise<RepositoryInfo[] | null> => {
  try {
    if (!fs.existsSync(devCacheFilePath)) return null;

    const fileContent = await fs.promises.readFile(devCacheFilePath, 'utf-8');
    const parsed = JSON.parse(fileContent) as Partial<DevCacheContent>;

    if (
      !isRegularObject(parsed) ||
      !isNumber(parsed.updated_at) ||
      !Array.isArray(parsed.data)
    ) {
      return null;
    }

    const now = Date.now();

    if (now - parsed.updated_at > maxAge) {
      return null;
    }

    return parsed.data;
  } catch (err) {
    console.error('Error reading dev cache:', err);
    return null;
  }
};

const writeDevCache = async (data: RepositoryInfo[]): Promise<void> => {
  try {
    if (!fs.existsSync(devCacheDir)) {
      await fs.promises.mkdir(devCacheDir, { recursive: true });
    }
    await fs.promises.writeFile(
      devCacheFilePath,
      JSON.stringify(
        {
          updated_at: Date.now(),
          data,
        } satisfies DevCacheContent,
        null,
        2,
      ),
      'utf-8',
    );
  } catch (err) {
    console.error('Error writing dev cache:', err);
  }
};

export async function fetchRepos(): Promise<RepositoryInfo[]> {
  if (process.env.NODE_ENV === 'development') {
    const cachedData = await readDevCache();
    if (cachedData) {
      return cachedData;
    }
  }

  const repos = await fetchAllRepos();

  const output = await Promise.all(
    repos
      .filter(shouldIncludeRepo)
      .sort((a, b) => {
        // Place this respository last
        return a.name === THIS_REPO_NAME
          ? 1
          : b.name === THIS_REPO_NAME
            ? -1
            : 0;
      })
      .map(getRepoInfo),
  );

  if (process.env.NODE_ENV === 'development') {
    await writeDevCache(output);
  }

  return output;
}
