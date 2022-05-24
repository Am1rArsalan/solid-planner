const API_ROOT = "http://localhost:8000";

const encode = encodeURIComponent;

type MethodType = "GET" | "POST" | "PUT" | "DELETE";

async function send<DataType>(
  method: MethodType,
  url: string,
  data: DataType,
  resKey: string
) {
  const headers = {},
    opts = { method, headers };

  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(data);
  }

  //if (state.token) headers["Authorization"] = `Token ${state.token}`;

  const response = await fetch(API_ROOT + url, opts);
  const json = await response.json();
  return resKey ? json[resKey] : json;

  //try {
  //} catch (err) {
  //if (err && err.response && err.response.status === 401) {
  //actions.logout();
  //}
  //return err;
  //}
}

// make this class later
export default function createAgent([state, actions]) {
  const Backlog = {
    getAll: () => send<undefined>("get", "/backlogs", undefined, "backlogs"),
  };

  //const Auth = {
  //current: () => send("get", "/user", undefined, "user"),
  //login: (email, password) =>
  //send("post", "/users/login", { user: { email, password } }),
  //register: (username, email, password) =>
  //send("post", "/users", { user: { username, email, password } }),
  //save: (user) => send("put", "/user", { user }),
  //};

  return {
    Backlog,
  };
}
