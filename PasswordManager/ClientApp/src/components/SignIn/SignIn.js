import React, { useState, useRef, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';

import style from './SignIn.module.css';

import home_office from './home_office.jpg';

import GetCookie from '../public_files/GetCookie.js';

export default function SignIn() {
    const [message, setMessage] = useState('');
    const [count_wrong_entry, setCount_Wrong_Entry] = useState(0);

   

    const refUsername = useRef("");
    const refPassword = useRef("");

    const redirect = useHistory();

    if (GetCookie("status_account") == "online") redirect.push('/Account');

    useEffect(() => {

        document.documentElement.style.setProperty('--bodyColor', 'white');

    }, []);

        const verifie_exist_user=(event)=>  {

            event.preventDefault();
           
            if (refUsername.current.value.match(/\w/)) {
                setMessage("Please wait");

                
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };

                
                
                fetch('http://localhost:32349/api/send_one_time_password/' + refUsername.current.value, requestOptions)
                        .then(response => response.json())
                        .then((responseData) => {
                            

                            
                            if (responseData == "time ban")
                                setMessage("Too much attempts wait to expire time ban");
                            else
                                if (responseData != "user not exist") {
                                  


                                        let element = document.getElementById('password_form');
                                        element.style.display = "block";

                                        element = document.getElementById('hide_elements');
                                    element.style.display = "none";

                                    setMessage(responseData);
                                }
                                    else
                                    setMessage(responseData);

                        });
                
                
            }
            else
                setMessage("Field can not empty");
         

    }

    


    const Login_account = (event) => {

        event.preventDefault();
        setMessage("Please wait");

        
        if (count_wrong_entry < 5) {
            let userdata = {

                "Username": refUsername.current.value,
                "Password": refPassword.current.value

            };


            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userdata)
            };



         

            fetch('http://localhost:32349/api/login', requestOptions)
                .then(response => response.json())
                .then((responseData) => {


                    if (responseData != "Password does not match" && responseData != "Password incorect") {


                        refUsername.current.value = "";
                        refPassword.current.value = "";


                        // +1 day when create cookie

                        var date = new Date();

                        date.setDate(date.getDate() + 1);


                        document.cookie = "username=" + userdata.Username + "; expires=" + date.toGMTString();

                        document.cookie = "status_account=online ; expires=" + date.toGMTString();

                        document.cookie = "auth_token=" + responseData +"; expires = " + date.toGMTString();

                        setMessage("Log in successfully");

                        
                        redirect.go('/Account');


                    }
                    else {

                        setCount_Wrong_Entry(count_wrong_entry => count_wrong_entry + 1);

                        if (count_wrong_entry >= 5) {

                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    "Username": refUsername.current.value
                                })
                            };



                         

                            fetch('http://localhost:32349/api/login_wrong', requestOptions)
                                .then(response => response.json())
                                .then((responseData) => {

                                   
                                    setMessage(responseData);

                                });




                        }

                        setMessage(responseData + " You have " + (5 - count_wrong_entry) + " attempts");

                    }



                });
        }
        else
            setMessage("You was used all attempts please wait 10 minutes");
    }

 

    return (

        <div className={ style.signin_content}>
            
                <form >

                    <p class="login_text">Username: </p>
                    <input type="text" class="form-control" style={{ width: "30%" }} ref={refUsername} />
                    <br />

                <div id="hide_elements">

                <button id="verifie_user" class="btn btn-primary" onClick={verifie_exist_user}> Verifie </button>

                    <NavLink style={{margin:"15px"} } tag={Link} to="/SignUp" >Create Account</NavLink>

                    <NavLink style={{ margin: "15px" }}  tag={Link} to="/Secret" >Inaccessible Email</NavLink>
                    </div>
                </form>

                <form id="password_form" className={style.form_position} style={{ display: "none" }}>

                    <p class="login_text">Password: </p>
                    <input type="password" class="form-control" style={{ width: "30%" }} ref={refPassword} />

                    <br /><br />
                <button class="btn btn-primary" onClick={Login_account}>Log In</button>

                <NavLink style={{ margin: "15px" }} tag={Link} to="/SignUp" >Create Account</NavLink>

                <NavLink style={{ margin: "15px" }} tag={Link} to="/Secret" >Inaccessible Email</NavLink>
               
            </form>
            <p style={{ marginTop: "15px", marginLeft: "5px" }}>{message} </p>
   

               
                    <img  src={home_office} className={style.home_image} />
               
           
            </div>

        


    );

    }
        