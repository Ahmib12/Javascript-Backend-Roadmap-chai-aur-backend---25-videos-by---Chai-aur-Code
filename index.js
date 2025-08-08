require('dotenv').config()

const express = require("express"); //  u can use any of these (this and below) --
// import express from "express"
const app = express(); // app is very powerful here, u can use many things here , (its like some library -- eg:- math, wiht that u can use amny stuffs - pi, swrt,cube wtc)
const port = 3000; // u can use anything

const githubData = {
  "id": 1,
  "firstName": "Emily",
  "lastName": "Johnson",
  "maidenName": "Smith",
  "age": 28,
  "gender": "female",
  "email": "emily.johnson@x.dummyjson.com",
  "phone": "+81 965-431-3024",
  "username": "emilys",
  "password": "emilyspass",
  "birthDate": "1996-5-30",
  "image": "https://dummyjson.com/icon/emilys/128",
  "bloodGroup": "O-",
  "height": 193.24,
  "weight": 63.16,
  "eyeColor": "Green",
  }

app.get("/", (req, res) => {
  res.send("Hello World!"); // if u get any request in the / then give the below response..
});

// once u hv app u can use it "n" no of times, can get , fetch , delete etc
app.get("/login", (req,res) => {
  res.send("u hv logged in successfully.,.,");
});

app.get("/movie",(req,res)=>{
    res.send(`<h1>happy movie time..- chill </h1>`)
})

app.get("/youtube",(req,res)=>{--
  res.send("<h2>Youtube...</h2>")
})

app.get('/github',(req,res) => {
  res.json(githubData)
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});
