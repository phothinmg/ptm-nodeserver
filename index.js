import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";

/**
 * Creates a development server for serving static files based on the provided routes.
 *
 * @param {Array} routes - An array of routes to serve static files from.
 * @return {Object} server - The created development server.
 */
export default function devserver(routes){
    const rootPath = { route: '/',  path: '.'};
    const wroutes = routes === undefined ? '' : routes;
    const folders = [rootPath, ...wroutes];
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
        if (fs.existsSync(filePath)) {
          fs.createReadStream(filePath).pipe(res);
          found = true;
          break;
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