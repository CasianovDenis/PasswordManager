import React, { useState,useRef } from 'react';

import style from './Account.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import add_icon from './add_icon.png';

import GetCookie from '../public_files/GetCookie.js';


export default function Modal_password(props) {

    const [message, setMessage] = useState('');
    

    const refName_record = useRef("");
    const refPassword = useRef("");
    const refDescription = useRef("");
    
    
    const save_password = () => {

        setMessage("Please Wait");
        
        if (refName_record.current.value.match(/^[a-zA-Z0-9\s]*$/)) {

            if (refDescription.current.value.match(/^[a-zA-Z0-9\s]*$/)) {



                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "Username": GetCookie("username"),
                        "Name": refName_record.current.value,
                        "Password": refPassword.current.value,
                        "Description": refDescription.current.value,
                        "AuthorizationToken": GetCookie("auth_token")
                    })
                };


                fetch('http://localhost:32349/api/add_data', requestOptions)
                    .then(response => response.json())
                    .then((responseData) => {

                        if (responseData == "Succes") {

                            setMessage("Data added successfully");


                            let field_input = document.getElementById('Name_modal');
                            field_input.value = "";

                            field_input = document.getElementById('Password_modal');
                            field_input.value = "";

                            field_input = document.getElementById('Description_modal');
                            field_input.value = "";

                            refName_record.current.value = ""; refPassword.current.value = "";
                            refDescription.current.value = "";

                            props.func('succes');
                        }

                        else
                            setMessage(responseData);


                    });
            }
            else
                setMessage("Description can not have symbols");
        }
        else
            setMessage("Name can not have symbols");
    }

        return (

            <body>

                <button className={style.button_add} role="button" data-toggle="modal" data-target="#add_password"  >
                    <img src={add_icon} style={{ width: "45px", height: "45px" }} /> <span class="text">Add password</span></button>

                <div class="modal fade" id="add_password" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Add Password</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                <p> Title :</p>
                                <input type="text" ref={refName_record } id="Name_modal" class="form-control" style={{ width: "60%" }} required />

                                <br />

                                <p>Password :</p>
                                <input type="password" ref={refPassword} id="Password_modal" class="form-control" style={{ width: "60%" }} required />

                                <br />

                                <p>Description :</p>
                                <input type="text" ref={refDescription} id="Description_modal" class="form-control" style={{ width: "60%" }} />

                            </div>
                            <p style={{ marginLeft: "5px" }}>{message}</p>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={save_password}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </body>
        );


    
}




