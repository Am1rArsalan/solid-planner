import { StoreContextType } from ".";
import {
  createFetchHttpRequest,
  createHttpRequest,
} from "../api/createHttpRequest";
import {
  BacklogType,
  CreateDto,
  EditPomodoroDto,
  PomodoroType,
} from "../types/pomodoro";
import { ChangeOrderDto, ChangeTaskStatusDto } from "../types/shared";
import { UserType } from "../types/user";

export interface BacklogsAgent {
  fetchBacklogs(): Promise<BacklogType[]>;
  addBacklog(data: CreateDto): Promise<BacklogType>;
}

export interface UserAgent {
  fetchUser(): Promise<UserType>;
  logout(): Promise<void>;
}

export interface PomodoroAgent {
  editPomodoro(data: EditPomodoroDto): Promise<PomodoroType>;
}

export interface PomodorosAgent {
  fetchPomodoros(): Promise<PomodoroType[]>;
  doneTask(id: string): Promise<PomodoroType[]>;
  changeTaskStatus(
    id: string,
    data: ChangeTaskStatusDto
  ): Promise<PomodoroType[]>;
}

export interface TaskAgent {
  remove<T>(id: string): Promise<T>;
  changeOrder<T>(data: ChangeOrderDto): Promise<T[]>;
}

export interface Agent {
  user: UserAgent;
  backlogs: BacklogsAgent;
  pomodoros: PomodorosAgent;
  pomodoro: PomodoroAgent;
  tasks: TaskAgent;
}

export default function createAgent([state, actions]: StoreContextType): Agent {
  const user: UserAgent = {
    fetchUser: () =>
      createFetchHttpRequest(
        "GET",
        "/user",
        "data",
        state.token,
        actions.logout
      ),
    logout: () =>
      createFetchHttpRequest(
        "GET",
        "/auth/logout",
        "data",
        state.token,
        actions.logout
      ),
  };

  const backlogs: BacklogsAgent = {
    fetchBacklogs: () =>
      createFetchHttpRequest(
        "GET",
        "/pomodoros/backlogs",
        "data",
        state.token,
        actions.logout
      ),

    addBacklog: (data: CreateDto) =>
      createHttpRequest<CreateDto>(
        "POST",
        "/pomodoros",
        data,
        "data",
        state.token,
        actions.logout
      ),
  };

  const pomodoro = {
    editPomodoro: (data: EditPomodoroDto) =>
      createHttpRequest("PUT", `/pomodoros/edit`, data, "data", state.token),
  };

  const pomodoros: PomodorosAgent = {
    fetchPomodoros: () =>
      createFetchHttpRequest("GET", "/pomodoros", "data", state.token),
    doneTask: (id: string) =>
      createFetchHttpRequest("PUT", `/pomodoros/${id}`, "data", state.token),
    changeTaskStatus: (
      id: string,
      data: ChangeTaskStatusDto
    ): Promise<PomodoroType[]> =>
      createHttpRequest("POST", `/pomodoros/${id}`, data, "data", state.token),
  };

  const tasks: TaskAgent = {
    remove: <T>(id: string): Promise<T> =>
      createFetchHttpRequest(
        "DELETE",
        `/pomodoros/${id}`,
        "data",
        state.token,
        actions.logout
      ),
    changeOrder: <T>(data: ChangeOrderDto): Promise<T[]> => {
      return createHttpRequest(
        "POST",
        `/pomodoros/order`,
        data,
        "data",
        state.token
      );
    },
  };

  return {
    user,
    backlogs,
    pomodoros,
    pomodoro,
    tasks,
  };
}
