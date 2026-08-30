"use client";

import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { VINHO, BORDA, BRANCO, FONTE_TITULO, RAIO_MENU, SOMBRA_MENU, PADDING_CARTAO, TITULO_SECAO } from "./tema";

// Modal simples (overlay + caixa). `rodape` recebe os botões.
export default function Modal({ aberto, titulo, onFechar, rodape, children, largura = "560px" }) {
  if (!aberto) return null;

  return (
    <Flex position="fixed" inset={0} bg="rgba(0,0,0,0.45)" zIndex={1000} align="center" justify="center" p={4} onClick={onFechar}>
      <Box bg={BRANCO} borderRadius={RAIO_MENU} w="100%" maxW={largura} boxShadow={SOMBRA_MENU} onClick={(e) => e.stopPropagation()}>
        <Flex justify="space-between" align="center" px={PADDING_CARTAO} py={4} borderBottom="1px solid" borderColor={BORDA}>
          <Heading fontSize={TITULO_SECAO} color={VINHO} fontFamily={FONTE_TITULO}>
            {titulo}
          </Heading>
          <IconButton aria-label="Fechar" variant="ghost" size="sm" onClick={onFechar}>
            <FiX />
          </IconButton>
        </Flex>

        <Box px={PADDING_CARTAO} py={PADDING_CARTAO} maxH="70vh" overflowY="auto">
          {children}
        </Box>

        {rodape && (
          <Flex justify="flex-end" gap={3} px={PADDING_CARTAO} py={4} borderTop="1px solid" borderColor={BORDA}>
            {rodape}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
