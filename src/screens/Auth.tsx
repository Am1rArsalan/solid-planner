import { Component } from "solid-js";
import { Background } from "../components/UI/background";
import { Button } from "../components/UI/button";
import { useStore } from "../store";
import styles from "./Auth.module.css";

const Auth: Component = () => {
  const [store] = useStore();

  return (
    <div class={styles.Auth}>
      <a href="http://localhost:8080/auth/google">
        <Button class={styles.SignInButton}> Sign In</Button>
      </a>
      <Background pomodoroState={store.pomodoroState} />
    </div>
  );
};

export default Auth;
