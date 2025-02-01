import React, { useState } from "react";
import Style from "../../styles/register.module.css";
import Image from "next/image";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import Link from "next/link";

const Register = () => {
  const [file, setFile] = useState();
  function handleChange(e) {
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      <div className={Style.home}>
        <button>
          <Link href="./">
            <BsArrowLeftCircleFill className={Style.home_icon} />
            Home
          </Link>
        </button>
      </div>
      <div className={Style.form}>
        <h1>Account Registration:</h1>
        <h3>Please Enter all neccesary information correctly:</h3>
        <form>
          <div className={Style.form_container}>
            <div className={Style.form_container_top}>
              <div className={Style.register_firstname}>
                <label>First Name:</label>
                <input
                  type="text"
                  size="30"
                  minLength="2"
                  maxLength="15"
                  placeholder="John"
                  id="fname"
                  name="firstname"
                  pattern="[Aa-Zz]{4}"
                  autoFocus
                  required
                />
              </div>
              <div className={Style.register_lastname}>
                <label>Last Name:</label>
                <input
                  type="text"
                  size="30"
                  minLength="2"
                  maxLength="15"
                  placeholder="Andrew"
                  id="lname"
                  name="lastname"
                  pattern="[Aa-Zz]{4}"
                  autoFocus
                  required
                />
              </div>

              <div className={Style.register_gender}>
                Gender:
                <input type="radio" name="gender" value="M" /> Male
                <input type="radio" name="gender" value="F" /> Female
              </div>

              <div className={Style.register_phone}>
                <label>Phone No:</label>
                <input
                  type="text"
                  size="30"
                  minLength="6"
                  maxLength="15"
                  placeholder="Enter Phone No:"
                  name="phone"
                  pattern="[Aa-Zz]{4}"
                  autoFocus
                  required
                />
              </div>

              <div className={Style.register_email}>
                <label>Email:</label>
                <input
                  type="text"
                  size="30"
                  minLength="6"
                  maxLength="30"
                  placeholder="youremail@abc.com"
                  id="email"
                  name="email"
                  pattern="[Aa-Zz]{4}"
                  autoFocus
                  required
                />
              </div>
              <div className={Style.register_pword}>
                <label>Password:</label>
                <input
                  size="30"
                  minLength="6"
                  maxLength="8"
                  placeholder="**********"
                  id="password"
                  name="pass"
                  type="password"
                  required
                  pattern="[Aa-Zz0-9@#$]"
                />
              </div>
              <div className={Style.register_pword}>
                <label>Confirm Password:</label>
                <input
                  size="30"
                  minLength="6"
                  maxLength="8"
                  placeholder="**********"
                  id="password"
                  name="pass"
                  type="password"
                  required
                  pattern="[Aa-Zz0-9@#$]"
                />
              </div>
            </div>

            {/* <div className={Style.upload_photo}>
              <div className={Style.uplaod_photo_info}>
                <label>
                  <img src={file} id="output" height="150" width="130" />
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                />
              </div>
              <p>Upload your photo (jpeg or png - Max 500kb)</p>
            </div> */}
          </div>
          <div className={Style.register_button}>
            <div className={Style.register_submit_button}>
              <input type="Submit" />
            </div>
            <div className={Style.register_login_button}>
              <a href="./login">Already have an account? Login</a>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
