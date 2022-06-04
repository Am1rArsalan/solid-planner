import { API_ROOT } from "../constants/api";
import { HttpRequestMethodType } from "../types/api";

export async function createFetchHttpRequest(
  method: HttpRequestMethodType,
  url: string,
  resKey: string,
  token: string | null
) {
  // FIXME : make this variables type safe
  const headers: any = {};
  const opts: any = { method, headers };

  if (token) headers["Authorization"] = `Token ${token}`;

  try {
    const response = await fetch(API_ROOT + url, opts);
    const json = await response.json();
    return resKey ? json[resKey] : json;
  } catch (err) {
    //if (err && err?.response && err?.response.status === 401) {
    // ....
    //actions.logout();
    //}
    throw err;
  }
}

export async function createHttpRequest<DataType>(
  method: HttpRequestMethodType,
  url: string,
  data: DataType,
  resKey: string,
  token: string | null
) {
  // FIXME : make this variables type safe
  const headers: any = {};
  const opts: any = { method, headers };

  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(data);
  }

  if (token) headers["Authorization"] = `Token ${token}`;

  try {
    const response = await fetch(API_ROOT + url, opts);
    const json = await response.json();
    return resKey ? json[resKey] : json;
  } catch (err) {
    //if (err && err?.response && err?.response.status === 401) {
    // ....
    //actions.logout();
    //}
    throw err;
  }
}
