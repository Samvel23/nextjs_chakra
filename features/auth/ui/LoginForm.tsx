"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Typography } from "@/shared/ui";
import { loginAction } from "../model/actions";

import styles from "./LoginForm.module.scss";

interface ILoginFormProps {
  showDemoPassword: boolean;
}

const LoginSubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className={styles["login-form__submit"]}
      type="submit"
      disabled={pending}
    >
      <Typography
        as="span"
        value={pending ? "Auth.signingIn" : "Auth.loginButton"}
      />
    </button>
  );
};

export const LoginForm = ({ showDemoPassword }: ILoginFormProps) => {
  const [state, action] = useActionState(loginAction, { error: null });

  return (
    <form className={styles["login-form"]} action={action}>
      <h1 className={styles["login-form__title"]}>
        <Typography as="span" value="Auth.loginTitle" />
      </h1>
      <p className={styles["login-form__description"]}>
        <Typography as="span" value="Auth.loginDescription" />
      </p>
      <label className={styles["login-form__field"]}>
        <span className={styles["login-form__label"]}>
          <Typography as="span" value="Auth.passwordLabel" />
        </span>
        <input
          className={styles["login-form__input"]}
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error && (
        <p className={styles["login-form__error"]} role="alert">
          <Typography as="span" value={`Auth.${state.error}`} />
        </p>
      )}
      {showDemoPassword && (
        <p className={styles["login-form__demo"]}>
          <Typography as="span" value="Auth.demoPassword" />
        </p>
      )}
      <LoginSubmitButton />
    </form>
  );
};
