const comments = require('../model/comments.js')();


module.exports = () => {
    
    const getController = async (req, res) => {
        res.json(await comments.get());
    }
    
    const getById = async (req, res) => {
        const issueNumber = req.params.issueNumber;
        const id = parseInt(req.params.id);
        const result = await comments.get(issueNumber, id);
        //check if comments exists;
        if(result == null){
            res.status(404).json({
                error: 404,
                message: 'Comment not found.',
            });
        }else {
            res.json(result);
        }
    }
    
    const getByAuthor = async (req, res) => {
        const issueNumber = null;
        const id = null;
        const author = req.params.author;
        const result = await comments.get(issueNumber, id, author);
        //check if the author has comments;
        if(result == null){
            res.status(404).json({
                error: 404,
                message: 'Author has not commented yet.',
            });
        }else {
            res.json(result);
        }
    }
    
    const getByIssue = async (req, res) => {
        const result = await comments.get(req.params.issueNumber);
        //check if the issue has comments;
        if(result == null){
            res.status(404).json({
                error: 404,
                message: 'Issue has no comments yet.',
            });
        }else {
            res.json(result);
        }
    }
    
    const postController = async (req, res) => {
        const issueNumber = req.params.issueNumber;
        const text = req.body.text;
        if (!text){
            res.send(`Text is missing.`);
        }
        //call the logged user;
        const author = req.user;
        
        //method starts only after all the items are passed;
        if(text){
            console.log('  inside post comments');
            const results = await comments.add(text, author, issueNumber);
            res.end(`POST: ${text}`);
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