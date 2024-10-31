export const models = [
  // {
  //   title: "Image-to-Text",
  //   models: ["@cf/llava-hf/llava-1.5-7b-hf", "@cf/unum/uform-gen2-qwen-500m"],
  // },
  {
    title: "Text Generation",
    models: [
      "@cf/qwen/qwen1.5-14b-chat-awq",
      "@cf/meta/llama-3.1-8b-instruct",
      "@cf/deepseek-ai/deepseek-math-7b-instruct",
    ],
  },
  {
    title: "Text-to-Image",
    models: [
      "@cf/lykon/dreamshaper-8-lcm",
      "@cf/black-forest-labs/flux-1-schnell",
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
    ],
  },
];

export function getModelType(modelName) {
  for (const category of models) {
    if (category.models.includes(modelName)) {
      return category.title;
    }
  }
  return null;
}
