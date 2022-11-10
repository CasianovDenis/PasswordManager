import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Modal_password from './Modal_password';
import Modal_delete from './Modal_delete';
import key from './key.png';
import style from './Account.module.css'
import GetCookie from '../GetCookie.js';

export default function Account() {
    
    const [responseData, setResponseData] = React.useState([]);

    const redirect = useHistory();

   

    if (GetCookie("status_account") != "online") redirect.push('/');

 
    //call api when loadin page
    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({

                "Username": GetCookie("username"),
                "Name": "null",
                "Password": "null"

            })
        };

        

        fetch('http://localhost:32349/api/getdatastore', requestOptions)
            .then(response => response.json())
            .then((responseData) => {
                setResponseData(responseData)

            });

    }, []);
    

    

    return (

        <div >
            <Modal_password />
            <Modal_delete />
            <hr />
            {responseData.map(item => {
                return (
                    <div className={style.div_data } >
                        <img src={key} style={{width:"25px",height:"25px"} }/> Your Data
                    <p>Name: {item.Name}</p>
                        <p>Password: {item.Password}</p>
                        <p>Description: {item.Description}</p>
                        
                        </div>
                    );
            })}
           
        </div>
    );
}


