import axios from 'axios';
import { Octokit } from '@octokit/rest';
import { pick } from '.';

const octokit = new Octokit({
    auth: process.env.GH_AUTH,
});

export type Repo = Awaited<
    ReturnType<typeof octokit['rest']['repos']['listForUser']>
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
];

type RepoContents = {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    _links: {
        self: string;
        git: string;
        html: string;
    };
};

async function getPackageJSON({ language, full_name, default_branch }: Repo) {
    if (!['TypeScript', 'JavaScript'].includes(language)) return null;
    const config = {
        headers: {
            'User-Agent': process.env.GH_UA,
            Authorization: `Bearer ${process.env.GH_AUTH}`,
        },
    };
    try {
        const url = `https://raw.githubusercontent.com/${full_name}/${default_branch}/package.json`;
        const { data } = await axios.get<Record<string, string>>(url, config);
        return data;
    } catch (err: Error | unknown) {
        console.error(err);
        return null;
    }
}

export async function fetchRepos(): Promise<PartialRepo[]> {
    try {
        const { data } = await octokit.rest.repos.listForUser({
            username: 'vinsjo',
            type: 'owner',
        });
        const repos = await Promise.all(
            data
                .filter((repo) => {
                    return repo.description && repo.name !== 'vinsjo';
                })
                .map(async (repo) => {
                    const partial = pick(repo, ...repoPropKeys);
                    const pkg = await getPackageJSON(repo);
                    return { ...partial, package_name: pkg?.name };
                })
        );
        return repos;
    } catch (err: Error | unknown) {
        console.error(err);
        return [];
    }
}
