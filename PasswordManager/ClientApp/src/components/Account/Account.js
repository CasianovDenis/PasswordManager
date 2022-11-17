import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Modal_password from './Modal_password';

import delete_icon from './delete_icon.png';
import key from './key.png';

import style from './Account.module.css'

import GetCookie from '../GetCookie.js';
import Fetch from '../Fetch.js';



export default function Account() {
    
    const [responseData, setResponseData] = React.useState([]);
    

    const redirect = useHistory();
   

    if (GetCookie("status_account") != "online") redirect.push('/');

 
    //call api when loadin page
   
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                "Username": GetCookie("username"),
                "Name": "null",
                "Password": "null"

            })
        };


    let response = Fetch(requestOptions, 'getdatastore');


    useEffect(() => {

        setResponseData(response);
     

    }, [response]);
    
    
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

            //call api from backend and send json data,which create before

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
          
            <Modal_password />
           
       

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



   
