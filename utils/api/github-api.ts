import axios from 'axios';
import { Octokit } from '@octokit/rest';
import { pick } from '@utils/misc';
import path from 'path';
import fs from 'fs';
import { isArr, isNum, isObj, isStr, isUndef } from 'x-is-type';
import safeJSON from 'safe-json-decode';

const DATA_DIR = path.join(path.resolve(), 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}
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

/**
 * @param storedMaxAge max age of stored json-file, in seconds
 */
async function getReposFromFile(storedMaxAge?: number) {
    try {
        if (!fs.existsSync(JSON_PATH)) return null;
        if (isNum(storedMaxAge)) {
            const mtimeMs = await new Promise<number>((resolve) => {
                fs.stat(JSON_PATH, (err, stats) => {
                    resolve(err ? 0 : stats.mtimeMs);
                });
            });
            if (!mtimeMs || Date.now() - mtimeMs > storedMaxAge * 1000) {
                return null;
            }
        }
        const json = await fs.promises.readFile(JSON_PATH, {
            encoding: 'utf-8',
        });
        const repos = safeJSON.decode(json);
        if (!isArr(repos) || !repos.every(isPartialRepo)) return null;
        return repos;
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        return null;
    }
}

async function writeReposToFile(repos: PartialRepo[]) {
    try {
        const json = safeJSON.encode(repos);
        await fs.promises.writeFile(JSON_PATH, json, { encoding: 'utf-8' });
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
    }
}

function getPackageURL({ full_name, default_branch }: Repo) {
    return !full_name || !default_branch
        ? null
        : `https://raw.githubusercontent.com/${full_name}/${default_branch}/package.json`;
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

export async function fetchRepos(): Promise<PartialRepo[]> {
    try {
        // const storedRepos = await getReposFromFile(storedMaxAge);
        // if (storedRepos) return storedRepos;

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

        const repos = await Promise.all(
            data
                .filter((repo) => {
                    return (
                        repo.description &&
                        repo.name !== 'vinsjo' &&
                        !repo.topics?.includes('school-assignment')
                    );
                })
                .map(async (fullRepo) => {
                    const repo: PartialRepo = pick(fullRepo, ...repoPropKeys);
                    if (repo.name === 'sjogren.dev') {
                        repo.description = 'This website';
                        delete repo.homepage;
                    }
                    const pkg = await fetchPackageJSON(fullRepo);
                    if (pkg?.name) repo.package_name = pkg.name;
                    return repo;
                })
        );
        repos.sort((a, b) =>
            a.name === 'sjogren.dev' ? 1 : b.name === 'sjogren.dev' ? -1 : 0
        );
        await writeReposToFile(repos);
        return repos;
    } catch (err: Error | any) {
        console.error(err);
        return [];
    }
}
