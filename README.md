# timefold-wesl-example
Example on how to use wesl together with timefold

## Repo structure

- `src/main.ts` - Entrypoint. Add Plugins and Systems and start the world.
- `src/world.ts` - Create a single instance of our world.
- `src/render-plugin.ts` - Minimal RenderPlugin implementation
- `src/shader.ts` - Code that is needed to build a shader string
- `src/wesl.ts` - Access to some strings produced by `@timefold/webgpu`

See Code comments in `src/wesl.ts`