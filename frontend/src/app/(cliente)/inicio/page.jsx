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
import { FiBookOpen, FiClock, FiArrowRight, FiAlertTriangle, FiCheckCircle, FiVolume2 } from "react-icons/fi";

import Shell, { Cartao, CartaoAviso, TituloSecao, Vazio } from "@/components/cliente/Shell";
import { useUsuario } from "../../../components/auth/RequireAuth";
import { getLivrosPopulares, getMeusEmprestimos } from "../../../api";

import {
  PRIMARY_COLOR,
  CARD_BG,
  BORDER_COLOR,
  TEXT_DARK,
  TEXT_LIGHT,
  PLACEHOLDER_BG,
  OK_BG,
  OK_COR,
  ALERTA_BG,
  ALERTA_COR,
  ERRO_BG,
  ERRO_COR,
  RAIO_MEDIO,
  RAIO_PEQUENO,
  GAP_CARTAO,
  HOVER_CARTAO,
  HOVER_VITRINE,
  HOVER_CAPA,
  HOVER_LINK,
  TRANSICAO,
  TEXTO_APOIO,
  TEXTO_MIUDO,
  RAIO_CAMPO,
  PRIMARY_HOVER,
} from "@/components/cliente/tema";

const ATIVOS = ["PENDENTE", "EMPRESTADO"];

// Avisos fixos da biblioteca. O horário é o mesmo que já existia no projeto;
// se mudar, é aqui que se edita — não há essa informação no banco.
const AVISOS = [
  {
    icone: FiClock,
    titulo: "Horário de Funcionamento",
    // `whiteSpace: pre-line` no CartaoAviso respeita a quebra.
    texto: `Segunda a Sexta: 08h às 18h
Sábado: 08h às 12h`,
  },
  {
    icone: FiAlertTriangle,
    titulo: "Devoluções",
    texto: "Fique atento ao prazo de devolução. Livro atrasado bloqueia novos empréstimos.",
  },
  {
    icone: FiCheckCircle,
    titulo: "Como funciona",
    // Substituiu um card de "Novidades" que anunciava novidade sem saber se
    // havia alguma. Estes são os passos reais que a API impõe.
    texto: `1. Peça o livro pelo site
2. A biblioteca aprova o pedido
3. Retire no balcão`,
  },
];

function formatarData(valor) {
  if (!valor) return "—";
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "—" : data.toLocaleDateString("pt-BR");
}

// Rótulo do status para o card da home
function situacao(emprestimo) {
  if (emprestimo.status === "PENDENTE") return { texto: "Aguardando aprovação", bg: ALERTA_BG, cor: ALERTA_COR };
  if (emprestimo.atrasado) return { texto: "Atrasado", bg: ERRO_BG, cor: ERRO_COR };
  return { texto: "Emprestado", bg: OK_BG, cor: OK_COR };
}

function Capa({ src, alt, ...props }) {
  return (
    <AspectRatio ratio={2 / 3} borderRadius={RAIO_PEQUENO} overflow="hidden" bg={PLACEHOLDER_BG} {...props}>
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

export default function InicioPage() {
  const usuario = useUsuario();

  const [emprestimos, setEmprestimos] = useState(null); // null = carregando
  const [destaques, setDestaques] = useState(null);
  const [criterio, setCriterio] = useState("recentes");

  useEffect(() => {
    let ativo = true;

    getMeusEmprestimos().then((r) => {
      if (!ativo) return;
      const lista = r?.sucesso ? r.dados.emprestimos : [];
      setEmprestimos(lista.filter((e) => ATIVOS.includes(e.status)));
    });

    // O rótulo segue o critério que a API usou: com histórico são os mais
    // emprestados; sem histórico, as novidades. Antes dizia "Destaque" sempre.
    getLivrosPopulares(5).then((r) => {
      if (!ativo) return;
      setDestaques(r?.sucesso ? r.dados : []);
      if (r?.criterio) setCriterio(r.criterio);
    });

    return () => {
      ativo = false;
    };
  }, []);

  // Uma pendência por vez, a mais urgente: atraso vence pedido pendente.
  const atrasados = (emprestimos || []).filter((e) => e.atrasado);
  const pendentes = (emprestimos || []).filter((e) => e.status === "PENDENTE");

  const alerta = atrasados.length
    ? {
        icone: FiAlertTriangle,
        bg: ERRO_BG,
        cor: ERRO_COR,
        texto: `Você tem ${atrasados.length === 1 ? "um livro atrasado" : `${atrasados.length} livros atrasados`}. Devolva para poder pegar outro.`,
      }
    : pendentes.length
    ? {
        icone: FiClock,
        bg: ALERTA_BG,
        cor: ALERTA_COR,
        texto: `${pendentes.length === 1 ? "Uma solicitação aguarda" : `${pendentes.length} solicitações aguardam`} aprovação da biblioteca.`,
      }
    : null;

  const primeiroNome = (usuario?.nome || "").trim().split(" ")[0];

  return (
    <Shell
      titulo={`Bem-vindo(a)${primeiroNome ? `, ${primeiroNome}` : ""}!`}
      subtitulo="Explore, reserve e gerencie seus livros de forma fácil e rápida."
    >
          {/* 9: pendência sobe para o topo em vez de ficar escondida no meio */}
          {alerta && (
            <Flex
              bg={alerta.bg}
              border="1px solid"
              borderColor={alerta.cor}
              borderRadius={RAIO_MEDIO}
              p={4}
              gap={3}
              align="center"
              flexWrap="wrap"
            >
              <Icon as={alerta.icone} color={alerta.cor} boxSize={5} />
              <Text fontSize={TEXTO_APOIO} color={alerta.cor} flex={1} minW="200px">
                {alerta.texto}
              </Text>
              <Button
                as={Link}
                href="/emprestimo_livro"
                size="sm"
                variant="outline"
                borderColor={alerta.cor}
                color={alerta.cor}
                borderRadius={RAIO_CAMPO}
                _hover={{ bg: CARD_BG }}
              >
                Ver empréstimos
              </Button>
            </Flex>
          )}

          {/* EMPRÉSTIMOS — faixa horizontal, largura cheia.
              Antes era um cartão de meia tela ao lado dos destaques: os dois
              tinham alturas independentes e ritmos diferentes (lista vertical
              x grade de capas), e a linha nunca fechava. */}
          <VStack align="stretch" gap={GAP_CARTAO}>
            <Flex justify="space-between" align="center" gap={3} flexWrap="wrap">
              <TituloSecao>Seus empréstimos</TituloSecao>
              <Text
                as={Link}
                href="/emprestimo_livro"
                _hover={HOVER_LINK}
                color={PRIMARY_COLOR}
                fontSize={TEXTO_APOIO}
                fontWeight="medium"
              >
                Ver todos <Icon as={FiArrowRight} ml={1} display="inline" />
              </Text>
            </Flex>

            {emprestimos === null ? (
              <Flex justify="center" py={8}><Spinner color={PRIMARY_COLOR} /></Flex>
            ) : emprestimos.length === 0 ? (
              <Cartao>
                <Vazio
                  icone={FiBookOpen}
                  titulo="Nenhum empréstimo em andamento"
                  acao={
                    <Button as={Link} href="/buscar_livro" size="sm" bg={PRIMARY_COLOR} color="white" _hover={{ bg: PRIMARY_HOVER }}>
                      Buscar livros
                    </Button>
                  }
                >
                  Quando você pedir um livro, ele aparece aqui.
                </Vazio>
              </Cartao>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={GAP_CARTAO}>
                {emprestimos.map((e) => {
                  const st = situacao(e);
                  return (
                    <Cartao
                      key={e.id_emprestimo}
                      as={Link}
                      href={`/detalhe_livro/${e.id_livro}`}
                      borderColor={e.atrasado ? ERRO_COR : BORDER_COLOR}
                      display="flex"
                      gap={4}
                      alignItems="center"
                      transition={TRANSICAO}
                      _hover={HOVER_CARTAO}
                    >
                      <Capa src={e.capa_url} alt={e.titulo} w="72px" flexShrink={0} />

                      <VStack align="flex-start" gap={1} flex={1} minW={0}>
                        <Badge bg={st.bg} color={st.cor} borderRadius="full" px={2} textTransform="none" fontSize={TEXTO_MIUDO}>
                          {st.texto}
                        </Badge>
                        <Heading fontSize={TEXTO_APOIO} fontWeight="semibold" color={PRIMARY_COLOR} lineClamp={1}>
                          {e.titulo}
                        </Heading>
                        <Text fontSize={TEXTO_MIUDO} color={TEXT_LIGHT} lineClamp={1}>
                          {e.autor}
                        </Text>
                        <Text fontSize={TEXTO_MIUDO} color={TEXT_DARK}>
                          {e.status === "PENDENTE"
                            ? `Solicitado em ${formatarData(e.data_solicitacao)}`
                            : `Devolver até ${formatarData(e.data_devolucao_prevista)}`}
                        </Text>
                      </VStack>
                    </Cartao>
                  );
                })}
              </SimpleGrid>
            )}
          </VStack>

          {/* LIVROS — largura cheia, capas maiores */}
          <VStack align="stretch" gap={GAP_CARTAO}>
            <Flex justify="space-between" align="center" gap={3} flexWrap="wrap">
              <TituloSecao>
                {criterio === "populares" ? "Mais emprestados" : "Novidades no acervo"}
              </TituloSecao>
              <Text
                as={Link}
                href="/buscar_livro"
                _hover={HOVER_LINK}
                color={PRIMARY_COLOR}
                fontSize={TEXTO_APOIO}
                fontWeight="medium"
              >
                Ver o acervo <Icon as={FiArrowRight} ml={1} display="inline" />
              </Text>
            </Flex>

            {destaques === null ? (
              <Flex justify="center" py={8}><Spinner color={PRIMARY_COLOR} /></Flex>
            ) : destaques.length === 0 ? (
              <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT}>Nenhum livro disponível no momento.</Text>
            ) : (
              <SimpleGrid columns={{ base: 2, sm: 3, lg: 5 }} gap={GAP_CARTAO}>
                {destaques.map((livro) => (
                  <VStack
                    key={livro.id}
                    as={Link}
                    href={`/detalhe_livro/${livro.id}`}
                    role="group"
                    align="flex-start"
                    gap={2}
                    w="full"
                    transition={TRANSICAO}
                    _hover={HOVER_VITRINE}
                  >
                    <Capa
                      src={livro.capa_url}
                      alt={livro.titulo}
                      w="full"
                      boxShadow="sm"
                      transition={TRANSICAO}
                      _groupHover={HOVER_CAPA}
                    />
                    <VStack align="flex-start" gap={0} w="full">
                      <Text fontSize={TEXTO_APOIO} fontWeight="semibold" color={PRIMARY_COLOR} lineClamp={2} lineHeight="tight">
                        {livro.titulo}
                      </Text>
                      <Text fontSize={TEXTO_MIUDO} color={TEXT_LIGHT} lineClamp={1} mt={1}>
                        {livro.autor}
                      </Text>
                    </VStack>
                  </VStack>
                ))}
              </SimpleGrid>
            )}
          </VStack>

          {/* AVISOS DA BIBLIOTECA */}
          <VStack align="stretch" gap={GAP_CARTAO}>
            <Flex align="center" color={PRIMARY_COLOR} gap={3}>
              <Icon as={FiVolume2} boxSize={6} />
              <TituloSecao>Informações importantes</TituloSecao>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={GAP_CARTAO}>
              {AVISOS.map((aviso) => (
                <CartaoAviso key={aviso.titulo} icone={aviso.icone} titulo={aviso.titulo}>
                  {aviso.texto}
                </CartaoAviso>
              ))}
            </SimpleGrid>
          </VStack>
    </Shell>
  );
}
