import React, { useState,useRef } from 'react';
import style from './SignUp.module.css';
import { Link, NavLink } from 'react-router-dom';
import book_readers from './book_readers.jpg';
import faq from './faq.png';

export default function SignUp() {

    const [message, setMessage] = useState("");
    const refUsername = useRef(""), refEmail = useRef(""), refQuestion = useRef(""), refAnswer = useRef("");

    const onCreateUser = (event) => {

        event.preventDefault();
        //create object which get data from input
        let newuser = {

            "Username": refUsername.current.value,
            "Email": refEmail.current.value,
            "Secret_question": refQuestion.current.value,
            "Secret_answer":refAnswer.current.value

        };

        if (newuser.Username.match(/^[A-Za-z0-9]+$/)) {
            //email validation
            if (newuser.Email.match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {

                if (newuser.Secret_question.match(/^[A-Za-z0-9]+$/)) {

                    if (newuser.Secret_answer.match(/^[A-Za-z0-9]+$/)) {

                        setMessage("Please wait");

                        //after email validation create option for json
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newuser)
                        };

                        //call api from backend and send json data,which create before

                        fetch('http://localhost:32349/api/createuser', requestOptions)
                            .then(response => response.json())
                            .then((responseData) => {

                                //get returned data from backend and display result on displya for user
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
                        setMessage( "Secret answer can not empty or have symbols" );
                }
                else
                    setMessage( "Secret question can not  empty or have symbols" );
            }
            else
                setMessage("Email has incorrect format" );
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

                <p>{message} </p>

            </form>

            <img src={book_readers} className={style.book_image} />

        </div>
    );
  }

