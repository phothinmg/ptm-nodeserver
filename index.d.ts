import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";

interface Folder {
  route: string;
  path: string;
}

/**
 * Creates a development server for serving static files based on the provided routes.
 *
 * @param {Array<Folder>} routes - An array of routes to serve static files from.
 * @returns {http.Server} - The created server instance.
 */
export default function devserver(routes: Array<Folder>): http.Server {
  if (!routes) {
    console.log('Please check option : routes !!');
  }
  
  const folders: Array<Folder> = routes;
  
  const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    let found: boolean = false;
    
    for (const folder of folders) {
      if (req.url.startsWith(folder.route)) {
        const filePath: string = path.join(folder.path, req.url.replace(folder.route, ''));
        
        if (fs.statSync(filePath).isDirectory()) {
          const indexPath: string = path.join(filePath, 'index.html');
          
          if (fs.existsSync(indexPath)) {
            fs.createReadStream(indexPath).pipe(res);
            found = true;
            break;
          }
        }
        
        try {
          if (fs.existsSync(filePath)) {
            fs.createReadStream(filePath).pipe(res);
            found = true;
            break;
          }
        } catch (err) {
          if (err.code === 'ENOENT' && err.syscall === 'stat' && err.path === 'favicon.ico') {
            continue;
          }
          
          res.statusCode = 500;
          res.end('Internal Server Error');
          return;
        }
      }
    }
    
    if (!found) {
      res.statusCode = 404;
      res.end('Not found');
    }
  });
  
  return server;
}