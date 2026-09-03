"use client";

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { RAIO } from "@/components/tema";

const config = defineConfig({
  theme: {
    tokens: {
      radii: {
        // Os semânticos que os componentes do Chakra consultam por padrão.
        xs: { value: RAIO },
        sm: { value: RAIO },
        md: { value: RAIO },
        lg: { value: RAIO },
        xl: { value: RAIO },
        "2xl": { value: RAIO },
        "3xl": { value: RAIO },
        "4xl": { value: RAIO },
        // `full` continua redondo: avatar, selo em pílula e ícone circular.
        full: { value: "9999px" },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export function Provider(props) {
 return <ChakraProvider value={system}>{props.children}</ChakraProvider>;
}
