const db = require('../db')();
const COLLECTION = 'issues';

module.exports = () => {
    const get = async () => {
        console.log('   inside issues');
        const issues = await db.get(COLLECTION);
        return issues;       
    }

    const add = async (name, title, description) => {
        const results = await db.add(COLLECTION, {
            name: name,
            title: title,
            description: description
        });
        
        return  results.result;
    }

    return {
        get,
        add
    }
}