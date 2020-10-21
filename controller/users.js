const users = require('../model/users.js')();

module.exports = () => {

    const getController = async (req, res) => {
        res.json(await users.get());
    }

    const getByID = async (req, res) => {
       /* const result = users.get(req.params.id);
        if(result.error){
            res.status(404).json({
                error: "Invalid ID"
            });
        }*/
        res.json({error: 'not implemented.'});
    }

    const postController = async (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const usertype = req.body.usertype;
        console.log('  inside post users');
        const result = await users.add(name, email, usertype);
        res.json(result);
        res.end(`POST: ${name}, ${email}, ${usertype}`);
    }  

    return {
        getController,
        getByID,
        postController
}
}