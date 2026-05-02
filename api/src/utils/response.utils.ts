export function buildPagination({ data, total, current, pageSize }) {
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    meta: { total, current, pageSize, totalPages },
    links: {
      next: current < totalPages ? current + 1 : null,
      prev: current > 1 ? current - 1 : null,
    },
  };
}
