export async function POST(request) {
  const { method } = request;
  console.log("request: ", request);
  if (method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  const { prompt, modelName } = await request.json();
  const accountId = "d1665159130e619da07e405470778702";
  const apiKey = "1jcjjIOUS9e1An4O7C6YVb_oRlQb05CfW5HJAN_R";
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelName}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data.result.response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error calling AI model: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}