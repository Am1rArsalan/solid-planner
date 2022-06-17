import { API_ROOT } from "../constants/api";
import { HttpRequestMethodType } from "../types/api";

export async function createFetchHttpRequest(
  method: HttpRequestMethodType,
  url: string,
  resKey: string,
  token: string | null,
  onError: () => void
) {
  // FIXME : make this variables type safe
  if (!token) return;

  const headers: any = {};
  const opts: any = { method, headers };

  headers["Authorization"] = `${token}`;

  const res = await fetch(API_ROOT + url, opts);
  if (!res.ok && res.status == 401) {
    onError();
    return;
  }

  if (!res.ok) {
    return;
  }

  const json = await res.json();
  return resKey ? json[resKey] : json;
}

export async function createHttpRequest<DataType>(
  method: HttpRequestMethodType,
  url: string,
  data: DataType,
  resKey: string,
  token: string | null,
  onError: () => void
) {
  // FIXME : make this variables type safe
  if (!token) return;

  const headers: any = {};
  const opts: any = { method, headers };

  if (data !== undefined) {
    opts.body = JSON.stringify(data);
    headers["Content-Type"] = "application/json";
  }

  headers["Authorization"] = `${token}`;

  const res = await fetch(API_ROOT + url, opts);
  if (!res.ok && res.status == 401 && onError) {
    onError();
    return;
  }

  if (!res.ok) {
    return;
  }

  const json = await res.json();
  return resKey ? json[resKey] : json;
}
