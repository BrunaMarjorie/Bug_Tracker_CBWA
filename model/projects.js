const db = require('../db')();
const COLLECTION = 'projects';

module.exports = () => {
    const get = async (slug = null) => {
        console.log('   inside projects');
        if(!slug){
            const projects = await db.get(COLLECTION);
            return projects; 
        }
            const projects = await db.get(COLLECTION, {slug});
            //check if the project exists;           
            if(projects.length != 0){
                return projects;

            }else {
                return null;
            }      
    }

    const add = async (slug, name, description) => {
        //set slug in uppercase;
        slug = slug.toUpperCase();
        //check if slug is unique;
        const valid = await db.find(COLLECTION, {slug});
        if(!valid){
            const results = await db.add(COLLECTION, {
            slug: slug,
            name: name,
            description: description
            });
            return  results.result;
        }
            return null; 
    }

    const aggregateWithIssues = async (slug) => {
        const LOOKUP_ISSUES_PIPELINE = [
            //filter the project;
            {   $match: {
                'slug': slug,
            }},
            {   $lookup: {
                    from: 'issues',
                    localField: '_id',
                    foreignField: 'project_id',
                    as: 'issues',
                },
            },
        ];
        const projects = await db.aggregate(COLLECTION, LOOKUP_ISSUES_PIPELINE);
        return projects;
    }

    return {
        get,
        add,
        aggregateWithIssues,
    }
}