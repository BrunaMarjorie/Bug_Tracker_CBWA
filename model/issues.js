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
        //check if the issue exists;           
        if(issues.length != 0){
            return issues;

        }else {
            return null;
        }           
    }

    const add = async (title, description, slug) => {
        console.log( "   inside models issues");
        //look for the project_id using the slug;
        const project_id = await db.find('projects', {slug});
        //count how many issues for the project already exists;
        const count = await db.count(COLLECTION, {project_id});
        const results = await db.add(COLLECTION, {
            issueNumber: slug + '-' + (count+1),
            title: title,
            description: description,
            project_id: project_id,         
            status: "open",
        });
       
        return  results.result;
    }

    //update issue status;
    const updateStatus = async (status, issueNumber) => {
        console.log( "   inside put models issues");
        const results = await db.updateIssueStatus(issueNumber, status);
        return  results.result;
    }

    const aggregateWithComments = async () => {
        const LOOKUP_COMMENTS_PIPELINE = [
            {   $lookup: {
                    from: 'comments',
                    localField: 'issueNumber',
                    foreignField: 'issueNumber',
                    as: 'comments',
                },
            },
        ];
        const issues = await db.aggregate(COLLECTION, LOOKUP_COMMENTS_PIPELINE);
        return issues;
    }

    return {
        get,
        add,
        updateStatus,
        aggregateWithComments
    }
}