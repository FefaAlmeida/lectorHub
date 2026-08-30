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
  FiBookOpen,
  FiArrowLeft,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCalendar,
  FiTag,
  FiSend,
  FiTrash2,
  FiEdit2,
} from "react-icons/fi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Importação da API
import Shell, { Cartao, Carregando, TituloSecao } from "@/components/cliente/Shell";
import {
  getLivroPorId,
  getAvaliacoes,
  salvarAvaliacao,
  excluirAvaliacao,
  getElegibilidade,
  getMeusEmprestimos,
  solicitarEmprestimo,
} from "../../../../api";
import { useUsuario } from "../../../../components/auth/RequireAuth";

// --- CONFIGURAÇÕES VISUAIS ---
import {
  PRIMARY_COLOR,
  BORDER_COLOR,
  TEXT_DARK,
  TEXT_LIGHT,
  PLACEHOLDER_BG,
  HOVER_BG,
  OK_BG,
  OK_COR,
  ALERTA_BG,
  ALERTA_COR,
  ERRO_BG,
  ERRO_COR,
  RAIO_MEDIO,
  RAIO_PEQUENO,
  TEXTO_APOIO,
  RAIO_CAMPO,
  PRIMARY_HOVER,
  HOVER_VITRINE,
  HOVER_CAPA,
  TRANSICAO,
  TEXTO_MIUDO,
  GAP_ITEM,
  GAP_CARTAO,
  ERRO_HOVER,
  ESTRELA,
  GAP_SECAO,
  BG_COLOR,
  PADDING_CARTAO,
} from "@/components/cliente/tema";

// `capa_url` é opcional no banco, então nem todo livro tem imagem.
function Capa({ src, alt, ...props }) {
  return (
    <AspectRatio ratio={2 / 3} overflow="hidden" bg={PLACEHOLDER_BG} {...props}>
      {src ? (
        <Image src={src} alt={alt} objectFit="cover" />
      ) : (
        <Flex align="center" justify="center" bg={PLACEHOLDER_BG}>
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
          color={ESTRELA}
          fill={estrela <= nota ? ESTRELA : "none"}
          cursor={onSelect ? "pointer" : "default"}
          transition={TRANSICAO}
          _hover={onSelect ? { opacity: 0.6 } : undefined}
          aria-label={`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`}
          onClick={onSelect ? () => onSelect(estrela) : undefined}
        />
      ))}
    </HStack>
  );
}

// "Maria Eduarda Souza" -> "Maria S." — identifica sem expor o nome inteiro
// em conteúdo público.
function nomeCurto(nome = "") {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "Leitor";
  if (partes.length === 1) return partes[0];
  return `${partes[0]} ${partes[partes.length - 1][0].toUpperCase()}.`;
}

// Barras por nota. A API já calculava essa distribuição e a tela jogava fora —
// é ela que dá sentido à média (4,2 com dez notas 4 é diferente de 4,2 com
// metade 5 e metade 3).
function ResumoAvaliacoes({ estatisticas }) {
  const total = estatisticas?.total_avaliacoes ?? 0;
  if (total === 0) return null;

  const porNota = [
    [5, estatisticas.cinco_estrelas],
    [4, estatisticas.quatro_estrelas],
    [3, estatisticas.tres_estrelas],
    [2, estatisticas.duas_estrelas],
    [1, estatisticas.uma_estrela],
  ];

  return (
    <Cartao>
      <Flex gap={GAP_CARTAO} align="center" direction={{ base: "column", sm: "row" }}>
        <VStack gap={1} minW="120px">
          <Heading fontSize="40px" color={PRIMARY_COLOR} lineHeight="1">
            {estatisticas.media_notas.toFixed(1).replace(".", ",")}
          </Heading>
          <Estrelas nota={Math.round(estatisticas.media_notas)} tamanho={4} />
          <Text fontSize={TEXTO_MIUDO} color={TEXT_LIGHT}>
            {total} {total === 1 ? "avaliação" : "avaliações"}
          </Text>
        </VStack>

        <VStack gap={1} flex={1} w="100%" align="stretch">
          {porNota.map(([nota, quantidade]) => (
            <HStack key={nota} gap={3}>
              <Text fontSize={TEXTO_MIUDO} color={TEXT_LIGHT} w="12px" textAlign="right">
                {nota}
              </Text>
              <Icon as={FiStar} boxSize={3} color={ESTRELA} fill={ESTRELA} />
              <Box flex={1} h="6px" bg={PLACEHOLDER_BG} borderRadius="full" overflow="hidden">
                <Box
                  h="100%"
                  w={`${Math.round((quantidade / total) * 100)}%`}
                  bg={ESTRELA}
                  transition={TRANSICAO}
                />
              </Box>
              <Text fontSize={TEXTO_MIUDO} color={TEXT_LIGHT} w="20px">
                {quantidade}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Flex>
    </Cartao>
  );
}

function formatarData(valor) {
  if (!valor) return "";

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? "" : data.toLocaleDateString("pt-BR");
}

function DetalhesLivro({ bookId }) {
  const router = useRouter();

  const [livro, setLivro] = useState(null);
  const [semelhantes, setSemelhantes] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const usuario = useUsuario();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [novoComentario, setNovoComentario] = useState("");
  // Começa sem nota: vinha 5 marcado e quem só queria comentar dava cinco
  // estrelas sem escolher, inflando a média.
  const [userRating, setUserRating] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null); // { tipo: "ok" | "erro", texto }
  const [editando, setEditando] = useState(false);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);
  const [sinopseAberta, setSinopseAberta] = useState(false);
  const [visiveis, setVisiveis] = useState(5);

  // O botão antes voltava sempre para a busca, mesmo para quem chegou pela
  // home ou pelos empréstimos. Agora desfaz a navegação de verdade; só cai na
  // busca quem abriu o link direto (sem histórico dentro do site).
  function voltar() {
    const veioDeDentro =
      typeof document !== "undefined" &&
      document.referrer &&
      document.referrer.startsWith(window.location.origin);

    if (veioDeDentro && window.history.length > 1) router.back();
    else router.push("/buscar_livro");
  }
  const [elegibilidade, setElegibilidade] = useState(null);
  const [solicitando, setSolicitando] = useState(false);
  const [avisoEmprestimo, setAvisoEmprestimo] = useState(null);
  const [jaSolicitado, setJaSolicitado] = useState(false);

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

        // Se o usuário já avaliou, o formulário abre preenchido para editar.
        const minha = usuario ? (dados.avaliacoes || []).find((a) => a.id_usuario === usuario.id) : null;
        setUserRating(minha?.nota ?? 0);
        setNovoComentario(minha?.comentario || "");
      } catch (error) {
        console.error("[DetalhesLivro] Erro na busca:", error);

        if (ativo) {
          setLivro(null);
          setSemelhantes([]);
          setAvaliacoes([]);
          setEstatisticas(null);
          setErro("Não foi possível falar com o servidor.");
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

  const outrasAvaliacoes = useMemo(
    () => avaliacoes.filter((item) => item.id !== minhaAvaliacao?.id),
    [avaliacoes, minhaAvaliacao]
  );

  // Abre o formulário já com o que está publicado, para editar em vez de
  // reescrever do zero.
  function abrirEdicao() {
    setUserRating(minhaAvaliacao.nota);
    setNovoComentario(minhaAvaliacao.comentario || "");
    setAviso(null);
    setEditando(true);
  }

  function cancelarEdicao() {
    setEditando(false);
    setAviso(null);
  }

  useEffect(() => {
    if (!usuario) return;
    getElegibilidade().then((r) => r?.sucesso && setElegibilidade(r.dados));

    // Se já existe pedido/empréstimo ativo deste livro, o botão fica travado.
    getMeusEmprestimos().then((r) => {
      if (!r?.sucesso) return;
      const ativo = r.dados.emprestimos.some(
        (e) => String(e.id_livro) === String(bookId) && ["PENDENTE", "EMPRESTADO"].includes(e.status)
      );
      setJaSolicitado(ativo);
    });
  }, [usuario, bookId]);

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
      setJaSolicitado(true);
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
    if (!userRating) {
      setAviso({ tipo: "erro", texto: "Escolha uma nota de 1 a 5 antes de enviar." });
      return;
    }

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
      setEditando(false);
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

      setUserRating(0);
      setNovoComentario("");
      setEditando(false);
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
      <Shell>
        <Carregando texto="Carregando detalhes do livro..." />
      </Shell>
    );
  }

  // 2. TELA DE ERRO OU LIVRO NÃO ENCONTRADO
  if (!livro) {
    return (
      <Shell titulo="Livro não encontrado">
        <Cartao>
          <VStack gap={4} align="center" textAlign="center">
            <Text color={TEXT_LIGHT} fontSize={TEXTO_APOIO} maxW="md">
              {erro || "Não conseguimos carregar as informações deste livro."}
            </Text>
            <Button
              bg={PRIMARY_COLOR}
              color="white"
              borderRadius={RAIO_CAMPO}
              onClick={() => router.push("/buscar_livro")}
              _hover={{ bg: PRIMARY_HOVER }}
            >
              Voltar para a busca
            </Button>
          </VStack>
        </Cartao>
      </Shell>
    );
  }

  // 3. TELA DE DADOS DO LIVRO
  return (
    <Shell titulo={livro.title} subtitulo={`por ${livro.author}`}>
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="sm"
            alignSelf="flex-start"
            color={PRIMARY_COLOR}
            _hover={{ bg: HOVER_BG }}
            onClick={voltar}
          >
            <Icon as={FiArrowLeft} mr={2} /> Voltar
          </Button>

          {/* Seção Principal do Livro */}
          {/* 260px para a capa: em md a coluna de 1/3 virava uma imagem
              enorme com espaço morto ao lado. */}
          <Flex gap={GAP_SECAO} direction={{ base: "column", md: "row" }} align="flex-start">
            {/* Capa */}
            <Box w={{ base: "180px", md: "260px" }} flexShrink={0} alignSelf={{ base: "center", md: "flex-start" }}>
              <Capa
                src={livro.coverUrl}
                alt={livro.title}
                w="full"
                borderRadius={RAIO_MEDIO}
                boxShadow="sm"
              />
            </Box>

            {/* Informações */}
            <VStack align="flex-start" gap={4} flex={1} minW={0}>
              <Badge
                px={3}
                py={1}
                borderRadius="full"
                bg={livro.isAvailable ? OK_BG : ERRO_BG}
                color={livro.isAvailable ? OK_COR : ERRO_COR}
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
                <Text fontSize={TEXTO_APOIO} fontWeight="bold" color={PRIMARY_COLOR}>
                  Sinopse
                </Text>
                {/* Sinopse longa empurrava o botão de empréstimo para fora da
                    tela; agora corta em 5 linhas com "ler mais". */}
                <Text
                  fontSize={TEXTO_APOIO}
                  color={TEXT_DARK}
                  lineHeight="relaxed"
                  lineClamp={sinopseAberta ? undefined : 5}
                >
                  {livro.synopsis}
                </Text>
                {livro.synopsis.length > 320 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    px={0}
                    color={PRIMARY_COLOR}
                    _hover={{ bg: "transparent", textDecoration: "underline" }}
                    onClick={() => setSinopseAberta((v) => !v)}
                  >
                    {sinopseAberta ? "Ler menos" : "Ler mais"}
                  </Button>
                )}
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
                      jaSolicitado ||
                      !livro.isAvailable ||
                      (Boolean(usuario) && elegibilidade?.podeEmprestar === false)
                    }
                    loading={solicitando}
                    _hover={{ bg: PRIMARY_HOVER }}
                    onClick={
                      usuario ? pedirEmprestimo : () => router.push(`/login?next=/detalhe_livro/${bookId}`)
                    }
                  >
                    {jaSolicitado
                      ? "Solicitação em andamento"
                      : !livro.isAvailable
                      ? "Indisponível"
                      : usuario
                      ? "Solicitar Empréstimo"
                      : "Entrar para solicitar"}
                  </Button>

                </HStack>

                {avisoEmprestimo && (
                  <HStack
                    gap={2}
                    align="flex-start"
                    p={3}
                    borderRadius={RAIO_PEQUENO}
                    bg={avisoEmprestimo.tipo === "ok" ? OK_BG : ERRO_BG}
                  >
                    <Icon
                      as={
                        avisoEmprestimo.tipo === "ok"
                          ? FiCheckCircle
                          : FiAlertCircle
                      }
                      color={
                        avisoEmprestimo.tipo === "ok" ? OK_COR : ERRO_COR
                      }
                      mt="2px"
                    />
                    <Text
                      fontSize="sm"
                      color={
                        avisoEmprestimo.tipo === "ok" ? OK_COR : ERRO_COR
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
                      borderRadius={RAIO_PEQUENO}
                      bg={ALERTA_BG}
                    >
                      <Icon as={FiAlertCircle} color={ALERTA_COR} mt="2px" />
                      <Text fontSize="sm" color={ALERTA_COR}>
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
          </Flex>

          {/* Livros semelhantes */}
          {semelhantes.length > 0 && (
            <VStack align="stretch" gap={4} pt={6}>
              <TituloSecao>Da mesma categoria</TituloSecao>

              {/* Sombra na borda direita: sem ela, no desktop ninguém
                  descobre que a faixa rola. */}
              <Box position="relative">
                <HStack
                  gap={4}
                  align="stretch"
                  overflowX="auto"
                  pb={2}
                  css={{ scrollbarWidth: "thin" }}
                >
                {semelhantes.map((similar) => (
                  <Box
                    key={similar.id}
                    minW="140px"
                    maxW="140px"
                    cursor="pointer"
                    onClick={() => router.push(`/detalhe_livro/${similar.id}`)}
                    role="group"
                    transition={TRANSICAO}
                    _hover={HOVER_VITRINE}
                  >
                    <Capa
                      src={similar.capa_url}
                      alt={similar.titulo}
                      borderRadius={RAIO_MEDIO}
                      mb={2}
                      transition={TRANSICAO}
                      _groupHover={HOVER_CAPA}
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

                {semelhantes.length > 4 && (
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={2}
                    w="48px"
                    pointerEvents="none"
                    bgGradient={`linear(to-l, ${BG_COLOR}, transparent)`}
                  />
                )}
              </Box>
            </VStack>
          )}

          {/* Avaliações */}
          <VStack align="stretch" gap={GAP_CARTAO} pt={6}>
            <TituloSecao>Avaliações dos Leitores</TituloSecao>

            {/* Média e distribuição. Antes a média só existia lá no topo da
                página, espremida entre categoria e ano. */}
            <ResumoAvaliacoes estatisticas={estatisticas} />

            {/* Bloco do usuário: formulário OU a avaliação dele já publicada.
                Nunca os dois — antes o texto enviado ficava no formulário
                preenchido E aparecia de novo como comentário logo abaixo, e o
                botão de remover morava no formulário, longe do que apagava. */}
            {!usuario ? (
              <Cartao>
                <HStack justify="space-between" flexWrap="wrap" gap={3}>
                  <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT}>
                    Entre na sua conta para avaliar este livro.
                  </Text>
                  <Button
                    bg={PRIMARY_COLOR}
                    color="white"
                    size="sm"
                    borderRadius={RAIO_CAMPO}
                    onClick={() => router.push("/login")}
                    _hover={{ bg: PRIMARY_HOVER }}
                  >
                    Fazer login
                  </Button>
                </HStack>
              </Cartao>
            ) : minhaAvaliacao && !editando ? (
              <Cartao borderColor={PRIMARY_COLOR}>
                <VStack align="stretch" gap={GAP_ITEM}>
                  <HStack justify="space-between" flexWrap="wrap" gap={2}>
                    <HStack gap={3}>
                      <Text fontSize={TEXTO_APOIO} fontWeight="semibold" color={TEXT_DARK}>
                        Sua avaliação
                      </Text>
                      <Estrelas nota={minhaAvaliacao.nota} tamanho={4} />
                    </HStack>
                    <Text fontSize={TEXTO_MIUDO} color={TEXT_LIGHT}>
                      {formatarData(minhaAvaliacao.criado_em)}
                    </Text>
                  </HStack>

                  {minhaAvaliacao.comentario && (
                    <Text fontSize={TEXTO_APOIO} color={TEXT_DARK}>
                      {minhaAvaliacao.comentario}
                    </Text>
                  )}

                  {aviso && (
                    <Text fontSize={TEXTO_APOIO} color={aviso.tipo === "ok" ? OK_COR : ERRO_COR}>
                      {aviso.texto}
                    </Text>
                  )}

                  {/* Remover não tem desfazer: confirma no lugar, sem modal. */}
                  {confirmandoRemocao ? (
                    <HStack justify="flex-end" gap={3} flexWrap="wrap">
                      <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT}>
                        Remover sua avaliação?
                      </Text>
                      <Button
                        variant="ghost"
                        size="sm"
                        borderRadius={RAIO_CAMPO}
                        disabled={enviando}
                        onClick={() => setConfirmandoRemocao(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        bg={ERRO_COR}
                        color="white"
                        borderRadius={RAIO_CAMPO}
                        loading={enviando}
                        onClick={removerAvaliacao}
                        _hover={{ bg: ERRO_HOVER }}
                      >
                        Remover
                      </Button>
                    </HStack>
                  ) : (
                    <HStack justify="flex-end" gap={3}>
                      <Button
                        variant="ghost"
                        size="sm"
                        color={ERRO_COR}
                        borderRadius={RAIO_CAMPO}
                        onClick={() => setConfirmandoRemocao(true)}
                        _hover={{ bg: ERRO_BG }}
                      >
                        <Icon as={FiTrash2} mr={2} /> Remover
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        color={PRIMARY_COLOR}
                        borderColor={BORDER_COLOR}
                        borderRadius={RAIO_CAMPO}
                        onClick={abrirEdicao}
                        _hover={{ bg: HOVER_BG }}
                      >
                        <Icon as={FiEdit2} mr={2} /> Editar
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Cartao>
            ) : (
              <Cartao>
                <VStack gap={GAP_ITEM} align="stretch">
                  <Text fontSize={TEXTO_APOIO} fontWeight="semibold" color={TEXT_DARK}>
                    {editando ? "Edite sua avaliação:" : "Deixe sua avaliação sobre este livro:"}
                  </Text>

                  <HStack gap={3} flexWrap="wrap">
                    <Estrelas nota={userRating} onSelect={setUserRating} />
                    <Text fontSize={TEXTO_MIUDO} color={TEXT_LIGHT}>
                      {userRating ? `${userRating} de 5` : "Escolha uma nota (obrigatório)"}
                    </Text>
                  </HStack>

                  <Textarea
                    placeholder="Escreva sua opinião (opcional)"
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    borderColor={BORDER_COLOR}
                    borderRadius={RAIO_MEDIO}
                    _focus={{ borderColor: PRIMARY_COLOR }}
                    rows={3}
                    fontSize={TEXTO_APOIO}
                    maxLength={2000}
                  />

                  {aviso && (
                    <Text fontSize={TEXTO_APOIO} color={aviso.tipo === "ok" ? OK_COR : ERRO_COR}>
                      {aviso.texto}
                    </Text>
                  )}

                  <HStack justify="flex-end" gap={3}>
                    {editando && (
                      <Button
                        variant="ghost"
                        size="sm"
                        borderRadius={RAIO_CAMPO}
                        disabled={enviando}
                        onClick={cancelarEdicao}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button
                      bg={PRIMARY_COLOR}
                      color="white"
                      size="sm"
                      borderRadius={RAIO_CAMPO}
                      loading={enviando}
                      disabled={!userRating}
                      onClick={enviarAvaliacao}
                      _hover={{ bg: PRIMARY_HOVER }}
                    >
                      <Icon as={FiSend} mr={2} />
                      {editando ? "Salvar alterações" : "Enviar avaliação"}
                    </Button>
                  </HStack>
                </VStack>
              </Cartao>
            )}

            {/* Avaliações de outras pessoas */}
            {outrasAvaliacoes.length === 0 ? (
              <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT}>
                {minhaAvaliacao
                  ? "Ninguém mais avaliou este livro ainda."
                  : "Este livro ainda não recebeu avaliações. Seja o primeiro a comentar."}
              </Text>
            ) : (
              <VStack align="stretch" gap={GAP_ITEM}>
                {outrasAvaliacoes.slice(0, visiveis).map((avaliacao) => {
                  const cabecalho = (
                    <HStack justify="space-between" flexWrap="wrap" gap={2}>
                      <HStack gap={3} flexWrap="wrap">
                        <Text fontSize={TEXTO_APOIO} fontWeight="semibold" color={TEXT_DARK}>
                          {nomeCurto(avaliacao.usuario_nome)}
                        </Text>

                        {/* Avaliar é aberto a qualquer usuário; o selo diz
                            quais opiniões vêm de quem teve o livro em mãos. */}
                        {avaliacao.leitor_verificado && (
                          <Badge
                            bg={OK_BG}
                            color={OK_COR}
                            borderRadius="full"
                            px={2}
                            fontSize={TEXTO_MIUDO}
                            textTransform="none"
                            title="Este leitor já pegou o livro emprestado"
                          >
                            <HStack gap={1}>
                              <Icon as={FiCheckCircle} boxSize={3} />
                              <Text>Leitor verificado</Text>
                            </HStack>
                          </Badge>
                        )}

                        <Estrelas nota={avaliacao.nota} tamanho={4} />
                      </HStack>

                      <Text fontSize={TEXTO_MIUDO} color={TEXT_LIGHT}>
                        {formatarData(avaliacao.criado_em)}
                        {avaliacao.editado && " · editado"}
                      </Text>
                    </HStack>
                  );

                  // Nota sem texto não precisa de um cartão inteiro: vira uma
                  // linha, e o cartão fica para quem escreveu algo.
                  if (!avaliacao.comentario) {
                    return (
                      <Box key={avaliacao.id} px={PADDING_CARTAO} py={3}>
                        {cabecalho}
                      </Box>
                    );
                  }

                  return (
                    <Cartao key={avaliacao.id}>
                      <VStack align="stretch" gap={2}>
                        {cabecalho}
                        <Text fontSize={TEXTO_APOIO} color={TEXT_DARK}>
                          {avaliacao.comentario}
                        </Text>
                      </VStack>
                    </Cartao>
                  );
                })}

                {/* Antes a lista parava no limite da API sem avisar. */}
                {outrasAvaliacoes.length > visiveis && (
                  <Button
                    variant="outline"
                    borderColor={BORDER_COLOR}
                    color={PRIMARY_COLOR}
                    alignSelf="center"
                    onClick={() => setVisiveis((n) => n + 5)}
                    _hover={{ bg: HOVER_BG }}
                  >
                    Ver mais {Math.min(5, outrasAvaliacoes.length - visiveis)} de{" "}
                    {outrasAvaliacoes.length - visiveis} restantes
                  </Button>
                )}
              </VStack>
            )}
          </VStack>
    </Shell>
  );
}

// Rota dinâmica /detalhe_livro/[id]. A `key` remonta a página ao navegar
// entre livros ("Da mesma categoria"), zerando comentário, avisos etc.
export default function DetalhesLivroPage() {
  const { id } = useParams();
  return <DetalhesLivro key={id} bookId={id} />;
}
