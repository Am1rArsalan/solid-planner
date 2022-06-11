import { Accessor, Component, createContext, useContext } from "solid-js";
import { ParentProps, Resource } from "solid-js";
import { createStore } from "solid-js/store";
import {
  BacklogType,
  PomodoroFocusType,
  PomodoroType,
} from "../types/pomodoro";
import { StoreType } from "../types/store";
import createBacklogs, { BacklogActions } from "./createBacklogs";
import createPomodoro, { PomodoroActions } from "./createPomodoro";
import createPomodoros, { PomodorosActions } from "./createPomodoros";

// I don't like this
//export type Actions = BacklogActions & PomodoroActions & PomodorosActions;
export interface Actions
  extends BacklogActions,
    PomodoroActions,
    PomodorosActions {}

type StoreContextType = [StoreType, Actions];

const StoreContext = createContext<StoreContextType>();
const RouterContext = createContext();

export const Provider: Component<ParentProps> = (props) => {
  let backlogs: Resource<BacklogType[]>;
  let pomodoros: Resource<PomodoroType[]>;
  let pomodoroState: Accessor<PomodoroFocusType>;
  let activePomodoro: Accessor<PomodoroType | null>;

  const [state] = createStore<StoreType>({
    token: localStorage.getItem("jwt"),
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
  });

  const actions: Actions = Object({});
  const store: StoreContextType = [state, actions];

  backlogs = createBacklogs(actions, state);
  pomodoros = createPomodoros({ actions, state });
  const singlePomodoro = createPomodoro(actions, state);
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

export function useRouter() {
  return useContext(RouterContext);
}
