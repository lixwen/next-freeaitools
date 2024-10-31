export const runtime = "edge";

import { models } from "../../data/modelsData";

// 辅助函数：获取模型类型
function getModelType(modelName) {
  for (const category of models) {
    if (category.models.includes(modelName)) {
      return category.title;
    }
  }
  return null;
}

export async function POST(request) {
  const { prompt, modelName } = await request.json();
  const modelType = getModelType(modelName);
  console.log("prompt: {}, modelName: {}", prompt, modelName);
  try {
    const input = buildPrompt(prompt, modelName);
    const response = await process.env.AI.run(modelName, input);

    // 根据模型类型返回不同格式的响应
    switch (modelType) {
      case "Text-to-Image":
        return new Response(
          JSON.stringify({
            type: "image",
            image: response.image,
          }),
          {
            status: 200,
            headers: { "Content-Type": "image/jpg" },
          }
        );

      case "Image-to-Text":
      case "Text Generation":
      default:
        return new Response(
          JSON.stringify({
            type: "text",
            response: response.response,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        type: "text",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function buildPrompt(prompt, modelName) {
  if (modelName === "@cf/black-forest-labs/flux-1-schnell") {
    return {
      prompt: prompt,
    }
  }

  return {
    messages: [{ role: "user", content: prompt }],
  };
}
