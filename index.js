import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";

/**
 * Creates a development server for serving static files based on the provided routes.
 *
 * @param {Array} routes - An array of routes to serve static files from.
 */
export default function devserver(routes){
    if(!routes){console.log('Please check option : routes !!')}
    const folders = routes;
    const server = http.createServer((req, res) => {
    let found = false;
    for (const folder of folders) {
        if (req.url.startsWith(folder.route)) {
          const filePath = path.join(folder.path, req.url.replace(folder.route, ''));
          if (fs.statSync(filePath).isDirectory()) {
            const indexPath = path.join(filePath, 'index.html');
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
    
  return server
}