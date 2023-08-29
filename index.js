import express from 'express';
import axios from 'axios';
import path from 'path';
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const PORT = 8080;
const _dirname = "/";

app.use(express.static("public"));
app.use(bodyParser())
app.set("view engine", "ejs");
app.use(
    "/css",
    express.static(path.join(_dirname, "node_modules/bootstrap/dist/css"))
  )
  app.use(
    "/js",
    express.static(path.join(_dirname, "node_modules/bootstrap/dist/js"))
  )
  app.use("/js", express.static(path.join(_dirname, "node_modules/jquery/dist")))

app.get("/", (req,res)=>{
    res.render('index')
})

app.get("/temperature", (req,res)=>{
  res.render('./temperature')
})

app.get("/uv", (req,res)=>{
  res.render('./uv')
})

app.get("/wind", (req,res)=>{
  res.render('./wind')
})

app.get("/contact", (req,res)=>{
  res.render('./contact')
})

app.post("/contact", async (req,res)=>{
  console.log(req.body)
  let content = "Thank you for your contact. We will reach to you as soon as possible!"
  
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
      }
    });
    
    let mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL_TO_SEND,
      subject: 'Sending Email using Node.js',
      text: `Message from weather APP
            from ${req.body.name} ${req.body.surname}
            email: ${req.body.email}
            message: ${req.body.message}`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.render("./contact", {content: "Thank you for your contact. We will reach to you as soon as possible!"})
      }
    });
  } catch (error) {
    res.render("./contact", {content: "There was an Error. Please try again!"})
    res.send("Message Could not be Sent");
  }
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}.`)
})