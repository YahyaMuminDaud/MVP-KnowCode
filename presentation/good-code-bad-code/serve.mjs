import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`\nGood Code vs. Bad Code — deck running at http://localhost:${port}\n`);
  console.log("Controls: Arrow keys or the on-screen nav to move between slides.");
  console.log("Click the notes icon for speaker notes. Press Ctrl+C to stop.\n");
});
