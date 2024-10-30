export const runtime = "edge";

export async function POST(request) {
  const { prompt, modelName } = await request.json();

  try {
    const response = await context.env.AI.run(modelName, {
      messages: [{ role: "user", content: prompt }],
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}