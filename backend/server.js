import express from "express";
import  dotenv from "dotenv";
import  path from "path";

dotenv.config();

const  port = process.env.PORT ||4000
const app = express();

app.get("/",(req,res)=>{
  res.send("active")
  });

app.listen(port,()=>{
      console.log(`active on ${port}`)
  });
