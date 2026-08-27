"use client";

import { Box, Flex, Text, Icon, VStack } from "@chakra-ui/react";
import { FiGrid, FiBook, FiUsers, FiRefreshCw, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { logoutUsuario } from "../../api";

const VINHO = "#4A0E17";
const VINHO_ATIVO = "#69333C";
const TEXTO = "#F8EEE8";

const NAV_ITEMS = [
  { label: "Dashboard", icon: FiGrid, href: "/inicioAdm" },
  { label: "Livros", icon: FiBook, href: "/catalogoDeLivros" },
  { label: "Usuários", icon: FiUsers, href: "/gestaoUsuarios" },
  { label: "Empréstimos", icon: FiRefreshCw, href: "/gestaoEeR" },
];

function ItemSidebar({ icon, label, ativo, ...props }) {
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
      _hover={{ bg: ativo ? VINHO_ATIVO : "rgba(255,255,255,0.08)" }}
      {...props}
    >
      <Icon as={icon} boxSize={5} />
      <Text fontSize="15px">{label}</Text>
    </Flex>
  );
}

export default function SideBarAdm() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logoutUsuario();
    router.push("/login");
  }

  return (
    <Box w="280px" minH="calc(100vh - 72px)" bg={VINHO} color={TEXTO} px={6} py={8} flexShrink={0}>
      <Flex justify="center" mb={7}>
        <Box as="img" src="/logoLectorHub.png" alt="Logo Lector Hub" w="210px" h="210px" objectFit="contain" />
      </Flex>

      <Box h="1px" bg="rgba(255,255,255,0.18)" mb={6} />

      <VStack align="stretch" gap={2}>
        {NAV_ITEMS.map((item) => (
          <ItemSidebar
            key={item.href}
            as={Link}
            href={item.href}
            icon={item.icon}
            label={item.label}
            ativo={pathname.startsWith(item.href)}
          />
        ))}
      </VStack>

      <Box h="1px" bg="rgba(255,255,255,0.18)" my={6} />

      <ItemSidebar as="button" type="button" w="100%" icon={FiLogOut} label="Sair" ativo={false} onClick={handleLogout} />
    </Box>
  );
}
