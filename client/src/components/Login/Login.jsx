import {  useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import validarEmail from "./validateEmail";
import validatePassword from "./validatePassword";
import { authentication } from "../firebase/config/firebase-config.js";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

function validate(email, password) {
  let objeto = {};
  if (email === "") objeto = { ...objeto, email: "this field is required" };
  else if (validarEmail(email))
    email.length > 40
      ? (objeto = { ...objeto, email: "invalid length" })
      : (objeto = { ...objeto, email: "invalid format" });

  if (password === "")
    objeto = { ...objeto, password: "this field is required" };
  else if (validatePassword(password))
    objeto = {
      ...objeto,
      password: "Your password must be at least 8 characters",
    };

  return objeto;
}

export default function Loguin() {
  const history = useHistory();

  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  function handleChangeEmail(e) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      email: "",
    });
  }

  const handleChangePassword = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      password: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const objeto = validate(usuario.email, usuario.password);
    setErrors(objeto);
    if (Object.keys(objeto).length === 0) {
      fetch("http://localhost:3001/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            alert(data.error);
          } else {
            localStorage.setItem("accessToken", data.accessToken);
            console.log(data.accessToken);
            alert("Login Successful");
            history.push("/");
          }
        });
    } else {
      alert("Login Failed");
    }
  };

  const handleClickGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then((result) => {
        console.log(result);
        localStorage.setItem("token", result.user.uid);
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickGithub = async () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(authentication, provider)
      .then((result) => {
        console.log(result);
        localStorage.setItem("token", result.user.uid);
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="contRegister">
      <div className="flex">
        <div className="contLogin">
          <div className="contLogin-content">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChangeEmail}
                value={usuario.email}
              />
              {errors.email && <p className="error">{errors.email}</p>}
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChangePassword}
                value={usuario.password}
              />
              {errors.password && <p className="error">{errors.password}</p>}
              <div>
                <button onClick={handleClickGoogle}>Google</button>
              </div>
              <div>
                <button onClick={handleClickGithub}>Github</button>
              </div>
              <button type="submit" onClick={handleSubmit}>
                Login
              </button>
            </form>
            <Link to="/forgotPassword/" className="a">
              {" "}
              <h4>forget your password</h4>
            </Link>
            <Link to="/register" className="a">
              <h4>Register</h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
