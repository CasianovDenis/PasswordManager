import React, { useState, useRef, useEffect , useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';

import { Context } from '../Context';

import style from './SecretQuestion.module.css';

import question_mark from './question_mark.webp';

import GetCookie from '../public_files/GetCookie.js';

export default function Secret() {

    const [message, setMessage] = useState("");
    const [question, setQuestion] = useState("");
    const [count_wrong_entry, setCount_Wrong_Entry] = useState(0);
    const [show_answer_form, setShowAnswerForm] = useState(false);

    const [context, setContext] = useContext(Context);

    const refUsername = useRef(""), refAnswer = useRef("");
    const redirect = useHistory();
       

    if (GetCookie("status_account") == "online") redirect.push('/Account');


   

    const getquestion = (event) => {
        event.preventDefault();

                   setMessage("Please wait");

                     
                        const requestOptions = {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        };

                       

        fetch('http://localhost:32349/api/getquestion/' + refUsername.current.value, requestOptions)
                            .then(response => response.json())
                            .then((responseData) => {
                                const date = new Date();
                              
                               
                                if (responseData != null) {

                                    if (responseData[0].Time != null)
                                    var strdate = new Date(parseInt(responseData[0].Time.substr(6)));
                                    

                                    if (date > strdate || responseData[0].Time == null) {
                                        setQuestion(responseData[0].Text);

                                        let button = document.getElementById('verifie_button');
                                        button.style.display = "none";

                                        setShowAnswerForm(true);


                                        setMessage("");
                                    }
                                    else
                                        setMessage("Too much attempts,wait to expire time ban");
                                }
                                else
                                    setMessage("User not exist");


                            });
                    
    }


    const sendanswer = (event) => {
        event.preventDefault();

        if (count_wrong_entry < 5) {

            setMessage("Processing");

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "Username": refUsername.current.value,
                    "Secret_answer": btoa(refAnswer.current.value)
                })
            };

           

            fetch('http://localhost:32349/api/sendanswer', requestOptions)
                .then(response => response.json())
                .then((responseData) => {


                    if (responseData != "Answer isn't right" && responseData != "User not exist") {


                        var date = new Date();

                        date.setDate(date.getDate() + 1);

                        document.cookie = "username=" + refUsername.current.value + "; expires=" + date.toGMTString();

                        document.cookie = "status_account=online; expires=" + date.toGMTString();

                        document.cookie = "auth_token=" + responseData + "; expires = " + date.toGMTString();

                        setMessage("Log in successfully");

                     
                        setContext('succes_entered');
                    }


                    else {

                        setCount_Wrong_Entry(count_wrong_entry => count_wrong_entry + 1);



                        setMessage(responseData + " You have " + (5 - count_wrong_entry) + " attempts");
                    }

                });
        }
        else {

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


                    setMessage("You was used all attempts please wait 30 minutes");

                });
            
        }
    

    }
   
   

    return (

        <div className={style.authorization_form }>
            <form >
                <div className={style.inputBox }>
               
                    <input type="text" ref={refUsername} required />
                    <span>Username</span>
                    <i></i>
               
                </div>
                <button class="btn btn-primary" id="verifie_button" style={{ margin: "10px" }} onClick={getquestion}>Verifie</button>
                    
                
                {show_answer_form && (
                    <form>
                <div className={style.inputBox}>
                    <input type="text" value={ question} disabled />
                    <span>Question</span>
                    <i></i>

                </div>

                <div className={style.inputBox}>
                    <input type="text" ref={refAnswer} required />
                    <span>Answer</span>
                    <i></i>
                    </div>

                        <button class="btn btn-primary" style={{margin:"10px"} } onClick={sendanswer }>Sign In</button>
                        </form>
            )}
                   
          
            <NavLink tag={Link} to="/SignIn" >Back</NavLink>
                <p style={{ marginLeft: "15px" }}>{message}</p>

            </form>

            <img id="question_img" src={question_mark} className={style.question_image} />
            

        </div>
    );
  }

