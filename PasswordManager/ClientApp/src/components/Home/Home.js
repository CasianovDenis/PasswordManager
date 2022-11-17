import React from 'react';

import style from './Home.module.css';

import locker from './locker.png';
import security from './security.png';
import cross_platform from './cross_platform.png';
import open_source from './open_source.png';



export default function Home() {

    
    const redirect_to_SignIn=() => {

        window.open("http://localhost:32349/SignIn", '_self', "noopener noreferrer");
    }
    
    const redirect_to_SignUp = () => {
        window.open("http://localhost:32349/SignUp", '_self', "noopener noreferrer");
    }

 
    return (
      
        <div >
            <div className={style.first_div} >
                <img src={locker} className={style.image_form } />

                <p className={style.home_text}> Online Password Manager</p>
                <p className={style.home_text}> Store you passwords in safe. You passwords ever near for you</p>

                <button class="btn btn-primary button_style" id={style.login_button }
                    onClick={redirect_to_SignIn}> Sign In </button>

                <button class="btn btn-primary" id={ style.signup_button}
                    onClick={redirect_to_SignUp}> Sign Up </button>
            </div>

            <div className={style.second_div}>
                <img src={security} className={style.image_form_second} />Security
               
                <img src={cross_platform} className={style.image_form_second}/> Cross-platform
               
                <img src={open_source} className={style.image_form_second} />Open source

                <p className={style.text_description_1} style={{ left: "20%" }}>
                    All data is store safe,because him is encrypted using 256-bit AES</p>

                <p className={style.text_description_1} style={{ left: "30%" }}>
                    Password Manager working on all platform MacOS,Windows,Linux and Smartphone</p>

                <p className={style.text_description_1} style={{ left: "47%", top: "-45px" }}>
                    The full source code is published on Github.</p>
                </div>
        </div>
    );
  }

