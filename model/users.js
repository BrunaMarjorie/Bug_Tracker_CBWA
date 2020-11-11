const db = require('../db')();
const COLLECTION = 'users';
const bcrypt = require('bcrypt');

module.exports = () => {
    const get = async (email = null) => {

        console.log('   inside users model');
        if (!email) {
            const issueNumber = 'CA-1';
            const email = await db.sendEmail({issueNumber});
            console.log(email);
            try {
                const users = await db.get(COLLECTION);
                return { usersList: users };
            } catch (ex) {
                console.log("=== Exception user::get");
                return { error: ex };
            }
        } else {
            try {
                const users = await db.get(COLLECTION, { email });
                //check if user exists;
                if (users.length != 0) {
                    return { users };
                } else {
                    return null;
                }
            } catch (ex) {
                console.log("=== Exception user::get{email}");
                return { error: ex };
            }
        }
    }

    const getByKey = async (key) => {
        console.log('   inside users key');
        if (!key) {
            console.log(" 01: Missing key.");
            return null;
        } else {
            try {
                //look up and match user key;        
                const users = await db.findKeys();
                for (i in users) {
                    if (bcrypt.compareSync(key, users[i].key)) {
                        const user = users[i].email;
                        return user;
                    }
                }
                console.log(" 02: User not found.");
                return null;
            } catch (ex) {
                console.log("=== Exception user::getByKey");
                return { error: ex };
            }
        }
    }

    const add = async (name, email, usertype, hash) => {
        console.log('   inside users model');
        let valid;
        try {
            //checking if email is unique;
            valid = await db.find(COLLECTION, { email });
        } catch (ex) {
            console.log("=== Exception user::find{email}");
            return { error: ex };
        }
        if (!valid) {
            try {
                const results = await db.add(COLLECTION, {
                    name: name,
                    email: email,
                    usertype: usertype,
                    key: hash,
                });
                return results.result;
            } catch (ex) {
                console.log("=== Exception user::add");
                return { error: ex };
            }
        } else {
            return null;
        }
    };

    return {
        get,
        add,
        getByKey
    }
}