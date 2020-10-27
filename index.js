const express = require('express');
const bodyParser = require('body-parser');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const projectsController = require ('./controller/projects')();
const usersController = require ('./controller/users')();
const issuesController = require ('./controller/issues')();

const app = module.exports = express();

//logging 
app.use((req, res, next) => {
    console.log('[%s] %s -- %s', new Date(), req.method, req.url);
    next();
});

app.use(bodyParser.json());

app.get('/projects', projectsController.getController);
app.get('/projects/:slug', projectsController.getBySlug);
app.get('/projects/:slug/issues', projectsController.projectIssues);
app.post('/projects', projectsController.postController);

app.get('/users', usersController.getController);
app.get('/users/:email', usersController.getByEmail);
app.post('/users', usersController.postController);

app.get('/issues', issuesController.getController);
app.get('/issues/:issueNumber', issuesController.getByIssueNumber);
app.get('/projects/:slug/issues/:issueNumber', issuesController.getByIssueNumber);
app.post('/projects/:slug/issues', issuesController.postController);
app.put('/projects/:slug/issues/:issueNumber', issuesController.putController);

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




