import React, { useState, useRef , useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import style from './SignUp.module.css';

import book_readers from './book_readers.jpg';
import faq from './faq.png';

import GetCookie from '../public_files/GetCookie.js';

export default function SignUp() {

    const [message, setMessage] = useState("");
    const refUsername = useRef(""), refEmail = useRef(""), refQuestion = useRef(""), refAnswer = useRef("");

    const redirect = useHistory();

    if (GetCookie("status_account") == "online") redirect.push('/Account');

  

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

        <div className={style.signup_div}>

           
            <form >
                <div className={ style.inputBox}>
               
               
                <input type="text" ref={refUsername} maxlength="100" required/>
                <span >Username</span>
                    <i></i>
                </div>


                <div className={style.inputBox}>
                
                    <input type="text" ref={refEmail} required/>
                    <span >Email</span>
                    <i></i>
              </div>

                <div className={style.inputBox}>
               
                    <input type="text"  ref={refQuestion} required/>
                    <span >Question</span>
                    <i></i>

                <img src={faq} className={style.faq_image}
                    title="You need to create secret question,where know only you answer.
                    Its help you for log in account without password,if you can not acces your email" />

                   </div>
               
               
                <div className={style.inputBox}>
                    <input type="text"  ref={refAnswer} required/>
                    <span >Answer</span>
                    <i></i>

                 <img src={faq} className={style.faq_image}
                    title="In this field you must write answer for secret question" />

            
                </div>

                <button class="btn btn-primary" onClick={onCreateUser} style={{ margin:"10px" }}>Create</button>


                <NavLink tag={Link} to="/SignIn" style={{ margin: "20px" }}>Already have account</NavLink>

                <p style={{ marginLeft: "5px" }}>{message}</p>

            </form>

           
           
                <img className={style.image_book} src={book_readers}   />
            
               

                </div>
       
    );
  }

