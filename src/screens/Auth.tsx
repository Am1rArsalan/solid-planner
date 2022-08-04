import { Component } from "solid-js";
import { Button } from "../components/UI/button";
import { classNames } from "../components/UI/utils/classNames";
import { useStore } from "../store";
import styles from "../App.module.css";

const Auth: Component = () => {
  const [store, _] = useStore();

  return (
    <div class={styles.Auth}>
      <a href="http://localhost:8080/auth/google">
        <Button class={styles.SignInButton}> Sign In</Button>
      </a>
      <div
        class={
          store.pomodoroState === "Focus"
            ? styles.Background
            : classNames(styles.Background, styles.BlueBackground)
        }
      />
    </div>
  );
};

export default Auth;
