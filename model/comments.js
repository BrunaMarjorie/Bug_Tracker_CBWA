const db = require('../db')();
const COLLECTION = 'comments';


module.exports = () => {
    const get = async (issueNumber = null, id = null, author = null) => {
        console.log('   inside comments');
        if(!issueNumber && !id && !author){
            const comments = await db.get(COLLECTION);
            return comments;
            
        }else if (issueNumber && !id && !author){
            const comments = await db.get(COLLECTION, { issueNumber });
            //check if the issue has comments;           
            if(comments.length != 0){
                return comments;
            }else {
                return null;
            } 
        }else if (issueNumber && id && !author){
            const comments = await db.get(COLLECTION, { issueNumber, id});
            //check if the comment exists;           
            if(comments.length != 0){
                return comments;
            }else {
                return null;
            } 
        }else if(!issueNumber && !id && author){
            const comments = await db.get(COLLECTION, { author });
            //check if the author has comments;           
            if(comments.length != 0){
                return comments;
            }else {
                return null;
            }  
        }
    }
    
    
    const add = async (text, author, issueNumber) => {
        console.log( "   inside models comments");
        const count = await db.count(COLLECTION, {issueNumber});
        const results = await db.add(COLLECTION, {
            id: count+1,
            text: text,
            author: author,
            issueNumber: issueNumber,
            
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
        updateStatus,
        
    }
}