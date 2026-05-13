export const USER_TAG = {
  MY_PROFILE: "my-profile",
  USERS_LIST: "users-list",
  USER_DETAIL: (id: string) => `user-detail-${id}`,
};

export const USER_DURATION = {
  MY_PROFILE: 24 * 60 * 60, // 24 hours
  USERS_LIST: 60, // 1 minute
  USER_DETAIL: 60, // 1 minute
};