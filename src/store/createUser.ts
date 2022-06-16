import { createResource } from "solid-js";
import type { Resource } from "solid-js";
import { StoreType } from "../types/store";
import { UserType } from "../types/user";
import { fetchUser, logout } from "../api/user";
import { Actions } from ".";

export interface UserActions {
  logout(): Promise<void>;
}

export default function createUser(
  actions: Actions,
  state: StoreType
): Resource<UserType | undefined> {
  const [user, { mutate, refetch }] = createResource<UserType>(
    async () => await fetchUser(state.token)
  );

  Object.assign<Actions, UserActions>(actions, {
    logout() {
      localStorage.removeItem("token");
      return logout(state.token);
    },
  });

  return user;
}
