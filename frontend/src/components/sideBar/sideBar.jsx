"use client";

import { useState } from "react";
import { Box, Flex, IconButton, VStack, HStack, Text, Icon, Separator } from "@chakra-ui/react";
import { FiHome, FiSearch, FiBookOpen, FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { logoutUsuario } from "../../api";

import {
  PRIMARY_COLOR,
  BORDER_COLOR,
  SIDEBAR_BG,
  HOVER_BG,
  RAIO_PEQUENO,
} from "../cliente/tema";

const NAV_ITEMS = [
  { label: "Início", icon: FiHome, href: "/inicio" },
  { label: "Buscar Livros", icon: FiSearch, href: "/buscar_livro" },
  { label: "Meus Empréstimos", icon: FiBookOpen, href: "/emprestimo_livro" },
  { label: "Meu Cadastro", icon: FiUser, href: "/alterar_cadastro" },
];

const estiloItem = (ativo) => ({
  gap: 3,
  p: 3,
  pl: 4,
  borderRadius: RAIO_PEQUENO,
  color: ativo ? "white" : PRIMARY_COLOR,
  bg: ativo ? PRIMARY_COLOR : "transparent",
  _hover: ativo ? {} : { bg: HOVER_BG },
  transition: "all 0.2s ease",
  cursor: "pointer",
  fontWeight: ativo ? "semibold" : "normal",
  w: "100%",
});

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [aberto, setAberto] = useState(false);

  async function handleLogout() {
    await logoutUsuario();
    router.push("/login");
  }

  const itens = NAV_ITEMS.map((item) => {
    const ativo = pathname.startsWith(item.href);

    return (
      <HStack
        key={item.href}
        as={Link}
        href={item.href}
        onClick={() => setAberto(false)}
        {...estiloItem(ativo)}
      >
        <Icon as={item.icon} w={5} h={5} />
        <Text fontSize="md">{item.label}</Text>
      </HStack>
    );
  });

  const sair = (
    <HStack as="button" type="button" onClick={handleLogout} {...estiloItem(false)}>
      <Icon as={FiLogOut} w={5} h={5} />
      <Text fontSize="md">Sair</Text>
    </HStack>
  );

  return (
    <>
      {/* Coluna fixa a partir de md */}
      <Box
        as="nav"
        w="260px"
        bg={SIDEBAR_BG}
        borderRight="1px solid"
        borderColor={BORDER_COLOR}
        p={5}
        flexShrink={0}
        display={{ base: "none", md: "block" }}
      >
        <VStack gap={3} align="stretch">
          {itens}
          <Separator borderColor={BORDER_COLOR} my={4} />
          {sair}
        </VStack>
      </Box>

      {/* Abaixo de md a coluna não cabe. Antes ela simplesmente sumia e a
          área do cliente ficava sem navegação nenhuma no celular; agora vira
          uma barra no topo com menu recolhível. */}
      <Box
        as="nav"
        display={{ base: "block", md: "none" }}
        position="sticky"
        top={0}
        zIndex="sticky"
        bg={SIDEBAR_BG}
        borderBottom="1px solid"
        borderColor={BORDER_COLOR}
        w="100%"
      >
        <Flex align="center" justify="space-between" px={4} py={3}>
          <Text fontFamily="Georgia, serif" fontWeight="bold" color={PRIMARY_COLOR}>
            Lector Hub
          </Text>

          <IconButton
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            variant="ghost"
            color={PRIMARY_COLOR}
            onClick={() => setAberto((v) => !v)}
          >
            <Icon as={aberto ? FiX : FiMenu} w={5} h={5} />
          </IconButton>
        </Flex>

        {aberto && (
          <VStack gap={2} align="stretch" px={4} pb={4} borderTop="1px solid" borderColor={BORDER_COLOR} pt={3}>
            {itens}
            <Separator borderColor={BORDER_COLOR} my={2} />
            {sair}
          </VStack>
        )}
      </Box>
    </>
  );
}
