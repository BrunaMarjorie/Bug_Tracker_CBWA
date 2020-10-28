const db = require('../db')();
const COLLECTION = 'users';
const bcrypt = require('bcrypt');

module.exports = () => {
    const get = async (email = null) => {
        console.log('   inside users');
        if(!email){
            const users = await db.get(COLLECTION);
            return users; 
        }
            const users = await db.get(COLLECTION, {email});
            return users;            
    }

    const getByKey = async (key) => {
        console.log('   inside users key');
        if(!key){
            console.log(" 01: Missing key.");
            return null;        
        }
            const users = await db.findKeys();
            console.log(key);
            for (i in users){
                console.log(users[i].key);
                if(bcrypt.compareSync(key, users[i].key)){
                    return users[i];
                }
            }
                console.log(" 02: User not found.");
                return null;                
    }          

    const add = async (name, email, usertype, hash) => {
        const results = await db.add(COLLECTION, {
            name: name,
            email: email,
            usertype: usertype,
            key: hash,
        });
        
        return results.results;

    };    

    return {
        get,
        add,
        getByKey
    }
}