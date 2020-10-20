const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

function listener(req, res){
    console.log('[%s] %s -- %s', new Date(), req.method, res.url);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    
    switch (req.url){
        case "/projects":
            res.end('projects');
            break;

        case "/users":
            res.end('users');
            break;
        
        case "/issues":
            res.end('issues');
            break;
        
        default:
            res.statusCode = 404;
            res.end('404 resource not found.');
            break;
    }   
}

const server = http.createServer(listener);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

