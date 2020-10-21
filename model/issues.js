const db = require('../db')();
const COLLECTION = 'issues';

module.exports = () => {
    const get = (id = null) => {
        console.log('   inside issues');
        if(!id){
            return db.issues;

        }else if(parseInt(id) > db.issues.length){
            return {error: true};
        }

        return db.issues[parseInt(id) - 1];        
    }

    const add = (name, title, description) => {
        return  db.issues.push({
            id: db.issues.length + 1, 
            name, 
            title, 
            description,
        });  
    }

    return {
        get,
        add
    }
}