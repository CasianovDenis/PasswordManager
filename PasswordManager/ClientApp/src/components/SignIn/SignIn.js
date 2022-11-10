import React, { useState, useRef, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import style from './SignIn.module.css';
import home_office from './home_office.jpg';
import { Link, NavLink } from 'react-router-dom';
import GetCookie from '../GetCookie.js';

export default function SignIn() {
    const [message, setMessage] = useState('');
    

    const refUsername = useRef("");
    const refPassword = useRef("");

    const redirect = useHistory();

    if (GetCookie("status_account") == "online") redirect.push('/Account');

    

        const Smtp_password=(event)=>  {

            event.preventDefault();
           
            if (refUsername.current.value.match(/\w/)) {
                setMessage("Please wait");

                
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({

                        "Username": refUsername.current.value

                    })
                };

                //call api from backend and send json data,which create before
                
                
                    fetch('http://localhost:32349/api/smtp', requestOptions)
                        .then(response => response.json())
                        .then((responseData) => {
                            
                            
                            //get returned data from backend and display result on displya for user
                            if (responseData == "user_not_exist")
                                setMessage("user not exist");
                            else {
                             

                                    let element_div = document.getElementById('password_form');
                                    element_div.style.display = "block";

                                    let element_button = document.getElementById('smtp_button');
                                    element_button.style.display = "none";

                                let style_image = document.getElementById("signin_image");
                                style_image.style.top = "-300px";

                                let link_signup = document.getElementById("link_signup");
                                link_signup.style.position = "absolute";
                                link_signup.style.marginTop = "130px";
                                link_signup.style.marginLeft = "100px";

                                let link_secret = document.getElementById("link_secret");
                                link_secret.style.position = "absolute";
                                link_secret.style.marginTop = "130px";
                                link_secret.style.marginLeft = "220px";

                                    setMessage(
                                        "Password is sended in the email." +'\n'+
                                        "Mail can come delay or you can find him in the spam"
                                    );
                                   
                                }

                        });
                
                
            }
            else
                setMessage("Field can not empty");
         

    }

    


        const Login_account = (event) => {

            event.preventDefault();
            setMessage( "Please wait" );

            //create object which get data from input
            let userdata = {

                "Username": refUsername.current.value,
                "Password": refPassword.current.value

            };


            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userdata)
            };

            

            //call api from backend and send json data,which create before

            fetch('http://localhost:32349/api/login', requestOptions)
                .then(response => response.json())
                .then((responseData) => {

              
                    if (responseData == "Access_granted") {

                        refUsername.current.value = "";
                        refPassword.current.value = "";


                      
                        // +1 day when create cookie
                        
                        var date = new Date();
                           
                        date.setDate(date.getDate() + 1);
                       

                        document.cookie = "username=" + userdata.Username + "; expires=" + date.toGMTString();

                        document.cookie = "status_account=online ; expires=" + date.toGMTString();

                        setMessage( "Log in successfully" );

                        //redirect to page and refresh component
                        redirect.go('/Account');
                       

                    }
                    else

                        setMessage(responseData);

                });


        }

 

    return (
      
            <div>
            
                <form className={style.form_position}>

                    <p class="login_text">Username: </p>
                    <input type="text" class="form-control" style={{ width: "30%" }} ref={refUsername} />
                    <br />

                <button id="smtp_button" class="btn btn-primary" onClick={Smtp_password}> Verifie </button>

                <NavLink id="link_signup" tag={Link} to="/SignUp" style={{ margin: "25px" }}>Create Account</NavLink>

                <NavLink id="link_secret" tag={Link} to="/Secret" className={style.redirect_secret }>Inaccessible Email</NavLink>

                </form>

                <form id="password_form" className={style.form_position} style={{ display: "none" }}>

                    <p class="login_text">Password: </p>
                    <input type="password" class="form-control" style={{ width: "30%" }} ref={refPassword} />

                    <br /><br />
                <button  class="btn btn-primary" onClick={Login_account}>Log In</button>
                
            </form>
            
                <p>{message} </p>

                <div className={style.div_image}>
                    <img id="signin_image" src={home_office} className={style.home_image} />
                </div>
           
            </div>

        


    );

    }
        