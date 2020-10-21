const issues = require('../model/issues.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await issues.get());
    }

    const getByID = async (req, res) => {
        /*const result = issues.get(req.params.id);
        if(result.error){
            res.status(404).json({
                error: "Invalid ID"
            });
        }*/
        res.json({error: 'not implemented.'});
    }

    const postController = async (req, res) => {
        const name = req.body.name;
        const title = req.body.title;
        const description = req.body.description;
        console.log('  inside post issues');
        const results = await issues.add(name, title, description);
        res.end(`POST: ${name}, ${title}, ${description}`);
       
    }  

    return {
        getController,
        getByID,
        postController
}
}