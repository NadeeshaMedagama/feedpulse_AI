async function analyzeFeedback(title, description) {
  const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:4003";
  const response = await fetch(`${aiServiceUrl}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description })
  });

  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body?.error || body?.message || "AI analysis failed");
  }

  return body.data;
}

module.exports = { analyzeFeedback };
