const issues = require('../model/issues.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await issues.get());
    }

    const getByIssueNumber = async (req, res) => {
        const result = await issues.get(req.params.issueNumber);
        //check if the issue exists
        if(result == null){
            res.status(404).json({
                error: 404,
                message: 'Issue not found',
            });
        }else {
            res.json(result);
        }
    }

    //aggregating issues and their comments;
    const IssueComments = async (req, res) => {
        res.json(await issues.aggregateWithComments());
    };

    //update issue status;
    const putController = async (req, res) => {
        const status = req.body.status;
        if (!status){
            res.send(`Status missing.`);
        }
        const issueNumber = req.params.issueNumber;
        console.log('  inside put issues');
        //method starts only after the status is passed;
        if(status){
        const results = await issues.updateStatus(status, issueNumber);
        res.end(`Update status: ${status}`);
        }
    }

    const postController = async (req, res) => {
        const slug = req.params.slug;
        const title = req.body.title;
        if (!title){
            res.send(`Title is missing.`);
        }
        const description = req.body.description;
        if (!description){
            res.send(`Description is missing.`);
        }
        //method starts only after all the items are passed;
        if(slug && title && description){
        console.log('  inside post issues');
        const results = await issues.add(title, description, slug);
        res.end(`POST: ${title}, ${description}`);
        }
    }  

    return {
        getController,
        getByIssueNumber,
        postController,
        putController,
        IssueComments,
        
}
}