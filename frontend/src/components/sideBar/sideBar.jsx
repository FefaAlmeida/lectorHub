"use client";

import { Box, VStack, HStack, Text, Icon, Separator } from "@chakra-ui/react";
import { FiHome, FiSearch, FiBookOpen, FiUser, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { logoutUsuario } from "../../api";

const PRIMARY_COLOR = "#4A0E17";
const BORDER_COLOR = "#EFEBE3";

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
  borderRadius: "6px",
  color: ativo ? "white" : PRIMARY_COLOR,
  bg: ativo ? PRIMARY_COLOR : "transparent",
  _hover: ativo ? {} : { bg: "#F5F1E9" },
  transition: "all 0.2s ease",
  cursor: "pointer",
  fontWeight: ativo ? "semibold" : "normal",
  w: "100%",
});

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logoutUsuario();
    router.push("/login");
  }

  return (
    <Box
      as="nav"
      w="260px"
      bg="#FAF9F6"
      borderRight="1px solid"
      borderColor={BORDER_COLOR}
      p={5}
      flexShrink={0}
      display={{ base: "none", md: "block" }}
    >
      <VStack gap={3} align="stretch">
        {NAV_ITEMS.map((item) => (
          <HStack key={item.href} as={Link} href={item.href} {...estiloItem(pathname.startsWith(item.href))}>
            <Icon as={item.icon} w={5} h={5} />
            <Text fontSize="md">{item.label}</Text>
          </HStack>
        ))}

        <Separator borderColor={BORDER_COLOR} my={4} />

        <HStack as="button" type="button" onClick={handleLogout} {...estiloItem(false)}>
          <Icon as={FiLogOut} w={5} h={5} />
          <Text fontSize="md">Sair</Text>
        </HStack>
      </VStack>
    </Box>
  );
}
