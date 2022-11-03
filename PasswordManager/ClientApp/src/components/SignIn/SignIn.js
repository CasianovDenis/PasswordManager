import React, { useState, useRef, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import style from './SignIn.module.css';
import home_office from './home_office.jpg';
import { Link, NavLink } from 'react-router-dom';


export default function SignIn() {
    const [message, setMessage] = useState('');
    

    const refUsername = useRef("");
    const refPassword = useRef("");

    const redirect = useHistory();

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

    if (getCookie("status_account") == "online") redirect.push('/Account');

    

        const Smtp_password=(event)=>  {

            event.preventDefault();
            //create object which get data from input
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
                                window.localStorage.setItem('sesion_time', responseData);

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

                    //get returned data from backend and display result on displya for user
                    if (responseData == "Access_granted") {

                        refUsername.current.value = "";
                        refPassword.current.value = "";


                        // +1 hour when create cookie
                        var now = new Date();
                        var time = now.getTime();
                        time += 3600 * 1000;
                        now.setTime(time);


                        document.cookie = "window=active";
                        document.cookie = "username=" + userdata.Username + "; expires = " + now.toUTCString();

                        document.cookie = "status_account=online; expires = " + now.toUTCString();

                        setMessage( "Log in successfully" );

                        window.location.reload(false);
                        

                       

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
        