import { getModelType } from "../../data/modelsData";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req) {
  try {
    const { modelName, modelParams, messages, prompt } = await req.json();
    const modelType = getModelType(modelName);

    const userAccountId =
      req.headers.get("cf-account-id") || process.env.CF_ACCOUNT_ID;
    const userApiKey = req.headers.get("cf-api-key") || process.env.CF_API_KEY;

    const aiRequestBody = buildPrompt(prompt, modelType, messages, modelParams);
    console.log(
      `type: ${modelType} model: ${modelName} aiRequestBody: ${JSON.stringify(
        aiRequestBody
      )}`
    );

    switch (modelType) {
      case "Text-to-Image":
        // 图片生成模型保持原有逻辑
        const imgResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${userAccountId}/ai/run/${modelName}`,
          {
            method: "POST",
            body: JSON.stringify(aiRequestBody),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userApiKey}`,
            },
          }
        );

        if (!imgResponse.ok) {
          const error = await imgResponse.json();
          throw new Error(error.errors?.[0]?.message || "API request failed");
        }

        let base64Image;
        if (modelName === "@cf/black-forest-labs/flux-1-schnell") {
          const result = await imgResponse.json();
          base64Image = result.result.image;
        } else {
          const blob = await imgResponse.blob();
          const arrayBuffer = await blob.arrayBuffer();
          base64Image = Buffer.from(arrayBuffer).toString("base64");
        }

        return new Response(
          JSON.stringify({
            type: "image",
            image: `data:image/png;base64,${base64Image}`,
          })
        );

      case "Image-to-Text":
      case "Text Generation":
      default:
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${userAccountId}/ai/run/${modelName}`,
          {
            method: "POST",
            body: JSON.stringify(aiRequestBody),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userApiKey}`,
              Accept: "text/event-stream",
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.errors?.[0]?.message || "API request failed");
        }

        return new Response(response.body, {
          headers: { "content-type": "text/event-stream" },
        });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        type: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// buildPrompt 函数修改
function buildPrompt(prompt, modelType, messages = null, modelParams = null) {
  if (modelType === "Text-to-Image") {
    return {
      prompt: prompt,
      ...modelParams,
    };
  }

  // 文本生成模型
  const baseMessages = messages || [
    { role: "system", content: "You are a friendly assistant" },
    { role: "user", content: prompt },
  ];

  return {
    messages: baseMessages,
    stream: true,
    ...modelParams,
  };
}
