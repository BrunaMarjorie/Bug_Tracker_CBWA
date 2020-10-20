const users = require('../model/users.js')();

module.exports = () => {

    const getController = (req, res) => {
        res.setHeader('Content-Type', 'Application/json');
        return res.json(users.get());
    }

    const getByID = (req, res) => {
        res.setHeader('Content-Type', 'Application/json');
        const result = users.get(req.params.id);
        if(result.error){
            res.status(404).json({
                error: "Invalid ID"
            });
        }
        return res.json(users.get(req.params.id));
    }

    const postController = (req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let usertype = req.body.usertype;
        console.log('  inside post users');
        users.add(name, email, usertype);
        return res.end(`POST: ${name}, ${email}, ${usertype}`);
    }  

    return {
        getController,
        getByID,
        postController
}
}