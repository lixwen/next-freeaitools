import { getModelType } from "../../data/modelsData";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req) {
  try {
    const { prompt, modelName, messages, modelParams } = await req.json();

    const modelType = getModelType(modelName);

    // 从请求头中获取用户的 Cloudflare 凭证
    const userAccountId =
      req.headers.get("cf-account-id") || process.env.CF_ACCOUNT_ID;
    const userApiKey = req.headers.get("cf-api-key") || process.env.CF_API_KEY;

    // 根据模型类型构建不同的输入格式
    const input = buildPrompt(prompt, modelType, messages, modelParams);
    console.log(
      `type: ${modelType} model: ${modelName} input: ${JSON.stringify(input)}`
    );
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${userAccountId}/ai/run/${modelName}`,
      {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userApiKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.message || "API request failed");
    }

    // 统一处理不同模型的响应格式
    switch (modelType) {
      case "Text-to-Image":
        let base64Image;
        if (modelName === "@cf/black-forest-labs/flux-1-schnell") {
          // flux 模型直接返回 base64
          const result = await response.json();
          base64Image = result.result.image;
        } else {
          // 处理 ReadableStream
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          base64Image = Buffer.from(arrayBuffer).toString("base64");
        }
        return NextResponse.json({
          type: "image",
          image: `data:image/png;base64,${base64Image}`,
        });

      case "Image-to-Text":
      case "Text Generation":
      default:
        const result = await response.json();
        return NextResponse.json({
          type: "text",
          response: result.result.response,
        });
    }
  } catch (error) {
    return NextResponse.json(
      {
        type: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// 构建不同模型的输入格式
function buildPrompt(prompt, modelType, messages = null, modelParams = null) {
  if (modelType === "Text-to-Image") {
    return {
      prompt: prompt,
      ...modelParams,
    };
  }

  // 文本生成模型使用完整对话历史
  return {
    messages: messages || [
      { role: "system", content: "You are a friendly assistant" },
      { role: "user", content: prompt },
    ],
    ...modelParams,
  };
}
