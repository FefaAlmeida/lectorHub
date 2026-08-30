"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { ehRotaAdmin } from "@/components/rotas";

// Páginas de autenticação usam layout de tela cheia — sem footer embaixo.
const ROTAS_SEM_FOOTER = ["/login", "/cadastrar", "/redefinir-senha"];

export default function Footer() {
 const pathname = usePathname();

 // No painel o rodapé institucional também não cabe: ele é a terceira faixa
 // vinho da tela (com a sidebar e o antigo header) e empurra a rolagem.
 if (ROTAS_SEM_FOOTER.includes(pathname) || ehRotaAdmin(pathname)) return null;

 return (
  <Box
   as="footer"
   w="100%"
   bg="#4A0E17"
   color="#e2e0c9"
   px={8}
   py={4}
   mt="auto"
  >
   <Flex
    maxW="1200px"
    mx="auto"
    justify="space-between"
    align="center"
    fontSize="0.85rem"
   >
    <Text as="span">© 2026 Lector Hub</Text>
    <Text as="span">Todos os direitos reservados.</Text>
   </Flex>
  </Box>
 );
}
