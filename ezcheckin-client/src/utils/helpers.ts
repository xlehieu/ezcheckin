import qs from "qs";
export const buildQueryParams = (params: Record<any, string>) => {
  return qs.stringify(params, {
    skipNulls: true,
    addQueryPrefix: true,
    arrayFormat: "repeat",
  });
};
