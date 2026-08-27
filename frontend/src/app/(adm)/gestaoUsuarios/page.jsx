"use client";

import SideBarAdm from "@/components/sideBarADM/sideBarADM";
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  Input,
  Menu,
} from "@chakra-ui/react";

import {
  FiHome,
  FiBook,
  FiGrid,
  FiUsers,
  FiClock,
  FiRefreshCw,
  FiRepeat,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";

// =====================================================
// CORES
// =====================================================

const PRIMARY = "#4A0E17";
const PRIMARY_DARK = "#360A11";

const BACKGROUND = "#F7F3EE";
const WHITE = "#FFFFFF";

const BORDER = "#E9E1D8";

const TEXT = "#333333";
const TEXT_LIGHT = "#777777";

const GREEN = "#E4F0DF";
const GREEN_TEXT = "#4C7947";

const RED = "#F8E3DE";
const RED_TEXT = "#A84A3F";

// =====================================================
// DADOS APENAS VISUAIS
// =====================================================

const USUARIOS = [
  {
    id: 1,
    nome: "Ana Silva",
    email: "ana.silva@email.com",
    status: "Ativo",
    emprestimos: 2,
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    id: 2,
    nome: "João Lima",
    email: "joao.lima@email.com",
    status: "Ativo",
    emprestimos: 0,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 3,
    nome: "Mariana Souza",
    email: "mariana.souza@email.com",
    status: "Bloqueado",
    emprestimos: 5,
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    id: 4,
    nome: "Pedro Dias",
    email: "pedro.dias@email.com",
    status: "Ativo",
    emprestimos: 1,
    avatar: "https://i.pravatar.cc/100?img=11",
  },
  {
    id: 5,
    nome: "Carla Mendes",
    email: "carla.mendes@email.com",
    status: "Ativo",
    emprestimos: 3,
    avatar: "https://i.pravatar.cc/100?img=44",
  },
];

// =====================================================
// MENU
// =====================================================

const MENU = [
  {
    label: "Dashboard",
    icon: FiHome,
    href: "/adm",
  },
  {
    label: "Livros",
    icon: FiBook,
    href: "/adm/catalogoDeLivros",
  },
  {
    label: "Categorias",
    icon: FiGrid,
    href: "#",
  },
  {
    label: "Usuários",
    icon: FiUsers,
    href: "/adm/gestaoEeR",
    active: true,
  },
  {
    label: "Empréstimos",
    icon: FiClock,
    href: "/adm/gestaoEeR",
  },
  {
    label: "Devoluções",
    icon: FiRefreshCw,
    href: "/adm/gestaoEeR",
  },
  {
    label: "Reservas",
    icon: FiRepeat,
    href: "#",
  },
  {
    label: "Relatórios",
    icon: FiFileText,
    href: "#",
  },
  {
    label: "Configurações",
    icon: FiSettings,
    href: "#",
  },
];

// =====================================================
// ITEM DO MENU
// =====================================================

function MenuItem({ item }) {
  return (
    <HStack
      as="a"
      href={item.href}
      px={3}
      py={3}
      borderRadius="6px"
      gap={3}
      cursor="pointer"
      color={item.active ? WHITE : "rgba(255,255,255,.85)"}
      bg={item.active ? "rgba(54,10,17,.75)" : "transparent"}
      border={
        item.active
          ? "1px solid rgba(255,255,255,.15)"
          : "1px solid transparent"
      }
      transition="all .2s ease"
      _hover={{
        bg: item.active
          ? "rgba(54,10,17,.75)"
          : "rgba(255,255,255,.08)",
      }}
    >
      <Icon as={item.icon} boxSize={4} />

      <Text
        fontSize="12px"
        fontWeight={item.active ? "600" : "400"}
      >
        {item.label}
      </Text>
    </HStack>
  );
}

// =====================================================
// STATUS
// =====================================================

function StatusBadge({ status }) {
  const ativo = status === "Ativo";

  return (
    <Box
      display="inline-flex"
      px={3}
      py="7px"
      borderRadius="6px"
      bg={ativo ? GREEN : RED}
      color={ativo ? GREEN_TEXT : RED_TEXT}
      fontSize="11px"
      fontWeight="500"
    >
      {status}
    </Box>
  );
}

// =====================================================
// AVATAR
// =====================================================

function AvatarUsuario({ usuario }) {
  return (
    <Box
      w="44px"
      h="44px"
      borderRadius="full"
      overflow="hidden"
      bg="#EFE5D9"
      flexShrink={0}
    >
      <Box
        as="img"
        src={usuario.avatar}
        alt={usuario.nome}
        w="100%"
        h="100%"
        objectFit="cover"
      />
    </Box>
  );
}

// =====================================================
// BOTÃO DE AÇÃO
// =====================================================

function BotaoAcao({ icon, danger = false }) {
  return (
    <Button
      minW="40px"
      w="40px"
      h="40px"
      p={0}
      variant="outline"
      borderColor={BORDER}
      borderRadius="7px"
      color={danger ? RED_TEXT : PRIMARY}
      bg={WHITE}
      cursor="pointer"
      _hover={{
        bg: danger ? "#FAEEEE" : "#F8F1F1",
        borderColor: danger ? "#E7C9C4" : "#DCC4C4",
      }}
    >
      <Icon as={icon} boxSize={4.5} />
    </Button>
  );
}

// =====================================================
// DROPDOWN PADRONIZADO
// =====================================================

function FiltroSelect({ label, opcoes }) {
  return (
    <Stack
      gap={1.5}
      w="165px"
    >
      <Text
        fontSize="11px"
        color={TEXT_LIGHT}
      >
        {label}
      </Text>

      <Menu.Root
        positioning={{
          sameWidth: true,
        }}
      >
        <Menu.Trigger asChild>
          <Button
            variant="outline"
            h="50px"
            px={3}
            w="full"
            justifyContent="space-between"
            bg={WHITE}
            color={TEXT}
            border="1px solid"
            borderColor="#E5DDD5"
            borderRadius="8px"
            fontSize="13px"
            fontWeight="400"
            cursor="pointer"
            transition="all .2s ease"
            _hover={{
              borderColor: PRIMARY,
              bg: "#FCF9F6",
            }}
            _focus={{
              borderColor: PRIMARY,
              boxShadow: `0 0 0 1px ${PRIMARY}`,
              outline: "none",
            }}
          >
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {opcoes[0]}
            </Text>

            <Icon
              as={FiChevronDown}
              color={PRIMARY}
              fontSize="16px"
              flexShrink={0}
            />
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content
            bg={WHITE}
            borderRadius="12px"
            border="1px solid"
            borderColor="#E7DED8"
            boxShadow="0 8px 24px rgba(74,14,23,.12)"
            p={2}
            zIndex="popover"
          >
            {opcoes.map((opcao) => (
              <Menu.Item
                key={opcao}
                value={opcao}
                px={3}
                py={2.5}
                borderRadius="8px"
                cursor="pointer"
                color={TEXT}
                fontSize="13px"
                fontWeight="400"
                transition="all .2s ease"
                _hover={{
                  bg: "#F2E6E8",
                  color: PRIMARY,
                }}
              >
                {opcao}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Stack>
  );
}

// =====================================================
// PÁGINA
// =====================================================

export default function GestaoUsuarios() {
  return (
    <Flex
      minH="100vh"
      bg={BACKGROUND}
    >
      {/* =================================================
          LATERAL
      ================================================= */}

      <SideBarAdm />

      {/* =================================================
          CONTEÚDO PRINCIPAL
      ================================================= */}

      <Box
        flex="1"
        minW={0}
        px={{
          base: 5,
          md: 7,
          lg: 9,
          xl: 10,
        }}
        py={{
          base: 6,
          md: 8,
        }}
      >
        <Stack
          gap={6}
          w="100%"
        >
          {/* =================================================
              TÍTULO
          ================================================= */}

          <Stack gap={2}>
            <HStack
              display="inline-flex"
              w="fit-content"
              bg={PRIMARY}
              color={WHITE}
              px={4}
              py="8px"
              borderRadius="20px"
              gap={2}
            >
              <Icon
                as={FiUsers}
                boxSize={4}
              />

              <Text
                fontSize="12px"
                fontWeight="600"
              >
                Gestão de Usuários
              </Text>
            </HStack>

            <Text
              fontFamily="Georgia, serif"
              fontSize={{
                base: "34px",
                md: "42px",
                lg: "46px",
              }}
              color={PRIMARY}
              lineHeight="1.05"
            >
              Gestão de Usuários
            </Text>

            <Text
              fontSize="14px"
              color={TEXT_LIGHT}
            >
              Visualize, pesquise e gerencie os usuários
              cadastrados da biblioteca.
            </Text>
          </Stack>

          {/* =================================================
              FILTROS
          ================================================= */}

          <Card.Root
            bg={WHITE}
            border="1px solid"
            borderColor={BORDER}
            borderRadius="11px"
            boxShadow="0 2px 8px rgba(74,14,23,.04)"
          >
            <Card.Body p={5}>
              <Flex
                gap={5}
                align="end"
                w="100%"
              >
                {/* BUSCA */}

                <Box flex="1">
                  <Box position="relative">
                    <Icon
                      as={FiSearch}
                      position="absolute"
                      left="16px"
                      top="50%"
                      transform="translateY(-50%)"
                      color="#9A8E87"
                      boxSize={5}
                      zIndex={1}
                    />

                    <Input
                      pl="46px"
                      h="50px"
                      fontSize="13px"
                      placeholder="Pesquisar usuário..."
                      borderColor="#E5DDD5"
                      borderRadius="8px"
                      color={TEXT}
                      _placeholder={{
                        color: "#A69C96",
                      }}
                      _focus={{
                        borderColor: PRIMARY,
                        boxShadow: `0 0 0 1px ${PRIMARY}`,
                      }}
                    />
                  </Box>
                </Box>

                {/* STATUS */}

                <FiltroSelect
                  label="Status"
                  opcoes={[
                    "Todos",
                    "Ativo",
                    "Bloqueado",
                  ]}
                />

                {/* PERFIL */}

                <FiltroSelect
                  label="Perfil"
                  opcoes={[
                    "Todos",
                    "Aluno",
                    "Professor",
                  ]}
                />

                {/* NOVO USUÁRIO */}

                <Button
                  h="50px"
                  px={6}
                  bg={PRIMARY}
                  color={WHITE}
                  borderRadius="8px"
                  fontSize="13px"
                  fontWeight="500"
                  cursor="pointer"
                  _hover={{
                    bg: PRIMARY_DARK,
                  }}
                >
                  <Icon
                    as={FiPlus}
                    mr={2}
                    boxSize={4}
                  />

                  Novo Usuário
                </Button>
              </Flex>
            </Card.Body>
          </Card.Root>

          {/* =================================================
              TABELA
          ================================================= */}

          <Card.Root
            bg={WHITE}
            border="1px solid"
            borderColor={BORDER}
            borderRadius="11px"
            overflow="hidden"
            boxShadow="0 2px 8px rgba(74,14,23,.04)"
          >
            {/* CABEÇALHO DA TABELA */}

            <Box
              px={5}
              py={4}
              borderBottom="1px solid"
              borderColor={BORDER}
            >
              <Flex
                align="center"
                justify="space-between"
              >
                <Text
                  fontSize="13px"
                  fontWeight="600"
                  color={TEXT}
                >
                  Usuários cadastrados
                </Text>

                <Text
                  fontSize="11px"
                  color={TEXT_LIGHT}
                >
                  8 usuários
                </Text>
              </Flex>
            </Box>

            {/* TABELA */}

            <Box overflowX="auto">
              <Box
                minW="1050px"
                w="100%"
              >
                {/* CABEÇALHO */}

                <Flex
                  px={5}
                  py={4}
                  bg="#FCFAF7"
                  borderBottom="1px solid"
                  borderColor={BORDER}
                  align="center"
                >
                  <Box w="90px">
                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={TEXT}
                    >
                      Avatar
                    </Text>
                  </Box>

                  <Box
                    flex="1"
                    minW="220px"
                  >
                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={TEXT}
                    >
                      Nome Completo
                    </Text>
                  </Box>

                  <Box
                    flex="1.5"
                    minW="300px"
                  >
                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={TEXT}
                    >
                      Endereço de Email
                    </Text>
                  </Box>

                  <Box w="140px">
                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={TEXT}
                    >
                      Status
                    </Text>
                  </Box>

                  <Box w="190px">
                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={TEXT}
                    >
                      Empréstimos Ativos
                    </Text>
                  </Box>

                  <Box w="110px">
                    <Text
                      fontSize="11px"
                      fontWeight="600"
                      color={TEXT}
                    >
                      Ações
                    </Text>
                  </Box>
                </Flex>

                {/* USUÁRIOS */}

                {USUARIOS.map((usuario) => (
                  <Flex
                    key={usuario.id}
                    px={5}
                    py="14px"
                    minH="76px"
                    align="center"
                    borderBottom="1px solid"
                    borderColor="#F1ECE6"
                    transition="background .2s ease"
                    _hover={{
                      bg: "#FCF9F6",
                    }}
                  >
                    {/* AVATAR */}

                    <Box w="90px">
                      <AvatarUsuario
                        usuario={usuario}
                      />
                    </Box>

                    {/* NOME */}

                    <Box
                      flex="1"
                      minW="220px"
                    >
                      <Text
                        fontSize="13px"
                        fontWeight="500"
                        color={TEXT}
                      >
                        {usuario.nome}
                      </Text>
                    </Box>

                    {/* EMAIL */}

                    <Box
                      flex="1.5"
                      minW="300px"
                    >
                      <Text
                        fontSize="12px"
                        color={TEXT}
                      >
                        {usuario.email}
                      </Text>
                    </Box>

                    {/* STATUS */}

                    <Box w="140px">
                      <StatusBadge
                        status={usuario.status}
                      />
                    </Box>

                    {/* EMPRÉSTIMOS */}

                    <Box w="190px">
                      <Text
                        fontSize="13px"
                        color={TEXT}
                      >
                        {usuario.emprestimos}
                      </Text>
                    </Box>

                    {/* AÇÕES */}

                    <HStack
                      w="110px"
                      gap={2}
                    >
                      <BotaoAcao
                        icon={FiEdit3}
                      />

                      <BotaoAcao
                        icon={FiTrash2}
                        danger
                      />
                    </HStack>
                  </Flex>
                ))}
              </Box>
            </Box>

            {/* =================================================
                PAGINAÇÃO
            ================================================= */}

            <Box
              borderTop="1px solid"
              borderColor={BORDER}
              px={5}
              py={4}
            >
              <Flex
                justify="space-between"
                align="center"
              >
                <Text
                  fontSize="11px"
                  color={TEXT_LIGHT}
                >
                  Mostrando 1-5 de 8 usuários
                </Text>

                <HStack gap={2}>
                  <Button
                    minW="36px"
                    h="36px"
                    p={0}
                    variant="outline"
                    borderColor={BORDER}
                    borderRadius="7px"
                    bg={WHITE}
                  >
                    <Icon
                      as={FiChevronLeft}
                      boxSize={4}
                    />
                  </Button>

                  <Button
                    minW="36px"
                    h="36px"
                    p={0}
                    borderRadius="7px"
                    fontSize="11px"
                    bg={PRIMARY}
                    color={WHITE}
                    border="1px solid"
                    borderColor={PRIMARY}
                  >
                    1
                  </Button>

                  <Button
                    minW="36px"
                    h="36px"
                    p={0}
                    borderRadius="7px"
                    fontSize="11px"
                    bg={WHITE}
                    color={TEXT}
                    border="1px solid"
                    borderColor={BORDER}
                  >
                    2
                  </Button>

                  <Button
                    minW="36px"
                    h="36px"
                    p={0}
                    borderRadius="7px"
                    fontSize="11px"
                    bg={WHITE}
                    color={TEXT}
                    border="1px solid"
                    borderColor={BORDER}
                  >
                    3
                  </Button>

                  <Button
                    minW="36px"
                    h="36px"
                    p={0}
                    borderRadius="7px"
                    fontSize="11px"
                    bg={WHITE}
                    color={TEXT}
                    border="1px solid"
                    borderColor={BORDER}
                  >
                    4
                  </Button>

                  <Button
                    minW="36px"
                    h="36px"
                    p={0}
                    borderRadius="7px"
                    fontSize="11px"
                    bg={WHITE}
                    color={TEXT}
                    border="1px solid"
                    borderColor={BORDER}
                  >
                    5
                  </Button>

                  <Button
                    minW="36px"
                    h="36px"
                    p={0}
                    variant="outline"
                    borderColor={BORDER}
                    borderRadius="7px"
                    bg={WHITE}
                  >
                    <Icon
                      as={FiChevronRight}
                      boxSize={4}
                    />
                  </Button>
                </HStack>
              </Flex>
            </Box>
          </Card.Root>
        </Stack>
      </Box>
    </Flex>
  );
}