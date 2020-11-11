const mail = require('../mail')();
const db = require('../db')();
const COLLECTION = 'issues';


module.exports = () => {
    const get = async (issueNumber = null) => {
        console.log('   inside model issues');
        mail.dateUpdate();
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

    const add = async (title, description, slug, dueDate) => {
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
                dueDate: dueDate,
                status: "open",
            });

            return results.result;
        } catch (ex) {
            console.log("=== Exception issues::add");
            return { error: ex };
        };
    };

    //update issue status;
    const updateStatus = async (status, slug, issueNumber, user) => {
        console.log("   inside models issues");
        const email = user; //collect the email accessing the page;
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
                const results = await db.updateIssueStatus({ email }, issueNumber, status);
                if (!results) { //response if user is not authorised;
                    return -1;
                } else {
                    mail.update(issueNumber); //send email when status is updated;
                    return results.result;
                }
            } catch (ex) {
                console.log("=== Exception issues::updateStatus");
                return { error: ex };
            };
        }

    }

    const aggregateWithComments = async () => {
        console.log("   inside models issues");
        mail.dateUpdate();
        const LOOKUP_COMMENTS_PIPELINE = [
            {
                $lookup: //function to aggregate the comments;
                {
                    from: 'comments',
                    localField: 'issueNumber',
                    foreignField: 'issueNumber',
                    as: 'comments',
                },
            },
            {
                $lookup: //function to aggregate the watchers;
                {
                    from: 'watchers',
                    let: { 'issueNumber': '$issueNumber' },
                    //only the author will be shown as result;
                    pipeline: [{
                        $match: {
                            $expr:
                                { $eq: ['$issueNumber', '$$issueNumber'] }
                        }
                    },
                    { $project: { 'issueNumber': 0, '_id': 0 } }],
                    as: 'watchers',
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