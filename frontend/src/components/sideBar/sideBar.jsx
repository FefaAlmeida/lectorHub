"use client";
import sideBar from "@/components/sideBar/sideBar";
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

import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";

import { logoutUsuario } from "../../api";

const PRIMARY_COLOR = "#4A0E17";
const BORDER_COLOR = "#EFEBE3";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const NAV_ITEMS = [
  {
    label: "Início",
    icon: FiHome,
    href: "/inicio",
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
    label: "Meu Cadastro",
    icon: FiUser,
    href: "/alterar_cadastro",
  },
];

function NavItem({ item, ativo }) {
  return (
    <HStack
      as="a"
      href={item.href}
      spacing={3}
      p={3}
      pl={4}
      borderRadius="6px"
      color={ativo ? "white" : PRIMARY_COLOR}
      bg={ativo ? PRIMARY_COLOR : "transparent"}
      _hover={!ativo ? { bg: "#F5F1E9" } : {}}
      transition={`all 0.2s ${EASE}`}
      cursor="pointer"
      fontWeight={ativo ? "semibold" : "normal"}
    >
      <Icon
        as={item.icon}
        w={5}
        h={5}
      />

      <Text fontSize="md">
        {item.label}
      </Text>
    </HStack>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  async function handleLogout() {
    try {
      await logoutUsuario();
    } finally {
      router.push("/login");
    }
  }

  function verificarAtivo(item) {
    // HISTÓRICO
    if (item.label === "Histórico") {
      return (
        pathname === "/emprestimo_livro" &&
        searchParams.get("aba") === "historico"
      );
    }

    // MEUS EMPRÉSTIMOS
    if (item.label === "Meus Empréstimos") {
      return (
        pathname === "/emprestimo_livro" &&
        searchParams.get("aba") !== "historico"
      );
    }

    // OUTRAS PÁGINAS
    return pathname === item.href;
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
      <VStack
        spacing={3}
        align="stretch"
      >

        {NAV_ITEMS.map((item, index) => (
          <NavItem
            key={index}
            item={item}
            ativo={verificarAtivo(item)}
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