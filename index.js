import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 8080;
}


// const PORT = port = process.env.PORT || 8080;
const _dirname = "/";
const API_KEY = process.env.OPENWEATHER_API;
const UV_API_KEY = process.env.UV_API;

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

  //HOME

app.get("/:page", (req, res)=>{
    res.render(`./${req.params.page}`)
  })

app.get("/", (req,res)=>{
    res.render('index')
})
// app.get("/iss", (req,res)=>{
//   res.render('./iss')
// })
// app.get("/uv", (req,res)=>{
//   res.render('./uv')
// })
// app.get("/wind", (req,res)=>{
//   res.render('./wind')
// })
// app.get("/contact", (req,res)=>{
//   res.render('./contact')
// })

app.post("/", async (req,res)=>{
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
    res.redirect("/")
  }
})

// ISS LOCATION


app.post("/iss" ,async (req,res)=>{
  try{
    const result = await axios.get(`http://api.open-notify.org/iss-now.json`);
    const lon = result.data.iss_position.longitude;
    const lat = result.data.iss_position.latitude;
    res.render("./iss", {content: {lat: lat, lon: lon}})
  }catch (error){
    res.redirect("./iss")
  }
})

//UV RADIATION
app.post("/uv", async (req,res)=>{
  try {
    // get the latitude and longtitude from City name from openweather API geolocation
    const city = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${req.body.location}&limit=1&appid=${API_KEY}`);
    const lat = city.data[0].lat;
    const lon = city.data[0].lon;
    // get the current uv City name from https://www.openuv.io/dashboard
    const myHeaders = new Headers();
      myHeaders.append("x-access-token", "openuv-ciq4zrlly3a6a8-io");
      myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        const uvData = {
          time: result.result.uv_time,
          uv: result.result.uv
        }
        console.log(uvData.time)
        res.render('./uv', {content: uvData});
      })
      .catch(error => console.log('error', error));
    
    
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
})

//CONTACT FORM
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