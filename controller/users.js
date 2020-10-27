const projects = require('../model/projects.js');

const users = require('../model/users.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await users.get());
    }

    const getByEmail = async (req, res) => {
        res.json(await users.get(req.params.email));
    }

    const postController = async (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const usertype = req.body.usertype;
        console.log('  inside controller users');
        const result = await users.add(name, email, usertype);
        res.end(`POST: ${name}, ${email}, ${usertype}`);
        
        
    }  

    return {
        getController,
        getByEmail,
        postController
}
}