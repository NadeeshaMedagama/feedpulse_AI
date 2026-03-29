function sendSuccess(res, data, message = "OK", status = 200) {
  return res.status(status).json({ success: true, data, error: null, message });
}

function sendError(res, message, error, status = 500) {
  return res.status(status).json({ success: false, data: null, error: error || null, message });
}

module.exports = { sendSuccess, sendError };

