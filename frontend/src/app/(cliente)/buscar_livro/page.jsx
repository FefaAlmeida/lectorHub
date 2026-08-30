"use client";
import { useCallback, useEffect, useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  Menu,
  Spinner,
  SimpleGrid,
  Stack,
  Text,
  IconButton,
  Separator,
  AspectRatio,
} from "@chakra-ui/react";

import { FiSearch, FiRefreshCcw, FiBookOpen, FiChevronLeft, FiChevronRight, FiChevronDown, FiX } from "react-icons/fi";

import Shell, { Carregando, Vazio, TelaCarregando } from "@/components/cliente/Shell";
import { getLivros, getCategoriasComLivros } from "../../../api";

// --- CONFIGURAÇÕES VISUAIS ---
// Esta tela é a referência do visual do cliente; os tokens vivem em tema.js.
import {
  EASE,
  PRIMARY_COLOR,
  CARD_BG,
  BORDER_COLOR,
  TEXT_DARK,
  TEXT_LIGHT,
  PLACEHOLDER_BG,
  SUAVE_BG,
  TEXTO_MIUDO,
  PRIMARY_HOVER,
  RAIO_CARTAO,
  RAIO_CAMPO,
  RAIO_MEDIO,
  RAIO_PEQUENO,
  HOVER_CARTAO,
  TRANSICAO,
  ALTURA_CAMPO,
  GAP_CARTAO,
} from "@/components/cliente/tema";

const LIMITE_POR_PAGINA = 12;

// Cada opção guarda o rótulo exibido e o valor enviado à API.
const OPCOES_DISPONIBILIDADE = [
  { label: "Todos", valor: "" },
  { label: "Disponível", valor: "true" },
  { label: "Indisponível", valor: "false" },
];

const OPCOES_ORDEM = [
  { label: "Título (A-Z)", valor: "titulo_asc" },
  { label: "Título (Z-A)", valor: "titulo_desc" },
  { label: "Mais recentes", valor: "recentes" },
];

const FILTROS_INICIAIS = {
  // A categoria virou FK: o filtro guarda o id, não mais o nome.
  categoria_id: "",
  disponivel: "",
  ordem: "titulo_asc",
};

// --- CAPA COM FALLBACK ---
// `capa_url` é opcional no banco, então nem todo livro tem imagem.
function Capa({ livro }) {
  return (
    <AspectRatio ratio={2 / 3} borderRadius={RAIO_MEDIO} overflow="hidden" bg={PLACEHOLDER_BG}>
      {livro.capa_url ? (
        <Image
          src={livro.capa_url}
          alt={livro.titulo}
          objectFit="cover"
          w="100%"
          h="100%"
        />
      ) : (
        <Flex align="center" justify="center" bg={PLACEHOLDER_BG}>
          <Icon as={FiBookOpen} boxSize={8} color={PRIMARY_COLOR} opacity={0.35} />
        </Flex>
      )}
    </AspectRatio>
  );
}

// --- DROPDOWN DE FILTRO ---
function FiltroMenu({ label, opcoes, valor, onChange }) {
  const selecionada = opcoes.find((opcao) => opcao.valor === valor) || opcoes[0];

  return (
    <Box flex={{ base: "1 1 100%", md: "1" }}>
      <Text fontSize="xs" color={TEXT_DARK} mb={1.5} fontWeight="semibold" ml={2}>
        {label}
      </Text>

      <Menu.Root
        positioning={{ sameWidth: true }}
        onSelect={(detalhe) => onChange(detalhe.value)}
      >
        <Menu.Trigger asChild>
          <Button
            variant="outline"
            bg="white"
            border="1px solid"
            borderColor={BORDER_COLOR}
            borderRadius={RAIO_CAMPO}
            h={ALTURA_CAMPO}
            px={4}
            w="full"
            justifyContent="space-between"
            color={TEXT_DARK}
            fontWeight="500"
            transition={`all .25s ${EASE}`}
            _hover={{
              borderColor: PRIMARY_COLOR,
              bg: SUAVE_BG,
              boxShadow: "md",
            }}
            _focus={{
              borderColor: PRIMARY_COLOR,
              boxShadow: "0 0 0 3px rgba(74,14,23,.15)",
            }}
          >
            {selecionada.label}
            <Icon as={FiChevronDown} color={PRIMARY_COLOR} fontSize="lg" />
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content
            bg="white"
            borderRadius={RAIO_CARTAO}
            border="1px solid"
            borderColor={BORDER_COLOR}
            boxShadow="0 8px 24px rgba(74,14,23,.12)"
            p={2}
            zIndex="popover"
          >
            {opcoes.map((opcao) => (
              <Menu.Item
                key={opcao.valor || opcao.label}
                value={opcao.valor}
                px={3}
                py={2.5}
                borderRadius={RAIO_PEQUENO}
                cursor="pointer"
                color={TEXT_DARK}
                fontWeight="500"
                transition="all 0.2s ease"
                _hover={{
                  bg: "#F2E6E8",
                  color: PRIMARY_COLOR,
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

// --- PÁGINA PRINCIPAL ---
function BuscarLivrosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // A home manda ?busca=..., então a tela já abre com o resultado.
  const buscaInicial = searchParams.get("busca") || "";

  const [termo, setTermo] = useState(buscaInicial); // o que está digitado no input
  const [busca, setBusca] = useState(buscaInicial); // o que já foi enviado à API
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);
  const [pagina, setPagina] = useState(1);

  const [livros, setLivros] = useState([]);
  const [paginacao, setPaginacao] = useState({ total: 0, totalPaginas: 1 });
  const [categorias, setCategorias] = useState([{ label: "Todas", valor: "" }]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Categorias vêm do banco — só precisam ser buscadas uma vez.
  useEffect(() => {
    let ativo = true;

    // Só as categorias que têm livro: oferecer as vazias só gera busca zerada.
    getCategoriasComLivros()
      .then((resposta) => {
        if (!ativo || !resposta?.sucesso) return;

        setCategorias([
          { label: "Todas", valor: "" },
          ...resposta.dados.map((c) => ({ label: c.nome, valor: String(c.id) })),
        ]);
      })
      .catch(() => {
        /* filtro segue só com "Todas" */
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarLivros() {
      try {
        setCarregando(true);

        const resposta = await getLivros({
          busca,
          categoria_id: filtros.categoria_id,
          disponivel: filtros.disponivel,
          ordem: filtros.ordem,
          pagina,
          limite: LIMITE_POR_PAGINA,
        });

        if (!ativo) return;

        if (!resposta?.sucesso) {
          setLivros([]);
          setPaginacao({ total: 0, totalPaginas: 1 });
          setErro(resposta?.mensagem || "Não foi possível carregar os livros.");
          return;
        }

        setLivros(resposta.dados);
        setPaginacao(resposta.paginacao);
        setErro(null);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarLivros();

    return () => {
      ativo = false;
    };
  }, [busca, filtros, pagina]);

  // Qualquer mudança de filtro/busca volta para a primeira página.
  const aplicarFiltro = useCallback((campo, valor) => {
    setFiltros((atuais) => ({ ...atuais, [campo]: valor }));
    setPagina(1);
  }, []);

  function buscar() {
    setBusca(termo.trim());
    setPagina(1);
  }

  function limparFiltros() {
    setTermo("");
    setBusca("");
    setFiltros(FILTROS_INICIAIS);
    setPagina(1);
  }

  function abrirDetalhes(id) {
    router.push(`/detalhe_livro/${id}`);
  }

  // Rótulos do que está filtrando agora; clicar remove o filtro.
  const filtrosAtivos = [
    filtros.categoria_id && {
      campo: "categoria_id",
      limpo: "",
      label: categorias.find((c) => c.valor === filtros.categoria_id)?.label,
    },
    filtros.disponivel && {
      campo: "disponivel",
      limpo: "",
      label: OPCOES_DISPONIBILIDADE.find((o) => o.valor === filtros.disponivel)?.label,
    },
    filtros.ordem !== FILTROS_INICIAIS.ordem && {
      campo: "ordem",
      limpo: FILTROS_INICIAIS.ordem,
      label: OPCOES_ORDEM.find((o) => o.valor === filtros.ordem)?.label,
    },
  ].filter((c) => c && c.label);

  // Janela em volta da página atual + primeira e última, com reticências.
  // Antes renderizava um botão por página: 30 páginas viravam 30 botões.
  const paginas = (() => {
    const total = paginacao.totalPaginas || 1;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const janela = new Set([1, total, pagina, pagina - 1, pagina + 1]);
    const lista = [...janela].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

    return lista.reduce((acc, n, i) => {
      if (i > 0 && n - lista[i - 1] > 1) acc.push("...");
      acc.push(n);
      return acc;
    }, []);
  })();

  return (
    <Shell
      titulo="Buscar Livros"
      subtitulo="Encontre o livro ideal para você. Pesquise por título, autor, assunto ou palavra-chave."
    >

          {/* Barra de Busca e Botões */}
          <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <InputGroup
              flex="1"
              startElement={<Icon as={FiSearch} color={PRIMARY_COLOR} ml={2} />}
            >
              <Input
                placeholder="Digite título, autor ou assunto..."
                value={termo}
                onChange={(evento) => setTermo(evento.target.value)}
                onKeyDown={(evento) => evento.key === "Enter" && buscar()}
                bg={CARD_BG}
                border="1px solid"
                borderColor={BORDER_COLOR}
                borderRadius={RAIO_CAMPO}
                _placeholder={{ color: "#A8A29E" }}
                _focus={{ borderColor: PRIMARY_COLOR, boxShadow: `0 0 0 1px ${PRIMARY_COLOR}` }}
                pl={10}
                size="lg"
                transition={`all 0.2s ${EASE}`}
              />
            </InputGroup>

            <Button
              onClick={buscar}
              bg={PRIMARY_COLOR}
              color="white"
              size="lg"
              borderRadius={RAIO_CAMPO}
              _hover={{ bg: PRIMARY_HOVER }}
              transition={TRANSICAO}
            >
              Buscar
            </Button>

          </Flex>

          {/* Filtros */}
          <Flex gap={4} wrap="wrap" align="flex-start">
            <FiltroMenu
              label="Categoria"
              opcoes={categorias}
              valor={filtros.categoria_id}
              onChange={(valor) => aplicarFiltro("categoria_id", valor)}
            />
            <FiltroMenu
              label="Disponibilidade"
              opcoes={OPCOES_DISPONIBILIDADE}
              valor={filtros.disponivel}
              onChange={(valor) => aplicarFiltro("disponivel", valor)}
            />
            <FiltroMenu
              label="Ordenar por"
              opcoes={OPCOES_ORDEM}
              valor={filtros.ordem}
              onChange={(valor) => aplicarFiltro("ordem", valor)}
            />

            <Button
              variant="ghost"
              color={PRIMARY_COLOR}
              _hover={{ bg: "transparent", textDecoration: "underline" }}
              px={2}
              h={ALTURA_CAMPO}
              mt="22px"
              onClick={limparFiltros}
            >
              <Icon mr={2}><FiRefreshCcw /></Icon>
              Limpar filtros
            </Button>
          </Flex>

          {/* Cabeçalho dos Resultados */}
          <Flex justify="space-between" align="center" gap={3} flexWrap="wrap" borderBottom="1px solid" borderColor={BORDER_COLOR} pb={3}>
            <HStack gap={2} color={PRIMARY_COLOR}>
              <Icon as={FiBookOpen} boxSize={5} />
              <Text fontWeight="bold" fontSize="lg">
                {paginacao.total} {paginacao.total === 1 ? "livro" : "livros"}
              </Text>
            </HStack>

            {/* 16: o que está filtrando fica visível e removível, em vez de
                só dentro do dropdown fechado. */}
            {filtrosAtivos.length > 0 && (
              <HStack gap={2} flexWrap="wrap">
                {filtrosAtivos.map((chip) => (
                  <HStack
                    key={chip.campo}
                    as="button"
                    type="button"
                    onClick={() => aplicarFiltro(chip.campo, chip.limpo)}
                    gap={1.5}
                    bg={SUAVE_BG}
                    color={PRIMARY_COLOR}
                    border="1px solid"
                    borderColor={BORDER_COLOR}
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize={TEXTO_MIUDO}
                    fontWeight="medium"
                    transition={TRANSICAO}
                    _hover={{ bg: CARD_BG }}
                    title={`Remover filtro: ${chip.label}`}
                  >
                    <Text>{chip.label}</Text>
                    <Icon as={FiX} boxSize={3} />
                  </HStack>
                ))}
              </HStack>
            )}
          </Flex>

          {/* Resultados */}
          {carregando ? (
            <Carregando texto="Carregando livros..." />
          ) : erro ? (
            <Vazio titulo="Erro ao carregar o catálogo">{erro}</Vazio>
          ) : livros.length === 0 ? (
            <Vazio titulo="Nenhum livro encontrado">
              Tente outro termo de busca ou limpe os filtros.
            </Vazio>
          ) : (
            // Grid distribui as colunas; com Flex+wrap e card de largura
            // fixa, a última linha ficava encostada à esquerda.
            <SimpleGrid columns={{ base: 2, sm: 3, lg: 4, xl: 5 }} gap={GAP_CARTAO} py={2}>
              {livros.map((livro) => (
                <Card.Root
                  key={livro.id}
                  variant="outline"
                  bg={CARD_BG}
                  borderRadius={RAIO_CARTAO}
                  border="1px solid"
                  borderColor={BORDER_COLOR}
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => abrirDetalhes(livro.id)}
                  transition={TRANSICAO}
                  _hover={HOVER_CARTAO}
                >
                  <Box p={3} pb={0} position="relative">
                    <Capa livro={livro} />
                  </Box>

                  <Card.Body pt={3} pb={2} px={3} gap={1}>
                    <Heading size="sm" color={TEXT_DARK} lineClamp={1} fontSize="sm">
                      {livro.titulo}
                    </Heading>

                    <Text color={TEXT_LIGHT} fontSize="xs" mb={1} lineClamp={1}>
                      {livro.autor}
                    </Text>

                    <HStack flexWrap="wrap" gap={1} mb={2}>
                      <Badge
                        bg={SUAVE_BG}
                        color={PRIMARY_COLOR}
                        fontWeight="600"
                        borderRadius="full"
                        px={3}
                      >
                        {livro.categoria}
                      </Badge>
                      {livro.ano_publicacao && (
                        <Badge
                          bg={SUAVE_BG}
                          color={PRIMARY_COLOR}
                          fontWeight="600"
                          borderRadius="full"
                          px={3}
                        >
                          {livro.ano_publicacao}
                        </Badge>
                      )}
                    </HStack>

                    <HStack align="center" gap={1.5}>
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg={livro.disponivel ? "#48BB78" : "#E53E3E"}
                      />
                      <Text fontSize="xs" color={TEXT_DARK} fontWeight="medium">
                        {livro.disponivel ? "Disponível" : "Indisponível"}
                      </Text>
                    </HStack>
                  </Card.Body>

                  <Card.Footer px={3} pb={3} pt={1}>
                    <Button
                      w="full"
                      bg={SUAVE_BG}
                      color={PRIMARY_COLOR}
                      border="none"
                      borderRadius={RAIO_CAMPO}
                      fontWeight="600"
                      transition=".25s"
                      _hover={{
                        bg: PRIMARY_COLOR,
                        color: "white",
                      }}
                    >
                      Ver detalhes
                    </Button>
                  </Card.Footer>
                </Card.Root>
              ))}
            </SimpleGrid>
          )}

          {/* Paginação */}
          {paginacao.totalPaginas > 1 && (
            <Flex justify="center" align="center" mt={4} gap={2}>
              <IconButton
                variant="ghost"
                color={TEXT_LIGHT}
                aria-label="Anterior"
                size="sm"
                disabled={pagina === 1}
                onClick={() => setPagina((atual) => Math.max(atual - 1, 1))}
              >
                <FiChevronLeft />
              </IconButton>

              {paginas.map((numero, indice) =>
                numero === "..." ? (
                  <Text key={`reticencias-${indice}`} px={1} color={TEXT_LIGHT}>
                    …
                  </Text>
                ) : (
                  <Button
                    key={numero}
                    size="sm"
                    w={8}
                    p={0}
                    borderRadius={RAIO_PEQUENO}
                    variant={numero === pagina ? "solid" : "ghost"}
                    bg={numero === pagina ? PRIMARY_COLOR : "transparent"}
                    color={numero === pagina ? "white" : TEXT_DARK}
                    onClick={() => setPagina(numero)}
                  >
                    {numero}
                  </Button>
                )
              )}

              <IconButton
                variant="ghost"
                color={TEXT_LIGHT}
                aria-label="Próximo"
                size="sm"
                disabled={pagina === paginacao.totalPaginas}
                onClick={() =>
                  setPagina((atual) => Math.min(atual + 1, paginacao.totalPaginas))
                }
              >
                <FiChevronRight />
              </IconButton>
            </Flex>
          )}

    </Shell>
  );
}

// useSearchParams exige Suspense para o Next conseguir pré-renderizar a rota.
export default function BuscarLivrosPage() {
  return (
    <Suspense fallback={<TelaCarregando />}>
      <BuscarLivrosConteudo />
    </Suspense>
  );
}
