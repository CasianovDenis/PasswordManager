import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import style from './Settings.module.css';

import user_icon from '../public_files/user_icon.png';
import email_icon from './email_icon.png';
import secret_icon from './secret_data.png';

import Modal_edit_username from './Modal_edit_username.js';
import Modal_edit_email from './Modal_edit_email.js';
import Modal_edit_secret_question from './Modal_edit_secret_question.js';
import GetCookie from '../public_files/GetCookie.js';


export default function Settings() {

    const [dbdata, setDbdata] = useState(null);
    const [request, setRequest] = useState(false);

    const redirect = useHistory();

    if (GetCookie("status_account") != "online") redirect.push('/');

    useEffect(() => {

      

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        
            fetch('http://localhost:32349/api/getuserdata/' + GetCookie("username")+'/'+GetCookie("auth_token"), requestOptions)
                .then(response => response.json())
                .then((responseData) => {

                    if (responseData != "Incorrect username") setDbdata(responseData);


                });

    }, [request]);


    const change_page = (data) => {
        if (data == 'succes')
        request == false ? setRequest(true) : setRequest(false);
    }

    if (dbdata != null)
    return (

        <div className={style.account_settings }>

            <div className={style.settings_div}>
                <img src={user_icon} style={{ width: "25px" , height: "25px"} } />

                <p style={{ color: "white", marginLeft: "40px", marginTop: "-25px" }}>Edit Username :</p>
                <p style={{ color: "white" }}>Username : {dbdata.Username}</p>
               
                <Modal_edit_username func={change_page} />
                
            </div>
                
           

           

            <div className={style.settings_div}>
                <img src={email_icon} style={{ width: "25px", height: "25px" }} /> 

                <p style={{ color: "white", marginLeft: "40px", marginTop:"-25px" }}>Email Settings:</p>
                <p style={{ color: "white" }}>Email: {dbdata.Email}</p>

                <Modal_edit_email Email={dbdata.Email} func={change_page} />
            </div>

            <div className={style.settings_div}>

                <img src={secret_icon} style={{ width: "25px", height: "25px" }} /> 
                <p style={{ color: "white", marginLeft: "40px", marginTop:"-25px" }}>Secret question:</p>
                
                <p style={{ color: "#f28883"}}>
                    Don't use simple secret question for example "My name",question must be strong  for only you know answer</p>

                <Modal_edit_secret_question question={dbdata.Secret_question} func={change_page} />

            </div>
            

        </div>

        );
    else
        return (
            <div class="spinner-border" role="status" >
                <span class="visually-hidden"></span>
            </div>
        )

    }
        