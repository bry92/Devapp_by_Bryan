export const ROADMAP_UPGRADES = [
  {
    id: "full-project-agent",
    title: "Full Project Agent (Multi-File AI Editing)",
    value: "Turn prompt updates into coordinated multi-file edits rather than full project resets.",
    capabilities: [
      "Read and reason over the full project tree",
      "Apply one change plan across multiple files",
      "Refactor existing code and preserve user edits",
    ],
  },
  {
    id: "one-click-deploy",
    title: "Built-In Deployment",
    value: "Ship generated apps to production with one click for instant sharing and growth loops.",
    capabilities: [
      "Deploy to Vercel, Netlify, or Cloudflare Pages",
      "Create a live share URL after generation",
      "Track deployment status and rollback history",
    ],
  },
  {
    id: "backend-data",
    title: "Database + Backend Generator",
    value: "Generate persistent data and API layers so users can build real products, not only mock UIs.",
    capabilities: [
      "Generate API routes and data models from prompts",
      "Provision managed data with Supabase/Firebase",
      "Wire frontend forms directly to generated endpoints",
    ],
  },
  {
    id: "self-repair",
    title: "AI Debugging + Self-Repair",
    value: "Automatically detect, diagnose, and fix common build/runtime failures.",
    capabilities: [
      "Read build/test/runtime errors",
      "Propose and apply safe patch suggestions",
      "Re-run validations until healthy",
    ],
  },
  {
    id: "smart-templates",
    title: "Smart Templates",
    value: "Start from proven template architectures to improve generation quality and success rate.",
    capabilities: [
      "Route prompts to the best-fit template family",
      "Apply prompt-specific customization to structure and copy",
      "Keep generated apps consistent and production-oriented",
    ],
  },
];

export const BONUS_UPGRADE = {
  title: "Bonus: Real-Time AI Coding",
  value:
    "Provide contextual code suggestions while users edit files, including API integrations and refactors.",
};
