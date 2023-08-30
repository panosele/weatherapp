import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

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

app.post("/", async (req,res)=>{
  const API_KEY = process.env.OPENWEATHER_API;
  try {
    // get the latitude and longtitude from City name from openweathermap API geolocation
    const city = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${req.body.location}&limit=1&appid=${API_KEY}`);
    const lat = city.data[0].lat;
    const lon = city.data[0].lon;
    // get the current weatherfor City name from openweathermap API
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    console.log(weather.data);
    
    const weatherData = {
      city: weather.data.name,
      main: weather.data.weather[0].main,
      icon: `https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png` ,
      description: weather.data.weather[0].description,
      temperatureMin: weather.data.main.temp_min +" Celcius",
      temperatureMax: weather.data.main.temp_max +" Celcius",
      feelsLike: weather.data.main.feels_like +" Celcius",
      pressure: weather.data.main.pressure +" hPa",
      humidity: weather.data.main.humidity +" %",
      wind_speed: weather.data.wind.speed +" m/s",
      wind_direction: weather.data.wind.deg +" degrees",
      wind_gust: weather.data.wind.gust +" m/s",
    }
    console.log(weatherData);
    // render the results ---PENDINGGGGG
    res.render('index', {content: weatherData});
  } catch (error) {
    console.error(error);
  }
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