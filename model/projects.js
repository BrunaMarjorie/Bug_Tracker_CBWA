const projects = require('../controller/projects');

const db = require('../db')();

module.exports = () => {
    const get = (id = null) => {
        console.log('   inside projects');
        if(!id){
            return db.projects;
        
        }else if(parseInt(id) > db.projects.length){
            return {error: true};
        }

        return db.projects[parseInt(id) - 1];        
    }

    const add = (slug, name, description) => {
        return  db.projects.push({
            id: db.projects.length + 1, 
            slug, 
            name, 
            description,
        });  
    }

    return {
        get,
        add
    }
}