"use client";
import Sidebar from "../../../components/sideBar/sideBar";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  Stack,
  Text,
  IconButton,
  Separator,
  AspectRatio,
} from "@chakra-ui/react";

import {
  FiGrid,
  FiList,
  FiSearch,
  FiSliders,
  FiRefreshCcw,
  FiBookOpen,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiHome,
  FiClock,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { getLivros, getCategorias, logoutUsuario } from "../../../api";

// --- CONFIGURAÇÕES VISUAIS ---
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const PRIMARY_COLOR = "#4A0E17"; // Cor principal vinho
const BG_COLOR = "#F5F2EE";
const CARD_BG = "#FFFFFF";
const BORDER_COLOR = "#EFEBE3";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";

const LIMITE_POR_PAGINA = 12;

// --- DADOS DA NAVEGAÇÃO ---
const NAV_ITEMS = [
  { label: "Início", icon: FiHome, href: "/inicio" },
  { label: "Buscar Livros", icon: FiSearch, href: "/buscar_livro", active: true },
  { label: "Meus Empréstimos", icon: FiBookOpen, href: "/emprestimo_livro" },
  { label: "Histórico", icon: FiClock, href: "/emprestimo_livro?aba=historico" },
  { label: "Meu Cadastro", icon: FiUser, href: "/alterar_cadastro" },
];

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
  categoria: "",
  disponivel: "",
  ordem: "titulo_asc",
};

// --- CAPA COM FALLBACK ---
// `capa_url` é opcional no banco, então nem todo livro tem imagem.
function Capa({ livro }) {
  return (
    <AspectRatio ratio={2 / 3} borderRadius="12px" overflow="hidden" bg="#F7F3EF">
      {livro.capa_url ? (
        <Image
          src={livro.capa_url}
          alt={livro.titulo}
          objectFit="cover"
          w="100%"
          h="100%"
          transition=".35s"
          _hover={{ transform: "scale(1.05)" }}
        />
      ) : (
        <Flex align="center" justify="center" bg="#F7F3EF">
          <Icon as={FiBookOpen} boxSize={8} color={PRIMARY_COLOR} opacity={0.35} />
        </Flex>
      )}
    </AspectRatio>
  );
}

// --- COMPONENTE AUXILIAR DA SIDEBAR ---
function NavItem({ item }) {
  return (
    <HStack
      as="a"
      href={item.href}
      gap={3}
      p={3}
      pl={4}
      borderRadius="6px"
      color={item.active ? "white" : TEXT_DARK}
      bg={item.active ? PRIMARY_COLOR : "transparent"}
      _hover={!item.active ? { bg: "#FFFFFF" } : {}}
      transition={`all 0.2s ${EASE}`}
      cursor="pointer"
      fontWeight={item.active ? "semibold" : "normal"}
    >
      <Icon as={item.icon} w={5} h={5} mr={3} />
      <Text fontSize="md">{item.label}</Text>
    </HStack>
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
            borderColor="#E7DED8"
            borderRadius="14px"
            h="48px"
            px={4}
            w="full"
            justifyContent="space-between"
            color={TEXT_DARK}
            fontWeight="500"
            transition={`all .25s ${EASE}`}
            _hover={{
              borderColor: PRIMARY_COLOR,
              bg: "#FAF5F6",
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
            borderRadius="16px"
            border="1px solid"
            borderColor="#E7DED8"
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
                borderRadius="8px"
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
export default function BuscarLivros() {
  const router = useRouter();

  const [termo, setTermo] = useState(""); // o que está digitado no input
  const [busca, setBusca] = useState(""); // o que já foi enviado à API
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

    getCategorias()
      .then((resposta) => {
        if (!ativo || !resposta?.sucesso) return;

        setCategorias([
          { label: "Todas", valor: "" },
          ...resposta.dados.map((nome) => ({ label: nome, valor: nome })),
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
          categoria: filtros.categoria,
          disponivel: filtros.disponivel,
          ordem: filtros.ordem,
          pagina,
          limite: LIMITE_POR_PAGINA,
        });

        if (!ativo) return;

        if (!resposta?.sucesso) {
          setLivros([]);
          setErro(resposta?.mensagem || "Não foi possível carregar os livros.");
          return;
        }

        setLivros(resposta.dados);
        setPaginacao(resposta.paginacao);
        setErro(null);
      } catch {
        if (ativo) {
          setLivros([]);
          setErro(
            "Não foi possível falar com o servidor. Verifique se a API está rodando em http://localhost:3001."
          );
        }
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

  async function sair() {
    try {
      await logoutUsuario();
    } finally {
      router.push("/login");
    }
  }

  const paginas = Array.from(
    { length: paginacao.totalPaginas || 1 },
    (_, indice) => indice + 1
  );

  return (
    <Flex minH="100vh" bg={BG_COLOR}>
      {/* BARRA LATERAL */}
      <Sidebar/>

      {/* CONTEÚDO PRINCIPAL */}
      <Box flex={1} p={{ base: 6, md: 8 }} pb={16} overflow="hidden">
        <Stack gap={8} align="stretch" maxW="8xl" mx="auto">

          {/* Cabeçalho */}
          <Stack gap={2}>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              color={PRIMARY_COLOR}
              fontFamily="Georgia, serif"
            >
              Buscar Livros
            </Heading>
            <Text fontSize="md" color={TEXT_LIGHT}>
              Encontre o livro ideal para você. Pesquise por título, autor, assunto ou palavra-chave.
            </Text>
          </Stack>

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
                borderRadius="full"
                _placeholder={{ color: "#AAA" }}
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
              borderRadius="14px"
              boxShadow="0 4px 12px rgba(74,14,23,.15)"
              _hover={{
                bg: "#360A11",
                transform: "translateY(-2px)",
              }}
              transition=".3s"
            >
              Buscar
            </Button>

            <Button variant="outline" color={PRIMARY_COLOR} borderColor={PRIMARY_COLOR} _hover={{ bg: "#f2e6e8" }} size="lg" borderRadius="full">
              <Icon mr={2}><FiSliders /></Icon>
              Busca Avançada
            </Button>
          </Flex>

          {/* Filtros */}
          <Flex gap={4} wrap="wrap" align="flex-start">
            <FiltroMenu
              label="Categoria"
              opcoes={categorias}
              valor={filtros.categoria}
              onChange={(valor) => aplicarFiltro("categoria", valor)}
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
              h="48px"
              mt="22px"
              onClick={limparFiltros}
            >
              <Icon mr={2}><FiRefreshCcw /></Icon>
              Limpar filtros
            </Button>
          </Flex>

          {/* Cabeçalho dos Resultados */}
          <Flex justify="space-between" align="center" mt={4} borderBottom="1px solid" borderColor={BORDER_COLOR} pb={4}>
            <HStack gap={4}>
              <Flex bg="white" borderRadius="16px" border="1px solid" borderColor="#E8E1D8" p={5}>
                <FiBookOpen size={18} />
              </Flex>
              <Stack gap={0}>
                <Text fontWeight="bold" color={PRIMARY_COLOR} fontSize="lg">
                  {paginacao.total} {paginacao.total === 1 ? "livro encontrado" : "livros encontrados"}
                </Text>
                <Text fontSize="sm" color={TEXT_LIGHT}>
                  Exibindo resultados da sua busca
                </Text>
              </Stack>
            </HStack>

            <HStack gap={2}>
              <Text fontSize="sm" color={TEXT_LIGHT} mr={2}>Visualização:</Text>
              <IconButton bg={PRIMARY_COLOR} color="white" aria-label="Grade" size="sm" borderRadius="md">
                <FiGrid />
              </IconButton>
              <IconButton bg={CARD_BG} border="1px solid" borderColor={BORDER_COLOR} color={TEXT_LIGHT} aria-label="Lista" size="sm" borderRadius="md">
                <FiList />
              </IconButton>
            </HStack>
          </Flex>

          {/* Resultados */}
          {carregando ? (
            <Flex justify="center" align="center" py={20}>
              <Stack align="center" gap={4}>
                <Spinner color={PRIMARY_COLOR} size="xl" borderWidth="3px" />
                <Text color={TEXT_LIGHT} fontSize="sm">Carregando livros...</Text>
              </Stack>
            </Flex>
          ) : erro ? (
            <Flex justify="center" align="center" py={20}>
              <Stack align="center" gap={3} textAlign="center" maxW="md">
                <Text color={PRIMARY_COLOR} fontWeight="bold">Erro ao carregar o catálogo</Text>
                <Text color={TEXT_LIGHT} fontSize="sm">{erro}</Text>
              </Stack>
            </Flex>
          ) : livros.length === 0 ? (
            <Flex justify="center" align="center" py={20}>
              <Stack align="center" gap={3} textAlign="center" maxW="md">
                <Text color={PRIMARY_COLOR} fontWeight="bold">Nenhum livro encontrado</Text>
                <Text color={TEXT_LIGHT} fontSize="sm">
                  Tente outro termo de busca ou limpe os filtros.
                </Text>
              </Stack>
            </Flex>
          ) : (
            <Flex
              gap={6}
              wrap="wrap"
              py={8} /* Padding vertical para a sombra do hover não cortar */
              px={2}
            >
              {livros.map((livro) => (
                <Card.Root
                  key={livro.id}
                  variant="outline"
                  bg={CARD_BG}
                  borderRadius="18px"
                  border="1px solid"
                  borderColor="#E7DED8"
                  overflow="hidden"
                  minW="210px"
                  maxW="210px"
                  cursor="pointer"
                  onClick={() => abrirDetalhes(livro.id)}
                  transition={`all 0.3s ${EASE}`}
                  _hover={{
                    transform: "translateY(-6px)",
                    borderColor: PRIMARY_COLOR,
                    boxShadow: "0 8px 20px rgba(74,14,23,.12)",
                  }}
                >
                  <Box p={3} pb={0} position="relative">
                    <Icon
                      as={FiHeart}
                      position="absolute"
                      top={5}
                      right={5}
                      color="gray.400"
                      cursor="pointer"
                      zIndex={2}
                      _hover={{ color: PRIMARY_COLOR }}
                      onClick={(evento) => evento.stopPropagation()}
                    />
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
                        bg="#FAF5F6"
                        color={PRIMARY_COLOR}
                        fontWeight="600"
                        borderRadius="99px"
                        px={3}
                      >
                        {livro.categoria}
                      </Badge>
                      {livro.ano_publicacao && (
                        <Badge
                          bg="#FAF5F6"
                          color={PRIMARY_COLOR}
                          fontWeight="600"
                          borderRadius="99px"
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
                      bg="#FAF5F6"
                      color={PRIMARY_COLOR}
                      border="none"
                      borderRadius="10px"
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
            </Flex>
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

              {paginas.map((numero) => (
                <Button
                  key={numero}
                  size="sm"
                  w={8}
                  p={0}
                  borderRadius="6px"
                  variant={numero === pagina ? "solid" : "ghost"}
                  bg={numero === pagina ? PRIMARY_COLOR : "transparent"}
                  color={numero === pagina ? "white" : TEXT_DARK}
                  onClick={() => setPagina(numero)}
                >
                  {numero}
                </Button>
              ))}

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

        </Stack>
      </Box>
    </Flex>
  );
}
