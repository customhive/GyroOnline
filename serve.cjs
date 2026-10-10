// Optional preview server. index.html also works by double-clicking it.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
  let pathname;
  try { pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch {res.writeHead(400);res.end('Bad request');return;}
  const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  const rel=path.relative(root,target);
  if(rel.startsWith('..')||path.isAbsolute(rel)){res.writeHead(403);res.end('Forbidden');return;}
  fs.readFile(target,(error,data)=>{
    if(error){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
  });
}).listen(Number(process.env.PORT||4181),'127.0.0.1',()=>console.log('Gyro Clash Online: http://127.0.0.1:'+Number(process.env.PORT||4181)));
