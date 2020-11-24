const issues = require('../model/issues.js')();

module.exports = () => {

    const getController = async (req, res) => {
        const { issuesList, error } = await issues.get();
        if (error) {
            return res.status(500).json({ error })
        } else {
            res.json({ issues: issuesList });
        }
    }

    const getByIssueNumber = async (req, res) => {
        try {
            const issuesList = await issues.get(req.params.issueNumber);
            //check if the issue exists
            if (issuesList == null) {
                res.status(404).json({
                    error: 404,
                    message: 'Issue not found',
                });
            } else {
                res.json(issuesList);
            }
        } catch (ex) {
            console.log("=== Exception issues::getByIssueNumber.");
            return res.status(500).json({ error: ex })
        }
    }

    //aggregating issues and their comments;
    const IssueComments = async (req, res) => {
        try {
            const issuesList = await issues.aggregateWithComments();
            //check if project exists
            if (issuesList == null) {
                res.status(404).json({
                    error: 404,
                    message: 'Issue not found',
                });
            } else {
                res.json(issuesList);
            }
        } catch (ex) {
            console.log("=== Exception issues::IssueComments.");
            return res.status(500).json({ error: ex })
        }

    };

    //update issue status;
    const putController = async (req, res) => {
        const issueNumber = req.params.issueNumber;
        const slug = req.params.slug;
        const status = req.body.status;
        const user = req.user; //collect user to check authorisation;
        if (!status) {
            res.send(`Status missing.`);
        } else {
            console.log('  inside put issues');
            //method starts only after the status is passed;
            try {
                const results = await issues.updateStatus(status, slug, issueNumber, user);
                //check if project and issue exists
                if (results == null) { //response if issueNumber or slug is not found;
                    res.status(404).json({
                        error: 404,
                        message: 'Issue or Project not found',
                    });
                } else if (results == -1) { //response if user is not an 'admin';
                    res.status(403).json({
                        error: 403,
                        message: 'Action not authorised',
                    });
                } else {
                    res.end(`Update status: ${status}`);
                }
            } catch (ex) {
                console.log("=== Exception issues::putController.");
                return res.status(500).json({ error: ex })
            };
        };
    };

    const postController = async (req, res) => {
        const slug = req.params.slug;
        const title = req.body.title;
        if (!title) {
            res.send(`Title is missing.`);
        }
        const description = req.body.description;
        if (!description) {
            res.send(`Description is missing.`);
        }
        const deadline = parseInt(req.body.deadline);
        if (!deadline) {
            res.send(`Deadline (in days) is missing.`);
        }
        //create a current date, add the deadline and convert it into String;
        let dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + deadline);
        //method starts only after all the items are passed;
        if (slug && title && description && deadline) {
            console.log('  inside post issues');
            try {
                const results = await issues.add(title, description, slug, dueDate);
                res.end(`POST: ${title}, ${description}, ${dueDate}`);
            } catch (ex) {
                console.log("=== Exception issues::add");
                return res.status(500).json({ error: ex })
            }
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