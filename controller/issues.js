const projects = require('../model/projects.js')();
const issues = require('../model/issues.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await issues.get());
    }

    const getByIssueNumber = async (req, res) => {
        res.json(await issues.get(req.params.issueNumber));
    }

    const putController = async (req, res) => {
        const status = req.body.status;
        //const slug = req.params.slug;
        const issueNumber = req.params.issueNumber;
        console.log('  inside put issues');
        const results = await issues.updateStatus(status, issueNumber);
        res.end(`Update status: ${status}`);
    }

    const postController = async (req, res) => {
        const slug = req.params.slug;
        const title = req.body.title;
        const description = req.body.description;
        console.log('  inside post issues');
        const results = await issues.add(title, description, slug);
        res.end(`POST: ${title}, ${description}`);
    }  

    return {
        getController,
        getByIssueNumber,
        postController,
        putController,
        
}
}