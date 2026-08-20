"use client";

import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Separator,
} from "@chakra-ui/react";

import {
  FiHome,
  FiSearch,
  FiBookOpen,
  FiClock,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useRouter } from "next/navigation";

const PRIMARY_COLOR = "#4A0E17";
const BORDER_COLOR = "#EFEBE3";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const NAV_ITEMS = [
  {
    label: "Início",
    icon: FiHome,
    href: "/inicio",
    active: true,
  },
  {
    label: "Buscar Livros",
    icon: FiSearch,
    href: "/buscar_livro",
  },
  {
    label: "Meus Empréstimos",
    icon: FiBookOpen,
    href: "/emprestimo_livro",
  },
  {
    label: "Histórico",
    icon: FiClock,
    href: "/emprestimo_livro?aba=historico",
  },
  {
    label: "Meu Cadastro",
    icon: FiUser,
    href: "/alterar_cadastro",
  },
];

function NavItem({ item }) {
  return (
    <HStack
      as="a"
      href={item.href}
      spacing={3}
      p={3}
      pl={4}
      borderRadius="6px"
      color={item.active ? "white" : PRIMARY_COLOR}
      bg={item.active ? PRIMARY_COLOR : "transparent"}
      _hover={!item.active ? { bg: "#F5F1E9" } : {}}
      transition={`all 0.2s ${EASE}`}
      cursor="pointer"
      fontWeight={item.active ? "semibold" : "normal"}
    >
      <Icon as={item.icon} w={5} h={5} />

      <Text fontSize="md">
        {item.label}
      </Text>
    </HStack>
  );
}

export default function Sidebar() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutUsuario();
    } finally {
      router.push("/login");
    }
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
      <VStack spacing={3} align="stretch">

        {NAV_ITEMS.map((item, index) => (
          <NavItem
            key={index}
            item={item}
          />
        ))}

        <Separator
          borderColor={BORDER_COLOR}
          my={4}
        />

        <HStack
          as="button"
          spacing={3}
          p={3}
          pl={4}
          borderRadius="6px"
          color={PRIMARY_COLOR}
          _hover={{ bg: "#F5F1E9" }}
          transition={`all 0.2s ${EASE}`}
          cursor="pointer"
          onClick={handleLogout}
        >
          <Icon
            as={FiLogOut}
            w={5}
            h={5}
          />

          <Text fontSize="md">
            Sair
          </Text>
        </HStack>

      </VStack>
    </Box>
  );
}