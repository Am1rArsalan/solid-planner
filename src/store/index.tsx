import { Accessor, Component, createContext, useContext } from "solid-js";
import { ParentProps, Resource } from "solid-js";
import { createStore } from "solid-js/store";
import {
  BacklogType,
  PomodoroFocusType,
  PomodoroType,
} from "../types/pomodoro";
import { StoreType } from "../types/store";
import { UserType } from "../types/user";
import createAgent from "./createAgent";
import createBacklogs, { BacklogActions } from "./createBacklogs";
import createPomodoro, { PomodoroActions } from "./createPomodoro";
import createPomodoros, { PomodorosActions } from "./createPomodoros";
import createSharedActions, { SharedActions } from "./createSharedActions";
import createUser, { UserActions } from "./createUser";

export type Actions = BacklogActions &
  PomodoroActions &
  PomodorosActions &
  UserActions &
  SharedActions;

export type StoreContextType = [StoreType, Actions];

const StoreContext = createContext<StoreContextType>();

export const Provider: Component<ParentProps> = (props) => {
  let backlogs: Resource<BacklogType[]>;
  let pomodoros: Resource<PomodoroType[]>;
  let pomodoroState: Accessor<PomodoroFocusType>;
  let activePomodoro: Accessor<PomodoroType | null>;
  let user: Resource<UserType | undefined>;

  const queryParams = new URLSearchParams(location.search);
  if (!localStorage.getItem("token") && queryParams.get("token")) {
    localStorage.setItem("token", queryParams.get("token") as string);
    const newUrl = `${window.location.pathname}`;
    history.pushState({ path: newUrl }, "", newUrl);
  }

  const [state] = createStore<StoreType>({
    token: localStorage.getItem("token"),
    get backlogs() {
      return backlogs;
    },
    get pomodoros() {
      return pomodoros;
    },
    get pomodoroState() {
      return pomodoroState;
    },
    get activePomodoro() {
      return activePomodoro;
    },
    get user() {
      return user;
    },
  });

  const actions: Actions = Object({});
  const store: StoreContextType = [state, actions];
  const agent = createAgent(store);

  createSharedActions(actions, state, agent.pomodoros);
  backlogs = createBacklogs(actions, agent);
  user = createUser(actions, agent.user);
  pomodoros = createPomodoros(actions, state, agent);
  const singlePomodoro = createPomodoro(actions, agent.pomodoro);
  pomodoroState = singlePomodoro.pomodoroState;
  activePomodoro = singlePomodoro.activePomodoro;

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const store = useContext(StoreContext);
  return store as StoreContextType;
}
