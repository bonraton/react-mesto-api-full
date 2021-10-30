import { useState } from "react";
import { withRouter } from "react-router";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onLogin(email, password);
  }

  return (
    <div className="autorization">
      <form
        onSubmit={handleSubmit}
        name="login"
        id="login-form"
        method="post"
        className="autorization-form"
        required
      >
        <h3 className="autorization-form__title">Вход</h3>
        <input
          onChange={changeEmail}
          value={email}
          type="email"
          placeholder="Email"
          className="autorization-form__input"
          required
        ></input>
        <input
          onChange={changePassword}
          value={password}
          type="password"
          placeholder="Password"
          className="autorization-form__input"
          required
        ></input>
        <input
          type="submit"
          name="submit"
          value="Войти"
          className="autorization-form__submit"
        ></input>
      </form>
    </div>
  );
}

export default withRouter(Login);
