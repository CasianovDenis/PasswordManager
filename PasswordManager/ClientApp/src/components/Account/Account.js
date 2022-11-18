import React, { useEffect,useState } from 'react';
import { useHistory } from 'react-router-dom';

import Modal_password from './Modal_password';

import delete_icon from './delete_icon.png';
import key from './key.png';

import style from './Account.module.css'

import GetCookie from '../public_files/GetCookie.js';

import loadingGif from '../public_files/loading_animation.gif';


export default function Account() {
    
    const [responseData, setResponseData] = React.useState([]);
    

    const redirect = useHistory();
   

    if (GetCookie("status_account") != "online") redirect.push('/');

   
    
    useEffect(() => {

        //added loading animation,timeout 5 second,after animation are hidden
        setTimeout(() => {

            const animation = document.getElementsByClassName('gifloading')[0];
            const loading_div = document.getElementsByClassName('loader_wrapper')[0];
            
                animation.style.minWidth = "0px";
                animation.style.height = "0px";

                loading_div.style.minWidth = "0px";
                loading_div.style.height = "0px";

        
        }, 5000)

        //create request obj
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                "Username": GetCookie("username"),
                "Name": "null",
                "Password": "null"

            })
        };

       //called api for get user data and display him
            fetch('http://localhost:32349/api/getdatastore', requestOptions)
            .then(response => response.json())
            .then((responseData) => {
                setResponseData(responseData)

            });

    }, []);


    
    const delete_password = (ev) => {

        let item = ev.target.getAttribute('title');

        if (window.confirm("You want to delete data: " + item) == true) {

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "Username": GetCookie("username"),
                    "Name": item,
                    "Password": "null"

                })
            };

            //called api where send json request for delete data from DB

            fetch('http://localhost:32349/api/deletedatastore', requestOptions)
                .then(response => response.json())
                .then((responseData) => {

                    if (responseData == "Succes") {


                        window.location.reload(false);
                    }
                    else
                        alert("Error : data can not deleted");

                });
        }
            
    }

    return (

       

        <div >

            {/*Called modal from another js page*/}

            <Modal_password />

            {/*Loading animation gif/div*/}

            <div class="loader_wrapper" >
               
                <img src={loadingGif} alt="wait until the page loads"  class="gifloading"/>
            </div>

                    
            {/*Div where are displayed data*/}

            <div className={style.display_div }>
            {responseData.map(item => {
                return (
                    <div className={style.div_data}  >
                        <img src={key} style={{width:"25px",height:"25px"} }/> Your Data
                        <p >Name: {item.Name}</p>
                        <p>Password: {item.Password}</p>
                        <p>Description: {item.Description}</p>

                       
                        <img src={delete_icon} className={style.delete_image} onClick={delete_password}
                            title={item.Name} />
                       
                    </div>
                    
                  
                        
                    );
            })}
                </div>
           
        </div>
    );
}



   
