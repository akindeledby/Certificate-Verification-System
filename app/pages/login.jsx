import React, { useState } from "react";
import Image from "next/image";
import Style from "../../styles/login.module.css";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import Link from "next/link";
import { doSocialLogin } from "./actions";

const login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const [errorMessage, setErrorMessage] = useState({});

  // Generate code for error messages
  const renderErrorMessage = (name) =>
    name === errorMessage.name && (
      <div className="error">{errorMessage.error}</div>
    );

  return (
    <>
      <div className={Style.form_container}>
        <div>
          <button>
            <Link href="./">
              <BsArrowLeftCircleFill />
              Home
            </Link>
          </button>
        </div>
        {/* Login form */}
        <form action={doSocialLogin}>
          <div>
            <div className={Style.title}>Log In:</div>
            <div className={Style.login_email}>
              <label>Email:</label>
              <input
                type="text"
                size="40"
                minlength="6"
                maxlength="40"
                placeholder="john@abc.com"
                name="email"
                pattern="[Aa-Zz]{4}"
                autoFocus
                required
              />
              {renderErrorMessage("email")}
            </div>
            <div className={Style.login_pword}>
              <label>Password:</label>
              <input
                type="password"
                size="15"
                minlength="6"
                maxlength="15"
                placeholder="********"
                name="pass"
                required
                pattern="[Aa-Zz0-9@#$]"
              />
              {renderErrorMessage("pword")}
            </div>
            <div>
              <button
                className={Style.login_submit_button}
                type="submit"
                name="action"
                value="google"
              >
                Login
              </button>
            </div>
            <div className={Style.login_reset_register_buttons}>
              <div className={Style.login_reset_button}>
                <a href="#">Reset Password</a>
              </div>
              <div className={Style.login_register_button}>
                <a href="./register">Don't have an account? Register</a>
              </div>
            </div>
          </div>
        </form>
        <div>
          <p>Or</p>
          <div>
            <button
              className={Style.login_submit_button}
              type="submit"
              name="action"
              value="google"
            >
              Sign In With Google
            </button>
          </div>
          <div>
            <button
              className={Style.login_submit_button}
              type="submit"
              name="action"
              value="facebook"
            >
              Sign In With Facebook
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
