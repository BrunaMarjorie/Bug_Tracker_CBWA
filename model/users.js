const db = require('../db')();

module.exports = () => {
    const get = (id = null) => {
        console.log('   inside users');
        if(!id){
            return db.users;

        }else if(parseInt(id) > db.users.length){
            return {error: true};
        }

        return db.users[parseInt(id) - 1];        
    }

    const add = (name, email, usertype) => {
        return  db.users.push({
            id: db.users.length + 1, 
            name, 
            email, 
            usertype,
        });  
    }

    return {
        get,
        add
    }
}