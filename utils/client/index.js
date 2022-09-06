/** @param  {...(string|any)} names */
const classNames = (...names) =>
	names.filter((n) => n && typeof n === 'string').join(' ');

export { classNames };
