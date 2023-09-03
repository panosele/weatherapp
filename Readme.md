# Weather APP
This is a small app Written in nodeJS, EJS templates for you to find your currnet weather on your location, if you are safe from UV radiation in your Location and discover where is the ISS station right now.

# Environment vars
This project uses the following environment variables:

API_KEYS, you should follow the documentation of the 3 APIS, which ae used to generate your own API keys, and store them in .env file.


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 8.0.0


# Getting started
- Clone the repository
```
git clone  https://github.com/panosele/weatherapp.git
```
- Install dependencies
```
navigate to local repo(cd <project_name>)
npm install
```
- Run the project
```
node index.js
```
  Navigate to `http://localhost:8080`

- API Document endpoints

  Current Weather : https://openweathermap.org/api/one-call-3 

  UV Radiation : https://www.openuv.io/dashboard?tab=0

  ISS Live Location : http://open-notify.org/Open-Notify-API/ISS-Location-Now/
