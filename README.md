
# IoT Weather Station
An IoT weather application that is based on NodeMCU and a web application developed using AngularJS and firebase.

## Description
The NodeMCU serves as a station point that retrieves the weather data that is the temperature, pressure and humidity from a BME280 sensor, the NodeMCU then uploads the data to a real-time database periodically, the user web application retireves then this real-time data from the real-time database and displays it on the dashboard.

## Project Structure

1. **NodeMCU**: This directory contains the NodeMCU platformIO project directory, It contains the whole code and a readme file for further documentation regarding the NodeMCU part.
2. **IOT-Portal**: This directory contains an AngularJS project directory which contains the code for the user-side Web application that can access the weather station data, it contains a readme for further documentation regarding this part.

## Project Showcase
