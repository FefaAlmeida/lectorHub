"use client";

import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
} from "@chakra-ui/react";

import {
  FiGrid,
  FiBook,
  FiFolder,
  FiUsers,
  FiRefreshCw,
  FiCornerDownLeft,
  FiBookmark,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

import {
  usePathname,
  useRouter,
} from "next/navigation";

const VINHO = "#4A0E17";
const VINHO_ATIVO = "#69333C";
const TEXTO = "#F8EEE8";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: FiGrid,
    href: "/inicioAdm",
  },
  {
    label: "Livros",
    icon: FiBook,
    href: "/catalogoDeLivros",
  },
  
  {
    label: "Usuários",
    icon: FiUsers,
    href: "/gestaoUsuarios",
  },
  {
    label: "Empréstimos",
    icon: FiRefreshCw,
    href: "/gestaoEeR",
  }
];

function ItemSidebar({ item, ativo, onClick }) {
  return (
    <Flex
      align="center"
      gap={4}
      px={4}
      py={3}
      borderRadius="10px"
      cursor="pointer"
      bg={ativo ? VINHO_ATIVO : "transparent"}
      color={TEXTO}
      fontWeight={ativo ? "600" : "400"}
      transition="all 0.2s ease"
      _hover={{
        bg: ativo ? VINHO_ATIVO : "rgba(255,255,255,0.08)",
      }}
      onClick={onClick}
    >
      <Icon
        as={item.icon}
        boxSize={5}
      />

      <Text fontSize="15px">
        {item.label}
      </Text>
    </Flex>
  );
}

export default function SideBarAdm() {
  const pathname = usePathname();
  const router = useRouter();

  function verificarAtivo(item) {
    if (item.label === "Livros") {
      return (
        pathname === "/catalogoDeLivros" ||
        pathname === "/cadastroDeLivros" ||
        pathname === "/editarLivro"
      );
    }

    if (item.label === "Empréstimos") {
      return pathname === "/gestaoEeR";
    }

    return pathname === item.href;
  }

  return (
    <Box
      w="280px"
      minH="calc(100vh - 72px)"
      bg={VINHO}
      color={TEXTO}
      px={6}
      py={8}
      flexShrink={0}
    >

      {/* LOGO */}
      <VStack
        spacing={3}
        mb={7}
      >
        <Flex
          w="70px"
          h="70px"
          border="2px solid"
          borderColor="#F5E7D8"
          borderRadius="50%"
          align="center"
          justify="center"
        >
          <Icon
            as={FiBook}
            boxSize={9}
            color="#F5E7D8"
          />
        </Flex>

        <Box textAlign="center">
          <Text
            fontFamily="Georgia, serif"
            fontSize="17px"
            fontWeight="bold"
            letterSpacing="1.5px"
          >
            LECTOR HUB
          </Text>

          <Text
            fontSize="12px"
            fontWeight="bold"
            color="#D8BDB2"
            letterSpacing="0.5px"
          >
            MINHA BIBLIOTECA
          </Text>
        </Box>
      </VStack>

      {/* LINHA */}
      <Box
        h="1px"
        bg="rgba(255,255,255,0.18)"
        mb={6}
      />

      {/* MENU */}
      <VStack
        align="stretch"
        spacing={2}
      >
        {NAV_ITEMS.map((item) => (
          <ItemSidebar
            key={item.label}
            item={item}
            ativo={verificarAtivo(item)}
            onClick={() => router.push(item.href)}
          />
        ))}
      </VStack>

    </Box>
  );
}