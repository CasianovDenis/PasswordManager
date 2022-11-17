import React, { useState,useRef } from 'react';

import style from './Account.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import add_icon from './add_icon.png';

import GetCookie from '../GetCookie.js';
//import fetch from '../Fetch.js';

export default function Modal_password() {

    const [message, setMessage] = useState('');

    const refName_record = useRef("");
    const refPassword = useRef("");
    const refDescription = useRef("");
    

    const storepassword = () => {

        setMessage("Please Wait");

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "Username": GetCookie("username"),
                "Name": refName_record.current.value,
                "Password": refPassword.current.value,
                "Description": refDescription.current.value
            })
        };

        //call api from backend and send json data,which create before

        fetch('http://localhost:32349/api/add_data', requestOptions)
            .then(response => response.json())
            .then((responseData) => {

                if (responseData == "Succes") {

                    setMessage("Data added successfully");


                    window.location.reload(false);
                }

                else
                    setMessage(responseData);


            });
        


            

    }





        return (

            <body>

                <button className={style.button_add} role="button" data-toggle="modal" data-target="#add_password"  >
                    <img src={add_icon} className={style.add_image} /> <span class="text">Add password</span></button>

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
                                <input type="text" ref={refName_record } class="form-control" style={{ width: "40%" }} required />
                                <br />
                                <p>Password :</p>
                                <input type="password" ref={refPassword} class="form-control" style={{ width: "40%" }} required />
                                <br />
                                <p>Description :</p>
                                <input type="text" ref={refDescription} class="form-control" style={{ width: "40%" }} />
                            </div>
                            <p style={{ marginLeft: "5px" }}>{message}</p>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={storepassword}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </body>
        );


    
}




