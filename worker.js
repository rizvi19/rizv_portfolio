const CV_PARTS = [
  '/cvparts/part0.txt','/cvparts/part1.txt','/cvparts/part2.txt',
  '/cvparts/part3.txt','/cvparts/part4.txt','/cvparts/part5.txt'
];

async function serveFinalCV(request, env) {
  const origin = new URL(request.url);
  const parts = await Promise.all(CV_PARTS.map(async (path) => {
    const url = new URL(path, origin);
    const response = await env.ASSETS.fetch(new Request(url, request));
    if (!response.ok) throw new Error(`Missing CV asset part: ${path}`);
    return response.text();
  }));
  const binary = atob(parts.join('').trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Response(bytes, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'inline; filename="Shahriar_Rizvi_CV.pdf"',
      'cache-control': 'public, max-age=3600'
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/Shahriar_Rizvi_CV.pdf') {
      return serveFinalCV(request, env);
    }

    if (url.pathname.startsWith('/cvparts/')) {
      return new Response('Not found', { status: 404 });
    }

    const response = await env.ASSETS.fetch(request);
    const isPortfolioPage = url.pathname === '/' || url.pathname === '/index.html';
    if (isPortfolioPage && response.ok && (response.headers.get('content-type') || '').includes('text/html')) {
      return new HTMLRewriter()
        .on('body', {
          element(element) {
            element.append('<script src="/stars-motion.js" defer></script>', { html: true });
          }
        })
        .transform(response);
    }
    return response;
  }
};
