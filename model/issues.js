const db = require('../db')();
const COLLECTION = 'issues';

module.exports = () => {
    const get = async (issueNumber = null) => {
        console.log('   inside model issues');
        if (!issueNumber) {
            try {
                const issues = await db.get(COLLECTION);
                return { issuesList: issues };
            } catch (ex) {
                console.log("=== Exception issues::get");
                return { error: ex };
            }
        } else {
            try {
                const issues = await db.get(COLLECTION, { issueNumber });
                //check if the issue exists;           
                if (issues.length != 0) {
                    return { issues };
                } else {
                    return null;
                }
            } catch (ex) {
                console.log("=== Exception issues::get{issueNumber}");
                return { error: ex };
            }
        }
    }

    const add = async (title, description, slug) => {
        console.log("   inside models issues");
        slug = slug.toUpperCase();
        let project_id;
        try {
            //look for the project_id using the slug;
            project_id = await db.find('projects', { slug });
        } catch (ex) {
            console.log("=== Exception issues::find{slug}");
            return { error: ex };
        }
        let count;
        try {
            //count how many issues for the project already exists;
            count = await db.count(COLLECTION, { project_id });
        } catch (ex) {
            console.log("=== Exception issues::count");
            return { error: ex };
        };
        try {
            const results = await db.add(COLLECTION, {
                issueNumber: slug + '-' + (count + 1),
                title: title,
                description: description,
                project_id: project_id,
                status: "open",
            });

            return results.result;
        } catch (ex) {
            console.log("=== Exception issues::add");
            return { error: ex };
        };
    };

    //update issue status;
    const updateStatus = async (status, slug, issueNumber) => {
        console.log("   inside models issues");
        let validSlug;
        try {
            //validate the slug;
            validSlug = await db.find('projects', { slug });
        } catch (ex) {
            console.log("=== Exception issues::find{slug}");
            return { error: ex };
        }
        try {
            //validate the issueNumber;
            validIssueNumber = await db.find('issues', { issueNumber });
        } catch (ex) {
            console.log("=== Exception issues::find{issueNumber}");
            return { error: ex };
        }
        if (!validSlug || !validIssueNumber) {
            return null;
        } else {
            try {
                const results = await db.updateIssueStatus(issueNumber, status);
                return results.result;
            } catch (ex) {
                console.log("=== Exception issues::updateStatus");
                return { error: ex };
            };
        }

    }

    const aggregateWithComments = async () => {
        console.log("   inside models issues");
        const LOOKUP_COMMENTS_PIPELINE = [
            {
                $lookup:
                {
                    from: 'comments',
                    localField: 'issueNumber',
                    foreignField: 'issueNumber',
                    as: 'comments',
                },
            },
        ];
        try {
            const issues = await db.aggregate(COLLECTION, LOOKUP_COMMENTS_PIPELINE);
            if (issues.length != 0) {
                return ({ issues });
            } else {
                return null;
            }
        } catch (ex) {
            console.log("=== Exception projects::aggregate");
            return { error: ex };
        }
    }

    return {
        get,
        add,
        updateStatus,
        aggregateWithComments
    }
}