
# IoT Weather Station
An IoT weather application that is based on NodeMCU and a web application developed using AngularJS and firebase.

## Description
The NodeMCU serves as a station point that retrieves the weather data that is the temperature, pressure and humidity from a BME280 sensor, the NodeMCU then uploads the data to a real-time database periodically, the user web application retireves then this real-time data from the real-time database and displays it on the dashboard.

## Project Structure

1. **NodeMCU**: This directory contains the NodeMCU platformIO project directory, It contains the whole code and a readme file for further documentation regarding the NodeMCU part.
2. **IOT-Portal**: This directory contains an AngularJS project directory which contains the code for the user-side Web application that can access the weather station data, it contains a readme for further documentation regarding this part.

## Getting Started
You have to setup each part individually inorder to run the project
1. Check the README of the **NodeMCU** directory to follow the documentation of setting up the NodeMCU part.
2. Check the README of the **IOT-Portal** directory to follow the documentation of setting up the Web app part. 

## Project Showcase
You can watch the youtube video from here:

[![Watch the video](https://img.youtube.com/vi/Go8dzMYW5yE/0.jpg)](https://www.youtube.com/watch?v=Go8dzMYW5yE)


## Contact
Mahmoud Elsheemy - mahmoudalshemy.3@gmail.com
