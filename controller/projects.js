const projects = require('../model/projects.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json( await projects.get());
    };

    const getBySlug = async (req, res) => {
        const result = await projects.get(req.params.slug);
        //check if the project exists
        if(result == null){
            res.status(404).json({
                error: 404,
                message: 'Project not found',
            });
        }else {
            res.json(result);
        }
    };

        //aggregating projects and their issues;
    const projectIssues = async (req, res) => {
        res.json(await projects.aggregateWithIssues(req.params.slug));
    };

    const postController = async (req, res) => {
        const slug = req.body.slug;
        if (!slug){
            res.send(`Slug is missing.`);
        }
        const name = req.body.name;
        if (!name){
            res.send(`Name is missing.`);
        }
        const description = req.body.description;
        if (!description){
            res.send(`Description is missing.`);
        }
        //method starts only after all the items are passed;
        if(slug && name && description){
        console.log('  inside post projects');
        const results = await projects.add(slug, name, description);
        //check if SLUG is unique;
        if(results != null){
            res.end(`POST: ${slug}, ${name}, ${description}`);
        }
        res.end(`Error: ${slug} already exists.`);
    }
    };

    return {
        getController,
        getBySlug,
        projectIssues,
        postController
}
}