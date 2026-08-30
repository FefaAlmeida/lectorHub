import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import globals from "globals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // `no-undef` vem desligado no preset do Next (ele assume TypeScript).
    // Como o projeto é JavaScript, sem esta regra um token esquecido no import
    // — RAIO_PEQUENO, por exemplo — passa pelo `next build` e só estoura no
    // navegador, porque a página fica atrás do RequireAuth e nunca é
    // pré-renderizada. Aqui o erro aparece antes.
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-undef": "error",
    },
  },
]);

export default eslintConfig;
