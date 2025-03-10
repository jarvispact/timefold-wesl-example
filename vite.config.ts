import { UserConfig } from "vite";
import { linkBuildPlugin } from "wesl-plugin";
import viteWesl from "wesl-plugin/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

// bug in the plugin finding the path, we'll fix this
const thisPath = fileURLToPath(import.meta.url);
const weslToml = path.join(path.dirname(thisPath), "wesl.toml");

const config: UserConfig = {
  plugins: [
    viteWesl({
      weslToml, // should be unnecessary (our bug: https://github.com/wgsl-tooling-wg/wesl-js/issues/148)
      extensions: [linkBuildPlugin],
    }),
  ],
};

export default config;
