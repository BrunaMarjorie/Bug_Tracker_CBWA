const db = require('../db')();
const COLLECTION = 'comments';


module.exports = () => {
    const get = async (issueNumber = null, id = null, author = null) => {
        console.log('   inside comments');
        if (!issueNumber && !id && !author) {
            try {
                const comments = await db.get(COLLECTION);
                return { commentsList: comments };
            } catch (ex) {
                console.log("=== Exception comments::get");
                return { error: ex };
            }
        } else if (issueNumber && !id && !author) {
            try {
                const comments = await db.get(COLLECTION, { issueNumber });
                //check if the issue has comments;           
                if (comments.length != 0) {
                    return { commentsList: comments };
                } else {
                    return null;
                }
            } catch (ex) {
                console.log("=== Exception comments::get");
                return { error: ex };
            }
        } else if (issueNumber && id && !author) {
            try {
                const comments = await db.get(COLLECTION, { issueNumber, id });
                //check if the comment exists;           
                if (comments.length != 0) {
                    return { commentsList: comments };
                } else {
                    return null;
                }
            } catch (ex) {
                console.log("=== Exception comments::get");
                return { error: ex };
            }
        } else if (!issueNumber && !id && author) {
            try {
                const comments = await db.get(COLLECTION, { author });
                //check if the author has comments;           
                if (comments.length != 0) {
                    return { commentsList: comments };
                } else {
                    return null;
                }
            } catch (ex) {
                console.log("=== Exception comments::get");
                return { error: ex };
            }
        }
    }

    const add = async (text, author, issueNumber) => {
        console.log("   inside models comments");
        let count;
        try {
            //count how many comments for the issue already exists;
            count = await db.count(COLLECTION, { issueNumber });
        } catch (ex) {
            console.log("=== Exception comments::count");
            return { error: ex };
        };
        try {
            const results = await db.add(COLLECTION, {
                id: count + 1,
                text: text,
                author: author,
                issueNumber: issueNumber,
            });
            return results.result;
        } catch (ex) {
            console.log("=== Exception comments::add");
            return { error: ex };
        };
    }

    return {
        get,
        add,
    }
}