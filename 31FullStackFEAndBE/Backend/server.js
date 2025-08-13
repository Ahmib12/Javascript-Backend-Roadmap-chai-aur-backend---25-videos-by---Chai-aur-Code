// require('dotenv').config(); 

// 1 - import express
// const express = require('express') // - this  is the old code -- these days we use import
import express from "express" 
import cors from 'cors';

// 2 - create app
const app = express();
app.use(cors());

// 3 -  app work is to navigate to some route
// app.get('/',(req,res)=>{
//     res.send('server is ready')
// })
app.use(express.static('dist')); 


// get a list of 5 jokes
// app.get('/jokes',(req,res)=>{ // we dont directly wrote /jokes -- we need to use /api/v1/jokes or api/jokes 
app.get('/api/jokes',(req,res)=>{
    const jokes = [
      {
        id: 1,
        title: "A joke 1",
        content: "this is a joke 1",
      },
      {
        id: 2,
        title: "A joke 2",
        content: "this is a joke 2",
      },
      {
        id: 3,
        title: "A joke 3",
        content: "this is a joke 3",
      },
    ];
    res.send(jokes);
})

const port = process.env.PORT || 5000; // if u push ur code to production ,then 100% it shd run from the env only, else ur code or files wil not run
// whether its in aws, or 

app.listen(port,() =>{
    console.log(`server listening on port -- http://localhost:${port}`);
})