import { Link, withRouter } from "react-router-dom";
import { useState } from "react/cjs/react.development";

function Register(props) {
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
    props.onRegister(email, password);
  }

  return (
    <div className="autorization">
      <form
        onSubmit={handleSubmit}
        name="register"
        id="register-form"
        method="post"
        className="autorization-form"
        required
      >
        <h3 className="autorization-form__title">Регистрация</h3>
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
          value="Зарегистрироваться"
          className="autorization-form__submit"
        ></input>
        <p className="autorization__paragraph">
          Уже зарегистрировались?{" "}
          <Link className="autorization__paragraph" to="./sign-in">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}
export default withRouter(Register);
