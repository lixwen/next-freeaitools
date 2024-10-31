export const runtime = "edge";

import { getModelType } from "../../data/modelsData";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, modelName, messages } = await req.json();

    const modelType = getModelType(modelName);

    // 根据模型类型构建不同的输入格式
    const input = buildPrompt(prompt, modelName, messages);
    console.log("input: ", input);
    const response = await process.env.AI.run(modelName, input);

    // 统一处理不同模型的响应格式
    switch (modelType) {
      case "Text-to-Image":
        if (modelName === "@cf/lykon/dreamshaper-8-lcm") {
          // 处理 ReadableStream
          const reader = response.getReader();
          const chunks = [];

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }

          // 合并所有的 chunks
          const concatenated = new Uint8Array(
            chunks.reduce((acc, chunk) => acc + chunk.length, 0)
          );

          let offset = 0;
          for (const chunk of chunks) {
            concatenated.set(chunk, offset);
            offset += chunk.length;
          }

          // 转换为 base64
          const base64Image = Buffer.from(concatenated).toString("base64");

          return NextResponse.json({
            type: "image",
            image: `data:image/png;base64,${base64Image}`,
          });
        } else {
          // flux 模型直接返回 base64
          return NextResponse.json({
            type: "image",
            image: `data:image/png;base64,${response.image}`,
          });
        }

      case "Image-to-Text":
      case "Text Generation":
      default:
        return NextResponse.json({
          type: "text",
          response: response.response,
        });
    }
  } catch (error) {
    console.error("Error details:", error);
    console.log("Response type:", typeof response);
    console.log("Response value:", response);

    return NextResponse.json(
      {
        type: "text",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// 构建不同模型的输入格式
function buildPrompt(prompt, modelName, messages = null) {
  if (
    modelName === "@cf/lykon/dreamshaper-8-lcm" ||
    modelName === "@cf/black-forest-labs/flux-1-schnell"
  ) {
    return {
      prompt: prompt,
      height: 768,
      width: 1024,
    };
  }

  // 文本生成模型使用完整对话历史
  return {
    messages: messages || [
      { role: "system", content: "You are a friendly assistant" },
      { role: "user", content: prompt },
    ],
  };
}