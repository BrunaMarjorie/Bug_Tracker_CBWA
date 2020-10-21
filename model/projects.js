const projects = require('../controller/projects');
const COLLECTION = 'projects';

const db = require('../db')();

module.exports = () => {
    const get = async () => {
        console.log('   inside projects');
        const projects = await db.get(COLLECTION);
        return projects;       
    }

    const add = async (slug, name, description) => {
        const results = await db.add(COLLECTION, {
            slug: slug,
            name: name,
            description: description
        });
        
        return  results.result;  
    }

    return {
        get,
        add
    }
}