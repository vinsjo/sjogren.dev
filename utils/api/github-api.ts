import axios from 'axios';
import { Octokit } from '@octokit/rest';
import { pick } from '@utils/misc';
import path from 'path';
import fs from 'fs';
import { isArr, isNum, isObj, isStr, isUndef } from 'x-is-type';
import safeJSON from 'safe-json-decode';

const DATA_DIR = path.join(path.resolve(), 'data');
const JSON_PATH = path.join(DATA_DIR, 'gh_repos.json');

export type Repo = Awaited<
    ReturnType<Octokit['rest']['repos']['listForAuthenticatedUser']>
>['data'][number] & { package_name?: string };

export type Owner = Repo['owner'];
export type License = Repo['license'];

export type PartialRepo = Pick<
    Repo,
    | 'id'
    | 'name'
    | 'full_name'
    | 'description'
    | 'url'
    | 'html_url'
    | 'created_at'
    | 'updated_at'
    | 'pushed_at'
    | 'language'
    | 'package_name'
    | 'homepage'
>;

interface PackageJSON {
    readonly name?: string;
    readonly version?: string;
    readonly description?: string;
    readonly author?: string;
    readonly license?: string;
    readonly repository?: Record<string, string>;
    readonly type?: string;
    readonly source?: string;
    readonly main?: string;
    readonly module?: string;
    readonly types?: string;
    readonly exports?: string;
    readonly files?: string[];
    readonly browserslist?: string[];
    readonly scripts?: Record<string, string>;
    readonly devDependencies?: Record<string, string>;
    readonly dependencies?: Record<string, string>;
    readonly keywords?: string[];
}

const repoPropKeys: (keyof Omit<PartialRepo, 'package_name'>)[] = [
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
];

const isPartialRepo = (data: unknown): data is PartialRepo => {
    if (!isObj(data)) return false;
    const {
        id,
        name,
        full_name,
        description,
        url,
        html_url,
        created_at,
        updated_at,
        pushed_at,
        language,
        package_name,
        homepage,
    } = data;

    return (
        isNum(id) &&
        [
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
        ].every(isStr) &&
        (isStr(package_name) || isUndef(package_name))
    );
};

function getPackageURL({ full_name, default_branch }: Repo) {
    return !full_name || !default_branch
        ? null
        : `https://raw.githubusercontent.com/${full_name}/${default_branch}/package.json`;
}

function filterRepos(repos: Repo[]) {
    return repos.filter((repo) => {
        return (
            repo.description &&
            /(\w+(\s)+){2,}\w+/.test(repo.description) &&
            repo.name !== 'vinsjo' &&
            !repo.topics?.includes('school-assignment')
        );
    });
}

async function fetchPackageJSON(repo: Repo) {
    const url = getPackageURL(repo);
    if (!url || !['TypeScript', 'JavaScript'].includes(repo.language)) {
        return null;
    }
    const { GH_AUTH, GH_UA } = process.env;
    const config =
        !GH_AUTH || !GH_UA
            ? {}
            : {
                  headers: {
                      'User-Agent': GH_UA,
                      Authorization: `Bearer ${GH_AUTH}`,
                  },
              };
    try {
        const { data } = await axios.get<PackageJSON>(url, config);
        return data;
    } catch (err: Error | any) {
        if (
            process.env.NODE_ENV !== 'production' &&
            (!axios.isAxiosError(err) || err.response?.status !== 404)
        ) {
            console.error('message' in err ? err.message : err);
        }
        return null;
    }
}

function getPartialRepos(repos: Repo[]): Promise<PartialRepo[]> {
    return Promise.all(
        repos
            .filter((repo) => {
                return (
                    // Exclude repos missing description
                    repo.description &&
                    // Only include repos with at least three words
                    /([\w.-@/!?&%]+(\s)+){2,}[\w.-@/!?&%]+/.test(
                        repo.description
                    ) &&
                    // Exclude "profile repo"
                    repo.name !== 'vinsjo' &&
                    // Exclude school assignments
                    !repo.topics?.includes('school-assignment')
                );
            })
            .map(async (repo) => {
                const partial: PartialRepo = pick(repo, ...repoPropKeys);
                if (partial.name === 'sjogren.dev') {
                    partial.description = 'This website';
                    partial.homepage = partial.html_url;
                }
                const pkg = await fetchPackageJSON(repo);
                if (pkg?.name) partial.package_name = pkg.name;
                return partial;
            })
    );
}

export async function fetchRepos(): Promise<PartialRepo[]> {
    try {
        const octokit = new Octokit({
            auth: process.env.GH_AUTH,
            userAgent: process.env.GH_UA,
        });
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            visibility: 'public',
            affiliation: 'owner',
            sort: 'created',
            direction: 'desc',
        });
        const repos = await getPartialRepos(data);
        return repos.sort((a, b) =>
            a.name === 'sjogren.dev' ? 1 : b.name === 'sjogren.dev' ? -1 : 0
        );
    } catch (err: Error | any) {
        console.error(err);
        return [];
    }
}
