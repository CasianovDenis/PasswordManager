import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import style from './SecretQuestion.module.css';
import { Link, NavLink } from 'react-router-dom';
import question_mark from './question_mark.webp';


export default function Secret() {

    const [message, setMessage] = useState("");
    const [question, setQuestion] = useState("");
    const refUsername = useRef(""), refAnswer = useRef("");
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

    
    const getquestion = (event) => {
        event.preventDefault();

                   setMessage("Please wait");

                        //after email validation create option for json
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "Username": refUsername.current.value
                            })
                        };

                        //call api from backend and send json data,which create before

                        fetch('http://localhost:32349/api/getquestion', requestOptions)
                            .then(response => response.json())
                            .then((responseData) => {

                                //get returned data from backend and display result on displya for user
                                if (responseData != null) {
                                    setQuestion(responseData);

                                    let button = document.getElementById('verifie_button');
                                    button.style.display = "none";

                                    let div_answer = document.getElementById('form_answer');
                                    div_answer.style.display = "block";

                                    let image = document.getElementById('question_img');
                                    image.style.marginTop = "-25%";

                                    setMessage("");
                                }
                                else
                                    setMessage("User not exist");


                            });
                    
    }


    const sendanswer = (event) => {
        event.preventDefault();

        

        //after email validation create option for json
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "Username": refUsername.current.value,
                "Secret_answer": refAnswer.current.value
            })
        };

        //call api from backend and send json data,which create before

        fetch('http://localhost:32349/api/sendanswer', requestOptions)
            .then(response => response.json())
            .then((responseData) => {

                //get returned data from backend and display result on displya for user
                if (responseData.match(/\d/)) {
                    

                    var date = new Date();

                    date.setDate(date.getDate() + 1);

                    document.cookie = "username=" + refUsername.current.value + "; expires=" + date.toGMTString();

                    document.cookie = "status_account=online; expires=" + date.toGMTString();

                    setMessage("Log in successfully");

             

                    redirect.go('/Account');
                }
                    


                else                   
                    setMessage(responseData);
                    


            });


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
            <p>{message}</p>

        </div>
    );
  }

