const express = require('express');
const bodyParser = require('body-parser');
const users = require('./model/users')();
const path = require('path');
let userLogged = null;


const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const projectsController = require('./controller/projects')();
const usersController = require('./controller/users')();
const issuesController = require('./controller/issues')();
const commentsController = require('./controller/comments')();
const watchersController = require('./controller/watchers')();

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
    //const key = req.headers["x-api-key"];
    const key = 'pass1234!'
    const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    if (!key) {
        console.log("   [%s] FAILED AUTHENTICATION -- %s, No key supplied",
            new Date(), clientIp);
        FailedAuthMessage.code = "01";
        return res.status(401).json(FailedAuthMessage);

    } else {

        userLogged = await users.getByKey(key);

        if (!userLogged) {
            console.log("   [%s] FAILED AUTHENTICATION -- %s, No user found",
                new Date(), clientIp);
            FailedAuthMessage.code = "02";
            return res.status(401).json(FailedAuthMessage);
        } else {
            //save the email logged;
            req.user = userLogged;
            next();
        }
    }
});

app.use(bodyParser.json());

//app.get('/projects', projectsController.getController);
//app.get('/projects/:slug', projectsController.getBySlug);
app.get('/projects/:slug/issues', projectsController.projectIssues);
app.post('/projects', projectsController.postController);

//app.get('/users', usersController.getController);
app.get('/users/:email', usersController.getByEmail);
app.post('/users', usersController.postController);

//app.get('/issues', issuesController.IssueComments);
//app.get('/issues/:issueNumber', issuesController.getByIssueNumber);
app.get('/projects/:slug/issues/:issueNumber', issuesController.getByIssueNumber);
app.post('/projects/:slug/issues', issuesController.postController);
app.put('/projects/:slug/issues/:issueNumber', issuesController.putController);

app.get('/comments', commentsController.getController);
//app.get('/comments/:author', commentsController.getByAuthor);
//app.get('/issues/:issueNumber/comments', commentsController.getByIssue);
app.get('/issues/:issueNumber/comments/:id', commentsController.getById);
app.post('/issues/:issueNumber/comments', commentsController.postController);

app.get('/watchers', watchersController.getController);
//app.get('/watchers/:author', watchersController.getByAuthor);
//app.get('/issues/:issueNumber/watchers', watchersController.getByIssue);
app.post('/issues/:issueNumber/watchers', watchersController.postController);


//view engine setup
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'hbs') //setting view engine as handlebars

app.use(express.static('./src'));

const issuesModel = require('./model/issues')();
const usersModel = require('./model/users')();
const projectsModel = require('./model/projects')();
const commentsModel = require('./model/comments')();
const watchersModel = require('./model/watchers')();

//initial page, when no login is done
app.get('/', (req, res) => {
    res.render('index');
});

//page after the login. should use this one for test
app.get('/home', async (req, res) => {
    try {
        const { projectsList } = await projectsModel.get();
        res.render('home', {
            projects: projectsList
        });
    } catch (e) {
        res.render('error');
    }
});

//login page
app.get('/login', (req, res) => {
    res.render('login');
});

//page not implemented yet
app.get('/users', async (req, res) => {
    try {
        const { usersList } = await usersModel.get();
        console.log(usersList);
        res.render('users', {
            title: 'Users',
            text: 'List of users',
            users: usersList
        });
    } catch (e) {
        res.render('error');
    }
});

//page shows the projects and issues
app.get('/projects/:slug', async (req, res) => {
    try {
        const projectsList = await projectsModel.aggregateWithIssues(req.params.slug);
        res.render('projects', projectsList);
    } catch (e) {
        res.render('error');
    }
});

//page shows all the issues
app.get('/issues', async (req, res) => {
    try {
        const { issuesList } = await issuesModel.get();
        res.render('issues', {
            title: 'Issues',
            text: 'List of issues',
            issues: issuesList
        });
    } catch (e) {
        res.render('error');
    }
});

//page shows an especific issue
app.get('/issues/:issueNumber', async (req, res) => {
    try {
        const issuesList = await issuesModel.get(req.params.issueNumber);
        console.log(issuesList);
        res.render('projectissue', issuesList);
    } catch (e) {
        res.render('error');
    }
});

//page shows the comments for an issue
app.get('/issues/:issueNumber/comments', async (req, res) => {
    try {
        const { commentsList } = await commentsModel.get(req.params.issueNumber);
        console.log(commentsList);
        res.render('comments', { comments: commentsList });
    } catch (e) {
        res.render('error');
    }
});

//page shows the comments for an user
app.get('/comments/:author', async (req, res) => {
    try {
        const { commentsList } = await commentsModel.get(null, null, req.params.author);
        console.log(commentsList);
        res.render('user_comments', { comments: commentsList });
    } catch (e) {
        res.render('error');
    }
});

//page shows the watchers for an issue
app.get('/issues/:issueNumber/watchers', async (req, res) => {
    try {
        const watchersList = await watchersModel.get(req.params.issueNumber);
        console.log(watchersList);
        res.render('watchers', watchersList);
    } catch (e) {
        res.render('error');
    }
});

//page shows the comments for an user
app.get('/watchers/:author', async (req, res) => {
    try {
        const watchersList = await watchersModel.get(null, req.params.author);
        console.log(watchersList);
        res.render('user_watching', watchersList);
    } catch (e) {
        res.render('error');
    }
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});

app.use((req, res) => {
    res.status(404).json({
        error: 404,
        message: 'Route not found',
    });
});




