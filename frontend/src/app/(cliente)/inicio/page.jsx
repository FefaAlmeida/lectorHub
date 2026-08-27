"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Icon,
  SimpleGrid,
  Image,
  AspectRatio,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { FiSearch, FiBookOpen, FiClock, FiUser, FiArrowRight, FiChevronRight } from "react-icons/fi";

import Sidebar from "../../../components/sideBar/sideBar";
import { useUsuario } from "../../../components/auth/RequireAuth";
import { getLivros, getMeusEmprestimos } from "../../../api";

const PRIMARY_COLOR = "#4A0E17";
const BORDER_COLOR = "#EFEBE3";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";
const HOVER_SHADOW = "0 8px 24px rgba(74, 14, 23, 0.08)";

const QUICK_ACTIONS = [
  { label: "Buscar Livros", icon: FiSearch, href: "/buscar_livro", description: "Encontre livros por título, autor ou assunto" },
  { label: "Meus Empréstimos", icon: FiBookOpen, href: "/emprestimo_livro", description: "Veja seus livros emprestados e prazos" },
  { label: "Histórico", icon: FiClock, href: "/emprestimo_livro?aba=historico", description: "Confira seu histórico de empréstimos" },
  { label: "Meu Cadastro", icon: FiUser, href: "/alterar_cadastro", description: "Atualize seus dados cadastrais" },
];

const ATIVOS = ["PENDENTE", "EMPRESTADO"];

function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
}

// Rótulo do status para o card da home
function situacao(emprestimo) {
  if (emprestimo.status === "PENDENTE") return { texto: "Aguardando aprovação", bg: "#FFF3E0", cor: "#B78103" };
  if (emprestimo.atrasado) return { texto: "Atrasado", bg: "#FCE8E6", cor: "#C5221F" };
  return { texto: "Emprestado", bg: "#E8F5E9", cor: "#388E3C" };
}

function Capa({ src, alt, ...props }) {
  return (
    <AspectRatio ratio={2 / 3} borderRadius="8px" overflow="hidden" bg="#F2EFE9" {...props}>
      {src ? (
        <Image src={src} alt={alt} objectFit="cover" />
      ) : (
        <Flex align="center" justify="center">
          <Icon as={FiBookOpen} boxSize={8} color={PRIMARY_COLOR} opacity={0.35} />
        </Flex>
      )}
    </AspectRatio>
  );
}

function Cartao({ children, ...props }) {
  return (
    <VStack align="stretch" gap={5} p={6} bg="white" borderRadius="12px" border="1px solid" borderColor={BORDER_COLOR} {...props}>
      {children}
    </VStack>
  );
}

function Titulo({ children }) {
  return (
    <Heading as="h2" fontSize="2xl" fontWeight="bold" color={PRIMARY_COLOR} fontFamily="Georgia, serif">
      {children}
    </Heading>
  );
}

export default function InicioPage() {
  const usuario = useUsuario();

  const [emprestimos, setEmprestimos] = useState(null); // null = carregando
  const [destaques, setDestaques] = useState(null);

  useEffect(() => {
    let ativo = true;

    getMeusEmprestimos().then((r) => {
      if (!ativo) return;
      const lista = r?.sucesso ? r.dados.emprestimos : [];
      setEmprestimos(lista.filter((e) => ATIVOS.includes(e.status)));
    });

    getLivros({ disponivel: "true", ordem: "recentes", limite: 4 }).then((r) => {
      if (ativo) setDestaques(r?.sucesso ? r.dados : []);
    });

    return () => {
      ativo = false;
    };
  }, []);

  const primeiroNome = (usuario?.nome || "").trim().split(" ")[0];

  return (
    <Flex minH="100vh" bg="white">
      <Sidebar />

      <Box flex={1} p={{ base: 6, md: 8 }} pb={16}>
        <VStack gap={12} align="stretch">
          {/* BOAS-VINDAS */}
          <VStack align="flex-start" gap={3}>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color={PRIMARY_COLOR} fontFamily="Georgia, serif">
              Bem-vindo(a){primeiroNome ? `, ${primeiroNome}` : ""}!
            </Heading>
            <Text fontSize="md" color={TEXT_LIGHT}>
              Explore, reserve e gerencie seus livros de forma fácil e rápida.
            </Text>
          </VStack>

          {/* AÇÕES RÁPIDAS */}
          <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap={4}>
            {QUICK_ACTIONS.map((acao) => (
              <Flex
                key={acao.href}
                as={Link}
                href={acao.href}
                align="center"
                bg="white"
                p={4}
                borderRadius="12px"
                border="1px solid"
                borderColor={BORDER_COLOR}
                _hover={{ borderColor: PRIMARY_COLOR, boxShadow: HOVER_SHADOW, transform: "translateY(-2px)" }}
                transition="all 0.2s ease"
              >
                <Flex w={12} h={12} borderRadius="full" bg={PRIMARY_COLOR} color="white" align="center" justify="center" mr={3} flexShrink={0}>
                  <Icon as={acao.icon} w={5} h={5} />
                </Flex>
                <VStack align="flex-start" gap={0} flex={1}>
                  <Heading fontSize="sm" fontWeight="semibold" color={PRIMARY_COLOR}>{acao.label}</Heading>
                  <Text fontSize="xs" color={TEXT_LIGHT} lineClamp={2}>{acao.description}</Text>
                </VStack>
                <Icon as={FiChevronRight} color={PRIMARY_COLOR} w={4} h={4} ml={1} />
              </Flex>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
            {/* EMPRÉSTIMOS ATIVOS */}
            <Cartao justify="space-between">
              <Titulo>Seus empréstimos</Titulo>

              {emprestimos === null ? (
                <Flex justify="center" py={8}><Spinner color={PRIMARY_COLOR} /></Flex>
              ) : emprestimos.length === 0 ? (
                <Flex border="2px dashed" borderColor="#DED6C9" borderRadius="8px" p={4} h="90px" align="center" justify="center" color={TEXT_LIGHT}>
                  <Text fontSize="xs">Nenhum empréstimo em andamento.</Text>
                </Flex>
              ) : (
                emprestimos.map((e) => {
                  const s = situacao(e);
                  return (
                    <Flex key={e.id_emprestimo} border="1px solid" borderColor={e.atrasado ? "#C5221F" : BORDER_COLOR} borderRadius="8px" p={4} align="center" gap={4}>
                      <Capa src={e.capa_url} alt={e.titulo} w="80px" flexShrink={0} />

                      <VStack align="flex-start" gap={1} flex={1}>
                        <Badge bg={s.bg} color={s.cor} borderRadius="full" px={2} textTransform="none" fontSize="xs">{s.texto}</Badge>
                        <Heading fontSize="md" fontWeight="semibold" color={PRIMARY_COLOR}>{e.titulo}</Heading>
                        <Text fontSize="xs" color={TEXT_LIGHT}>{e.autor}</Text>
                        {e.status === "PENDENTE" ? (
                          <Text fontSize="xs" color={TEXT_DARK}>Solicitado em {formatarData(e.data_solicitacao)}</Text>
                        ) : (
                          <Text fontSize="xs" color={TEXT_DARK}>Devolver até {formatarData(e.data_devolucao_prevista)}</Text>
                        )}
                      </VStack>

                      <Button as={Link} href={`/detalhe_livro/${e.id_livro}`} variant="outline" size="sm" borderColor={PRIMARY_COLOR} color={PRIMARY_COLOR}>
                        Ver detalhes
                      </Button>
                    </Flex>
                  );
                })
              )}

              <Text as={Link} href="/emprestimo_livro" color={PRIMARY_COLOR} fontSize="sm" fontWeight="medium" textAlign="center" pt={1}>
                Ver todos os empréstimos <Icon as={FiArrowRight} ml={1} display="inline" />
              </Text>
            </Cartao>

            {/* DESTAQUES */}
            <Cartao>
              <HStack justify="space-between">
                <Titulo>Livros em Destaque</Titulo>
                <Text as={Link} href="/buscar_livro" color={PRIMARY_COLOR} fontSize="xs" fontWeight="medium">
                  Ver todos <Icon as={FiArrowRight} ml={1} display="inline" />
                </Text>
              </HStack>

              {destaques === null ? (
                <Flex justify="center" py={8}><Spinner color={PRIMARY_COLOR} /></Flex>
              ) : destaques.length === 0 ? (
                <Text fontSize="xs" color={TEXT_LIGHT}>Nenhum livro disponível no momento.</Text>
              ) : (
                <SimpleGrid columns={{ base: 2, sm: 4 }} gap={5} w="full">
                  {destaques.map((livro) => (
                    <VStack key={livro.id} as={Link} href={`/detalhe_livro/${livro.id}`} align="flex-start" gap={2} w="full" _hover={{ transform: "translateY(-4px)" }} transition="all 0.2s ease">
                      <Capa src={livro.capa_url} alt={livro.titulo} w="full" boxShadow="sm" />
                      <VStack align="flex-start" gap={0} w="full">
                        <Text fontSize="xs" fontWeight="semibold" color={PRIMARY_COLOR} lineClamp={2} lineHeight="tight">{livro.titulo}</Text>
                        <Text fontSize="xs" color={TEXT_LIGHT} lineClamp={1} mt={1}>{livro.autor}</Text>
                      </VStack>
                    </VStack>
                  ))}
                </SimpleGrid>
              )}
            </Cartao>
          </SimpleGrid>
        </VStack>
      </Box>
    </Flex>
  );
}
