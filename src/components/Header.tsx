import { Component } from "solid-js";
import { useStore } from "../store";
import styles from "./styles/Header.module.css";
import { Button } from "./UI/button";
import { useNavigate } from "solid-app-router";

const Header: Component = () => {
  const [store, { logout }] = useStore();
  const nav = useNavigate();

  return (
    <header class={styles.Header}>
      <Button
        class={styles.SignInButton}
        onClick={async () => {
          await logout();
          nav("/auth");
        }}
      >
        logout
      </Button>
      {store.user?.displayName}
    </header>
  );
};

export default Header;
