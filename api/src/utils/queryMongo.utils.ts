export const buildSearchQueryMongodb = <T>(
  search: string,
  fields: (keyof T)[],
) => {
  return fields.filter(Boolean).map((field) => ({
    [field]: { $regex: search, $options: 'i' },
  }));
};
