import React, { useState,useEffect } from 'react';
import style from './Settings.module.css';

import user_icon from '../public_files/user_icon.png';
import email_icon from './email_icon.png';
import secret_icon from './secret_data.png';

import Modal_edit_username from './Modal_edit_username.js';
import Modal_edit_email from './Modal_edit_email.js';
import Modal_edit_secret_question from './Modal_edit_secret_question.js';
import GetCookie from '../public_files/GetCookie.js';


export default function Settings() {
   
    const [dbdata, setDbdata] = useState('');
   

    if (GetCookie("status_account") != "online") window.open("http://localhost:32349/", '_self', "noopener noreferrer");
    
    useEffect(() => {

        //create object which get data from input             
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                "Username": GetCookie("username")

            })
        };

        //call api from backend and send json data,which create before
        fetch('http://localhost:32349/api/getuserdata', requestOptions)
            .then(response => response.json())
            .then((responseData) => {

                if (responseData != null)  setDbdata(responseData); 

            });

    },[dbdata]);
    
                        
    return (

        <div>

           
         

            <div className={style.background_top_color}>

                <p id="font_style"className={style.font_style}>{dbdata.Username}</p>
                <Modal_edit_username />
               
            </div>

          

            <div className={style.settings_user_photo} id="user_photo_div">

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
                <p style={{ color: "white", marginLeft: "40px", marginTop:"-25px" }}>Secret question:</p>
                
                <p style={{ color: "#f28883"}}>
                    Don't use simple secret question for example "My name",question must be strong  for only you know answer</p>
                <Modal_edit_secret_question question={dbdata.Secret_question} />
            </div>



            <div className={style.background_bottom_color }>

                </div>
            

        </div>

    );

    }
        