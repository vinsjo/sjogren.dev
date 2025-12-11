export const capitalize = <T extends string>(str: T) => {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
};

/**
 * Format url for display
 *
 * Creates URL object and returns hostname + pathname (+ search if specified)
 *
 * @param urlString - URL string to format
 * @param includeSearch - Set to false to exclude search params. Defaults to true.
 * @param removeLeadingWww - Set to false to keep leading 'www.' if present. Defaults to true.
 */
export function formatURL(
  urlString: Maybe<string>,
  includeSearch: boolean = true,
  removeLeadingWww: boolean = true,
) {
  if (!urlString) return null;

  try {
    const { hostname, pathname, search } = new URL(urlString);

    let output = hostname + pathname;

    if (includeSearch) {
      output += search;
    }

    // Remove leading 'www.'
    if (removeLeadingWww) {
      output = output.replace(/^www\./, '');
    }

    // Remove trailing slash(es)
    return output.replace(/\/+$/, '');
  } catch (e) {
    return null;
  }
}
