const projects = require('../model/projects.js')();

module.exports = () => {

    const getController = (req, res) => {
        res.setHeader('Content-Type', 'Application/json');
        return res.json(projects.get());
    }

    const getByID = (req, res) => {
        res.setHeader('Content-Type', 'Application/json');
        const result = projects.get(req.params.id);
        if(result.error){
            res.status(404).json({
                error: "Invalid ID"
            });
        }
        return res.json(projects.get(req.params.id));
    }

    const postController = (req, res) => {
        let slug = req.body.slug;
        let name = req.body.name;
        let description = req.body.description;
        console.log('  inside post projects');
        projects.add(slug, name, description);
        return res.end(`POST: ${slug}, ${name}, ${description}`);
    }

    return {
        getController,
        getByID,
        postController
}
}