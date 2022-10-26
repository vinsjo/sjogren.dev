import axios from 'axios';
import { Octokit } from '@octokit/rest';
import { pick } from '@utils/misc';

const octokit = new Octokit({
    auth: process.env.GH_AUTH,
    userAgent: process.env.GH_UA,
});

export type Repo = Awaited<
    ReturnType<typeof octokit['rest']['repos']['listForAuthenticatedUser']>
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
    | 'license'
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
    'license',
    'homepage',
];

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
                .map(async (repo) => {
                    const partial = pick(repo, ...repoPropKeys);
                    const pkg = await fetchPackageJSON(repo);
                    return { ...partial, package_name: pkg?.name || null };
                })
        );
        return repos;
    } catch (err: Error | any) {
        console.error(err);
        return [];
    }
}
