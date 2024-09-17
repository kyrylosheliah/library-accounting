import {
  defineConfig,
  presetIcons,
  presetWind,
  transformerCompileClass,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  presets: [presetIcons(), presetWind()],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        "src/**/*.{js,ts}",
      ],
      // exclude files
      // exclude: []
    },
  },
  transformers: [transformerDirectives(), transformerCompileClass()],
});
