import { createResource } from "solid-js";
import type { Resource } from "solid-js";
import { UserType } from "../types/user";
import { Actions } from ".";
import { UserAgent } from "./createAgent";

export interface UserActions {
  logout(): Promise<void>;
}

export default function createUser(
  actions: Actions,
  agent: UserAgent
): Resource<UserType | undefined> {
  const [user] = createResource<UserType>(async () => await agent.fetchUser());

  Object.assign<Actions, UserActions>(actions, {
    logout() {
      window.location.replace("/auth");
      localStorage.clear();
      return agent.logout();
    },
  });

  return user;
}
