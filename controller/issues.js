const issues = require('../model/issues.js')();

module.exports = () => {

    const getController = (req, res) => {
        res.setHeader('Content-Type', 'Application/json');
        return res.json(issues.get());
    }

    const getByID = (req, res) => {
        res.setHeader('Content-Type', 'Application/json');
        const result = issues.get(req.params.id);
        if(result.error){
            res.status(404).json({
                error: "Invalid ID"
            });
        }
        return res.json(issues.get(req.params.id));
    }

    const postController = (req, res) => {
        let name = req.body.name;
        let title = req.body.title;
        let description = req.body.description;
        console.log('  inside post issues');
        issues.add(name, title, description);
        return res.end(`POST: ${name}, ${title}, ${description}`);
       
    }  

    return {
        getController,
        getByID,
        postController
}
}