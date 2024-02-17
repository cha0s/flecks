// Adapted from https://reactrouter.com/en/main/guides/ssr
export function createFetchRequest(req, res) {
  // Build and propagate request parameters.
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, values = []]) => {
    (Array.isArray(values) ? values : [values]).forEach((value) => {
      headers.append(key, value);
    });
  });
  const init = {headers, method: req.method};
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const urlSearchParams = new URLSearchParams();
    Object.entries(req.body)
      .forEach(([name, value]) => {
        urlSearchParams.append(name, value);
      });
    init.body = urlSearchParams;
  }
  // Build the request URL.
  const origin = `${req.protocol}://${req.get('host')}`;
  const {href} = new URL(req.originalUrl || req.url, origin);
  // Allow aborting the request.
  const controller = new AbortController();
  res.on('close', () => controller.abort());
  return new Request(href, {...init, signal: controller.signal});
}
