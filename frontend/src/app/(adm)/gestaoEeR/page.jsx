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
        p={{
          base: 5,
          md: 7,
          lg: 8,
        }}
      >
        <Stack
          maxW="1500px"
          mx="auto"
          gap={6}
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

              <Stack gap={1}>
                <Heading
                  fontFamily="Georgia, serif"
                  fontSize={{
                    base: "24px",
                    md: "29px",
                  }}
                  color={PRIMARY}
                  lineHeight="1.15"
                >
                  Gestão de Empréstimos e Reservas
                </Heading>

                <Text
                  fontSize="10px"
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
                      w="260px"
                    >
                      <Icon
                        as={FiSearch}
                        position="absolute"
                        left="11px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="#999"
                        boxSize={3.5}
                        zIndex={1}
                      />

                      <Input
                        pl="34px"
                        h="38px"
                        fontSize="9px"
                        placeholder="Buscar por usuário, livro ou data..."
                        value={busca}
                        onChange={(e) =>
                          setBusca(
                            e.target.value
                          )
                        }
                        borderColor="#E5DED6"
                        borderRadius="5px"
                      />
                    </Box>

                    <Box
                      as="select"
                      value={statusFiltro}
                      onChange={(e) =>
                        setStatusFiltro(
                          e.target.value
                        )
                      }
                      h="38px"
                      minW="120px"
                      px={3}
                      fontSize="9px"
                      bg={WHITE}
                      border="1px solid"
                      borderColor="#E5DED6"
                      borderRadius="5px"
                    >
                      <option value="Todos">
                        Todos
                      </option>

                      <option value="Pendente">
                        Pendentes
                      </option>

                      <option value="Aguardando">
                        Aguardando
                      </option>

                      <option value="Aprovado">
                        Aprovados
                      </option>

                      <option value="Recusado">
                        Recusados
                      </option>
                    </Box>
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
                      w="260px"
                    >
                      <Icon
                        as={FiSearch}
                        position="absolute"
                        left="11px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="#999"
                        boxSize={3.5}
                        zIndex={1}
                      />

                      <Input
                        pl="34px"
                        h="38px"
                        fontSize="9px"
                        placeholder="Buscar por usuário, livro ou código..."
                        borderColor="#E5DED6"
                        borderRadius="5px"
                      />
                    </Box>

                    <Box
                      as="select"
                      h="38px"
                      minW="120px"
                      px={3}
                      fontSize="9px"
                      bg={WHITE}
                      border="1px solid"
                      borderColor="#E5DED6"
                      borderRadius="5px"
                    >
                      <option>
                        Todos
                      </option>

                      <option>
                        No prazo
                      </option>

                      <option>
                        Atrasado
                      </option>
                    </Box>
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
                        w="260px"
                      >
                        <Icon
                          as={FiSearch}
                          position="absolute"
                          left="11px"
                          top="50%"
                          transform="translateY(-50%)"
                          color="#999"
                          boxSize={3.5}
                          zIndex={1}
                        />

                        <Input
                          pl="34px"
                          h="38px"
                          fontSize="9px"
                          placeholder="Buscar por usuário, livro ou código..."
                          borderColor="#E5DED6"
                          borderRadius="5px"
                        />
                      </Box>

                      <Box
                        as="select"
                        h="38px"
                        minW="120px"
                        px={3}
                        fontSize="9px"
                        bg={WHITE}
                        border="1px solid"
                        borderColor="#E5DED6"
                        borderRadius="5px"
                      >
                        <option>
                          Todos
                        </option>

                        <option>
                          Em dia
                        </option>

                        <option>
                          Atrasado
                        </option>
                      </Box>
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

                        {DEVOLUCOES_INICIAIS.map(
                          (devolucao) => (
                            <DevolucaoRow
                              key={devolucao.id}
                              devolucao={
                                devolucao
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
                      Mostrando 1 a 5 de 5 empréstimos
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
    </Flex>
  );
}