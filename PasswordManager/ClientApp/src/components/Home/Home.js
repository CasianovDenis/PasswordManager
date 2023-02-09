import React, { useEffect } from 'react';
import { useHistory} from 'react-router-dom';

import style from './Home.module.css';

import locker from './locker.png';
import security_image from './security.png';
import cross_platform_image from './cross_platform.png';
import open_source_image from './open_source.png';

import GetCookie from '../public_files/GetCookie.js';



export default function Home() {

    const redirect = useHistory();

    if (GetCookie("status_account") == "online") redirect.push('/Account');

    useEffect(() => {

        document.documentElement.style.setProperty('--bodyColor', 'rgb(41,44,51)');

    }, []);

    const redirect_to_SignIn=() => {

        redirect.push('/SignIn');

    }
    
    const redirect_to_SignUp = () => {
        redirect.push('/SignUp');
       
    }

 
    return (
      
        <div className={ style.home_div}>

            <div className={style.welcome_div} >

                <img src={locker} className={style.image_locker } />

                <p className={style.welcome_text}> Online Password Manager</p>
                <p className={style.welcome_text}> Store you passwords in safe. You passwords ever near for you</p>

                <button class="btn btn-primary button_style" id={style.login_button }
                    onClick={redirect_to_SignIn}> Sign In </button>

                <button class="btn btn-primary" id={ style.signup_button}
                    onClick={redirect_to_SignUp}> Sign Up </button>
            </div>

            <div className={style.Info_web_app}>

            <div className={style.security_info }>

                    <img src={security_image} style={{width: "50px" , height: "50px"} } />Security

                <p  style={{ left: "20%" }}>
                    All data is store safe,because him is encrypted using 256-bit AES</p>

            </div>

            <div className={style.crossplatform_info}>

                    <img src={cross_platform_image} style={{ width: "50px", height: "50px" }} /> Cross-platform

              <p  style={{ left: "30%" }}>
                Password Manager working on all platform MacOS,Windows,Linux and Smartphone</p>

            </div>

            <div className={style.opensource_info }>
                    <img src={open_source_image} style={{ width: "50px", height: "50px" }} />Open source


                <p  style={{ left: "47%", top: "-45px" }}>
                    The full source code is published on Github.</p>
            </div>
                </div>
              
        </div>
    );
  }

