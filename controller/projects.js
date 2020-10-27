const projects = require('../model/projects.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json( await projects.get());
    };

    const getBySlug = async (req, res) => {
        res.json(await projects.get(req.params.slug));
    };

    const projectIssues = async (req, res) => {
        res.json(await projects.aggregateWithIssues(req.params.slug));
    };

    const postController = async (req, res) => {
        const slug = req.body.slug;
        const name = req.body.name;
        const description = req.body.description;
        console.log('  inside post projects');
        const results = await projects.add(slug, name, description);
        res.end(`POST: ${slug}, ${name}, ${description}`);
    };

    return {
        getController,
        getBySlug,
        projectIssues,
        postController
}
}