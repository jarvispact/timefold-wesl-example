import { UserConfig } from "vite";
import { linkBuildPlugin } from "wesl-plugin";
import viteWesl from "wesl-plugin/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const config: UserConfig = {
  plugins: [
    viteWesl({
      extensions: [linkBuildPlugin],
    }),
  ],
};

export default config;
