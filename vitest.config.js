import { defineConfig } from "vite";
import {
  nodeProject,
  browserHeadlessProject,
  browserHeadedProject
} from "./vitest.projects.ts";

export default defineConfig({
  test: {
    projects: [
      nodeProject, 
      browserHeadlessProject,
      browserHeadedProject
    ]
  }
});
