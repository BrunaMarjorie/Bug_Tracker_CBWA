const projects = require('../model/projects.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json( await projects.get());
    }

    const getByID = async (req, res) => {
        /*const result = projects.get(req.params.id);
        if(result.error){
            res.status(404).json({
                error: "Invalid ID"
            });
        }*/
        res.json({error: 'not implemented.'});
    }

    const postController = async (req, res) => {
        const slug = req.body.slug;
        const name = req.body.name;
        const description = req.body.description;
        console.log('  inside post projects');
        const results = await projects.add(slug, name, description);
        res.end(`POST: ${slug}, ${name}, ${description}`);
    }

    return {
        getController,
        getByID,
        postController
}
}