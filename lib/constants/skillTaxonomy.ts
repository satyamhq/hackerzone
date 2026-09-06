/**
 * Canonical skill taxonomy for Hackerzone.
 * Used by Skill Arena, profile builder, job board filters, and matching engine.
 */
export const SKILL_CATEGORIES = [
  {
    name: "Prompt Engineering",
    skills: [
      "Prompt Design",
      "Chain-of-Thought Prompting",
      "Few-Shot Learning",
      "System Prompt Engineering",
      "RAG Pipelines",
    ],
  },
  {
    name: "Machine Learning",
    skills: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Deep Learning",
      "Neural Networks",
      "Transfer Learning",
      "Model Fine-Tuning",
    ],
  },
  {
    name: "Data Science & Analytics",
    skills: [
      "Data Analysis",
      "Statistical Modeling",
      "Data Visualization",
      "Feature Engineering",
      "A/B Testing",
    ],
  },
  {
    name: "Natural Language Processing",
    skills: [
      "Text Classification",
      "Named Entity Recognition",
      "Sentiment Analysis",
      "Language Models",
      "Text Generation",
    ],
  },
  {
    name: "Computer Vision",
    skills: [
      "Image Classification",
      "Object Detection",
      "Image Segmentation",
      "OCR",
      "Video Analysis",
    ],
  },
  {
    name: "AI Engineering",
    skills: [
      "Model Deployment",
      "MLOps",
      "API Integration",
      "Vector Databases",
      "AI Agent Development",
      "LLM Application Development",
    ],
  },
  {
    name: "Data Annotation & Labeling",
    skills: [
      "Text Annotation",
      "Image Labeling",
      "Quality Assurance",
      "Annotation Guidelines",
      "RLHF",
    ],
  },
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]["name"];
