# Project Name
BUG_TRACKER_CBWA 

## Table of Contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Example Usage](#example-usage)
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

## Setup
To clone and run this application, you'll need Git and Node.js (which comes with npm) installed on your computer.

## Example Usage

Route example for watchers:

- Get all watchers:	{GET}	/watchers
- Get all issues watched by an author:	{GET}	/watchers/:email
- Get all watchers for an issue:	{GET}	/issues/:issueNumber/watchers
- Add new watchers: 	{POST}	/issues/:issueNumber/watchers	

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