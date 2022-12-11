import React, { useState, useRef } from 'react';

import style from './Settings.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import edit_icon from './edit_icon.png';

import GetCookie from '../public_files/GetCookie.js';

export default function Modal_edit_email(props) {

    const [message, setMessage] = useState('');
   

    const refnewEmail = useRef("");
    
    const editemail = () => {

        setMessage("Please wait");

        if (refnewEmail.current.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "Username": GetCookie("username"),
                    "NewEmail": refnewEmail.current.value

                })
            };

            //call api from backend and send json data,which create before

            fetch('http://localhost:32349/api/edit_email', requestOptions)
                .then(response => response.json())
                .then((responseData) => {

                    if (responseData == "Succes") {

                        setMessage("Email change successfully");


                        var field = document.getElementById("newemail");
                        field.value = "";

                        refnewEmail.current.value = "";
                    }

                    else
                        setMessage(responseData);


                });
        }
        else
            setMessage("Email has incorect format");
    }



        return (

            <body>


                <img src={edit_icon} className={ style.email_edit_icon} data-toggle="modal" data-target="#edit_email" />

                <div class="modal fade" id="edit_email" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Edit email</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                <p> Old email:</p>
                                <input type="text" class="form-control" style={{ width: "60%" }} value={props.Email } disabled />

                                <br />
                                <p> New email:</p>
                                <input type="text" id="newemail" ref={refnewEmail} class="form-control" style={{ width: "60%" }} required />
    
                            </div>
                            <p style={{ marginLeft: "5px" }}>{message}</p>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={editemail}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </body>
        );


    
}




