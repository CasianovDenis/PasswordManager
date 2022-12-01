import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Link, NavLink } from 'react-router-dom';

import style from './SecretQuestion.module.css';

import question_mark from './question_mark.webp';

import GetCookie from '../public_files/GetCookie.js';

export default function Secret() {

    const [message, setMessage] = useState("");
    const [question, setQuestion] = useState("");
    const [count_wrong_entry, setCount_Wrong_Entry] = useState(0);
    const refUsername = useRef(""), refAnswer = useRef("");
    const redirect = useHistory();
       

    if (GetCookie("status_account") == "online") redirect.push('/Account');

    
    const getquestion = (event) => {
        event.preventDefault();

                   setMessage("Please wait");

                     
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "Username": refUsername.current.value
                            })
                        };

                       

                        fetch('http://localhost:32349/api/getquestion', requestOptions)
                            .then(response => response.json())
                            .then((responseData) => {
                                const date = new Date();

                                const strdate = new Date(responseData[0].Time);

                                
                                if (responseData != null) {

                                    if (date > strdate || responseData[0].Time == null) {
                                        setQuestion(responseData[0].Text);

                                        let button = document.getElementById('verifie_button');
                                        button.style.display = "none";

                                        let div_answer = document.getElementById('form_answer');
                                        div_answer.style.display = "block";

                                        let image = document.getElementById('question_img');
                                        image.style.marginTop = "-20%";

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
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "Username": refUsername.current.value,
                    "Secret_answer": btoa(refAnswer.current.value)
                })
            };

            //call api from backend and send json data,which create before

            fetch('http://localhost:32349/api/sendanswer', requestOptions)
                .then(response => response.json())
                .then((responseData) => {

                    //get returned data from backend and display result on displya for user
                    if (responseData == "Succes") {


                        var date = new Date();

                        date.setDate(date.getDate() + 1);

                        document.cookie = "username=" + refUsername.current.value + "; expires=" + date.toGMTString();

                        document.cookie = "status_account=online; expires=" + date.toGMTString();

                        setMessage("Log in successfully");



                        redirect.go('/Account');
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



            //call api from backend and send json data,which create before

            fetch('http://localhost:32349/api/login_wrong', requestOptions)
                .then(response => response.json())
                .then((responseData) => {


                    setMessage("You was used all attempts please wait 30 minutes");

                });
            
        }
    
                    


           


    }
   
   

    return (

        <div className={style.form }>
            <form >
                <p>Insert your username:</p>
                <input type="text" class="form-control" style={{ width: "30%" }} ref={refUsername} />
                <button class="btn btn-primary" id="verifie_button" style={{ marginTop: "10px" }} onClick={getquestion}>Verifie</button>
                </form>

            <form id="form_answer" className={style.form_answer }>
                <p>Question: {question }</p>
                <input type="text" class="form-control" style={{ width: "30%" }} ref={refAnswer} />
                <button class="btn btn-primary" id={style.signin_button } onClick={sendanswer }>Sign In</button>
            </form>

           
            <NavLink tag={Link} to="/SignIn" style={{ margin: "25px" }}>Back</NavLink>

            <img id="question_img" src={question_mark} className={style.question_image} />
            <p style={{ marginLeft:"15px" }}>{message}</p>

        </div>
    );
  }

