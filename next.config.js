import { fileURLToPath } from "url";

import { createJiti } from "jiti";
await createJiti(fileURLToPath(import.meta.url)).import("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  experimental: {
    reactCompiler: true,
  },

  eslint: { ignoreDuringBuilds: true },
};
export default config;
