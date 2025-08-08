require('dotenv').config()

const express = require("express"); //  u can use any of these (this and below) --
// import express from "express"
const app = express(); // app is very powerful here, u can use many things here , (its like some library -- eg:- math, wiht that u can use amny stuffs - pi, swrt,cube wtc)
const port = 3000; // u can use anything

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
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});
