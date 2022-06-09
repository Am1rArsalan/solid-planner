import { Component, ParentProps } from "solid-js";
import { createStore } from "solid-js/store";
import { useStore } from "../store";

const API_ROOT = "http://localhost:8000";

type PomodoroItemConfigFormProps = ParentProps<{
  current: number;
  end: number;
  id: string;
}>;

const PomodoroItemConfigForm: Component<PomodoroItemConfigFormProps> = ({
  current,
  end,
  children,
  id,
}) => {
  const [_, { loadPomodoros, editPomodoro }] = useStore();

  const [state, setState] = createStore<{
    act: number;
    est: number;
    active: "act" | "est";
  }>({ active: "est", act: current, est: end });

  return (
    <>
      <form
        id="pomodoro-config"
        style={{
          display: "flex",
          "justify-content": "space-between",
          width: "100%",
        }}
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await editPomodoro(id, state.est, state.act);
            loadPomodoros();
          } catch (error) {
            // TODO : handle error
          }
        }}
      >
        <div>
          <span
            style={{
              padding: ".5rem 1rem",
              "font-size": "2rem",
              "border-radius": "50%",
              border: state.active === "act" ? "1px solid green" : "unset",
              cursor: "pointer",
            }}
            onClick={() =>
              setState({
                active: "act",
              })
            }
          >
            {state.act}
          </span>
          <span style={{ "font-size": "2rem", margin: "0 .5rem" }}>/</span>
          <span
            onClick={() =>
              setState({
                active: "est",
              })
            }
            style={{
              padding: ".5rem 1rem",
              "font-size": "2rem",
              "border-radius": "50%",
              border: state.active === "est" ? "1px solid green" : "unset",
              cursor: "pointer",
            }}
          >
            {state.est}
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <button
            type="button"
            onClick={() =>
              setState({
                [state.active]: state[state.active] + 1,
              })
            }
          >
            {"⬆"}
          </button>
          <button
            type="button"
            onClick={() =>
              setState({
                [state.active]:
                  state[state.active] > 0 ? state[state.active] - 1 : 0,
              })
            }
          >
            {"⬇"}
          </button>
        </div>
      </form>
      {children}
    </>
  );
};

export default PomodoroItemConfigForm;
