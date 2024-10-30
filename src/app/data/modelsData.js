export const models = [
  {
    title: "Image-to-Text",
    models: ["@cf/llava-hf/llava-1.5-7b-hf", "@cf/unum/uform-gen2-qwen-500m"],
  },
  {
    title: "Text Generation",
    models: [
      "@hf/thebloke/deepseek-coder-6.7b-base-awq",
      "@cf/qwen/qwen1.5-14b-chat-awq",
      "@cf/deepseek-ai/deepseek-math-7b-instruct",
      "@cf/meta/llama-3.1-8b-instruct",
    ],
  },
  {
    title: "Text-to-Image",
    models: [
      "@cf/lykon/dreamshaper-8-lcm",
      "@cf/black-forest-labs/flux-1-schnell",
    ],
  },
];
