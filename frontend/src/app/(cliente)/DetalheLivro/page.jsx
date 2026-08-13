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
  FiCalendar,
  FiTag,
  FiSend,
} from "react-icons/fi";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// Importação da API
import { getLivroPorId } from "../../../api";

// --- CONFIGURAÇÕES VISUAIS ---
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const PRIMARY_COLOR = "#7A3131";
const BG_COLOR = "#FFFFFF";
const CARD_BG = "#FFFFFF";
const BORDER_COLOR = "#EFEBE3";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";

const NAV_ITEMS = [
  { label: "Início", icon: FiHome },
  { label: "Buscar Livros", icon: FiSearch, active: true },
  { label: "Meus Empréstimos", icon: FiBookOpen },
  { label: "Histórico", icon: FiClock },
  { label: "Meu Cadastro", icon: FiUser },
];

function NavItem({ item }) {
  return (
    <HStack
      as="a"
      href="#"
      spacing={3}
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

function DetalhesLivroContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pega o ID tanto da Rota Dinâmica ([id]) quanto de Query Parameters (?id=1)
  const bookId =
    params?.id ||
    params?.id_livro ||
    params?.slug ||
    searchParams?.get("id") ||
    searchParams?.get("id_livro");

  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [novoComentario, setNovoComentario] = useState("");
  const [userRating, setUserRating] = useState(5);

  useEffect(() => {
    let ativo = true;

    async function carregarLivro() {
      console.log("[DetalhesLivro] ID capturado:", bookId);

      if (!bookId) {
        console.error("[DetalhesLivro] Nenhum ID especificado na URL.");
        if (ativo) {
          setCarregando(false);
          setErro("ID do livro não especificado na URL.");
        }
        return;
      }

      try {
        setCarregando(true);
        console.log("[DetalhesLivro] Buscando dados do livro ID:", bookId);
        const response = await getLivroPorId(bookId);
        console.log("[DetalhesLivro] Resposta da API:", response);

        if (ativo) {
          const dados = response?.dados || response;

          if (dados && (dados.id_livro || dados.id || dados.titulo)) {
            setLivro({
              id: dados.id_livro || dados.id,
              title: dados.titulo,
              author: dados.autor,
              category: dados.categoria || "Geral",
              publishYear: dados.ano_publicacao || "N/A",
              isAvailable: dados.disponivel === true || dados.disponivel === 1,
              coverUrl:
                dados.capa_url ||
                "https://via.placeholder.com/300x450?text=Sem+Capa",
              synopsis:
                dados.sinopse ||
                "Nenhuma sinopse cadastrada para este livro no momento.",
            });
            setErro(null);
          } else {
            setErro("Livro não encontrado na base de dados.");
            setLivro(null);
          }
        }
      } catch (error) {
        console.error("[DetalhesLivro] Erro na busca:", error);
        if (ativo) {
          if (error?.status === 401 || error?.response?.status === 401) {
            setErro("Sua sessão expirou. Faça login novamente para visualizar.");
          } else {
            setErro("Falha ao carregar as informações do livro.");
          }
          setLivro(null);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarLivro();

    return () => {
      ativo = false;
    };
  }, [bookId]);

  // 1. TELA DE CARREGAMENTO
  if (carregando) {
    return (
      <Flex minH="100vh" bg={BG_COLOR} align="center" justify="center">
        <VStack spacing={4}>
          <Spinner color={PRIMARY_COLOR} size="xl" thickness="3px" />
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
        <VStack spacing={4} textAlign="center">
          <Heading size="lg" color={PRIMARY_COLOR} fontFamily="Georgia, serif">
            Livro não encontrado
          </Heading>
          <Text color={TEXT_LIGHT} fontSize="sm" maxW="md">
            {erro || "Não conseguimos carregar as informações deste livro."}
          </Text>
          <Button
            bg={PRIMARY_COLOR}
            color="white"
            onClick={() => router.back()}
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
        <VStack spacing={3} align="stretch">
          {NAV_ITEMS.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}

          <Separator borderColor={BORDER_COLOR} my={4} />

          <HStack
            as="a"
            href="#"
            spacing={3}
            p={3}
            pl={4}
            borderRadius="6px"
            color={PRIMARY_COLOR}
            _hover={{ bg: "#F5F1E9" }}
            transition={`all 0.2s ${EASE}`}
            cursor="pointer"
          >
            <Icon as={FiLogOut} w={5} h={5} />
            <Text fontSize="md">Sair</Text>
          </HStack>
        </VStack>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box flex={1} p={{ base: 6, md: 8 }} pb={16} overflowY="auto">
        <VStack spacing={8} align="stretch" maxW="5xl" mx="auto">
          {/* Botão Voltar */}
          <Button
            variant="ghost"
            size="sm"
            alignSelf="flex-start"
            color={PRIMARY_COLOR}
            _hover={{ bg: "#F5F1E9" }}
            onClick={() => router.back()}
          >
            <Icon as={FiArrowLeft} mr={2} /> Voltar para a busca
          </Button>

          {/* Seção Principal do Livro */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {/* Capa */}
            <Box>
              <AspectRatio
                ratio={2 / 3}
                w="full"
                borderRadius="12px"
                overflow="hidden"
                boxShadow="sm"
                bg="#F2EFE9"
              >
                <Image
                  src={livro.coverUrl}
                  alt={livro.title}
                  objectFit="cover"
                />
              </AspectRatio>
            </Box>

            {/* Informações */}
            <VStack
              align="flex-start"
              spacing={4}
              gridColumn={{ md: "span 2" }}
            >
              <Badge
                px={3}
                py={1}
                borderRadius="full"
                bg={livro.isAvailable ? "#E6F4EA" : "#FCE8E6"}
                color={livro.isAvailable ? "#137333" : "#C5221F"}
                fontWeight="bold"
                fontSize="xs"
              >
                <HStack spacing={1}>
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

              <HStack spacing={6} color={TEXT_LIGHT} fontSize="sm">
                <HStack spacing={1}>
                  <Icon as={FiTag} color={PRIMARY_COLOR} />
                  <Text>{livro.category}</Text>
                </HStack>
                <HStack spacing={1}>
                  <Icon as={FiCalendar} color={PRIMARY_COLOR} />
                  <Text>{livro.publishYear}</Text>
                </HStack>
              </HStack>

              <Separator borderColor={BORDER_COLOR} w="full" my={2} />

              <VStack align="flex-start" spacing={2} w="full">
                <Text fontSize="sm" fontWeight="bold" color={PRIMARY_COLOR}>
                  Sinopse
                </Text>
                <Text fontSize="sm" color={TEXT_DARK} lineHeight="relaxed">
                  {livro.synopsis}
                </Text>
              </VStack>

              {/* Ações */}
              <HStack spacing={4} pt={4} w="full">
                <Button
                  flex={1}
                  bg={PRIMARY_COLOR}
                  color="white"
                  size="lg"
                  isDisabled={!livro.isAvailable}
                  _hover={{ bg: "#632727" }}
                >
                  {livro.isAvailable ? "Solicitar Empréstimo" : "Indisponível"}
                </Button>

                <Button
                  variant="outline"
                  borderColor={BORDER_COLOR}
                  color={PRIMARY_COLOR}
                  size="lg"
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
            </VStack>
          </SimpleGrid>

          {/* Avaliações */}
          <VStack align="stretch" spacing={4} pt={6}>
            <Heading
              as="h2"
              fontSize="xl"
              color={PRIMARY_COLOR}
              fontFamily="Georgia, serif"
            >
              Avaliações dos Leitores
            </Heading>

            <Box
              bg={CARD_BG}
              p={6}
              borderRadius="12px"
              border="1px solid"
              borderColor={BORDER_COLOR}
            >
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" fontWeight="semibold" color={TEXT_DARK}>
                  Deixe sua avaliação sobre este livro:
                </Text>

                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      as={FiStar}
                      w={5}
                      h={5}
                      cursor="pointer"
                      color="#E2B93B"
                      fill={star <= userRating ? "#E2B93B" : "none"}
                      onClick={() => setUserRating(star)}
                    />
                  ))}
                </HStack>

                <Textarea
                  placeholder="Escreva sua opinião..."
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  borderColor={BORDER_COLOR}
                  _focus={{ borderColor: PRIMARY_COLOR }}
                  rows={3}
                  fontSize="sm"
                />

                <Button
                  alignSelf="flex-end"
                  bg={PRIMARY_COLOR}
                  color="white"
                  size="sm"
                  _hover={{ bg: "#632727" }}
                >
                  <Icon as={FiSend} mr={2} /> Enviar Comentário
                </Button>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}

// Exportação com Suspense (Requisito do Next.js para useSearchParams)
export default function DetalhesLivroPage() {
  return (
    <Suspense
      fallback={
        <Flex minH="100vh" bg={BG_COLOR} align="center" justify="center">
          <Spinner color={PRIMARY_COLOR} size="xl" thickness="3px" />
        </Flex>
      }
    >
      <DetalhesLivroContent />
    </Suspense>
  );
}