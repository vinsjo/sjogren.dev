export function replaceAtEnd(
  str: string,
  searchValue: string,
  replaceValue = ''
) {
  if (!str.length || !searchValue.length) return str;
  const index = str.length - searchValue.length;
  const slice = str.slice(index);
  if (slice !== searchValue) return str;
  return str.slice(0, index) + replaceValue;
}

export type FormatURLOptions = Record<
  'protocol' | 'hostname' | 'pathname' | 'search' | 'www',
  boolean
>;

export function formatURL(
  urlString: Maybe<string>,
  formatOptions: Partial<FormatURLOptions> = {}
) {
  if (!urlString) return null;
  try {
    const url = new URL(urlString);
    const options: FormatURLOptions = Object.assign(
      {
        protocol: false,
        www: false,
        hostname: true,
        pathname: true,
        search: true,
      },
      formatOptions
    );

    const output = replaceAtEnd(
      ['protocol', 'hostname', 'pathname', 'search']
        .map((key) => {
          return !options[key] ? '' : url[key];
        })
        .join(''),
      '/',
      ''
    );
    return !options.www ? output.replace('www.', '') : output;
  } catch (e) {
    return null;
  }
}
