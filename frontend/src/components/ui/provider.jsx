"use client";

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { RAIO } from "@/components/tema";

// Arredondamento no nível do tema.
//
// Anotar `borderRadius` botão a botão não resolvia: 46 botões do sistema não
// declaravam raio nenhum e herdavam o padrão do Chakra (6px), enquanto os
// outros usavam o token (10px). Era essa mistura que aparecia como "botões com
// arredondamento diferente".
//
// Redefinir os tokens de raio faz TODO componente do Chakra — Button, Input,
// Select, Textarea, Card, Menu, Dialog, Badge... — nascer com o mesmo canto,
// inclusive os que não passam nada.
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
