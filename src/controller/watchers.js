const watchers = require('../model/watchers.js')();
const db = require('../db')();
const COLLECTION = 'watchers';

module.exports = () => {

    const getController = async (req, res) => {
        const { watchersList, error } = await watchers.get();
        if (error) {
            return res.status(500).json({ error })
        } else {
            res.json({ watchers: watchersList });
        }
    }

    const getByAuthor = async (req, res) => {
        const issueNumber = null;
        const author = req.params.author;
        let watch;
        try {
            watch = await db.find(COLLECTION, { author });
        } catch (ex) {
            console.log("=== Exception watchers::find.");
            return res.status(500).json({ error: ex });
        } if (!watch) {
            res.status(404).json({
                error: 404,
                message: 'Author not found',
            });
        } else {
            try {
                const result = await watchers.get(issueNumber, author);
                //check if the author is watching;
                if (result == null) {
                    res.status(404).json({
                        error: 404,
                        message: 'Author is not watching any issue.',
                    });
                } else {
                    res.json(result);
                }
            } catch (ex) {
                console.log("=== Exception watchers::getByAuthor.");
                return res.status(500).json({ error: ex });
            }
        }
    }

    const getByIssue = async (req, res) => {
        const issueNumber = req.params.issueNumber;
        let valid;
        try {
            //check if issueNumber exists;
            valid = await db.find('issues', { issueNumber });
        } catch (ex) {
            console.log("=== Exception watchers::find");
            return res.status(500).json({ error: ex });
        };
        if (valid) { //loop if any issueNumber is valid;
            try {
                const result = await watchers.get(req.params.issueNumber);
                //check if the issue has comments;
                if (result == null) {
                    res.status(404).json({
                        error: 404,
                        message: 'No watchers found for this issue.',
                    });
                } else {
                    res.json(result);
                }
            } catch (ex) {
                console.log("=== Exception watchers::getByIssue.");
                return res.status(500).json({ error: ex });
            }
        } else { //loop is issueNumber is not valid;
            return res.status(404).json({
                error: 404,
                message: 'Issue not found.',
            });

        }
    }

    const postController = async (req, res) => {
        const issueNumber = req.params.issueNumber;
        let valid;
        try {
            //check if issueNumber exists;
            valid = await db.find('issues', { issueNumber });
        } catch (ex) {
            console.log("=== Exception comments::find");
            return res.status(500).json({ error: ex });
        };
        if (!valid) { //return if issueNumber is not found;
            return res.status(404).json({
                error: 404,
                message: 'Issue not found.',
            });
        }
        //call the logged user;
        const author = req.user;
        console.log('  inside post watchers');
        try {
            const results = await watchers.add(author, issueNumber);
            res.end(`POST: ${author} is now a watcher of ${issueNumber}`);
        } catch (ex) {
            console.log("=== Exception comments::add");
            return res.status(500).json({ error: ex })
        }
    }


    return {
        getController,
        getByAuthor,
        getByIssue,
        postController,
    }
}