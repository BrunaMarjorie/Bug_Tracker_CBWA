const comments = require('../model/comments.js')();
const db = require('../db')();
const COLLECTION = 'comments';

module.exports = () => {

    const getController = async (req, res) => {
        const { commentsList, error } = await comments.get();
        if (error) {
            return res.status(500).json({ error })
        } else {
            res.json({ comments: commentsList });
        }
    }

    const getById = async (req, res) => {
        const issueNumber = req.params.issueNumber;
        let valid;
        try {
            //check if issue exists;
            valid = await db.find('issues', { issueNumber });
        } catch (ex) {
            console.log("=== Exception comments::get");
            return { error: ex };
        };
        if (!valid) {
            res.status(404).json({
                error: 404,
                message: 'Issue not found.',
            });
        }
        const id = parseInt(req.params.id);
        try {
            const result = await comments.get(issueNumber, id);
            //check if comments exists;
            if (result == null) {
                res.status(404).json({
                    error: 404,
                    message: 'Comment not found.',
                });
            } else {
                res.json(result);
            }
        } catch (ex) {
            console.log("=== Exception comment::getById.");
            return res.status(500).json({ error: ex });
        }
    }

    const getByAuthor = async (req, res) => {
        const issueNumber = null;
        const id = null;
        const author = req.params.author;
        let watch;
        try {
            watch = await db.find(COLLECTION, {author});
        } catch (ex) {
            console.log("=== Exception comments::find.");
            return res.status(500).json({ error: ex });
        } if (!watch) {
            res.status(404).json({
                error: 404,
                message: 'Author not found',
            });
        } else {
            try {
                const result = await comments.get(issueNumber, id, author);
                //check if the author has comments;
                if (result == null) {
                    res.status(404).json({
                        error: 404,
                        message: 'Comments not found for this author.',
                    });
                } else {
                    res.json(result);
                }
            } catch (ex) {
                console.log("=== Exception comment::getByAuthor.");
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
            console.log("=== Exception comments::find");
            return res.status(500).json({ error: ex });
        };
        if (valid) { //loop if any issueNumber is valid;
            try {
                const result = await comments.get(req.params.issueNumber);
                //check if the issue has comments;
                if (result == null) {
                    res.status(404).json({
                        error: 404,
                        message: 'Comments not found for this issue.',
                    });
                } else {
                    res.json(result);
                }
            } catch (ex) {
                console.log("=== Exception comment::getByIssue.");
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
        const text = req.body.text;
        if (!text) {
            res.send(`Text is missing.`);
        } else {
            //method starts only after all the items are passed;
            console.log('  inside post comments');
            try {
                const results = await comments.add(text, author, issueNumber);
                res.end(`POST: ${text}`);
            } catch (ex) {
                console.log("=== Exception comments::add");
                return res.status(500).json({ error: ex })
            }
        }
    }

    return {
        getController,
        getByAuthor,
        getByIssue,
        getById,
        postController,
    }
}