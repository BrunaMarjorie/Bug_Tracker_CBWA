const db = require('../db')();
const COLLECTION = 'watchers';

module.exports = () => {
    const get = async (issueNumber = null, author = null) => {
        console.log('   inside watchers');
        if (!issueNumber && !author) {
            try {
                const watchers = await db.get(COLLECTION);
                console.log(watchers);
                return { watchersList: watchers };
            } catch (ex) {
                console.log("=== Exception watchers::get");
                return { error: ex };
            }
        } else if (issueNumber && !author) {
            try {
                const watchers = await db.get(COLLECTION, { issueNumber });
                //check if the issue has comments;           
                if (watchers.length != 0) {
                    return { watchersList: watchers };
                } else {
                    return null;
                }
            } catch (ex) {
                console.log("=== Exception watchers::get");
                return { error: ex };
            }
        } else if (!issueNumber && author) {
            try {
                const watchers = await db.get(COLLECTION, { author });
                //check if the author has comments;           
                if (watchers.length != 0) {
                    return { watchersList: watchers };
                } else {
                    return null;
                }
            } catch (ex) {
                console.log("=== Exception watchers::get");
                return { error: ex };
            }
        }
    }

    const add = async (author, issueNumber) => {
        console.log("   inside models watchers");
        try {
            const results = await db.add(COLLECTION, {
                author: author,
                issueNumber: issueNumber,
            });
            return results.result;
        } catch (ex) {
            console.log("=== Exception watchers::add");
            return { error: ex };
        };
    }

    return {
        get,
        add,
    }
}