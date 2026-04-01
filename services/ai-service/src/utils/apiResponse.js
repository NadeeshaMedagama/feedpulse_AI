function sendSuccess(res, data, message = "OK", status = 200) {
  return res.status(status).json({ success: true, data, error: null, message });
}

function sendError(res, message = "Request failed", error = null, status = 500) {
  return res.status(status).json({ success: false, data: null, error, message });
}

module.exports = { sendSuccess, sendError };

