import config from './config.json';
const { BACKEND_PORT } = JSON.parse(JSON.stringify(config));

async function api (path, method, body, authToken) {
  console.log(method + ':' + path);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: authToken,
  };

  const options = {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(body),
  };

  const res = await fetch(`http://localhost:${BACKEND_PORT}/${path}`, options);
  const status = res.status;
  const data = await res.json();

  return {
    status,
    data,
  };
}

export default api;
