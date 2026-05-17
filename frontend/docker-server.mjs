import { createServer, request as httpRequest } from 'node:http';
import { promises as fs } from 'node:fs';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const port = 3000;
const buildDir = join(process.cwd(), 'build');
const backendTarget = 'http://backend:5000';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const sendFile = async (filePath, response) => {
  try {
    const stat = await fs.stat(filePath);
    response.statusCode = 200;
    response.setHeader('Content-Type', contentTypes[extname(filePath)] ?? 'application/octet-stream');
    response.setHeader('Content-Length', stat.size);
    createReadStream(filePath).pipe(response);
  } catch {
    response.statusCode = 404;
    response.end('Not found');
  }
};

const proxyToBackend = (request, response) => {
  const proxyUrl = new URL(request.url ?? '/', backendTarget);

  const proxyRequest = httpRequest(
    proxyUrl,
    {
      method: request.method,
      headers: {
        ...request.headers,
        host: proxyUrl.host,
      },
    },
    (proxyResponse) => {
      response.writeHead(proxyResponse.statusCode ?? 502, proxyResponse.headers);
      proxyResponse.pipe(response);
    }
  );

  proxyRequest.on('error', () => {
    response.statusCode = 502;
    response.end('Bad gateway');
  });

  request.pipe(proxyRequest);
};

createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (requestUrl.pathname.startsWith('/api/')) {
    proxyToBackend(request, response);
    return;
  }

  const safePath = normalize(decodeURIComponent(requestUrl.pathname)).replace(/^([/\\])+/, '');
  const filePath = join(buildDir, safePath);

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await sendFile(join(filePath, 'index.html'), response);
      return;
    }

    await sendFile(filePath, response);
    return;
  } catch {
    await sendFile(join(buildDir, 'index.html'), response);
  }
}).listen(port, () => {
  console.log(`Frontend server listening on http://localhost:${port}`);
});