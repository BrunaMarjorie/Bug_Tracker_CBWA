const users = require('../model/users.js')();
const bcrypt = require('bcrypt');

module.exports = () => {

    const getController = async (req, res) => {
        const { usersList, error } = await users.get();
        if (error) {
            return res.status(500).json({ error })
        } else {
            res.json({ users: usersList });
        }
    }

    const getByEmail = async (req, res) => {
        try {
            const usersList = await users.get(req.params.email);
            //check if user exists;
            if (usersList == null) {
                res.status(404).json({
                    error: 404,
                    message: 'User not found',
                });
            } else {
                res.json(usersList);
            }
        } catch (ex) {
            console.log("=== Exception user::getByEmail.");
            return res.status(500).json({ error: ex })
        }
    }

    const postController = async (req, res) => {
        const name = req.body.name;
        if (!name) {
            res.send(`Name is missing.`);
        }
        const email = req.body.email;
        if (!email) {
            res.send(`Email is missing.`);
        } else {
            //validate email format;
            const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (!mailformat.test(String(email).toLowerCase())) {
                res.send(`Email format not valid.`);
            }
        }
        const usertype = req.body.usertype;
        if (!usertype) {
            res.send(`Usertype is missing.`);

            //validate usertype;
        } else if (usertype !== "admin" && usertype !== "user") {
            res.send(`Usertype is not valid. It must be 'admin' or 'user'.`);
        }
        const key = req.body.key;
        if (!key) {
            res.send(`Key(password) is missing.`);
        }
        //method starts only after all the items are passed;
        if (name && email && usertype && key) {
            const hash = bcrypt.hashSync(key, 10);
            console.log('  inside controller users');
            try {
                const results = await users.add(name, email, usertype, hash);
                //check if email is unique;
                if (results != null) {
                    res.end(`POST: ${name}, ${email}, ${usertype}`);
                } else {
                    res.end(`Error: ${email} already exists.`);
                }
            } catch (ex) {
                console.log("=== Exception user::add");
                return res.status(500).json({ error: ex })
            }
        }
    }

    return {
        getController,
        getByEmail,
        postController
    }
}