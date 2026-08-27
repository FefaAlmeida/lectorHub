"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import SideBarADM from "@/components/sideBarADM/sideBarADM";

export const VINHO = "#4A0E17";
export const BORDA = "#E8DCC4";
export const TEXTO_SUAVE = "#6B6B6B";

// Moldura comum das páginas do painel: sidebar + título + conteúdo.
export default function Shell({ titulo, subtitulo, acoes, children }) {
  return (
    <Flex minH="100vh" bg="#FAF7F2" color="#2D2D2D" w="100%">
      <SideBarADM />

      <Box flex="1" p={{ base: 6, md: 10 }} w="100%" minW={0}>
        <Flex justify="space-between" align="flex-start" mb={8} gap={4} flexWrap="wrap">
          <Box>
            <Heading size="3xl" color={VINHO} fontFamily="serif" mb={1}>
              {titulo}
            </Heading>
            {subtitulo && (
              <Text color={TEXTO_SUAVE} fontSize="md">
                {subtitulo}
              </Text>
            )}
          </Box>
          {acoes}
        </Flex>

        {children}
      </Box>
    </Flex>
  );
}

// Cartão branco padrão
export function Cartao(props) {
  return <Box bg="white" border="1px solid" borderColor={BORDA} borderRadius="2xl" p={6} boxShadow="sm" {...props} />;
}

export function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
}
