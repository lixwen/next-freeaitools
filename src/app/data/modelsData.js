const stableDiffusionParams = [
  {
    name: "negative_prompt",
    type: "text",
    label: "Negative Prompt",
    description: "Text describing elements to avoid in the generated image",
    default: "",
  },
  {
    name: "height",
    type: "number",
    label: "Height",
    description: "The height of the generated image in pixels",
    default: 1024,
    min: 256,
    max: 2048,
    step: 8,
  },
  {
    name: "width",
    type: "number",
    label: "Width",
    description: "The width of the generated image in pixels",
    default: 1024,
    min: 256,
    max: 2048,
    step: 8,
  },
  {
    name: "num_steps",
    type: "slider",
    label: "Number of Steps",
    description:
      "The number of diffusion steps; higher values can improve quality but take longer",
    default: 20,
    min: 1,
    max: 20,
    step: 1,
  },
  {
    name: "guidance",
    type: "slider",
    label: "Guidance Scale",
    description:
      "Controls how closely the generated image should adhere to the prompt; higher values make the image more aligned with the prompt",
    default: 7.5,
    min: 1,
    max: 20,
    step: 0.5,
  },
  {
    name: "strength",
    type: "slider",
    label: "Strength",
    description:
      "A value between 0 and 1 indicating how strongly to apply the transformation during img2img tasks; lower values make the output closer to the input image",
    default: 1,
    min: 0,
    max: 1,
    step: 0.05,
  },
  {
    name: "seed",
    type: "number",
    label: "Random Seed",
    description: "Random seed for reproducibility of the image generation",
    default: -1,
    min: -1,
    max: 2147483647,
  },
];

const textModelParams = [
  {
    name: "temperature",
    type: "slider",
    label: "Temperature",
    description:
      "Controls the randomness of the output; higher values produce more random results",
    default: 0.6,
    min: 0,
    max: 5,
    step: 0.1,
  },
  {
    name: "max_tokens",
    type: "number",
    label: "Max Tokens",
    description: "The maximum number of tokens to generate in the response",
    default: 1024,
    min: 1,
    max: 4096,
  },
  {
    name: "top_p",
    type: "slider",
    label: "Top P",
    description:
      "Adjusts the creativity of the AI's responses by controlling how many possible words it considers. Lower values make outputs more predictable; higher values allow for more varied and creative responses",
    default: 1,
    min: 0,
    max: 2,
    step: 0.05,
  },
  {
    name: "top_k",
    type: "number",
    label: "Top K",
    description:
      "Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises",
    default: 40,
    min: 1,
    max: 50,
  },
  {
    name: "repetition_penalty",
    type: "slider",
    label: "Repetition Penalty",
    description:
      "Penalty for repeated tokens; higher values discourage repetition",
    default: 1.1,
    min: 0,
    max: 2,
    step: 0.05,
  },
  {
    name: "frequency_penalty",
    type: "slider",
    label: "Frequency Penalty",
    description:
      "Decreases the likelihood of the model repeating the same lines verbatim",
    default: 0,
    min: 0,
    max: 2,
    step: 0.05,
  },
  {
    name: "presence_penalty",
    type: "slider",
    label: "Presence Penalty",
    description: "Increases the likelihood of the model introducing new topics",
    default: 0,
    min: 0,
    max: 2,
    step: 0.05,
  },
  {
    name: "seed",
    type: "number",
    label: "Random Seed",
    description: "Random seed for reproducibility of the generation",
    default: 1,
    min: 1,
    max: 9999999999,
  },
];

export const models = [
  {
    title: "Text Generation",
    models: [
      {
        id: "@cf/meta/llama-3.1-8b-instruct",
        name: "llama-3.1-8b-instruct",
        params: textModelParams,
      },
      {
        id: "@cf/meta/llama-2-7b-chat-fp16",
        name: "llama-2-7b-chat-fp16",
        params: textModelParams,
      },
      // @cf/meta/llama-3.1-70b-instruct
      {
        id: "@cf/meta/llama-3.1-70b-instruct",
        name: "llama-3.1-70b-instruct",
        params: textModelParams,
      },
      {
        id: "@cf/meta-llama/llama-2-7b-chat-hf-lora",
        name: "llama-2-7b-chat-hf-lora",
        params: textModelParams,
      },
      {
        id: "@hf/thebloke/llama-2-13b-chat-awq",
        name: "llama-2-13b-chat-awq",
        params: textModelParams,
      },
      {
        id: "@cf/tinyllama/tinyllama-1.1b-chat-v1.0",
        name: "tinyllama-1.1b-chat-v1.0",
        params: textModelParams,
      },
      {
        id: "@hf/thebloke/deepseek-coder-6.7b-base-awq",
        name: "deepseek-coder-6.7b-base-awq",
        params: textModelParams,
      },
      {
        id: "@hf/thebloke/deepseek-coder-6.7b-instruct-awq",
        name: "deepseek-coder-6.7b-instruct-awq",
        params: textModelParams,
      },
      {
        id: "@cf/deepseek-ai/deepseek-math-7b-instruct",
        name: "deepseek-math-7b-instruct",
        params: textModelParams,
      },
      {
        id: "@cf/thebloke/discolm-german-7b-v1-awq",
        name: "discolm-german-7b-v1-awq",
        params: textModelParams,
      },

      {
        id: "@cf/qwen/qwen1.5-1.8b-chat",
        name: "qwen1.5-1.8b-chat",
        params: textModelParams,
      },
      {
        id: "@cf/qwen/qwen1.5-14b-chat-awq",
        name: "qwen1.5-14b-chat-awq",
        params: textModelParams,
      },
      {
        id: "@cf/qwen/qwen1.5-7b-chat-awq",
        name: "qwen1.5-7b-chat-awq",
        params: textModelParams,
      },
      {
        id: "@hf/mistral/mistral-7b-instruct-v0.2",
        name: "mistral-7b-instruct-v0.2",
        params: textModelParams,
      },
      {
        id: "@hf/thebloke/zephyr-7b-beta-awq",
        name: "zephyr-7b-beta-awq",
        params: textModelParams,
      },
    ],
  },
  {
    title: "Text-to-Image",
    models: [
      {
        id: "@cf/lykon/dreamshaper-8-lcm",
        name: "dreamshaper-8-lcm",
        params: [
          {
            name: "negative_prompt",
            type: "text",
            label: "Negative Prompt",
            description:
              "Text describing elements to avoid in the generated image",
            default: "",
          },
          {
            name: "height",
            type: "number",
            label: "Height",
            description: "The height of the generated image in pixels",
            default: 1024,
            min: 256,
            max: 2048,
            step: 8,
          },
          {
            name: "width",
            type: "number",
            label: "Width",
            description: "The width of the generated image in pixels",
            default: 1024,
            min: 256,
            max: 2048,
            step: 8,
          },
          {
            name: "num_steps",
            type: "slider",
            label: "Number of Steps",
            description:
              "The number of diffusion steps; higher values can improve quality but take longer",
            default: 20,
            min: 1,
            max: 20,
            step: 1,
          },
          {
            name: "guidance",
            type: "slider",
            label: "Guidance Scale",
            description:
              "Controls how closely the generated image should adhere to the prompt; higher values make the image more aligned with the prompt",
            default: 7.5,
            min: 1,
            max: 20,
            step: 0.5,
          },
          {
            name: "strength",
            type: "slider",
            label: "Strength",
            description:
              "A value between 0 and 1 indicating how strongly to apply the transformation during img2img tasks; lower values make the output closer to the input image",
            default: 1,
            min: 0,
            max: 1,
            step: 0.05,
          },
          {
            name: "seed",
            type: "number",
            label: "Random Seed",
            description:
              "Random seed for reproducibility of the image generation",
            default: -1,
            min: -1,
            max: 2147483647,
          },
        ],
      },
      {
        id: "@cf/black-forest-labs/flux-1-schnell",
        name: "flux-1-schnell",
        params: [
          {
            name: "num_steps",
            type: "number",
            label: "Num Steps",
            description: "The number of steps to generate in the response",
            default: 4,
            min: 1,
            max: 8,
          },
          {
            name: "width",
            type: "number",
            label: "Width",
            description: "The width of the generated image",
            default: 512,
            min: 1,
            max: 1024,
          },
          {
            name: "height",
            type: "number",
            label: "Height",
            description: "The height of the generated image",
            default: 512,
            min: 1,
            max: 1024,
          },
          {
            name: "seed",
            type: "number",
            label: "Random Seed",
            description:
              "Random seed for reproducibility of the image generation",
            default: -1,
            min: -1,
            max: 2147483647,
          },
        ],
      },
      {
        id: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        name: "stable-diffusion-xl-base-1.0",
        params: stableDiffusionParams,
      },
      {
        id: "@cf/bytedance/stable-diffusion-xl-lightning",
        name: "stable-diffusion-xl-lightning",
        params: stableDiffusionParams,
      },
    ],
  },
  {
    title: "Image-to-Text",
    models: [
      {
        id: "@cf/llava-hf/llava-1.5-7b-hf",
        name: "llava-1.5-7b-hf",
        params: [
          {
            name: "max_tokens",
            type: "number",
            label: "Max Tokens",
            description: "The maximum number of tokens to generate in the response",
            default: 512,
            min: 1,
            max: 4096,
          },
          {
            name: "temperature",
            type: "slider",
            label: "Temperature",
            description: "Controls the randomness of the output",
            default: 0.6,
          },
        ],
        visionSupported: true,
      },
      {
        id: "@cf/unum/uform-gen2-qwen-500m",
        name: "uform-gen2-qwen-500m",
        params: [
          {
            name: "max_tokens",
            type: "number",
            label: "Max Tokens",
            description: "The maximum number of tokens to generate in the response",
            default: 512,
            min: 1,
            max: 4096,
          },
        ],
        visionSupported: true,
      },
    ],
  },
];

export function getModelType(modelId) {
  for (const category of models) {
    for (const model of category.models) {
      if (model.id === modelId) {
        return category.title;
      }
    }
  }
  return null;
}
