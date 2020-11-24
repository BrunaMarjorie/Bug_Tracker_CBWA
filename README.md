# Project Name
BUG_TRACKER_CBWA 

## Table of Contents
* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General info
This is an API developed to track bugs in projects, allowing users to insert their issues and comments and send e-mail notifications to users.

## Technologies
* Node - version 12.18.3
* Nodemon - version 2.0.6
* Express - version 4.17.1
* Body-parser - version 1.19.0
* Bcrypt - version 5.0.0
* Mongodb - version 3.6.2
* Nodemailer - version 6.4.15  
* Handlebars - version 4.1.1 

## How to Use
To clone and run this application, you'll need Git and Node.js (which comes with npm) installed on your computer.

## Code Examples
const express = require('express');
const bodyParser = require('body-parser');
const users = require('./model/users')();
const path = require('path');
let userLogged = null;


const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

## Features
List of features ready and for future development

- Update issue status when date is due;
- Send email to watchers list when issue is updated;

To-do list:

- Frontend needs to be improved.

## Status
Project is: in progress. 

## Inspiration
This project is the result of my Cloud-based Web Application subject in college. 

## Contact
Created by [Bruna Marjorie](https://github.com/BrunaMarjorie) - feel free to contact me!