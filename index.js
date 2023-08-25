import express from 'express';
import axios from 'axios';
import path from 'path';

const app = express();
const PORT = 8080;
const _dirname = "/";

app.use(express.static("public"));
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

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}.`)
})