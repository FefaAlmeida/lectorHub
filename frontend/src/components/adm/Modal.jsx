"use client";

import { Box, Flex, Heading, Icon, IconButton, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { VINHO, BORDA, BRANCO, FUNDO, FONTE_TITULO, RAIO_MENU, SOMBRA_MENU, PADDING_CARTAO, TITULO_SECAO, TEXTO_APOIO } from "./tema";

// Modal (overlay + caixa). `rodape` recebe os botões.
//
// O cabeçalho é vinho sólido: a caixa era branca do topo ao rodapé, com uma
// linha fina separando o título, e sumia contra o fundo claro da página.
// `descricao` diz o que a ação faz — antes só havia o título.
export default function Modal({ aberto, titulo, descricao, icone, onFechar, rodape, children, largura = "560px" }) {
  if (!aberto) return null;

  return (
    <Flex position="fixed" inset={0} bg="rgba(0,0,0,0.45)" zIndex={1000} align="center" justify="center" p={4} onClick={onFechar}>
      <Box bg={BRANCO} borderRadius={RAIO_MENU} overflow="hidden" w="100%" maxW={largura} boxShadow={SOMBRA_MENU} onClick={(e) => e.stopPropagation()}>
        <Flex
          justify="space-between"
          align="flex-start"
          gap={4}
          px={PADDING_CARTAO}
          py={5}
          bg={VINHO}
          color={BRANCO}
        >
          <Flex gap={3} align="flex-start" minW={0}>
            {icone && (
              <Flex
                w="40px"
                h="40px"
                borderRadius="full"
                bg="rgba(255,255,255,0.15)"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <Icon as={icone} boxSize={5} />
              </Flex>
            )}

            <Box minW={0}>
              <Heading fontSize={TITULO_SECAO} fontFamily={FONTE_TITULO} lineHeight="1.2">
                {titulo}
              </Heading>
              {descricao && (
                <Text fontSize={TEXTO_APOIO} opacity={0.85} mt={1}>
                  {descricao}
                </Text>
              )}
            </Box>
          </Flex>

          <IconButton
            aria-label="Fechar"
            variant="ghost"
            size="sm"
            color={BRANCO}
            flexShrink={0}
            _hover={{ bg: "rgba(255,255,255,0.15)" }}
            onClick={onFechar}
          >
            <FiX />
          </IconButton>
        </Flex>

        <Box px={PADDING_CARTAO} py={PADDING_CARTAO} maxH="70vh" overflowY="auto">
          {children}
        </Box>

        {rodape && (
          <Flex justify="flex-end" gap={3} px={PADDING_CARTAO} py={4} bg={FUNDO} borderTop="1px solid" borderColor={BORDA}>
            {rodape}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
