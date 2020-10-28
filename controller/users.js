const users = require('../model/users.js')();
const bcrypt = require('bcrypt');

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
        const key = req.body.key;
        const hash = bcrypt.hashSync(key, 10);
        console.log('  inside controller users');
        const result = await users.add(name, email, usertype, hash);
        res.end(`POST: ${name}, ${email}, ${usertype}`);
        
        
    }  

    return {
        getController,
        getByEmail,
        postController
}
}