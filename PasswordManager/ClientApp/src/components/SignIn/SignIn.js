import React, { useState,useRef,useEffect } from 'react';
import style from './SignIn.module.css';
import home_office from './home_office.jpg';
import { Link, NavLink } from 'react-router-dom';


export default function SignIn() {
    const [message, setMessage] = useState('');
    

    const refUsername = useRef("");
    const refPassword = useRef("");
    

    

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
                            //debugger;
                            
                            //get returned data from backend and display result on displya for user
                            if (responseData == "user_not_exist")
                                setMessage("user not exist");
                            else {


                                    let element_div = document.getElementById('password_form');
                                    element_div.style.display = "block";

                                    let element_button = document.getElementById('smtp_button');
                                    element_button.style.display = "none";

                                    setMessage(
                                        "Password is sended in the email." +"\n"+"\n"+
                                        " Password can come delay or you can find him in the  spam"
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
                        var date_time = new Date();
                        date_time.setHours(1);


                        document.cookie = "username=" + userdata.Username + "; expires = " + date_time;

                        document.cookie = "status_account=online; expires = " + date_time;

                        setMessage( "Log in successfully" );

                        window.open("http://localhost:32349/Account", '_self', "noopener noreferrer");


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


                </form>

                <form id="password_form" className={style.form_position} style={{ display: "none" }}>

                    <p class="login_text">Password: </p>
                    <input type="password" class="form-control" style={{ width: "30%" }} ref={refPassword} />

                    <br /><br />
                <button  class="btn btn-primary" onClick={Login_account}>Log In</button>
                <NavLink tag={Link} to="/SignUp" style={{ margin: "25px" }}>Create Account</NavLink>
            </form>
            
                <p>{message} </p>

                <div className={style.div_image}>
                    <img src={home_office} className={style.home_image} />
                </div>
           
            </div>

        


    );

    }
        