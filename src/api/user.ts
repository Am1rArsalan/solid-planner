import { UserType } from "../types/user";
import { createFetchHttpRequest } from "./createHttpRequest";

export async function fetchUser(token: string | null): Promise<UserType[]> {
  const result = await createFetchHttpRequest("GET", "/user", "data", token);

  return result;
}

export async function logout(token: string | null): Promise<void> {
  const result = await createFetchHttpRequest(
    "GET",
    "/auth/logout",
    "data",
    token
  );

  return result;
}
