"use client";

import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import SideBarADM from "@/components/sideBarADM/sideBarADM";

import {
  VINHO,
  BORDA,
  BRANCO,
  FUNDO,
  TEXTO,
  TEXTO_SUAVE,
  FONTE_TITULO,
  TITULO_PAGINA,
  TEXTO_APOIO,
  RAIO_CARTAO,
  PADDING_CARTAO,
  PADDING_PAGINA,
  LARGURA_CONTEUDO,
  GAP_SECAO,
} from "./tema";

// Reexportados porque as páginas já importavam daqui.
export { VINHO, BORDA, TEXTO_SUAVE };

// Moldura comum das páginas do painel: sidebar + título + conteúdo.
export default function Shell({ titulo, subtitulo, acoes, children }) {
  return (
    <Flex minH="100vh" bg={FUNDO} color={TEXTO} w="100%" direction={{ base: "column", lg: "row" }}>
      <SideBarADM />

      <Box flex="1" minW={0} p={PADDING_PAGINA}>
        {/* Conteúdo centralizado: em tela larga a tabela não estica sem fim. */}
        <Stack maxW={LARGURA_CONTEUDO} mx="auto" gap={GAP_SECAO}>
          <Flex justify="space-between" align="flex-end" gap={4} flexWrap="wrap">
            <Stack gap={1}>
              <Heading fontFamily={FONTE_TITULO} fontSize={TITULO_PAGINA} fontWeight="bold" color={VINHO} lineHeight="1.1">
                {titulo}
              </Heading>
              {subtitulo && (
                <Text fontSize={TEXTO_APOIO} color={TEXTO_SUAVE}>
                  {subtitulo}
                </Text>
              )}
            </Stack>
            {acoes}
          </Flex>

          {children}
        </Stack>
      </Box>
    </Flex>
  );
}

// Cartão branco padrão
export function Cartao(props) {
  return (
    <Box
      bg={BRANCO}
      border="1px solid"
      borderColor={BORDA}
      borderRadius={RAIO_CARTAO}
      p={PADDING_CARTAO}
      boxShadow="none"
      {...props}
    />
  );
}

export function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
}
