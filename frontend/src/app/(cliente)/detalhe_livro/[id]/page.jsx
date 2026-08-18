"use client";

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
  Separator,
  AspectRatio,
  Spinner,
  Badge,
  Textarea,
} from "@chakra-ui/react";
import {
  FiHome,
  FiSearch,
  FiBookOpen,
  FiClock,
  FiUser,
  FiLogOut,
  FiArrowLeft,
  FiStar,
  FiBookmark,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCalendar,
  FiTag,
  FiSend,
  FiTrash2,
} from "react-icons/fi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Importação da API
import {
  getLivroPorId,
  getAvaliacoes,
  salvarAvaliacao,
  excluirAvaliacao,
  getPerfil,
  getElegibilidade,
  solicitarEmprestimo,
  logoutUsuario,
} from "../../../../api";

// --- CONFIGURAÇÕES VISUAIS ---
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const PRIMARY_COLOR = "#7A3131";
const BG_COLOR = "#FFFFFF";
const CARD_BG = "#FFFFFF";
const BORDER_COLOR = "#EFEBE3";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";

const NAV_ITEMS = [
  { label: "Início", icon: FiHome, href: "/inicio" },
  { label: "Buscar Livros", icon: FiSearch, href: "/buscar_livro", active: true },
  { label: "Meus Empréstimos", icon: FiBookOpen, href: "/emprestimo_livro" },
  { label: "Histórico", icon: FiClock, href: "/emprestimo_livro?aba=historico" },
  { label: "Meu Cadastro", icon: FiUser, href: "/alterar_cadastro" },
];

// `capa_url` é opcional no banco, então nem todo livro tem imagem.
function Capa({ src, alt, ...props }) {
  return (
    <AspectRatio ratio={2 / 3} overflow="hidden" bg="#F2EFE9" {...props}>
      {src ? (
        <Image src={src} alt={alt} objectFit="cover" />
      ) : (
        <Flex align="center" justify="center" bg="#F2EFE9">
          <Icon as={FiBookOpen} boxSize={10} color={PRIMARY_COLOR} opacity={0.35} />
        </Flex>
      )}
    </AspectRatio>
  );
}

// Linha de 5 estrelas. Sem `onSelect` vira só leitura.
function Estrelas({ nota, onSelect, tamanho = 5 }) {
  return (
    <HStack gap={1}>
      {[1, 2, 3, 4, 5].map((estrela) => (
        <Icon
          key={estrela}
          as={FiStar}
          w={tamanho}
          h={tamanho}
          color="#E2B93B"
          fill={estrela <= nota ? "#E2B93B" : "none"}
          cursor={onSelect ? "pointer" : "default"}
          aria-label={`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`}
          onClick={onSelect ? () => onSelect(estrela) : undefined}
        />
      ))}
    </HStack>
  );
}

function formatarData(valor) {
  if (!valor) return "";

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "" : data.toLocaleDateString("pt-BR");
}

function NavItem({ item }) {
  return (
    <HStack
      as="a"
      href={item.href}
      gap={3}
      p={3}
      pl={4}
      borderRadius="6px"
      color={item.active ? "white" : PRIMARY_COLOR}
      bg={item.active ? PRIMARY_COLOR : "transparent"}
      _hover={!item.active ? { bg: "#F5F1E9" } : {}}
      transition={`all 0.2s ${EASE}`}
      cursor="pointer"
      fontWeight={item.active ? "semibold" : "normal"}
    >
      <Icon as={item.icon} w={5} h={5} />
      <Text fontSize="md">{item.label}</Text>
    </HStack>
  );
}

export default function DetalhesLivroPage() {
  // Rota dinâmica /detalhe_livro/[id] — o ID vem sempre da URL.
  const { id: bookId } = useParams();
  const router = useRouter();

  const [livro, setLivro] = useState(null);
  const [semelhantes, setSemelhantes] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: "ok" | "erro", texto }
  const [elegibilidade, setElegibilidade] = useState(null);
  const [solicitando, setSolicitando] = useState(false);
  const [avisoEmprestimo, setAvisoEmprestimo] = useState(null);

  // Quem está logado — define se o formulário de avaliação aparece.
  useEffect(() => {
    let ativo = true;

    getPerfil()
      .then((resposta) => {
        if (ativo && resposta?.sucesso) setUsuario(resposta.dados);
      })
      .catch(() => {
        /* visitante não logado: o formulário vira convite para entrar */
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarLivro() {
      if (!bookId) return;

      try {
        setCarregando(true);
        const resposta = await getLivroPorId(bookId);

        if (!ativo) return;

        if (!resposta?.sucesso || !resposta?.dados) {
          setLivro(null);
          setSemelhantes([]);
          setAvaliacoes([]);
          setEstatisticas(null);
          setErro(resposta?.mensagem || "Livro não encontrado na base de dados.");
          return;
        }

        const dados = resposta.dados;

        setLivro({
          id: dados.id,
          title: dados.titulo,
          author: dados.autor,
          category: dados.categoria || "Geral",
          publishYear: dados.ano_publicacao || "N/A",
          isAvailable: Boolean(dados.disponivel),
          coverUrl: dados.capa_url,
          synopsis:
            dados.sinopse ||
            "Nenhuma sinopse cadastrada para este livro no momento.",
        });
        setSemelhantes(dados.semelhantes || []);
        setAvaliacoes(dados.avaliacoes || []);
        setEstatisticas(dados.estatisticas || null);
        setErro(null);
      } catch (error) {
        console.error("[DetalhesLivro] Erro na busca:", error);

        if (ativo) {
          setLivro(null);
          setSemelhantes([]);
          setAvaliacoes([]);
          setEstatisticas(null);
          setErro(
            "Não foi possível falar com o servidor. Verifique se a API está rodando em http://localhost:3001."
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarLivro();

    return () => {
      ativo = false;
    };
  }, [bookId]);

  // A API garante uma avaliação por usuário por livro.
  const minhaAvaliacao = useMemo(
    () =>
      usuario
        ? avaliacoes.find((item) => item.id_usuario === usuario.id) || null
        : null,
    [avaliacoes, usuario]
  );

  // Ao encontrar a avaliação já existente, o formulário abre preenchido
  // para o usuário editar em vez de escrever de novo do zero.
  useEffect(() => {
    if (minhaAvaliacao) {
      setUserRating(minhaAvaliacao.nota);
      setNovoComentario(minhaAvaliacao.comentario || "");
    }
  }, [minhaAvaliacao?.id]);

  // Regras de empréstimo: o aviso aparece ANTES do clique, não depois do erro.
  const recarregarElegibilidade = useCallback(async () => {
    const resposta = await getElegibilidade();

    if (resposta?.sucesso) setElegibilidade(resposta.dados);
  }, []);

  useEffect(() => {
    if (usuario) recarregarElegibilidade().catch(() => {});
  }, [usuario, recarregarElegibilidade]);

  async function sair() {
    try {
      await logoutUsuario();
    } finally {
      router.push("/login");
    }
  }

  async function pedirEmprestimo() {
    setAvisoEmprestimo(null);
    setSolicitando(true);

    try {
      const resposta = await solicitarEmprestimo(livro.id);

      if (!resposta?.sucesso) {
        setAvisoEmprestimo({
          tipo: "erro",
          texto: resposta?.mensagem || "Não foi possível solicitar o empréstimo.",
        });

        if (resposta?.dados) setElegibilidade(resposta.dados);
        return;
      }

      setElegibilidade(resposta.dados.elegibilidade);
      setAvisoEmprestimo({ tipo: "ok", texto: resposta.mensagem });
    } catch {
      setAvisoEmprestimo({
        tipo: "erro",
        texto: "Não foi possível falar com o servidor.",
      });
    } finally {
      setSolicitando(false);
    }
  }

  const recarregarAvaliacoes = useCallback(async () => {
    const resposta = await getAvaliacoes(bookId);

    if (resposta?.sucesso) {
      setAvaliacoes(resposta.dados.avaliacoes);
      setEstatisticas(resposta.dados.estatisticas);
    }
  }, [bookId]);

  async function enviarAvaliacao() {
    setAviso(null);
    setEnviando(true);

    try {
      const resposta = await salvarAvaliacao(bookId, {
        nota: userRating,
        comentario: novoComentario.trim(),
      });

      if (!resposta?.sucesso) {
        setAviso({
          tipo: "erro",
          texto: resposta?.mensagem || "Não foi possível enviar sua avaliação.",
        });
        return;
      }

      await recarregarAvaliacoes();
      setAviso({ tipo: "ok", texto: resposta.mensagem });
    } catch {
      setAviso({
        tipo: "erro",
        texto: "Não foi possível falar com o servidor.",
      });
    } finally {
      setEnviando(false);
    }
  }

  async function removerAvaliacao() {
    setAviso(null);
    setEnviando(true);

    try {
      const resposta = await excluirAvaliacao(bookId);

      if (!resposta?.sucesso) {
        setAviso({
          tipo: "erro",
          texto: resposta?.mensagem || "Não foi possível remover sua avaliação.",
        });
        return;
      }

      setUserRating(5);
      setNovoComentario("");
      await recarregarAvaliacoes();
      setAviso({ tipo: "ok", texto: resposta.mensagem });
    } catch {
      setAviso({
        tipo: "erro",
        texto: "Não foi possível falar com o servidor.",
      });
    } finally {
      setEnviando(false);
    }
  }

  // 1. TELA DE CARREGAMENTO
  if (carregando) {
    return (
      <Flex minH="100vh" bg={BG_COLOR} align="center" justify="center">
        <VStack gap={4}>
          <Spinner color={PRIMARY_COLOR} size="xl" borderWidth="3px" />
          <Text color={TEXT_LIGHT} fontSize="sm">
            Carregando detalhes do livro...
          </Text>
        </VStack>
      </Flex>
    );
  }

  // 2. TELA DE ERRO OU LIVRO NÃO ENCONTRADO
  if (!livro) {
    return (
      <Flex minH="100vh" bg={BG_COLOR} align="center" justify="center" p={6}>
        <VStack gap={4} textAlign="center">
          <Heading size="lg" color={PRIMARY_COLOR} fontFamily="Georgia, serif">
            Livro não encontrado
          </Heading>
          <Text color={TEXT_LIGHT} fontSize="sm" maxW="md">
            {erro || "Não conseguimos carregar as informações deste livro."}
          </Text>
          <Button
            bg={PRIMARY_COLOR}
            color="white"
            onClick={() => router.push("/buscar_livro")}
            _hover={{ bg: "#632727" }}
          >
            Voltar para a busca
          </Button>
        </VStack>
      </Flex>
    );
  }

  // 3. TELA DE DADOS DO LIVRO
  return (
    <Flex minH="100vh" bg={BG_COLOR}>
      {/* BARRA LATERAL */}
      <Box
        as="nav"
        w="260px"
        bg="#FAF9F6"
        borderRight="1px solid"
        borderColor={BORDER_COLOR}
        p={5}
        flexShrink={0}
        display={{ base: "none", md: "block" }}
      >
        <VStack gap={3} align="stretch">
          {NAV_ITEMS.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}

          <Separator borderColor={BORDER_COLOR} my={4} />

          <HStack
            as="button"
            gap={3}
            p={3}
            pl={4}
            borderRadius="6px"
            color={PRIMARY_COLOR}
            _hover={{ bg: "#F5F1E9" }}
            transition={`all 0.2s ${EASE}`}
            cursor="pointer"
            onClick={sair}
          >
            <Icon as={FiLogOut} w={5} h={5} />
            <Text fontSize="md">Sair</Text>
          </HStack>
        </VStack>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box flex={1} p={{ base: 6, md: 8 }} pb={16} overflowY="auto">
        <VStack gap={8} align="stretch" maxW="5xl" mx="auto">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="sm"
            alignSelf="flex-start"
            color={PRIMARY_COLOR}
            _hover={{ bg: "#F5F1E9" }}
            onClick={() => router.push("/buscar_livro")}
          >
            <Icon as={FiArrowLeft} mr={2} /> Voltar para a busca
          </Button>

          {/* Seção Principal do Livro */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {/* Capa */}
            <Box>
              <Capa
                src={livro.coverUrl}
                alt={livro.title}
                w="full"
                borderRadius="12px"
                boxShadow="sm"
              />
            </Box>

            {/* Informações */}
            <VStack align="flex-start" gap={4} gridColumn={{ md: "span 2" }}>
              <Badge
                px={3}
                py={1}
                borderRadius="full"
                bg={livro.isAvailable ? "#E6F4EA" : "#FCE8E6"}
                color={livro.isAvailable ? "#137333" : "#C5221F"}
                fontWeight="bold"
                fontSize="xs"
              >
                <HStack gap={1}>
                  <Icon as={livro.isAvailable ? FiCheckCircle : FiXCircle} />
                  <Text>
                    {livro.isAvailable
                      ? "Disponível para Empréstimo"
                      : "Indisponível no Momento"}
                  </Text>
                </HStack>
              </Badge>

              <Heading
                as="h1"
                fontSize={{ base: "2xl", md: "3xl" }}
                color={PRIMARY_COLOR}
                fontFamily="Georgia, serif"
              >
                {livro.title}
              </Heading>

              <Text fontSize="lg" color={TEXT_DARK} fontWeight="medium">
                por {livro.author}
              </Text>

              <HStack gap={6} color={TEXT_LIGHT} fontSize="sm" flexWrap="wrap">
                <HStack gap={1}>
                  <Icon as={FiTag} color={PRIMARY_COLOR} />
                  <Text>{livro.category}</Text>
                </HStack>
                <HStack gap={1}>
                  <Icon as={FiCalendar} color={PRIMARY_COLOR} />
                  <Text>{livro.publishYear}</Text>
                </HStack>
                {estatisticas?.total_avaliacoes > 0 && (
                  <HStack gap={2}>
                    <Estrelas nota={Math.round(estatisticas.media_notas)} tamanho={4} />
                    <Text fontWeight="semibold" color={TEXT_DARK}>
                      {estatisticas.media_notas.toFixed(1)}
                    </Text>
                    <Text>
                      ({estatisticas.total_avaliacoes}{" "}
                      {estatisticas.total_avaliacoes === 1
                        ? "avaliação"
                        : "avaliações"}
                      )
                    </Text>
                  </HStack>
                )}
              </HStack>

              <Separator borderColor={BORDER_COLOR} w="full" my={2} />

              <VStack align="flex-start" gap={2} w="full">
                <Text fontSize="sm" fontWeight="bold" color={PRIMARY_COLOR}>
                  Sinopse
                </Text>
                <Text fontSize="sm" color={TEXT_DARK} lineHeight="relaxed">
                  {livro.synopsis}
                </Text>
              </VStack>

              {/* Ações */}
              <VStack align="stretch" gap={3} pt={4} w="full">
                <HStack gap={4} w="full">
                  <Button
                    flex={1}
                    bg={PRIMARY_COLOR}
                    color="white"
                    size="lg"
                    disabled={
                      !livro.isAvailable ||
                      (Boolean(usuario) && elegibilidade?.podeEmprestar === false)
                    }
                    loading={solicitando}
                    _hover={{ bg: "#632727" }}
                    onClick={
                      usuario ? pedirEmprestimo : () => router.push("/login")
                    }
                  >
                    {!livro.isAvailable
                      ? "Indisponível"
                      : usuario
                      ? "Solicitar Empréstimo"
                      : "Entrar para solicitar"}
                  </Button>

                  <Button
                    variant="outline"
                    borderColor={BORDER_COLOR}
                    color={PRIMARY_COLOR}
                    size="lg"
                    aria-label="Salvar livro"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    _hover={{ bg: "#FAF9F6" }}
                  >
                    <Icon
                      as={FiBookmark}
                      fill={isBookmarked ? PRIMARY_COLOR : "none"}
                      color={PRIMARY_COLOR}
                    />
                  </Button>
                </HStack>

                {avisoEmprestimo && (
                  <HStack
                    gap={2}
                    align="flex-start"
                    p={3}
                    borderRadius="8px"
                    bg={avisoEmprestimo.tipo === "ok" ? "#E6F4EA" : "#FCE8E6"}
                  >
                    <Icon
                      as={
                        avisoEmprestimo.tipo === "ok"
                          ? FiCheckCircle
                          : FiAlertCircle
                      }
                      color={
                        avisoEmprestimo.tipo === "ok" ? "#137333" : "#C5221F"
                      }
                      mt="2px"
                    />
                    <Text
                      fontSize="sm"
                      color={
                        avisoEmprestimo.tipo === "ok" ? "#137333" : "#C5221F"
                      }
                    >
                      {avisoEmprestimo.texto}
                    </Text>
                  </HStack>
                )}

                {/* Motivo do bloqueio aparece antes de o usuário tentar */}
                {usuario &&
                  elegibilidade?.podeEmprestar === false &&
                  !avisoEmprestimo && (
                    <HStack
                      gap={2}
                      align="flex-start"
                      p={3}
                      borderRadius="8px"
                      bg="#FFF3E0"
                    >
                      <Icon as={FiAlertCircle} color="#B78103" mt="2px" />
                      <Text fontSize="sm" color="#B78103">
                        {elegibilidade.motivo}
                      </Text>
                    </HStack>
                  )}

                {usuario && elegibilidade?.podeEmprestar && (
                  <Text fontSize="xs" color={TEXT_LIGHT}>
                    Você tem {elegibilidade.vagas} de {elegibilidade.limite}{" "}
                    empréstimos disponíveis.
                  </Text>
                )}
              </VStack>
            </VStack>
          </SimpleGrid>

          {/* Livros semelhantes */}
          {semelhantes.length > 0 && (
            <VStack align="stretch" gap={4} pt={6}>
              <Heading
                as="h2"
                fontSize="xl"
                color={PRIMARY_COLOR}
                fontFamily="Georgia, serif"
              >
                Da mesma categoria
              </Heading>

              <HStack gap={4} align="stretch" overflowX="auto" pb={2}>
                {semelhantes.map((similar) => (
                  <Box
                    key={similar.id}
                    minW="140px"
                    maxW="140px"
                    cursor="pointer"
                    onClick={() => router.push(`/detalhe_livro/${similar.id}`)}
                    transition={`all 0.25s ${EASE}`}
                    _hover={{ transform: "translateY(-4px)" }}
                  >
                    <Capa
                      src={similar.capa_url}
                      alt={similar.titulo}
                      borderRadius="10px"
                      mb={2}
                    />
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color={TEXT_DARK}
                      lineClamp={1}
                    >
                      {similar.titulo}
                    </Text>
                    <Text fontSize="xs" color={TEXT_LIGHT} lineClamp={1}>
                      {similar.autor}
                    </Text>
                  </Box>
                ))}
              </HStack>
            </VStack>
          )}

          {/* Avaliações */}
          <VStack align="stretch" gap={4} pt={6}>
            <Heading
              as="h2"
              fontSize="xl"
              color={PRIMARY_COLOR}
              fontFamily="Georgia, serif"
            >
              Avaliações dos Leitores
            </Heading>

            {/* Formulário — só para quem está logado */}
            <Box
              bg={CARD_BG}
              p={6}
              borderRadius="12px"
              border="1px solid"
              borderColor={BORDER_COLOR}
            >
              {usuario ? (
                <VStack gap={4} align="stretch">
                  <Text fontSize="sm" fontWeight="semibold" color={TEXT_DARK}>
                    {minhaAvaliacao
                      ? "Edite sua avaliação sobre este livro:"
                      : "Deixe sua avaliação sobre este livro:"}
                  </Text>

                  <Estrelas nota={userRating} onSelect={setUserRating} />

                  <Textarea
                    placeholder="Escreva sua opinião..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    borderColor={BORDER_COLOR}
                    _focus={{ borderColor: PRIMARY_COLOR }}
                    rows={3}
                    fontSize="sm"
                    maxLength={2000}
                  />

                  {aviso && (
                    <Text
                      fontSize="sm"
                      color={aviso.tipo === "ok" ? "#137333" : "#C5221F"}
                    >
                      {aviso.texto}
                    </Text>
                  )}

                  <HStack justify="flex-end" gap={3}>
                    {minhaAvaliacao && (
                      <Button
                        variant="outline"
                        size="sm"
                        color="#C5221F"
                        borderColor={BORDER_COLOR}
                        disabled={enviando}
                        onClick={removerAvaliacao}
                        _hover={{ bg: "#FCE8E6" }}
                      >
                        <Icon as={FiTrash2} mr={2} /> Remover
                      </Button>
                    )}

                    <Button
                      bg={PRIMARY_COLOR}
                      color="white"
                      size="sm"
                      loading={enviando}
                      onClick={enviarAvaliacao}
                      _hover={{ bg: "#632727" }}
                    >
                      <Icon as={FiSend} mr={2} />
                      {minhaAvaliacao ? "Atualizar avaliação" : "Enviar avaliação"}
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <HStack justify="space-between" flexWrap="wrap" gap={3}>
                  <Text fontSize="sm" color={TEXT_LIGHT}>
                    Entre na sua conta para avaliar este livro.
                  </Text>
                  <Button
                    bg={PRIMARY_COLOR}
                    color="white"
                    size="sm"
                    onClick={() => router.push("/login")}
                    _hover={{ bg: "#632727" }}
                  >
                    Fazer login
                  </Button>
                </HStack>
              )}
            </Box>

            {/* Avaliações já publicadas */}
            {avaliacoes.length === 0 ? (
              <Text fontSize="sm" color={TEXT_LIGHT}>
                Este livro ainda não recebeu avaliações. Seja o primeiro a
                comentar.
              </Text>
            ) : (
              <VStack align="stretch" gap={3}>
                {avaliacoes.map((avaliacao) => (
                  <Box
                    key={avaliacao.id}
                    bg={CARD_BG}
                    p={5}
                    borderRadius="12px"
                    border="1px solid"
                    borderColor={
                      avaliacao.id === minhaAvaliacao?.id
                        ? PRIMARY_COLOR
                        : BORDER_COLOR
                    }
                  >
                    <VStack align="stretch" gap={2}>
                      <HStack justify="space-between" flexWrap="wrap" gap={2}>
                        <HStack gap={3}>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color={TEXT_DARK}
                          >
                            {avaliacao.usuario_nome}
                          </Text>
                          {avaliacao.id === minhaAvaliacao?.id && (
                            <Badge
                              bg="#F5F1E9"
                              color={PRIMARY_COLOR}
                              borderRadius="full"
                              px={2}
                              fontSize="xs"
                            >
                              Você
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="xs" color={TEXT_LIGHT}>
                          {formatarData(avaliacao.criado_em)}
                        </Text>
                      </HStack>

                      <Estrelas nota={avaliacao.nota} tamanho={4} />

                      {avaliacao.comentario && (
                        <Text fontSize="sm" color={TEXT_DARK}>
                          {avaliacao.comentario}
                        </Text>
                      )}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}
