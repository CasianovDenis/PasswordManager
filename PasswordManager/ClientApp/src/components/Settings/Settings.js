import React, { useState,useEffect } from 'react';
import style from './Settings.module.css';

import user_icon from './user_icon.png';
import email_icon from './email_icon.png';
import secret_icon from './secret_data.png';

import Modal_edit_username from './Modal_edit_username.js';
import Modal_edit_email from './Modal_edit_email.js';
import Modal_edit_secret_question from './Modal_edit_secret_question.js';


export default function Settings() {
   
    const [username, setUsername] = useState('');
    const [dbdata, setDbdata] = useState('');
   
    
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    if (getCookie("status_account") != "online") window.open("http://localhost:32349/", '_self', "noopener noreferrer");
    
    useEffect(() => {
        //create object which get data from input             
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                "Username": getCookie("username")

            })
        };

        //call api from backend and send json data,which create before


        fetch('http://localhost:32349/api/getuserdata', requestOptions)
            .then(response => response.json())
            .then((responseData) => {

                if (responseData != null) { setUsername(responseData.Username); setDbdata(responseData); }

            });

    },[]);
    
                        
    return (

        <div>
            
            <div className={style.background_top_color}>

                <p className={style.font_style}>{username}</p>
                <Modal_edit_username />
               
            </div>


            <div className={style.settings_user_photo}>

                <img src={user_icon} className={style.image_user }/>
            </div>

           
            <div className={style.settings_div}>
                <img src={email_icon} className={style.icon_mail} />
                <p style={{ color: "white", marginLeft: "40px", marginTop:"-25px" }}>Email Settings:</p>
                <p style={{ color: "white" }}>Email: {dbdata.Email}</p>
                <Modal_edit_email Email={dbdata.Email}  />
            </div>

            <div className={style.settings_div}>
                <img src={secret_icon} className={style.secret_question_icon} />
                <p style={{ color: "white", marginLeft:"40px" }}>Secret question:</p>
                
                <p style={{ color: "#9b3126"}}>
                    Don't use simple secret question for example "My name",question must be strong  for only you know answer</p>
                <Modal_edit_secret_question question={dbdata.Secret_question} />
            </div>

            

        </div>

    );

    }
        