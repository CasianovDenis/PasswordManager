import React, { useState, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

import style from './SignUp.module.css';

import book_readers from './book_readers.jpg';
import faq from './faq.png';

import GetCookie from '../public_files/GetCookie.js';

export default function SignUp() {

    const [message, setMessage] = useState("");
    const refUsername = useRef(""), refEmail = useRef(""), refQuestion = useRef(""), refAnswer = useRef("");


    if (GetCookie("status_account") == "online") window.open("http://localhost:32349/", '_self', "noopener noreferrer");

    const onCreateUser = (event) => {

        event.preventDefault();
      
        let newuser = {

            "Username": refUsername.current.value,
            "Email": refEmail.current.value,
            "Secret_question": refQuestion.current.value,
            "Secret_answer":refAnswer.current.value

        };

        

        //username validation,must contain only letters or numbers

        if (newuser.Username.match(/^[A-Za-z0-9]+$/)) {

            if (newuser.Username.length <= 25) {

                //Checking if "Email" has correct format email
                if (newuser.Email.match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )) {
                    //secret question validation,must contain only letters or numbers

                    if (newuser.Secret_question.match(/^[a-zA-Z0-9\s]*$/)) {

                        //secret question validation,must contain only letters or numbers

                        if (newuser.Secret_answer.match(/^[a-zA-Z0-9\s]*$/)) {

                            setMessage("Please wait");
                            newuser.Secret_question = btoa(refQuestion.current.value);
                            newuser.Secret_answer = btoa(refAnswer.current.value);

                            
                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newuser)
                            };

                          

                            fetch('http://localhost:32349/api/createuser', requestOptions)
                                .then(response => response.json())
                                .then((responseData) => {

                                    
                                    if (responseData == "Create") {
                                        setMessage("Account create succesfully");
                                        refUsername.current.value = "";
                                        refEmail.current.value = "";
                                        refQuestion.current.value = "";
                                        refAnswer.current.value = "";
                                    }
                                    else
                                        setMessage(responseData);


                                });
                        }
                        else
                            setMessage("Secret answer can not empty or have symbols");
                    }
                    else
                        setMessage("Secret question can not  empty or have symbols");
                }
                else
                    setMessage("Email has incorrect format");
            }
            else
                setMessage("Username is too long,maximum 25 letters");
        }
        else
            setMessage("Username can not have symbols" );



    }

   


    return (

        <div >
            <form className={style.form_position} >
                <p >Username: </p>
                <input type="text" class="form-control" style={{ width: "30%" }} ref={refUsername} />
                <br />

                <p>Email: </p>
                <input type="email" class="form-control" style={{ width: "30%" }} ref={refEmail} />

                <br />

                <p >Secret Question: </p> <img src={faq} className={style.faq_image }
                    title="You need to create secret question,where know only you answer.
                    Its help you for log in account without password,if you can not acces your email" />

                <input type="text" class="form-control" style={{ width: "30%" }} ref={refQuestion} />

                <br />

                <p >Secret Answer: </p> <img src={faq} className={style.faq_image}
                    title="In this field you must write answer for secret question" />

                <input type="text" class="form-control" style={{ width: "30%" }} ref={refAnswer} />

                <br /><br />
                <button class="btn btn-primary" onClick={onCreateUser}>Create</button>


                <NavLink tag={Link} to="/SignIn" style={{ margin: "25px" }}>Already have account</NavLink>

                <p style={{ marginLeft: "5px" }}>{message}</p>

            </form>

            <img src={book_readers} className={style.book_image} />

        </div>
    );
  }

