const express = require('express');
const bodyParser = require('body-parser');
const users = require('./model/users')();
let userLogged = null;

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const projectsController = require ('./controller/projects')();
const usersController = require ('./controller/users')();
const issuesController = require ('./controller/issues')();
const commentsController = require ('./controller/comments')();

const app = module.exports = express();

//logging 
app.use((req, res, next) => {
    console.log('[%s] %s -- %s', new Date(), req.method, req.url);
    next();
});

app.use(async (req, res, next) => {
    const FailedAuthMessage = {
        error: "Failed Authentication.",
        message: "Go away",
    };
    const key = req.headers["x-api-key"];
    const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    
    if(!key){
        console.log("   [%s] FAILED AUTHENTICATION -- %s, No key supplied", 
        new Date(), clientIp);
        FailedAuthMessage.code = "01";
        return res.status(401).json(FailedAuthMessage);
    }else{
        
        userLogged = await users.getByKey(key);
        
        if(!userLogged){
            console.log("   [%s] FAILED AUTHENTICATION -- %s, No user found", 
            new Date(), clientIp);
            FailedAuthMessage.code = "02";
            return res.status(401).json(FailedAuthMessage);
        }else{    
            //save the email logged;
            req.user = userLogged;   
            next();
        }
    }
});

app.use(bodyParser.json());

app.get('/projects', projectsController.getController);
app.get('/projects/:slug', projectsController.getBySlug);
app.get('/projects/:slug/issues', projectsController.projectIssues);
app.post('/projects', projectsController.postController);

app.get('/users', usersController.getController);
app.get('/users/:email', usersController.getByEmail);
app.post('/users', usersController.postController);

app.get('/issues', issuesController.IssueComments);
app.get('/issues/:issueNumber', issuesController.getByIssueNumber);
app.get('/projects/:slug/issues/:issueNumber', issuesController.getByIssueNumber);
app.post('/projects/:slug/issues', issuesController.postController);
app.put('/projects/:slug/issues/:issueNumber', issuesController.putController);

app.get('/comments', commentsController.getController);
app.get('/comments/:author', commentsController.getByAuthor);
app.get('/issues/:issueNumber/comments', commentsController.getByIssue);
app.get('/issues/:issueNumber/comments/:id', commentsController.getById);
app.post('/issues/:issueNumber/comments', commentsController.postController);


app.get('/', (req, res) => {
    return res.json({
        message: 'Welcome to Bug Tracker!'
    });
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
    console.log(process.env.MONGO_URI)
});

app.use((req, res) => {
    res.status(404).json({
        error: 404,
        message: 'Route not found',
    });
});




