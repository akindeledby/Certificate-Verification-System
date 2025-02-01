import React from 'react'
import Image from "next/image";
import Style from "../styles/resetPassword.module.css"
import { BsArrowLeftCircleFill } from 'react-icons/bs'

const resetPassword = () => {

const handleSubmit = (event) => {
    event.preventDefault()
}

  return (
    <>
        <div className={Style.home}>
          <button>
          <BsArrowLeftCircleFill className={Style.home_icon}/>
          <span>Home</span>
          </button>
        </div>
    {/* Reset Password */}
        <form className={Style.form_container} onSubmit={handleSubmit}>
        <div>
          <div className={Style.title}>Reset Password:</div>
          <div className={Style.login_email}>
            <label>Email:</label>
            <input type="text" size="30" minlength="6" maxlength="30" placeholder="john@abc.com" name="email" pattern="[Aa-Zz]{4}" autoFocus required/>
          </div>
            <div className={Style.login_Npword}>
              <label>New Password:</label>
              <input type="password" size="15" minlength="6" maxlength="15" placeholder="********" name="pass" required pattern="[Aa-Zz0-9@#$]"/>
            </div>
            <div className={Style.login_Cpword}>
              <label>Confirm Password:</label>
              <input type="password" size="15" minlength="6" maxlength="15" placeholder="********" name="pass" required pattern="[Aa-Zz0-9@#$]"/>
            </div>
            <div className={Style.submit_button}>
              <div className={Style.login_submit_button}>
              <input type="submit" value="Submit" />
              </div>
            </div>
            </div>
        </form>
        </>
  )
}

export default resetPassword
