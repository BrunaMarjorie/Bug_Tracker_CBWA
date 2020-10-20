module.exports = () => {
    const projects = [
        {id: 1, slug: 'STORE', name: 'bookstore', description: 'collection of books and authors.'},
        {id: 2, slug: 'TRACKER', name: 'bugtracker', description: 'api to track bugs in projects.'},
    ];

    const users = [
        {id: 1, name: 'Bruna Santana', email: 'brunamarjorie@gmail.com', usertype: 'admin'},
        {id: 2, name: 'Dave Albert', email: 'dalbert@cct.ie', usertype: 'user'}
    ];

    const issues = [
        {id: 1, issueNumber: 'STORE-1', title: 'store issue', description: 'lala'},
        {id: 2, issueNumber: 'TRACKER-1', title: 'tracker issue', description: 'lala'}
    ];

    return {
        projects,
        users,
        issues,
    };
};