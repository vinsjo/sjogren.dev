export function classNames(...names: any[]) {
    return names.filter((n) => n && typeof n === 'string').join(' ');
}
