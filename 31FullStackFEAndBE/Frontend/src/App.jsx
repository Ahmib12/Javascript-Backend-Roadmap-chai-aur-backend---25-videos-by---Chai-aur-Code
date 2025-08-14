import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [jokes,setJokes] = useState([]);

  useEffect(() =>{

    // axios.get("http://localhost:5000/jokes")
    // axios.get("http://localhost:5000/api/jokes") 
    axios.get("http://localhost:5000/api/jokes") 
    

    .then((response) => {
      setJokes(response.data)
    })
    .catch((error) =>{
      console.log(error);
    })
  })

  return (
    <>
      <h1>Syeda's world  | explorer | developer | globe trotter</h1>
      <p>JOKES : {jokes.length}</p>
      {
        jokes.map((joke,index)=>(
          <div key={joke.id}>
            <h3> TITLE :- {joke.title}</h3>  
            <h3> Content:- {joke.content}</h3>  
          </div>
        ))
      }
    </>
  )
}

export default App
