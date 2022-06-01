import { Component, ParentProps, Show } from "solid-js";
import { createStore } from "solid-js/store";

const API_ROOT = "http://localhost:8000";

type PomodoroItemConfigFormProps = ParentProps<{
  current: number;
  end: number;
  id: string;
  revalidate: () => void;
}>;

const PomodoroItemConfigForm: Component<PomodoroItemConfigFormProps> = ({
  current,
  end,
  children,
  id,
  revalidate,
}) => {
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
          // TODO : add optimistic ui
          e.preventDefault();
          const res = await fetch(`${API_ROOT}/pomodoros/edit`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, act: state.act, est: state.est }),
          });

          if (res.status != 200) {
            /// FIXME : set error///
            throw Error("Error in creating a backlog task");
          }
          revalidate();
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
