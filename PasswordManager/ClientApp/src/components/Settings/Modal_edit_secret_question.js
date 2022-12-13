import React, { useState, useRef } from 'react';

import style from './Settings.module.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import edit_icon from './edit_icon.png';

import GetCookie from '../public_files/GetCookie.js';

export default function Modal_edit_secret_question(props) {

    const [message, setMessage] = useState('');
   

    const refanswer = useRef("");
    const refnewQuestion = useRef("");
    const refnewAnswer = useRef("");

    const editquestion = () => {

        setMessage("Please wait");

        let newdata = {

            "Username": GetCookie("username"),
            "NewQuestion": refnewQuestion.current.value,
            "NewAnswer": refnewAnswer.current.value,
            "OldAnswer": refanswer.current.value

        };

        


        //old answer validation,must contain letters or numbers
        if (newdata.OldAnswer.match(/^[a-zA-Z0-9\s]*$/)) {

            //secret question validation,must contain  letters or numbers
            if (newdata.NewQuestion.match(/^[a-zA-Z0-9\s]*$/)) {

                //secret question validation,must contain  letters or numbers

                if (newdata.NewAnswer.match(/^[A-Za-z0-9\s]*$/)) {

                    //New question  must doesn't match actual question
                    if (newdata.NewQuestion != props.question) {

                        //question must doesn't equal answer
                        if (newdata.NewQuestion != newdata.NewAnswer && newdata.NewQuestion != newdata.OldAnswer) {

                            //code base64 data from input field
                            newdata.OldAnswer = btoa(refanswer.current.value);
                            newdata.Secret_question = btoa(refnewQuestion.current.value);
                            newdata.NewAnswer = btoa(refnewAnswer.current.value);

                            const requestOptions = {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newdata)
                            };

                            fetch('http://localhost:32349/api/edit_secret_question', requestOptions)
                                .then(response => response.json())
                                .then((responseData) => {

                                    if (responseData == "Succes") {

                                        setMessage("Secret question and answer has change successfully");

                                        var field = document.getElementById("oldanswer");
                                        field.value = "";

                                        field = document.getElementById("newquestion");
                                        field.value = "";

                                        field = document.getElementById("newanswer");
                                        field.value = "";

                                        refanswer.current.value = ""; refnewQuestion.current.value = "";
                                        refnewAnswer.current.value = "";

                                     
                                    }

                                    else
                                        setMessage(responseData);


                                });
                        }
                        else
                            setMessage("Question doesn't match answer");
                    }
                    else
                        setMessage("New question match old");
                }
                else
                    setMessage("Actual answer isn't right");
            }
            else
                setMessage("Not accepted symbol in the question");
        }
    }


        return (

            <body>


                <img src={edit_icon} className={ style.secret_question_edit_icon} data-toggle="modal" data-target="#edit_secret_question" />

                <div class="modal fade" id="edit_secret_question" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Edit secret question</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                <p> Actual secret question: {props.question}</p>

                                <br />
                                <p> Answer:</p>
                                <input type="text" id="oldanswer" ref={refanswer} class="form-control" style={{ width: "70%" }} required />


                                <br />
                                <p> New secret question:</p>
                                <input type="text" ref={refnewQuestion} id="newquestion" class="form-control" style={{ width: "70%" }} required />

                                <br />
                                <p> New answer for new question:</p>
                                <input type="text" ref={refnewAnswer} id="newanswer" class="form-control" style={{ width: "70%" }} required />

                            </div>
                            <p style={{ marginLeft: "5px" }}>{message}</p>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={editquestion}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </body>
        );


    
}




