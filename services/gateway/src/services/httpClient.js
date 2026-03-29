async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    body = null;
  }

  return { ok: response.ok, status: response.status, body };
}

module.exports = { requestJson };

