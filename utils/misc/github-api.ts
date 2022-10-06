import axios from 'axios';
import GitHubAPI from 'types/github-api';
import { pickProps } from '.';

const repoProps: (keyof GitHubAPI.Repo)[] = [
    'name',
    'full_name',
    'description',
    'url',
    'created_at',
    'updated_at',
    'pushed_at',
    'language',
    'license',
];

export type PartialRepo = Pick<GitHubAPI.Repo, typeof repoProps[number]>;

export async function fetchRepos(): Promise<PartialRepo[]> {
    try {
        const res = await axios.get<GitHubAPI.Repo[]>(
            'https://api.github.com/users/vinsjo/repos'
        );
        if (!Array.isArray(res.data)) throw 'Unexpected API Response';
        const repos = res.data
            .filter(
                ({ visibility, fork, name }) =>
                    visibility === 'public' && !fork && name !== 'VinSjo'
            )
            .map((repo) => {
                return pickProps(repo, ...repoProps);
            });
        return repos;
    } catch (err: Error | unknown) {
        console.error(err);
        return [];
    }
}
