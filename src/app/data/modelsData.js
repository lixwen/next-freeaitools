export const models = [
  {
    title: "Text Generation",
    models: [
      "@cf/meta/llama-3.1-8b-instruct",
      "@cf/meta/llama-2-7b-chat-fp16",
      "@cf/meta-llama/llama-2-7b-chat-hf-lora",
      "@hf/thebloke/deepseek-coder-6.7b-base-awq",
      "@hf/thebloke/deepseek-coder-6.7b-instruct-awq",
      "@cf/deepseek-ai/deepseek-math-7b-instruct",
      "@cf/thebloke/discolm-german-7b-v1-awq",
      "@cf/tiiuae/falcon-7b-instruct",
      "@cf/google/gemma-2b-it-lora",
      "@cf/google/gemma-7b-it-lora",
      "@hf/google/gemma-7b-it",
      "@hf/nousresearch/hermes-2-pro-mistral-7b",
      "@hf/thebloke/llama-2-13b-chat-awq",
      "@cf/qwen/qwen1.5-14b-chat-awq",
      "@hf/mistral/mistral-7b-instruct-v0.2",
      "@cf/tinyllama/tinyllama-1.1b-chat-v1.0",
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
