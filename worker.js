const CV_URL = 'https://drive.google.com/file/d/1-fbRAbCe2t2-xWEeoWXrmnBUIK_OWa0Q/view?usp=drive_link';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/Shahriar_Rizvi_CV.pdf') {
      return Response.redirect(CV_URL, 302);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    const isPortfolioPage = (url.pathname === '/' || url.pathname === '/index.html') && response.ok && contentType.includes('text/html');

    if (!isPortfolioPage) return response;

    return new HTMLRewriter()
      .on('a[href="Shahriar_Rizvi_CV.pdf"]', {
        element(element) {
          element.setAttribute('href', CV_URL);
          element.setAttribute('target', '_blank');
          element.setAttribute('rel', 'noopener');
        }
      })
      .on('body', {
        element(element) {
          element.append('<script src="/stars-motion.js" defer></script>', { html: true });
        }
      })
      .transform(response);
  }
};
