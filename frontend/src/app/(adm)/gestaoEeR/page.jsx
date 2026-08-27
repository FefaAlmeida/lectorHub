"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
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
  FiBookOpen,
  FiCheckCircle,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiX,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";
import SideBarAdm from "@/components/sideBarADM/sideBarADM";

// ============================================================
// CORES
// ============================================================

const PRIMARY = "#4A0E17";
const PRIMARY_DARK = "#360A11";

const BACKGROUND = "#F5F2EE";
const WHITE = "#FFFFFF";

const BORDER = "#EDE7E0";

const TEXT = "#333333";
const TEXT_LIGHT = "#777777";

// ============================================================
// OPÇÕES DOS FILTROS
// ============================================================

const OPCOES_RESERVAS = [
  { label: "Todos", valor: "Todos" },
  { label: "Pendentes", valor: "Pendente" },
  { label: "Aguardando", valor: "Aguardando" },
  { label: "Aprovados", valor: "Aprovado" },
  { label: "Recusados", valor: "Recusado" },
];

const OPCOES_EMPRESTIMOS = [
  { label: "Todos", valor: "Todos" },
  { label: "No prazo", valor: "No prazo" },
  { label: "Atrasado", valor: "Atrasado" },
];

const OPCOES_DEVOLUCOES = [
  { label: "Todos", valor: "Todos" },
  { label: "Em dia", valor: "Em dia" },
  { label: "Atrasado", valor: "Atrasado" },
];

// ============================================================
// RESERVAS
// ============================================================

const RESERVAS_INICIAIS = [
  {
    id: 1,
    livro: "1984",
    autor: "George Orwell",
    usuario: "Maria Clara",
    email: "maria.clara@email.com",
    iniciais: "MC",
    data: "13/05/2025 10:30",
    status: "Pendente",
    capa: "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
  },

  {
    id: 2,
    livro: "Dom Casmurro",
    autor: "Machado de Assis",
    usuario: "João Pedro",
    email: "joao.pedro@email.com",
    iniciais: "JP",
    data: "13/05/2025 09:15",
    status: "Pendente",
    capa: "https://covers.openlibrary.org/b/isbn/9788535902778-M.jpg",
  },

  {
    id: 3,
    livro: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    usuario: "Larissa Souza",
    email: "larissa.souza@email.com",
    iniciais: "LS",
    data: "12/05/2025 16:45",
    status: "Aguardando",
    capa: "https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg",
  },

  {
    id: 4,
    livro: "A Menina que Roubava Livros",
    autor: "Markus Zusak",
    usuario: "Rafael Vieira",
    email: "rafael.vieira@email.com",
    iniciais: "RV",
    data: "12/05/2025 14:20",
    status: "Pendente",
    capa: "https://covers.openlibrary.org/b/isbn/9780375842207-M.jpg",
  },
];

// ============================================================
// EMPRÉSTIMOS
// ============================================================

const EMPRESTIMOS_INICIAIS = [
  {
    id: 1187,
    codigo: "#EMP1187",
    usuario: "Maria Clara",
    email: "maria.clara@email.com",
    telefone: "(11) 98765-4321",
    iniciais: "MC",
    livro: "O Hobbit",
    autor: "J.R.R. Tolkien",
    capa: "https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg",
    dataEmprestimo: "06/05/2025",
    devolucao: "20/05/2025",
    dias: 7,
    status: "No prazo",
  },

  {
    id: 1186,
    codigo: "#EMP1186",
    usuario: "João Pedro",
    email: "joao.pedro@email.com",
    telefone: "(11) 97654-3210",
    iniciais: "JP",
    livro: "A Culpa é das Estrelas",
    autor: "John Green",
    capa: "https://covers.openlibrary.org/b/isbn/9780525428028-M.jpg",
    dataEmprestimo: "07/05/2025",
    devolucao: "21/05/2025",
    dias: 8,
    status: "No prazo",
  },

  {
    id: 1185,
    codigo: "#EMP1185",
    usuario: "Larissa Souza",
    email: "larissa.souza@email.com",
    telefone: "(11) 98888-1111",
    iniciais: "LS",
    livro: "Orgulho e Preconceito",
    autor: "Jane Austen",
    capa: "https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg",
    dataEmprestimo: "05/05/2025",
    devolucao: "19/05/2025",
    dias: 6,
    status: "No prazo",
  },

  {
    id: 1184,
    codigo: "#EMP1184",
    usuario: "Rafael Vieira",
    email: "rafael.vieira@email.com",
    telefone: "(11) 99999-2222",
    iniciais: "RV",
    livro: "1984",
    autor: "George Orwell",
    capa: "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
    dataEmprestimo: "04/05/2025",
    devolucao: "11/05/2025",
    dias: -2,
    status: "Atrasado",
  },

  {
    id: 1183,
    codigo: "#EMP1183",
    usuario: "Ana Martins",
    email: "ana.martins@email.com",
    telefone: "(11) 95555-3333",
    iniciais: "AM",
    livro: "Ensaio sobre a Cegueira",
    autor: "José Saramago",
    capa: "https://covers.openlibrary.org/b/isbn/9780156007757-M.jpg",
    dataEmprestimo: "08/05/2025",
    devolucao: "12/05/2025",
    dias: -1,
    status: "Atrasado",
  },
];

// ============================================================
// DEVOLUÇÕES
// ============================================================

const DEVOLUCOES_INICIAIS = [
  {
    id: 1,
    usuario: "Maria Clara",
    email: "maria.clara@email.com",
    iniciais: "MC",
    livro: "1984",
    autor: "George Orwell",
    capa: "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
    dataEmprestimo: "13/05/2025",
    prazo: "20/05/2025",
    diasAtraso: 0,
    status: "Em dia",
  },

  {
    id: 2,
    usuario: "João Pedro",
    email: "joao.pedro@email.com",
    iniciais: "JP",
    livro: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    capa: "https://covers.openlibrary.org/b/isbn/9780156012195-M.jpg",
    dataEmprestimo: "12/05/2025",
    prazo: "19/05/2025",
    diasAtraso: 1,
    status: "Atrasado",
  },

  {
    id: 3,
    usuario: "Larissa Souza",
    email: "larissa.souza@email.com",
    iniciais: "LS",
    livro: "A Culpa é das Estrelas",
    autor: "John Green",
    capa: "https://covers.openlibrary.org/b/isbn/9780525428028-M.jpg",
    dataEmprestimo: "10/05/2025",
    prazo: "17/05/2025",
    diasAtraso: 3,
    status: "Atrasado",
  },

  {
    id: 4,
    usuario: "Rafael Vieira",
    email: "rafael.vieira@email.com",
    iniciais: "RV",
    livro: "O Hobbit",
    autor: "J.R.R. Tolkien",
    capa: "https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg",
    dataEmprestimo: "08/05/2025",
    prazo: "15/05/2025",
    diasAtraso: 5,
    status: "Atrasado",
  },

  {
    id: 5,
    usuario: "Ana Martins",
    email: "ana.martins@email.com",
    iniciais: "AM",
    livro: "Orgulho e Preconceito",
    autor: "Jane Austen",
    capa: "https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg",
    dataEmprestimo: "13/05/2025",
    prazo: "20/05/2025",
    diasAtraso: 0,
    status: "Em dia",
  },
];

// ============================================================
// MENU
// ============================================================

const MENU = [
  {
    label: "Início",
    icon: FiHome,
  },

  {
    label: "Livros",
    icon: FiBook,
  },

  {
    label: "Categorias",
    icon: FiGrid,
  },

  {
    label: "Usuários",
    icon: FiUsers,
  },

  {
    label: "Empréstimos e Reservas",
    icon: FiClock,
    active: true,
  },

  {
    label: "Devoluções",
    icon: FiRefreshCw,
  },

  {
    label: "Reservas",
    icon: FiRepeat,
  },

  {
    label: "Relatórios",
    icon: FiFileText,
  },

  {
    label: "Configurações",
    icon: FiSettings,
  },
];

// ============================================================
// ITEM MENU
// ============================================================

function MenuItem({ item }) {
  return (
    <HStack
      px={3}
      py={3}
      borderRadius="5px"
      bg={
        item.active
          ? PRIMARY_DARK
          : "transparent"
      }
      color={
        item.active
          ? WHITE
          : "rgba(255,255,255,.85)"
      }
      cursor="pointer"
      gap={3}
      transition="all .2s ease"
      _hover={{
        bg: item.active
          ? PRIMARY_DARK
          : "rgba(255,255,255,.08)",
      }}
    >
      <Icon
        as={item.icon}
        boxSize={4}
      />

      <Text
        fontSize="12px"
        fontWeight={
          item.active
            ? "600"
            : "400"
        }
      >
        {item.label}
      </Text>
    </HStack>
  );
}

// ============================================================
// STATUS
// ============================================================

function StatusBadge({ status }) {
  let background = "#F7EED8";
  let color = "#9A691C";

  if (
    status === "Aguardando"
  ) {
    background = "#E7EEF7";
    color = "#5276A8";
  }

  if (
    status === "Aprovado" ||
    status === "Em dia" ||
    status === "No prazo"
  ) {
    background = "#E5F2E8";
    color = "#347A45";
  }

  if (
    status === "Atrasado" ||
    status === "Recusado"
  ) {
    background = "#F9E2E2";
    color = "#A43D3D";
  }

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      px={3}
      py={1.5}
      borderRadius="5px"
      bg={background}
      color={color}
      fontSize="9px"
      fontWeight="600"
      whiteSpace="nowrap"
    >
      {status}
    </Box>
  );
}

// ============================================================
// INDICADOR
// ============================================================

function Indicador({
  icon,
  titulo,
  valor,
}) {
  return (
    <Card.Root
      bg={WHITE}
      border="1px solid"
      borderColor={BORDER}
      borderRadius="8px"
      boxShadow="none"
    >
      <Card.Body p={4}>
        <HStack gap={4}>
          <Box
            w="42px"
            h="42px"
            flexShrink={0}
            borderRadius="full"
            bg={PRIMARY}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              as={icon}
              color={WHITE}
              boxSize={5}
            />
          </Box>

          <Stack gap={0}>
            <Text
              fontSize="10px"
              color={TEXT_LIGHT}
            >
              {titulo}
            </Text>

            <Text
              fontSize="19px"
              fontWeight="700"
              color={TEXT}
            >
              {valor}
            </Text>
          </Stack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

// ============================================================
// HEADER TABELA
// ============================================================

function TabelaHeader({ tipo }) {
  if (
    tipo === "emprestimos"
  ) {
    return (
      <Grid
        templateColumns="0.9fr 1.6fr 1.7fr 1.15fr 1.25fr 0.85fr 1.35fr"
        gap={4}
        px={5}
        py={4}
        bg="#FAF8F5"
        borderBottom="1px solid"
        borderColor={BORDER}
        alignItems="center"
      >
        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          EMPRÉSTIMO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          USUÁRIO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          LIVRO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          DATA DE EMPRÉSTIMO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          DEVOLUÇÃO PREVISTA
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          STATUS
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          AÇÕES
        </Text>
      </Grid>
    );
  }

  if (
    tipo === "devolucoes"
  ) {
    return (
      <Grid
        templateColumns="1.6fr 1.8fr 1.25fr 1.25fr 0.75fr 0.9fr 1.7fr"
        gap={4}
        px={5}
        py={4}
        bg="#FAF8F5"
        borderBottom="1px solid"
        borderColor={BORDER}
        alignItems="center"
      >
        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          USUÁRIO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          LIVRO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          DATA DE
          <br />
          EMPRÉSTIMO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          PRAZO PARA
          <br />
          DEVOLUÇÃO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          DIAS
          <br />
          ATRASO
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          STATUS
        </Text>

        <Text
          fontSize="9px"
          fontWeight="700"
          color={TEXT_LIGHT}
        >
          AÇÕES
        </Text>
      </Grid>
    );
  }

  return (
    <Grid
      templateColumns="2.2fr 1.8fr 1.5fr 1fr 1.6fr"
      gap={5}
      px={5}
      py={4}
      bg="#FAF8F5"
      borderBottom="1px solid"
      borderColor={BORDER}
      alignItems="center"
    >
      <Text
        fontSize="9px"
        fontWeight="700"
        color={TEXT_LIGHT}
      >
        LIVRO
      </Text>

      <Text
        fontSize="9px"
        fontWeight="700"
        color={TEXT_LIGHT}
      >
        USUÁRIO
      </Text>

      <Text
        fontSize="9px"
        fontWeight="700"
        color={TEXT_LIGHT}
      >
        DATA DA SOLICITAÇÃO
      </Text>

      <Text
        fontSize="9px"
        fontWeight="700"
        color={TEXT_LIGHT}
      >
        STATUS
      </Text>

      <Text
        fontSize="9px"
        fontWeight="700"
        color={TEXT_LIGHT}
      >
        AÇÕES
      </Text>
    </Grid>
  );
}

// ============================================================
// LINHA RESERVA
// ============================================================

function ReservaRow({
  reserva,
  onAprovar,
  onRecusar,
}) {
  return (
    <Grid
      templateColumns="2.2fr 1.8fr 1.5fr 1fr 1.6fr"
      gap={5}
      px={5}
      py={5}
      minH="105px"
      alignItems="center"
      borderBottom="1px solid"
      borderColor={BORDER}
      _hover={{
        bg: "#FCFAF8",
      }}
    >
      <HStack gap={3}>
        <Box
          w="48px"
          h="62px"
          flexShrink={0}
          borderRadius="5px"
          overflow="hidden"
          bg="#F1EDE7"
        >
          <Box
            as="img"
            src={reserva.capa}
            alt={reserva.livro}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>

        <Stack gap={1}>
          <Text
            fontSize="14px"
            fontWeight="600"
            color={TEXT}
          >
            {reserva.livro}
          </Text>

          <Text
            fontSize="10px"
            color={TEXT_LIGHT}
          >
            {reserva.autor}
          </Text>
        </Stack>
      </HStack>

      <HStack gap={3}>
        <Box
          w="34px"
          h="34px"
          borderRadius="full"
          bg="#F3E8E4"
          color={PRIMARY}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          fontSize="9px"
          fontWeight="700"
        >
          {reserva.iniciais}
        </Box>

        <Stack gap={0.5}>
          <Text
            fontSize="11px"
            fontWeight="600"
            color={TEXT}
          >
            {reserva.usuario}
          </Text>

          <Text
            fontSize="9px"
            color={TEXT_LIGHT}
          >
            {reserva.email}
          </Text>
        </Stack>
      </HStack>

      <Text
        fontSize="10px"
        color={TEXT}
      >
        {reserva.data}
      </Text>

      <StatusBadge
        status={reserva.status}
      />

      <HStack gap={2}>
        <Button
          h="32px"
          px={3}
          fontSize="9px"
          variant="outline"
          borderColor="#A8CDB6"
          color="#347A45"
          onClick={() =>
            onAprovar(reserva.id)
          }
        >
          <Icon
            as={FiCheckCircle}
            mr={1.5}
            boxSize={3}
          />
          Aprovar
        </Button>

        <Button
          h="32px"
          px={3}
          fontSize="9px"
          variant="outline"
          borderColor="#E8B5B5"
          color="#A43D3D"
          onClick={() =>
            onRecusar(reserva.id)
          }
        >
          <Icon
            as={FiX}
            mr={1.5}
            boxSize={3}
          />
          Recusar
        </Button>
      </HStack>
    </Grid>
  );
}

// ============================================================
// LINHA EMPRÉSTIMO
// ============================================================

function EmprestimoRow({
  emprestimo,
}) {
  return (
    <Grid
      templateColumns="0.9fr 1.6fr 1.7fr 1.15fr 1.25fr 0.85fr 1.35fr"
      gap={4}
      px={5}
      py={4}
      minH="92px"
      alignItems="center"
      borderBottom="1px solid"
      borderColor={BORDER}
      _hover={{
        bg: "#FCFAF8",
      }}
    >
      {/* CÓDIGO */}

      <Text
        fontSize="9px"
        fontWeight="600"
        color={TEXT}
      >
        {emprestimo.codigo}
      </Text>

      {/* USUÁRIO */}

      <HStack gap={2.5}>
        <Box
          w="32px"
          h="32px"
          flexShrink={0}
          borderRadius="full"
          bg="#F4E7E3"
          color={PRIMARY}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="9px"
          fontWeight="700"
        >
          {emprestimo.iniciais}
        </Box>

        <Stack
          gap={0.5}
          minW={0}
        >
          <Text
            fontSize="10px"
            fontWeight="600"
            color={TEXT}
            whiteSpace="nowrap"
          >
            {emprestimo.usuario}
          </Text>

          <Text
            fontSize="8px"
            color={TEXT_LIGHT}
            whiteSpace="nowrap"
          >
            {emprestimo.email}
          </Text>

          <Text
            fontSize="8px"
            color={TEXT_LIGHT}
          >
            Tel: {emprestimo.telefone}
          </Text>
        </Stack>
      </HStack>

      {/* LIVRO */}

      <HStack gap={3}>
        <Box
          w="30px"
          h="42px"
          flexShrink={0}
          borderRadius="3px"
          overflow="hidden"
        >
          <Box
            as="img"
            src={emprestimo.capa}
            alt={emprestimo.livro}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>

        <Stack gap={0.5}>
          <Text
            fontSize="10px"
            fontWeight="600"
            color={TEXT}
            lineHeight="1.2"
          >
            {emprestimo.livro}
          </Text>

          <Text
            fontSize="8px"
            color={TEXT_LIGHT}
          >
            {emprestimo.autor}
          </Text>
        </Stack>
      </HStack>

      {/* DATA */}

      <Text
        fontSize="9px"
        color={TEXT}
      >
        {emprestimo.dataEmprestimo}
      </Text>

      {/* DEVOLUÇÃO */}

      <Stack gap={0.5}>
        <Text
          fontSize="9px"
          color={TEXT}
        >
          {emprestimo.devolucao}
        </Text>

        {emprestimo.dias >= 0 ? (
          <Text
            fontSize="8px"
            color="#3D8950"
            fontWeight="600"
          >
            Em {emprestimo.dias} dias
          </Text>
        ) : (
          <Text
            fontSize="8px"
            color="#C83D3D"
            fontWeight="600"
          >
            Há{" "}
            {Math.abs(
              emprestimo.dias
            )}{" "}
            dias
          </Text>
        )}
      </Stack>

      {/* STATUS */}

      <StatusBadge
        status={emprestimo.status}
      />

      {/* AÇÕES */}

      <HStack gap={2}>
        <Button
          h="30px"
          px={3}
          fontSize="8px"
          fontWeight="600"
          variant="outline"
          borderColor="#D8B5B5"
          color={PRIMARY}
          borderRadius="4px"
          whiteSpace="nowrap"
        >
          <Icon
            as={FiRefreshCw}
            boxSize={3}
            mr={1.5}
          />

          Registrar saída
        </Button>

        <Button
          h="30px"
          w="30px"
          minW="30px"
          p={0}
          variant="outline"
          borderColor="#BFD5D7"
          color="#426D72"
          borderRadius="4px"
        >
          <Icon
            as={FiEye}
            boxSize={3.5}
          />
        </Button>
      </HStack>
    </Grid>
  );
}

// ============================================================
// LINHA DEVOLUÇÃO
// ============================================================

function DevolucaoRow({
  devolucao,
  onEstenderPrazo,
}) {
  return (
    <Grid
      templateColumns="1.6fr 1.8fr 1.25fr 1.25fr 0.75fr 0.9fr 1.7fr"
      gap={4}
      px={5}
      py={4}
      minH="82px"
      alignItems="center"
      borderBottom="1px solid"
      borderColor={BORDER}
      _hover={{
        bg: "#FCFAF8",
      }}
    >
      {/* USUÁRIO */}

      <HStack gap={2.5}>
        <Box
          w="32px"
          h="32px"
          flexShrink={0}
          borderRadius="full"
          bg="#F4E7E3"
          color={PRIMARY}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="9px"
          fontWeight="700"
        >
          {devolucao.iniciais}
        </Box>

        <Stack gap={0.5}>
          <Text
            fontSize="10px"
            fontWeight="600"
            color={TEXT}
          >
            {devolucao.usuario}
          </Text>

          <Text
            fontSize="8px"
            color={TEXT_LIGHT}
          >
            {devolucao.email}
          </Text>
        </Stack>
      </HStack>

      {/* LIVRO */}

      <HStack gap={3}>
        <Box
          w="30px"
          h="42px"
          flexShrink={0}
          borderRadius="3px"
          overflow="hidden"
        >
          <Box
            as="img"
            src={devolucao.capa}
            alt={devolucao.livro}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>

        <Stack gap={0.5}>
          <Text
            fontSize="10px"
            fontWeight="600"
            color={TEXT}
            lineHeight="1.2"
          >
            {devolucao.livro}
          </Text>

          <Text
            fontSize="8px"
            color={TEXT_LIGHT}
          >
            {devolucao.autor}
          </Text>
        </Stack>
      </HStack>

      {/* DATA */}

      <Text
        fontSize="9px"
        color={TEXT}
      >
        {devolucao.dataEmprestimo}
      </Text>

      {/* PRAZO */}

      <Text
        fontSize="9px"
        color={TEXT}
      >
        {devolucao.prazo}
      </Text>

      {/* DIAS */}

      <Text
        fontSize="10px"
        fontWeight="600"
        color={
          devolucao.diasAtraso > 0
            ? "#C83D3D"
            : TEXT
        }
      >
        {devolucao.diasAtraso}
      </Text>

      {/* STATUS */}

      <StatusBadge
        status={devolucao.status}
      />

      {/* AÇÕES */}

      <HStack gap={2}>
        <Button
          h="31px"
          px={3}
          fontSize="8px"
          fontWeight="600"
          bg={PRIMARY}
          color={WHITE}
          borderRadius="4px"
          whiteSpace="nowrap"
          onClick={() => onEstenderPrazo(devolucao)}
          _hover={{
            bg: PRIMARY_DARK,
          }}
        >
          <Icon
            as={FiCalendar}
            boxSize={3}
            mr={1.5}
          />

          Estender prazo
        </Button>

        <Button
          h="31px"
          px={3}
          fontSize="8px"
          fontWeight="600"
          bg={PRIMARY}
          color={WHITE}
          borderRadius="4px"
          whiteSpace="nowrap"
          _hover={{
            bg: PRIMARY_DARK,
          }}
        >
          <Icon
            as={FiCheckCircle}
            boxSize={3}
            mr={1.5}
          />

          Confirmar devolução
        </Button>
      </HStack>
    </Grid>
  );
}


// ============================================================
// MODAL ESTENDER PRAZO
// Visual baseado exatamente no modelo enviado
// ============================================================

function dataBrParaIso(data) {
  if (!data) return "";

  const partes = data.split("/");

  if (partes.length !== 3) {
    return "";
  }

  const [dia, mes, ano] = partes;

  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function dataIsoParaBr(data) {
  if (!data) return "";

  const partes = data.split("-");

  if (partes.length !== 3) {
    return data;
  }

  const [ano, mes, dia] = partes;

  return `${dia}/${mes}/${ano}`;
}

function ModalEstenderPrazo({
  aberto,
  devolucao,
  onFechar,
  onSalvar,
}) {
  const [novoPrazo, setNovoPrazo] = useState(
    devolucao ? dataBrParaIso(devolucao.prazo) : ""
  );

  const [observacao, setObservacao] = useState("");

  if (!aberto || !devolucao) {
    return null;
  }

  const prazoAtualIso = dataBrParaIso(devolucao.prazo);

  let diasAdicionados = 0;

  if (prazoAtualIso && novoPrazo) {
    const atual = new Date(`${prazoAtualIso}T00:00:00`);
    const novo = new Date(`${novoPrazo}T00:00:00`);

    diasAdicionados = Math.round(
      (novo.getTime() - atual.getTime()) / 86400000
    );
  }

  function salvar() {
    if (!novoPrazo) {
      alert("Selecione o novo prazo de devolução.");
      return;
    }

    if (prazoAtualIso && novoPrazo <= prazoAtualIso) {
      alert("O novo prazo precisa ser posterior ao prazo atual.");
      return;
    }

    onSalvar({
      novoPrazo: dataIsoParaBr(novoPrazo),
      observacao: observacao.trim(),
      diasAdicionados,
    });
  }

  return (
    <Flex
      position="fixed"
      inset={0}
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      bg="rgba(0,0,0,0.50)"
      px="14px"
      py="18px"
      overflowY="auto"
      fontFamily="Arial, sans-serif"
      zIndex={9999}
      onClick={onFechar}
    >
      <Box
        w="720px"
        maxW="95vw"
        bg="#FFF9F0"
        borderRadius="13px"
        overflow="hidden"
        border="1px solid rgba(74,14,23,.14)"
        boxShadow="0 22px 60px rgba(0,0,0,.28), 0 4px 15px rgba(0,0,0,.12)"
        flexShrink={0}
        transform="translateY(20px)"
        onClick={(evento) => evento.stopPropagation()}
      >
        {/* CABEÇALHO */}
        <Box
          position="relative"
          textAlign="center"
          bg="#FFFAF4"
          pt="15px"
          pb="11px"
          px="42px"
        >
          <Button
            position="absolute"
            top="8px"
            right="11px"
            minW="30px"
            w="30px"
            h="30px"
            p={0}
            bg="transparent"
            color={PRIMARY}
            borderRadius="full"
            _hover={{ bg: "#F4E8E1" }}
            onClick={onFechar}
            aria-label="Fechar"
          >
            <Icon as={FiX} boxSize="20px" />
          </Button>

          <Heading
            fontFamily="Georgia, serif"
            fontSize="26px"
            fontWeight="normal"
            color={PRIMARY}
            lineHeight="1.1"
          >
            Estender Prazo
          </Heading>

          <Text mt="4px" fontSize="10px" color="#7C6D66">
            Atualize o prazo de devolução do empréstimo selecionado.
          </Text>
        </Box>

        {/* FAIXA VINHO */}
        <Flex
          mx="15px"
          h="72px"
          position="relative"
          overflow="hidden"
          align="center"
          justify="center"
          borderRadius="8px 8px 0 0"
          bg="linear-gradient(110deg,#570810 0%,#771018 35%,#8A161E 52%,#741018 70%,#570810 100%)"
        >
          {/* DECORAÇÃO ESQUERDA */}
          <Box
            position="absolute"
            left="15px"
            bottom="-18px"
            w="130px"
            h="100px"
            opacity=".22"
          >
            <Box
              position="absolute"
              left="45px"
              bottom="0"
              w="1px"
              h="92px"
              bg="#DDAE68"
              transform="rotate(26deg)"
            />
            <Box
              position="absolute"
              left="20px"
              top="29px"
              w="42px"
              h="1px"
              bg="#DDAE68"
              transform="rotate(41deg)"
            />
            <Box
              position="absolute"
              left="46px"
              top="45px"
              w="43px"
              h="1px"
              bg="#DDAE68"
              transform="rotate(-35deg)"
            />
            <Box
              position="absolute"
              left="15px"
              top="55px"
              w="34px"
              h="1px"
              bg="#DDAE68"
              transform="rotate(50deg)"
            />
          </Box>

          <Icon
            as={FiCalendar}
            boxSize="45px"
            color="#DDBB75"
            strokeWidth="1.2"
          />

          {/* DECORAÇÃO DIREITA */}
          <Box
            position="absolute"
            right="15px"
            bottom="-18px"
            w="130px"
            h="100px"
            opacity=".22"
            transform="scaleX(-1)"
          >
            <Box
              position="absolute"
              left="45px"
              bottom="0"
              w="1px"
              h="92px"
              bg="#DDAE68"
              transform="rotate(26deg)"
            />
            <Box
              position="absolute"
              left="20px"
              top="29px"
              w="42px"
              h="1px"
              bg="#DDAE68"
              transform="rotate(41deg)"
            />
            <Box
              position="absolute"
              left="46px"
              top="45px"
              w="43px"
              h="1px"
              bg="#DDAE68"
              transform="rotate(-35deg)"
            />
            <Box
              position="absolute"
              left="15px"
              top="55px"
              w="34px"
              h="1px"
              bg="#DDAE68"
              transform="rotate(50deg)"
            />
          </Box>
        </Flex>

        {/* CONTEÚDO */}
        <Box
          mx="15px"
          mb="14px"
          px="23px"
          pt="13px"
          pb="14px"
          bg="#FFFAF3"
          border="1px solid"
          borderTop="none"
          borderColor="#E8D7C5"
          borderRadius="0 0 8px 8px"
        >
          {/* LIVRO + USUÁRIO */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1fr",
            }}
            gap="18px"
          >
            <Stack gap="4px">
              <Text
                fontSize="10px"
                fontWeight="600"
                color={PRIMARY}
              >
                Livro
              </Text>

              <Input
                value={devolucao.livro}
                readOnly
                h="34px"
                px="11px"
                bg="#FFFCF7"
                border="1px solid"
                borderColor="#E4D2BE"
                borderRadius="6px"
                color="#3D2928"
                fontSize="10px"
                cursor="default"
                _focus={{ boxShadow: "none" }}
              />
            </Stack>

            <Stack gap="4px">
              <Text
                fontSize="10px"
                fontWeight="600"
                color={PRIMARY}
              >
                Usuário
              </Text>

              <Input
                value={devolucao.usuario}
                readOnly
                h="34px"
                px="11px"
                bg="#FFFCF7"
                border="1px solid"
                borderColor="#E4D2BE"
                borderRadius="6px"
                color="#3D2928"
                fontSize="10px"
                cursor="default"
                _focus={{ boxShadow: "none" }}
              />
            </Stack>
          </Grid>

          {/* DATA DO EMPRÉSTIMO + PRAZO ATUAL */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1fr",
            }}
            gap="18px"
            mt="10px"
          >
            <Stack gap="4px">
              <Text
                fontSize="10px"
                fontWeight="600"
                color={PRIMARY}
              >
                Data de empréstimo
              </Text>

              <Input
                value={devolucao.dataEmprestimo}
                readOnly
                h="34px"
                px="11px"
                bg="#FFFCF7"
                border="1px solid"
                borderColor="#E4D2BE"
                borderRadius="6px"
                color="#3D2928"
                fontSize="10px"
                cursor="default"
                _focus={{ boxShadow: "none" }}
              />
            </Stack>

            <Stack gap="4px">
              <Text
                fontSize="10px"
                fontWeight="600"
                color={PRIMARY}
              >
                Prazo atual
              </Text>

              <Input
                value={devolucao.prazo}
                readOnly
                h="34px"
                px="11px"
                bg="#FFFCF7"
                border="1px solid"
                borderColor="#E4D2BE"
                borderRadius="6px"
                color="#3D2928"
                fontSize="10px"
                cursor="default"
                _focus={{ boxShadow: "none" }}
              />
            </Stack>
          </Grid>

          {/* NOVO PRAZO + DIAS ADICIONADOS */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1fr",
            }}
            gap="18px"
            mt="10px"
          >
            <Stack gap="4px">
              <Text
                fontSize="10px"
                fontWeight="600"
                color={PRIMARY}
              >
                Novo prazo de devolução
              </Text>

              <Input
                type="date"
                value={novoPrazo}
                min={prazoAtualIso || undefined}
                onChange={(evento) =>
                  setNovoPrazo(evento.target.value)
                }
                h="34px"
                px="11px"
                bg="#FFFCF7"
                border="1px solid"
                borderColor="#E4D2BE"
                borderRadius="6px"
                color="#3D2928"
                fontSize="10px"
                _hover={{
                  borderColor: "#CDB69B",
                }}
                _focus={{
                  borderColor: PRIMARY,
                  boxShadow: `0 0 0 1px ${PRIMARY}`,
                }}
              />
            </Stack>

            <Stack gap="4px">
              <Text
                fontSize="10px"
                fontWeight="600"
                color={PRIMARY}
              >
                Dias adicionados
              </Text>

              <Input
                value={
                  diasAdicionados > 0
                    ? `${diasAdicionados} ${
                        diasAdicionados === 1
                          ? "dia"
                          : "dias"
                      }`
                    : "—"
                }
                readOnly
                h="34px"
                px="11px"
                bg="#FFFCF7"
                border="1px solid"
                borderColor="#E4D2BE"
                borderRadius="6px"
                color="#3D2928"
                fontSize="10px"
                cursor="default"
                _focus={{ boxShadow: "none" }}
              />
            </Stack>
          </Grid>

          {/* OBSERVAÇÃO */}
          <Stack gap="4px" mt="10px">
            <Text
              fontSize="10px"
              fontWeight="600"
              color={PRIMARY}
            >
              Observação
            </Text>

            <Box position="relative">
              <Input
                value={observacao}
                onChange={(evento) =>
                  setObservacao(evento.target.value)
                }
                maxLength={250}
                placeholder="Digite uma observação sobre a extensão do prazo..."
                h="40px"
                px="11px"
                pr="52px"
                bg="#FFFCF7"
                border="1px solid"
                borderColor="#E4D2BE"
                borderRadius="6px"
                color="#3D2928"
                fontSize="9px"
                _placeholder={{
                  color: "#9B908A",
                }}
                _hover={{
                  borderColor: "#CDB69B",
                }}
                _focus={{
                  borderColor: PRIMARY,
                  boxShadow: `0 0 0 1px ${PRIMARY}`,
                }}
              />

              <Text
                position="absolute"
                right="8px"
                bottom="5px"
                fontSize="7px"
                color="#7C6D66"
              >
                {observacao.length}/250
              </Text>
            </Box>
          </Stack>

          {/* AVISO */}
          <Box
            mt="11px"
            px="12px"
            py="9px"
            bg="#FDF4EA"
            border="1px solid"
            borderColor="#EAD8C5"
            borderRadius="6px"
          >
            <Text
              fontSize="8px"
              lineHeight="1.45"
              color="#7C6D66"
            >
              O novo prazo substituirá a data atual de devolução
              deste empréstimo.
            </Text>
          </Box>

          {/* BOTÕES */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "1fr 1.03fr",
            }}
            gap="10px"
            mt="11px"
          >
            <Button
              h="38px"
              bg="transparent"
              color={PRIMARY}
              border="1px solid"
              borderColor={PRIMARY}
              borderRadius="6px"
              fontFamily="Georgia, serif"
              fontWeight="normal"
              fontSize="12px"
              _hover={{
                bg: "#F8EEE6",
              }}
              onClick={onFechar}
            >
              Cancelar
            </Button>

            <Button
              h="38px"
              bg={PRIMARY}
              color="white"
              borderRadius="6px"
              fontFamily="Georgia, serif"
              fontWeight="normal"
              fontSize="12px"
              boxShadow="0 3px 8px rgba(74,14,23,.15)"
              _hover={{
                bg: PRIMARY_DARK,
              }}
              onClick={salvar}
            >
              Salvar Alterações
            </Button>
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
}


// ============================================================
// FILTRO PERSONALIZADO
// ============================================================

function FiltroMenu({ valor, onChange, opcoes }) {
  const selecionada =
    opcoes.find((opcao) => opcao.valor === valor) || opcoes[0];

  return (
    <Box minW="135px">
      <Menu.Root
        positioning={{ sameWidth: true }}
        onSelect={(detalhe) => onChange(detalhe.value)}
      >
        <Menu.Trigger asChild>
          <Button
            variant="outline"
            bg={WHITE}
            border="1px solid"
            borderColor="#E7DED8"
            borderRadius="14px"
            h="42px"
            px={4}
            w="full"
            justifyContent="space-between"
            color={TEXT}
            fontSize="10px"
            fontWeight="500"
            transition="all .25s cubic-bezier(0.16, 1, 0.3, 1)"
            _hover={{
              borderColor: PRIMARY,
              bg: "#FAF5F6",
              boxShadow: "0 4px 12px rgba(74,14,23,.08)",
            }}
            _focus={{
              borderColor: PRIMARY,
              boxShadow: "0 0 0 3px rgba(74,14,23,.12)",
            }}
          >
            {selecionada.label}

            <Icon
              as={FiChevronDown}
              color={PRIMARY}
              boxSize={4}
              ml={4}
            />
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content
            bg={WHITE}
            border="1px solid"
            borderColor="#E7DED8"
            borderRadius="16px"
            boxShadow="0 10px 28px rgba(74,14,23,.12)"
            p={2}
            overflow="hidden"
            zIndex="popover"
          >
            {opcoes.map((opcao) => (
              <Menu.Item
                key={opcao.valor}
                value={opcao.valor}
                px={3}
                py={2.5}
                borderRadius="10px"
                cursor="pointer"
                color={TEXT}
                fontSize="10px"
                fontWeight="500"
                transition="all .2s ease"
                _hover={{
                  bg: "#F2E6E8",
                  color: PRIMARY,
                }}
                _focus={{
                  bg: "#F2E6E8",
                  color: PRIMARY,
                }}
              >
                {opcao.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Box>
  );
}

// ============================================================
// PÁGINA PRINCIPAL
// ============================================================

export default function GestaoEmprestimosReservas() {
  const [aba, setAba] =
    useState("reservas");

  const [reservas, setReservas] =
    useState(RESERVAS_INICIAIS);

  const [busca, setBusca] =
    useState("");

  const [statusFiltro, setStatusFiltro] =
    useState("Todos");

  const [statusEmprestimo, setStatusEmprestimo] =
    useState("Todos");

  const [statusDevolucao, setStatusDevolucao] =
    useState("Todos");

  const [devolucoes, setDevolucoes] =
    useState(DEVOLUCOES_INICIAIS);

  const [devolucaoPrazo, setDevolucaoPrazo] =
    useState(null);

  // ==========================================================
  // APROVAR
  // ==========================================================

  function aprovarReserva(id) {
    setReservas((lista) =>
      lista.map((reserva) =>
        reserva.id === id
          ? {
              ...reserva,
              status: "Aprovado",
            }
          : reserva
      )
    );
  }

  // ==========================================================
  // RECUSAR
  // ==========================================================

  function recusarReserva(id) {
    setReservas((lista) =>
      lista.map((reserva) =>
        reserva.id === id
          ? {
              ...reserva,
              status: "Recusado",
            }
          : reserva
      )
    );
  }

  // ==========================================================
  // ESTENDER PRAZO
  // ==========================================================

  function abrirEstenderPrazo(devolucao) {
    setDevolucaoPrazo(devolucao);
  }

  function salvarExtensaoPrazo({
    novoPrazo,
    observacao,
    diasAdicionados,
  }) {
    if (!devolucaoPrazo) {
      return;
    }

    setDevolucoes((lista) =>
      lista.map((item) =>
        item.id === devolucaoPrazo.id
          ? {
              ...item,
              prazo: novoPrazo,
              observacaoPrazo: observacao,
              diasAdicionadosPrazo: diasAdicionados,
            }
          : item
      )
    );

    setDevolucaoPrazo(null);
  }

  // ==========================================================
  // FILTRO RESERVAS
  // ==========================================================

  const reservasFiltradas =
    reservas.filter((reserva) => {
      const texto =
        `${reserva.livro} ${reserva.autor} ${reserva.usuario} ${reserva.email}`
          .toLowerCase();

      const correspondeBusca =
        texto.includes(
          busca.toLowerCase()
        );

      const correspondeStatus =
        statusFiltro === "Todos" ||
        reserva.status === statusFiltro;

      return (
        correspondeBusca &&
        correspondeStatus
      );
    });

  // ==========================================================
  // CONTADORES
  // ==========================================================

  const reservasPendentes =
    reservas.filter(
      (item) =>
        item.status === "Pendente" ||
        item.status === "Aguardando"
    ).length;

  const emprestimosAtivos =
    EMPRESTIMOS_INICIAIS.filter(
      (item) =>
        item.status === "No prazo"
    ).length;

  const atrasados =
    EMPRESTIMOS_INICIAIS.filter(
      (item) =>
        item.status === "Atrasado"
    ).length;

  return (
    <Flex
      minH="100vh"
      bg={BACKGROUND}
    >

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <SideBarAdm/>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

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
              HEADER
          ================================================= */}

          <Flex
            justify="space-between"
            align="center"
            gap={5}
            flexWrap="wrap"
          >
            <HStack gap={4}>
              <Box
                w="52px"
                h="52px"
                borderRadius="full"
                bg={PRIMARY}
                color={WHITE}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 3px 10px rgba(74,14,23,.15)"
              >
                <Icon
                  as={FiRepeat}
                  boxSize={6}
                />
              </Box>

              <Stack gap={2}>
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
                  Gestão de Empréstimos e Reservas
                </Text>

                <Text
                  fontSize="14px"
                  color={TEXT_LIGHT}
                >
                  Gerencie reservas, empréstimos e devoluções da biblioteca.
                </Text>
              </Stack>
            </HStack>

            <Box
              px={4}
              py={3}
              bg={WHITE}
              border="1px solid"
              borderColor={BORDER}
              borderRadius="7px"
            >
              <HStack gap={2}>
                <Icon
                  as={FiCalendar}
                  color={TEXT_LIGHT}
                  boxSize={4}
                />

                <Text
                  fontSize="9px"
                  color={TEXT}
                >
                  13 de maio de 2025
                </Text>
              </HStack>
            </Box>
          </Flex>

          {/* =================================================
              ABAS
          ================================================= */}

          <Card.Root
            bg={WHITE}
            border="1px solid"
            borderColor={BORDER}
            borderRadius="7px"
            overflow="hidden"
          >
            <Grid
              templateColumns="repeat(3, 1fr)"
            >

              {/* RESERVAS */}

              <Box
                px={5}
                py={4}
                cursor="pointer"
                borderBottom="2px solid"
                borderColor={
                  aba === "reservas"
                    ? PRIMARY
                    : "transparent"
                }
                onClick={() =>
                  setAba("reservas")
                }
              >
                <HStack
                  justify="center"
                  gap={3}
                >
                  <Icon
                    as={FiRepeat}
                    boxSize={4}
                    color={
                      aba === "reservas"
                        ? PRIMARY
                        : TEXT_LIGHT
                    }
                  />

                  <Text
                    fontSize="10px"
                    fontWeight={
                      aba === "reservas"
                        ? "600"
                        : "400"
                    }
                    color={
                      aba === "reservas"
                        ? PRIMARY
                        : TEXT
                    }
                  >
                    Solicitações / Reservas
                  </Text>
                </HStack>
              </Box>

              {/* EMPRÉSTIMOS */}

              <Box
                px={5}
                py={4}
                cursor="pointer"
                borderBottom="2px solid"
                borderColor={
                  aba === "emprestimos"
                    ? PRIMARY
                    : "transparent"
                }
                onClick={() =>
                  setAba("emprestimos")
                }
              >
                <HStack
                  justify="center"
                  gap={3}
                >
                  <Icon
                    as={FiBook}
                    boxSize={4}
                    color={
                      aba === "emprestimos"
                        ? PRIMARY
                        : TEXT_LIGHT
                    }
                  />

                  <Text
                    fontSize="10px"
                    fontWeight={
                      aba === "emprestimos"
                        ? "600"
                        : "400"
                    }
                    color={
                      aba === "emprestimos"
                        ? PRIMARY
                        : TEXT
                    }
                  >
                    Empréstimos Ativos
                  </Text>
                </HStack>
              </Box>

              {/* DEVOLUÇÕES */}

              <Box
                px={5}
                py={4}
                cursor="pointer"
                borderBottom="2px solid"
                borderColor={
                  aba === "devolucoes"
                    ? PRIMARY
                    : "transparent"
                }
                onClick={() =>
                  setAba("devolucoes")
                }
              >
                <HStack
                  justify="center"
                  gap={3}
                >
                  <Icon
                    as={FiClock}
                    boxSize={4}
                    color={
                      aba === "devolucoes"
                        ? PRIMARY
                        : TEXT_LIGHT
                    }
                  />

                  <Text
                    fontSize="10px"
                    fontWeight={
                      aba === "devolucoes"
                        ? "600"
                        : "400"
                    }
                    color={
                      aba === "devolucoes"
                        ? PRIMARY
                        : TEXT
                    }
                  >
                    Devoluções e Atrasos
                  </Text>
                </HStack>
              </Box>
            </Grid>
          </Card.Root>

          {/* =================================================
              CONTEÚDO RESERVAS
          ================================================= */}

          {aba === "reservas" && (
            <Card.Root
              bg={WHITE}
              border="1px solid"
              borderColor={BORDER}
              borderRadius="8px"
              overflow="hidden"
            >
              <Card.Body p={5}>

                <Flex
                  justify="space-between"
                  align="center"
                  gap={5}
                  flexWrap="wrap"
                  mb={5}
                >
                  <Stack gap={1}>
                    <HStack gap={3}>
                      <Box
                        w="34px"
                        h="34px"
                        borderRadius="full"
                        bg="#F4E8E8"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon
                          as={FiRepeat}
                          color={PRIMARY}
                          boxSize={4}
                        />
                      </Box>

                      <Text
                        fontFamily="Georgia, serif"
                        fontSize="18px"
                        fontWeight="700"
                        color={PRIMARY}
                      >
                        Solicitações de Reserva
                      </Text>
                    </HStack>

                    <Text
                      fontSize="9px"
                      color={TEXT_LIGHT}
                    >
                      Aprove ou recuse as reservas feitas online pelos usuários.
                    </Text>
                  </Stack>

                  <HStack gap={3}>
                    <Box
                      position="relative"
                      w="280px"
                    >
                      <Icon
                        as={FiSearch}
                        position="absolute"
                        left="14px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="#999"
                        boxSize={4}
                        zIndex={1}
                        pointerEvents="none"
                      />

                      <Input
                        pl="40px"
                        h="42px"
                        fontSize="10px"
                        placeholder="Buscar por usuário, livro ou data..."
                        value={busca}
                        onChange={(e) =>
                          setBusca(
                            e.target.value
                          )
                        }
                        bg={WHITE}
                        border="1px solid"
                        borderColor="#E7DED8"
                        borderRadius="14px"
                        transition="all .25s cubic-bezier(0.16, 1, 0.3, 1)"
                        _placeholder={{
                          color: "#AAA",
                        }}
                        _hover={{
                          borderColor: "#D6C7C0",
                          bg: "#FFFEFD",
                        }}
                        _focus={{
                          borderColor: PRIMARY,
                          boxShadow: "0 0 0 3px rgba(74,14,23,.12)",
                          outline: "none",
                        }}
                      />
                    </Box>

                    <FiltroMenu
                      valor={statusFiltro}
                      onChange={setStatusFiltro}
                      opcoes={OPCOES_RESERVAS}
                    />
                  </HStack>
                </Flex>

                <Box
                  border="1px solid"
                  borderColor={BORDER}
                  borderRadius="6px"
                  overflow="hidden"
                >
                  <Box overflowX="auto">
                    <Box minW="1050px">

                      <TabelaHeader
                        tipo="reservas"
                      />

                      {reservasFiltradas.map(
                        (reserva) => (
                          <ReservaRow
                            key={reserva.id}
                            reserva={reserva}
                            onAprovar={
                              aprovarReserva
                            }
                            onRecusar={
                              recusarReserva
                            }
                          />
                        )
                      )}

                    </Box>
                  </Box>
                </Box>
              </Card.Body>

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
                    fontSize="9px"
                    color={TEXT_LIGHT}
                  >
                    Mostrando{" "}
                    {
                      reservasFiltradas.length
                    }{" "}
                    de {reservas.length} reservas
                  </Text>

                  <HStack gap={2}>
                    <Button
                      size="xs"
                      variant="outline"
                    >
                      <Icon
                        as={FiChevronLeft}
                      />
                    </Button>

                    <Button
                      size="xs"
                      bg={PRIMARY}
                      color={WHITE}
                    >
                      1
                    </Button>

                    <Button
                      size="xs"
                      variant="outline"
                    >
                      2
                    </Button>

                    <Button
                      size="xs"
                      variant="outline"
                    >
                      3
                    </Button>

                    <Button
                      size="xs"
                      variant="outline"
                    >
                      <Icon
                        as={FiChevronRight}
                      />
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            </Card.Root>
          )}

          {/* =================================================
              EMPRÉSTIMOS ATIVOS
          ================================================= */}

          {aba === "emprestimos" && (
            <Card.Root
              bg={WHITE}
              border="1px solid"
              borderColor={BORDER}
              borderRadius="8px"
              overflow="hidden"
            >
              <Card.Body p={5}>

                <Flex
                  justify="space-between"
                  align="center"
                  gap={4}
                  mb={5}
                  flexWrap="wrap"
                >
                  <Stack gap={1}>
                    <HStack gap={3}>
                      <Box
                        w="34px"
                        h="34px"
                        borderRadius="full"
                        bg="#F4E8E8"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon
                          as={FiBook}
                          color={PRIMARY}
                          boxSize={4}
                        />
                      </Box>

                      <Text
                        fontFamily="Georgia, serif"
                        fontSize="18px"
                        fontWeight="700"
                        color={PRIMARY}
                      >
                        Empréstimos Ativos
                      </Text>
                    </HStack>

                    <Text
                      fontSize="9px"
                      color={TEXT_LIGHT}
                    >
                      Acompanhe os livros emprestados e confirme a entrega aos usuários.
                    </Text>
                  </Stack>

                  <HStack gap={3}>
                    <Box
                      position="relative"
                      w="280px"
                    >
                      <Icon
                        as={FiSearch}
                        position="absolute"
                        left="14px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="#999"
                        boxSize={4}
                        zIndex={1}
                        pointerEvents="none"
                      />

                      <Input
                        pl="40px"
                        h="42px"
                        fontSize="10px"
                        placeholder="Buscar por usuário, livro ou código..."
                        bg={WHITE}
                        border="1px solid"
                        borderColor="#E7DED8"
                        borderRadius="14px"
                        transition="all .25s cubic-bezier(0.16, 1, 0.3, 1)"
                        _placeholder={{
                          color: "#AAA",
                        }}
                        _hover={{
                          borderColor: "#D6C7C0",
                          bg: "#FFFEFD",
                        }}
                        _focus={{
                          borderColor: PRIMARY,
                          boxShadow: "0 0 0 3px rgba(74,14,23,.12)",
                          outline: "none",
                        }}
                      />
                    </Box>

                    <FiltroMenu
                      valor={statusEmprestimo}
                      onChange={setStatusEmprestimo}
                      opcoes={OPCOES_EMPRESTIMOS}
                    />
                  </HStack>
                </Flex>

                <Box
                  border="1px solid"
                  borderColor={BORDER}
                  borderRadius="6px"
                  overflow="hidden"
                >
                  <Box overflowX="auto">
                    <Box minW="1180px">

                      <TabelaHeader
                        tipo="emprestimos"
                      />

                      {EMPRESTIMOS_INICIAIS.map(
                        (emprestimo) => (
                          <EmprestimoRow
                            key={emprestimo.id}
                            emprestimo={
                              emprestimo
                            }
                          />
                        )
                      )}

                    </Box>
                  </Box>
                </Box>

              </Card.Body>

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
                    fontSize="9px"
                    color={TEXT_LIGHT}
                  >
                    Mostrando 1 a 5 de 12 empréstimos ativos
                  </Text>

                  <HStack gap={2}>
                    <Button
                      size="xs"
                      variant="outline"
                    >
                      <Icon
                        as={FiChevronLeft}
                      />
                    </Button>

                    <Button
                      size="xs"
                      bg={PRIMARY}
                      color={WHITE}
                    >
                      1
                    </Button>

                    <Button
                      size="xs"
                      variant="outline"
                    >
                      2
                    </Button>

                    <Button
                      size="xs"
                      variant="outline"
                    >
                      3
                    </Button>

                    <Button
                      size="xs"
                      variant="outline"
                    >
                      <Icon
                        as={FiChevronRight}
                      />
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            </Card.Root>
          )}

          {/* =================================================
              DEVOLUÇÕES E ATRASOS
          ================================================= */}

          {aba === "devolucoes" && (
            <Stack gap={4}>

              <Card.Root
                bg={WHITE}
                border="1px solid"
                borderColor={BORDER}
                borderRadius="8px"
                overflow="hidden"
              >
                <Card.Body p={5}>

                  <Flex
                    justify="space-between"
                    align="center"
                    gap={4}
                    mb={5}
                    flexWrap="wrap"
                  >
                    <Stack gap={1}>
                      <HStack gap={3}>
                        <Box
                          w="34px"
                          h="34px"
                          borderRadius="full"
                          bg="#F4E8E8"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon
                            as={FiClock}
                            color={PRIMARY}
                            boxSize={4}
                          />
                        </Box>

                        <Text
                          fontFamily="Georgia, serif"
                          fontSize="18px"
                          fontWeight="700"
                          color={PRIMARY}
                        >
                          Devoluções e Atrasos
                        </Text>
                      </HStack>

                      <Text
                        fontSize="9px"
                        color={TEXT_LIGHT}
                      >
                        Confirme devoluções e gerencie prazos dos empréstimos.
                      </Text>
                    </Stack>

                    <HStack gap={3}>
                      <Box
                        position="relative"
                        w="280px"
                      >
                        <Icon
                          as={FiSearch}
                          position="absolute"
                          left="14px"
                          top="50%"
                          transform="translateY(-50%)"
                          color="#999"
                          boxSize={4}
                          zIndex={1}
                          pointerEvents="none"
                        />

                        <Input
                          pl="40px"
                          h="42px"
                          fontSize="10px"
                          placeholder="Buscar por usuário, livro ou código..."
                          bg={WHITE}
                          border="1px solid"
                          borderColor="#E7DED8"
                          borderRadius="14px"
                          transition="all .25s cubic-bezier(0.16, 1, 0.3, 1)"
                          _placeholder={{
                            color: "#AAA",
                          }}
                          _hover={{
                            borderColor: "#D6C7C0",
                            bg: "#FFFEFD",
                          }}
                          _focus={{
                            borderColor: PRIMARY,
                            boxShadow: "0 0 0 3px rgba(74,14,23,.12)",
                            outline: "none",
                          }}
                        />
                      </Box>

                      <FiltroMenu
                        valor={statusDevolucao}
                        onChange={setStatusDevolucao}
                        opcoes={OPCOES_DEVOLUCOES}
                      />
                    </HStack>
                  </Flex>

                  <Box
                    border="1px solid"
                    borderColor={BORDER}
                    borderRadius="6px"
                    overflow="hidden"
                  >
                    <Box overflowX="auto">
                      <Box minW="1200px">

                        <TabelaHeader
                          tipo="devolucoes"
                        />

                        {devolucoes.map(
                          (devolucao) => (
                            <DevolucaoRow
                              key={devolucao.id}
                              devolucao={devolucao}
                              onEstenderPrazo={
                                abrirEstenderPrazo
                              }
                            />
                          )
                        )}

                      </Box>
                    </Box>
                  </Box>

                </Card.Body>

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
                      fontSize="9px"
                      color={TEXT_LIGHT}
                    >
                      Mostrando 1 a 5 de {devolucoes.length} empréstimos
                    </Text>

                    <HStack gap={2}>
                      <Button
                        size="xs"
                        variant="outline"
                      >
                        <Icon
                          as={FiChevronLeft}
                        />
                      </Button>

                      <Button
                        size="xs"
                        bg={PRIMARY}
                        color={WHITE}
                      >
                        1
                      </Button>

                      <Button
                        size="xs"
                        variant="outline"
                      >
                        <Icon
                          as={FiChevronRight}
                        />
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              </Card.Root>

              {/* =================================================
                  INFORMAÇÕES
              ================================================= */}

              <Box
                bg="#F8E5DE"
                borderRadius="7px"
                px={5}
                py={4}
                border="1px solid"
                borderColor="#F0D5CC"
              >
                <HStack
                  align="flex-start"
                  gap={3}
                >
                  <Icon
                    as={FiAlertCircle}
                    color={PRIMARY}
                    boxSize={5}
                    mt="2px"
                  />

                  <Stack gap={1.5}>
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      color={PRIMARY}
                    >
                      Como gerenciar prazos:
                    </Text>

                    <Text
                      fontSize="9px"
                      color={TEXT}
                    >
                      ✓ Clique em Estender prazo para adicionar dias ao prazo de devolução.
                    </Text>

                    <Text
                      fontSize="9px"
                      color={TEXT}
                    >
                      ✓ O registro ficará atualizado automaticamente.
                    </Text>

                    <Text
                      fontSize="9px"
                      color={TEXT}
                    >
                      ✓ Use Confirmar devolução para confirmar a entrega do livro.
                    </Text>
                  </Stack>
                </HStack>
              </Box>

            </Stack>
          )}

        </Stack>
      </Box>

      <ModalEstenderPrazo
        key={devolucaoPrazo?.id || "modal-prazo"}
        aberto={Boolean(devolucaoPrazo)}
        devolucao={devolucaoPrazo}
        onFechar={() => setDevolucaoPrazo(null)}
        onSalvar={salvarExtensaoPrazo}
      />
    </Flex>
  );
}