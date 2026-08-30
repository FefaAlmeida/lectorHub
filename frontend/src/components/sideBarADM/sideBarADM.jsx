"use client";

import { useState } from "react";
import { Box, Flex, IconButton, Text, Icon, VStack } from "@chakra-ui/react";
import { FiGrid, FiBook, FiTag, FiUsers, FiRefreshCw, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { logoutUsuario } from "../../api";
import { useUsuario } from "@/components/auth/RequireAuth";
import { RAIO } from "@/components/tema";
import { TEXTO_APOIO, TEXTO_MIUDO, TEXTO_MENU } from "@/components/adm/tema";

const VINHO = "#4A0E17";
const VINHO_ATIVO = "#69333C";
const TEXTO = "#F8EEE8";

const NAV_ITEMS = [
  { label: "Dashboard", icon: FiGrid, href: "/inicioAdm" },
  { label: "Livros", icon: FiBook, href: "/catalogoDeLivros" },
  { label: "Categorias", icon: FiTag, href: "/gestaoCategorias" },
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
      borderRadius={RAIO}
      cursor="pointer"
      bg={ativo ? VINHO_ATIVO : "transparent"}
      color={TEXTO}
      fontWeight={ativo ? "600" : "400"}
      transition="all 0.2s ease"
      _hover={{ bg: ativo ? VINHO_ATIVO : "rgba(255,255,255,0.08)" }}
      {...props}
    >
      <Icon as={icon} boxSize={5} />
      <Text fontSize={TEXTO_MENU}>{label}</Text>
    </Flex>
  );
}

export default function SideBarAdm() {
  const usuario = useUsuario();
  const [aberto, setAberto] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logoutUsuario();
    router.push("/login");
  }

  const itens = NAV_ITEMS.map((item) => (
    <ItemSidebar
      key={item.href}
      as={Link}
      href={item.href}
      icon={item.icon}
      label={item.label}
      ativo={pathname.startsWith(item.href)}
      onClick={() => setAberto(false)}
    />
  ));

  const sair = (
    <ItemSidebar as="button" type="button" w="100%" icon={FiLogOut} label="Sair" ativo={false} onClick={handleLogout} />
  );

  const divisoria = <Box h="1px" bg="rgba(255,255,255,0.18)" />;

  // O menu de usuário vivia no cabeçalho da área do cliente, que não aparece
  // mais no painel. Sem isto, o admin não veria com que conta está logado.
  const identidade = usuario && (
    <Flex align="center" gap={3} px={4} py={3}>
      <Flex
        w="34px"
        h="34px"
        borderRadius="full"
        bg="rgba(255,255,255,0.15)"
        align="center"
        justify="center"
        fontWeight="bold"
        fontSize={TEXTO_APOIO}
        flexShrink={0}
      >
        {(usuario.nome || "?").trim()[0]?.toUpperCase()}
      </Flex>

      <Box minW={0}>
        <Text fontSize={TEXTO_APOIO} fontWeight="600" lineClamp={1}>
          {usuario.nome}
        </Text>
        <Text fontSize={TEXTO_MIUDO} opacity={0.7} lineClamp={1}>
          {usuario.email}
        </Text>
      </Box>
    </Flex>
  );

  return (
    <>
      {/* Coluna fixa a partir de lg. O painel tem tabelas largas, então ele
          precisa de mais espaço que a área do cliente antes de empilhar. */}
      <Box
        w="280px"
        minH="100vh"
        bg={VINHO}
        color={TEXTO}
        px={6}
        py={8}
        flexShrink={0}
        display={{ base: "none", lg: "block" }}
      >
        <Flex justify="center" mb={7}>
          <Box as="img" src="/logoLectorHub.png" alt="Logo Lector Hub" w="210px" h="210px" objectFit="contain" />
        </Flex>

        {divisoria}

        <VStack align="stretch" gap={2} mt={6}>
          {itens}
        </VStack>

        <Box h="1px" bg="rgba(255,255,255,0.18)" my={6} />

        {identidade}
        {sair}
      </Box>

      {/* Barra no topo abaixo de lg. Antes a coluna de 280px era fixa em
          qualquer largura e engolia a tela num notebook estreito. */}
      <Box
        display={{ base: "block", lg: "none" }}
        position="sticky"
        top={0}
        zIndex="sticky"
        bg={VINHO}
        color={TEXTO}
        w="100%"
      >
        <Flex align="center" justify="space-between" px={4} py={3}>
          <Flex align="center" gap={3}>
            <Box as="img" src="/logoLectorHub.png" alt="Logo Lector Hub" w="36px" h="36px" objectFit="contain" />
            <Text fontFamily="Georgia, serif" fontWeight="bold">
              Lector Hub
            </Text>
          </Flex>

          <IconButton
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={aberto}
            variant="ghost"
            color={TEXTO}
            _hover={{ bg: "rgba(255,255,255,0.08)" }}
            onClick={() => setAberto((v) => !v)}
          >
            <Icon as={aberto ? FiX : FiMenu} boxSize={5} />
          </IconButton>
        </Flex>

        {aberto && (
          <VStack align="stretch" gap={2} px={4} pb={4}>
            {divisoria}
            {itens}
            {divisoria}
            {identidade}
            {sair}
          </VStack>
        )}
      </Box>
    </>
  );
}
