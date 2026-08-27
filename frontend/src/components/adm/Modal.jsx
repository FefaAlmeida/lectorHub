"use client";

import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { VINHO } from "./Shell";

// Modal simples (overlay + caixa). `rodape` recebe os botões.
export default function Modal({ aberto, titulo, onFechar, rodape, children, largura = "560px" }) {
  if (!aberto) return null;

  return (
    <Flex position="fixed" inset={0} bg="rgba(0,0,0,0.45)" zIndex={1000} align="center" justify="center" p={4} onClick={onFechar}>
      <Box bg="white" borderRadius="2xl" w="100%" maxW={largura} boxShadow="xl" onClick={(e) => e.stopPropagation()}>
        <Flex justify="space-between" align="center" px={6} py={4} borderBottom="1px solid #E8DCC4">
          <Heading size="lg" color={VINHO} fontFamily="serif">
            {titulo}
          </Heading>
          <IconButton aria-label="Fechar" variant="ghost" size="sm" onClick={onFechar}>
            <FiX />
          </IconButton>
        </Flex>

        <Box px={6} py={5} maxH="70vh" overflowY="auto">
          {children}
        </Box>

        {rodape && (
          <Flex justify="flex-end" gap={3} px={6} py={4} borderTop="1px solid #E8DCC4">
            {rodape}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
