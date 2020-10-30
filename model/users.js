const db = require('../db')();
const COLLECTION = 'users';
const bcrypt = require('bcrypt');

module.exports = () => {
    const get = async (email = null) => {
        console.log('   inside users');
        if(!email){
            const users = await db.get(COLLECTION);
            return users; 
        }else {
            const users = await db.get(COLLECTION, {email});
            //check if user exists;
            if(users.length != 0){
                return users;
                
            }else {
                return null;
            } 
        }               
    }
    
    const getByKey = async (key) => {
        console.log('   inside users key');
        if(!key){
            console.log(" 01: Missing key.");
            return null;        
        }else {
            //look up and match user key;        
            const users = await db.findKeys();
            
            for (i in users){
                if(bcrypt.compareSync(key, users[i].key)){
                    const user = users[i].email;
                    return user;
                }
            }
            console.log(" 02: User not found.");
            return null;  
        }              
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