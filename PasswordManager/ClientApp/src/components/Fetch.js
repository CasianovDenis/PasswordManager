import { useEffect,useState } from 'react';

export default function Fetch(jsonobj, api_name) {
    const [data, setData] = useState([]);
    
    

   useEffect(() => {
   
             fetch('http://localhost:32349/api/' + api_name, jsonobj)
            .then(response => response.json())
            .then((responseData) => {

                setData(responseData);
                
            });
      
    }, []);

    return data;
  }

