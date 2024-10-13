export const getFormIdFromUrl = (url: string) => {
  const matches = url.match(/(?:fid|forms)\/(?<id>[a-f\d]{24})/i);
  return matches?.groups?.id;
};

export const getFormSlugFromUrl = (url: string) => {
  const matches = url.match(/fpl\/(?<slug>[a-z\d-_]+)/i);
  return matches?.groups?.slug;
};

export const getHostPathFromUrl = (url: string) => {
  const { host, pathname } = new URL(decodeURIComponent(url));
  return `${host}${pathname === "/" ? "" : pathname}`;
};

export const getPrefixedParamsFromUrl = (
  url: string,
  ...prefixes: string[]
): Record<string, string> => {
  const urlParams = [...new URLSearchParams(new URL(url).search).entries()];
  let extractedParams: [string, string][] = [];

  for (const prefix of prefixes) {
    extractedParams = [
      ...extractedParams,
      ...urlParams.filter((entry) => entry[0].substring(0, prefix.length) === prefix),
    ];
  }

  return extractedParams.reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});
};

export const addParamsToUrl = (
  url: string,
  params: Record<string, string>,
  options?: { override?: boolean },
) => {
  const override = options?.override ?? true;

  const urlParams: Record<string, string> = [
    ...new URLSearchParams(new URL(url).search).entries(),
  ].reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});

  const newParams = override ? { ...urlParams, ...params } : { ...params, ...urlParams };

  const queryString = Object.keys(newParams)
    .map((key) => `${key}=${encodeURIComponent(newParams[key]!)}`)
    .join("&");

  return `${url.split("?")[0]}?${queryString}`;
};
