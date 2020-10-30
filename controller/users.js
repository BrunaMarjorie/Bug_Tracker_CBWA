const users = require('../model/users.js')();
const bcrypt = require('bcrypt');

module.exports = () => {
    
    const getController = async (req, res) => {
        res.json(await users.get());
    }
    
    const getByEmail = async (req, res) => {
        const result = await users.get(req.params.email);
        //check if user exists;
        if(result == null){
            res.status(404).json({
                error: 404,
                message: 'User not found',
            });
        }else {
            res.json(result);
        }
        
    }
    
    const postController = async (req, res) => {
        const name = req.body.name;
        if (!name){
            res.send(`Name is missing.`);
        }
        const email = req.body.email;
        if (!email){
            res.send(`Email is missing.`);
        }
        const usertype = req.body.usertype;
        if (!usertype){
            res.send(`Usertype is missing.`);
        }
        const key = req.body.key;
        if (!key){
            res.send(`Key is missing.`);
        }
        //method starts only after all the items are passed;
        if (name && email && usertype && key){
            const hash = bcrypt.hashSync(key, 10);
            console.log('  inside controller users');
            const result = await users.add(name, email, usertype, hash);
            res.end(`POST: ${name}, ${email}, ${usertype}`);
        } 
    }  
    
    return {
        getController,
        getByEmail,
        postController
    }
}