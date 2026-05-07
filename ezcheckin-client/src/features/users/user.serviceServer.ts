import { APIResponse } from "@/@types/response.type";
import { apiServer } from "../../lib/apiServer";
import { USER_DURATION, USER_TAG } from "@/features/users/user.tag";


export const usersService = {
  myProfile: async () => {
    return apiServer.get<APIResponse<any>>("/users/my-profile", {
      next: {
        tags: [USER_TAG.MY_PROFILE],
        revalidate: USER_DURATION.MY_PROFILE,
      },
      passError:true
    });
  },
};
