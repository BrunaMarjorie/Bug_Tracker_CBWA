const issues = require('../controller/issues');

const db = require('../db')();
const COLLECTION = 'issues';


module.exports = () => {
    const get = async (issueNumber = null) => {
        console.log('   inside issues');
        if(!issueNumber){
            const issues = await db.get(COLLECTION);
            return issues;
        }

        const issues = await db.get(COLLECTION, { issueNumber });
        return issues;      
    }

    const add = async (title, description, slug) => {
        console.log( "   inside models issues");
        const project_id = await db.findProject(slug);
        const count = await db.count(project_id);
        const results = await db.add(COLLECTION, {
            issueNumber: slug + '-' + (count+1),
            title: title,
            description: description,
            project_id: project_id,         
            status: "open",
        });
       
        return  results.result;
    }

    const updateStatus = async (status, issueNumber) => {
        console.log( "   inside put models issues");
        const results = await db.updateIssueStatus(issueNumber, status);
        return  results.result;
    }

    return {
        get,
        add,
        updateStatus
    }
}