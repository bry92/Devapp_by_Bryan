declare module "*.jsx" {
  import type { ComponentType } from "react";
  export const componentMap: Record<string, ComponentType<Record<string, unknown>>>;
}

declare module "*.mjs" {
  export function generateProjectFiles(blueprint: unknown): Record<string, string>;
}

declare module "file-saver" {
  export function saveAs(data: Blob, filename?: string): void;
}
