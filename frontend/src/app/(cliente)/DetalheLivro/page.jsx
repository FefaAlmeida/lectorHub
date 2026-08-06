"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Button,
  Badge,
  Image,
  SimpleGrid,
  Container,
  Tag,
  Progress,
  Avatar,
  Menu,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
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
  FiGlobe,
  FiCalendar,
  FiFileText,
  FiLayers,
  FiMapPin,
  FiTag,
  FiShield,
  FiSettings,
  FiUsers,
  FiSend,
  FiThumbsUp,
} from "react-icons/fi";
import FadeIn from "@/components/ui/fade-in";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ACCENT = "#7A3131"; // Tom de vinho selecionado
const ACCENT_DARK = "#7A3131";
const ACCENT_LIGHT_BG = "rgba(92, 20, 33, 0.06)";
const ACCENT_HOVER_BG = "rgba(92, 20, 33, 0.04)";
const TAG_BG = "#F3EBEB";

// ----------------------------------------------------------------------
// ESTRUTURA DE DADOS (Substitua esta variável pela resposta da sua API)
// ----------------------------------------------------------------------
const mockBookData = {
  id: "LIV-008123",
  title: "1984",
  author: "George Orwell",
  coverUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
  synopsis: "Em uma sociedade totalitária dominada pelo Grande Irmão, Winston Smith trabalha para o Ministério da Verdade, reescrevendo a história para servir ao regime. Mas, ao questionar o sistema, ele descobre que a verdade pode ser o ato mais perigoso de todos.",
  isAvailable: true,
  availableQuantity: 3,
  categories: ["Ficção", "Distopia"],
  publisher: "Companhia das Letras",
  publishYear: "1949",
  pageCount: 328,
  language: "Português",
  location: "Estante 03 • Prateleira B",
  ageRating: "14 anos",
  ratingAverage: 4.6,
  totalReviews: 1284,
  ratingsBreakdown: [
    { stars: 5, percentage: 75, count: 815 },
    { stars: 4, percentage: 18, count: 278 },
    { stars: 3, percentage: 5, count: 89 },
    { stars: 2, percentage: 1, count: 20 },
    { stars: 1, percentage: 1, count: 10 },
  ],
  comments: [
    {
      id: "c1",
      userName: "Mariana Souza",
      userAvatar: "https://i.pravatar.cc/150?img=9",
      date: "Há 2 dias",
      rating: 5,
      text: "Uma leitura atemporal e assustadoramente atual. O ritmo do livro te prende do começo ao fim. Item essencial para qualquer leitor!",
      likes: 14,
    },
    {
      id: "c2",
      userName: "Lucas Oliveira",
      userAvatar: "https://i.pravatar.cc/150?img=12",
      date: "Há 1 semana",
      rating: 4,
      text: "Excelente edição da Companhia das Letras. A tradução está fluida e os textos de apoio ajudam bastante na contextualização histórica.",
      likes: 8,
    },
  ],
  similarBooks: [
    { id: "1", title: "Admirável Mundo Novo", author: "Aldous Huxley", coverUrl: "https://m.media-amazon.com/images/I/81zE42gT3xL._AC_UF1000,1000_QL80_.jpg" },
    { id: "2", title: "Fahrenheit 451", author: "Ray Bradbury", coverUrl: "https://m.media-amazon.com/images/I/81c8cIylf7L._AC_UF1000,1000_QL80_.jpg" },
    { id: "3", title: "Nós", author: "Yevgeny Zamyatin", coverUrl: "https://m.media-amazon.com/images/I/81XmCq-kO3L._AC_UF1000,1000_QL80_.jpg" },
  ]
};

const NAV_ITEMS = [
  { label: "Início", icon: FiHome },
  { label: "Buscar Livros", icon: FiSearch, active: true },
  { label: "Meus Empréstimos", icon: FiBookOpen },
  { label: "Histórico", icon: FiClock },
  { label: "Meu Cadastro", icon: FiUser },
];

export default function DetalhesLivroPage({ book = mockBookData }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(5);

  return (
    <Flex minH="100vh" bg="#FDFBF7">
      {/* BARRA LATERAL */}
      <Box
        as="aside"
        w="280px"
        bg="#FAF9F6"
        borderRight="1px solid"
        borderColor="#EFEBE3"
        p={6}
        flexShrink={0}
        display={{ base: "none", md: "block" }}
      >
        <VStack spacing={8} align="stretch" h="full">
          <HStack spacing={3} px={2}>
            <Flex w={10} h={10} bg={ACCENT} color="white" borderRadius="lg" align="center" justify="center">
              <Icon as={FiBookOpen} w={5} h={5} />
            </Flex>
            <Box>
              <Heading fontSize="md" color={ACCENT} fontFamily="serif">Minha Biblioteca</Heading>
              <Text fontSize="xs" color="gray.500">Sistema de Biblioteca</Text>
            </Box>
          </HStack>

          <VStack as="nav" spacing={1} align="stretch">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                justifyContent="flex-start"
                startIcon={<Icon as={item.icon} w={5} h={5} />}
                fontWeight={item.active ? "semibold" : "normal"}
                color={item.active ? ACCENT : "gray.600"}
                bg={item.active ? ACCENT_LIGHT_BG : "transparent"}
                borderLeft={item.active ? `3px solid ${ACCENT}` : "3px solid transparent"}
                borderRadius="6px"
                _hover={{ bg: ACCENT_HOVER_BG, color: ACCENT }}
                transition={`all 0.3s ${EASE}`}
                pl={4}
                h={12}
                fontSize="md"
              >
                {item.label}
              </Button>
            ))}
          </VStack>

          <Box flex={1} />

          <Menu.Root positioning={{ placement: "right-end" }}>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                w="full"
                justifyContent="flex-start"
                startIcon={
                  <Avatar.Root size="sm">
                    <Avatar.Image src="https://i.pravatar.cc/150?img=5" />
                    <Avatar.Fallback name="Natalia" />
                  </Avatar.Root>
                }
                fontWeight="medium"
                color="gray.700"
                _hover={{ bg: ACCENT_HOVER_BG }}
                borderRadius="6px"
                h={12}
                pl={2}
              >
                Natalia
              </Button>
            </Menu.Trigger>
            <Menu.Content bg="#FAF9F6" borderColor="#EFEBE3" borderRadius="12px" p={2}>
              <Menu.Item value="settings" borderRadius="6px"><Icon as={FiSettings} mr={2} /> Configurações</Menu.Item>
              <Menu.Item value="profile" borderRadius="6px"><Icon as={FiUsers} mr={2} /> Perfil</Menu.Item>
              <Menu.Separator borderColor="#EFEBE3" />
              <Menu.Item value="logout" color="red.500" borderRadius="6px"><Icon as={FiLogOut} mr={2} /> Sair</Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </VStack>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box flex={1} p={{ base: 4, md: 8 }} overflowY="auto">
        <Container maxW="6xl" px={0}>
          <FadeIn>
            <Button
              variant="ghost"
              size="sm"
              mb={6}
              color="gray.600"
              _hover={{ color: ACCENT, bg: ACCENT_HOVER_BG }}
              startIcon={<Icon as={FiArrowLeft} />}
            >
              Voltar para resultados
            </Button>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
              {/* COLUNA ESQUERDA/CENTRO */}
              <Box gridColumn={{ lg: "span 2" }}>
                <VStack spacing={8} align="stretch">
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    gap={8}
                    bg="#FAF9F6"
                    p={6}
                    border="1px solid"
                    borderColor="#EFEBE3"
                    borderRadius="16px"
                  >
                    <Box
                      w={{ base: "full", sm: "220px" }}
                      h="320px"
                      flexShrink={0}
                      borderRadius="8px"
                      overflow="hidden"
                      boxShadow="0 12px 24px -6px rgba(0,0,0,0.15)"
                    >
                      <Image src={book.coverUrl} alt={book.title} w="full" h="full" objectFit="cover" />
                    </Box>

                    <VStack align="flex-start" spacing={4} flex={1}>
                      <Badge
                        bg={book.isAvailable ? "green.50" : "red.50"}
                        color={book.isAvailable ? "green.700" : "red.700"}
                        border="1px solid"
                        borderColor={book.isAvailable ? "green.200" : "red.200"}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="semibold"
                      >
                        {book.isAvailable ? "Disponível" : "Indisponível"}
                      </Badge>

                      <Heading fontSize="3xl" fontFamily="Georgia, serif" color={ACCENT}>
                        {book.title}
                      </Heading>

                      <Text fontSize="md" color="gray.600" fontWeight="medium">
                        {book.author}
                      </Text>

                      <HStack spacing={2}>
                        {book.categories?.map((cat, i) => (
                          <Tag.Root key={i} bg={TAG_BG} color={ACCENT} borderRadius="md" size="sm">
                            {cat}
                          </Tag.Root>
                        ))}
                      </HStack>

                      <HStack spacing={1} color="amber.500">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            as={FiStar}
                            fill={i < Math.floor(book.ratingAverage) ? "currentColor" : "none"}
                            w={4}
                            h={4}
                          />
                        ))}
                        <Text fontSize="sm" color="gray.600" ml={2}>
                          {book.ratingAverage} <Text as="span" color="gray.400">({book.totalReviews} avaliações)</Text>
                        </Text>
                      </HStack>

                      <Text fontSize="sm" color="gray.600" lineHeight="relaxed">
                        {book.synopsis}
                      </Text>
                    </VStack>
                  </Flex>

                  {/* Ficha Técnica */}
                  <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={4}>
                    {[
                      { icon: FiLayers, label: "Editora", val: book.publisher },
                      { icon: FiCalendar, label: "Ano de publicação", val: book.publishYear },
                      { icon: FiFileText, label: "Páginas", val: book.pageCount },
                      { icon: FiGlobe, label: "Idioma", val: book.language },
                    ].map((item, i) => (
                      <Box key={i} bg="#FAF9F6" p={4} borderRadius="12px" border="1px solid" borderColor="#EFEBE3">
                        <VStack align="flex-start" spacing={1}>
                          <Icon as={item.icon} color={ACCENT} w={5} h={5} mb={1} />
                          <Text fontSize="xs" color="gray.500">{item.label}</Text>
                          <Text fontSize="sm" fontWeight="semibold" color={ACCENT}>{item.val}</Text>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                  {/* Avaliações e Métricas */}
                  <Box bg="#FAF9F6" p={6} borderRadius="16px" border="1px solid" borderColor="#EFEBE3">
                    <Flex justify="space-between" align="center" mb={6}>
                      <Heading fontSize="lg" fontFamily="Georgia, serif" color={ACCENT}>Avaliações dos leitores</Heading>
                      <Button variant="link" color={ACCENT} fontSize="sm">
                        Ver todas ({book.totalReviews}) →
                      </Button>
                    </Flex>

                    <Flex direction={{ base: "column", sm: "row" }} gap={8} align="center" mb={8}>
                      <VStack spacing={1} align="center">
                        <Text fontSize="4xl" fontWeight="bold" color={ACCENT} fontFamily="serif">
                          {book.ratingAverage}
                        </Text>
                        <HStack color="amber.500" spacing={1}>
                          {[...Array(5)].map((_, i) => (
                            <Icon key={i} as={FiStar} fill="currentColor" w={4} h={4} />
                          ))}
                        </HStack>
                        <Text fontSize="xs" color="gray.500">{book.totalReviews} avaliações</Text>
                      </VStack>

                      <VStack flex={1} w="full" spacing={2}>
                        {book.ratingsBreakdown?.map((row) => (
                          <HStack key={row.stars} w="full" spacing={3}>
                            <Text fontSize="xs" color="gray.600" w={3}>{row.stars}</Text>
                            <Icon as={FiStar} w={3} h={3} color="amber.500" />
                            <Progress.Root value={row.percentage} size="xs" flex={1}>
                              <Progress.Track bg="#EFEBE3">
                                <Progress.Range bg={ACCENT} />
                              </Progress.Track>
                            </Progress.Root>
                            <Text fontSize="xs" color="gray.400" w={8} textAlign="right">{row.count}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Flex>

                    {/* SEÇÃO DE COMENTÁRIOS DA COMUNIDADE */}
                    <VStack spacing={6} align="stretch" pt={6} borderTop="1px solid" borderColor="#EFEBE3">
                      <Heading fontSize="md" fontFamily="Georgia, serif" color={ACCENT}>
                        Comentários da Comunidade
                      </Heading>

                      {/* Formulário para Escrever Comentário */}
                      <Box bg="#FDFBF7" p={4} borderRadius="12px" border="1px solid" borderColor="#EFEBE3">
                        <VStack spacing={3} align="stretch">
                          <Flex justify="space-between" align="center">
                            <Text fontSize="xs" fontWeight="semibold" color="gray.700">
                              Deixe sua avaliação:
                            </Text>
                            <HStack spacing={1} cursor="pointer">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Icon
                                  key={star}
                                  as={FiStar}
                                  w={4}
                                  h={4}
                                  color="amber.500"
                                  fill={star <= userRating ? "currentColor" : "none"}
                                  onClick={() => setUserRating(star)}
                                />
                              ))}
                            </HStack>
                          </Flex>

                          <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="O que você achou desta leitura?"
                            bg="white"
                            color="gray.800"
                            _placeholder={{ color: "gray.400" }}
                            borderColor="#E4DED2"
                            fontSize="sm"
                            rows={3}
                            _focus={{ borderColor: ACCENT, boxShadow: `0 0 0 1px ${ACCENT}` }}
                          />

                          <Flex justify="flex-end">
                            <Button
                              size="sm"
                              bg={ACCENT}
                              color="white"
                              _hover={{ bg: ACCENT_DARK }}
                              startIcon={<Icon as={FiSend} />}
                            >
                              Publicar comentário
                            </Button>
                          </Flex>
                        </VStack>
                      </Box>

                      {/* Lista de Comentários */}
                      <VStack spacing={4} align="stretch" mt={2}>
                        {book.comments?.map((comment) => (
                          <Box
                            key={comment.id}
                            p={4}
                            borderRadius="12px"
                            bg="#FDFBF7"
                            border="1px solid"
                            borderColor="#EFEBE3"
                          >
                            <VStack align="stretch" spacing={2}>
                              <Flex justify="space-between" align="center">
                                <HStack spacing={3}>
                                  <Avatar.Root size="sm">
                                    <Avatar.Image src={comment.userAvatar} />
                                    <Avatar.Fallback name={comment.userName} />
                                  </Avatar.Root>
                                  <Box>
                                    <Text fontSize="sm" fontWeight="bold" color="gray.900">
                                      {comment.userName}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      {comment.date}
                                    </Text>
                                  </Box>
                                </HStack>

                                <HStack spacing={1} color="amber.500">
                                  {[...Array(5)].map((_, i) => (
                                    <Icon
                                      key={i}
                                      as={FiStar}
                                      w={3}
                                      h={3}
                                      fill={i < comment.rating ? "currentColor" : "none"}
                                    />
                                  ))}
                                </HStack>
                              </Flex>

                              <Text fontSize="sm" color="gray.700" lineHeight="relaxed">
                                {comment.text}
                              </Text>

                              <Flex justify="flex-end" align="center" pt={1}>
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  color="gray.500"
                                  _hover={{ color: ACCENT, bg: ACCENT_HOVER_BG }}
                                  startIcon={<Icon as={FiThumbsUp} w={3} h={3} />}
                                >
                                  Útil ({comment.likes})
                                </Button>
                              </Flex>
                            </VStack>
                          </Box>
                        ))}
                      </VStack>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              {/* COLUNA DIREITA */}
              <VStack spacing={6} align="stretch">
                <Box bg="#FAF9F6" p={6} borderRadius="16px" border="1px solid" borderColor="#EFEBE3">
                  <Heading fontSize="md" fontFamily="Georgia, serif" mb={4} color={ACCENT}>
                    Emprestar este livro
                  </Heading>

                  <Box
                    bg={book.isAvailable ? "green.50" : "red.50"}
                    border="1px solid"
                    borderColor={book.isAvailable ? "green.200" : "red.200"}
                    p={3}
                    borderRadius="8px"
                    mb={6}
                  >
                    <HStack spacing={3}>
                      <Icon as={FiCheckCircle} color={book.isAvailable ? "green.600" : "red.600"} w={5} h={5} />
                      <Box>
                        <Text fontSize="xs" fontWeight="bold" color={book.isAvailable ? "green.800" : "red.800"}>
                          {book.isAvailable ? "Disponível na biblioteca" : "Indisponível no momento"}
                        </Text>
                        <Text fontSize="xs" color={book.isAvailable ? "green.700" : "red.700"}>
                          {book.isAvailable ? "Você pode reservar ou emprestar este livro." : "Aguarde a devolução de um exemplar."}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  <VStack spacing={3} w="full">
                    <Button
                      w="full"
                      bg={ACCENT}
                      color="white"
                      h={12}
                      borderRadius="8px"
                      isDisabled={!book.isAvailable}
                      _hover={{ bg: ACCENT_DARK }}
                      startIcon={<Icon as={FiBookOpen} />}
                    >
                      Emprestar agora
                    </Button>

                    <Button
                      w="full"
                      variant="outline"
                      borderColor="#E4DED2"
                      color="gray.700"
                      h={12}
                      borderRadius="8px"
                      _hover={{ bg: TAG_BG }}
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      startIcon={<Icon as={FiBookmark} fill={isBookmarked ? ACCENT : "none"} color={isBookmarked ? ACCENT : "currentColor"} />}
                    >
                      {isBookmarked ? "Salvo na Lista" : "Adicionar à lista de desejos"}
                    </Button>
                  </VStack>

                  <VStack spacing={3} mt={6} pt={6} borderTop="1px solid" borderColor="#EFEBE3" align="stretch">
                    {[
                      { icon: FiTag, label: "Código do livro", val: book.id },
                      { icon: FiLayers, label: "Categoria", val: book.categories?.join(" / ") },
                      { icon: FiShield, label: "Avaliação Indicativa", val: book.ageRating },
                      { icon: FiBookOpen, label: "Quantidade disponível", val: `${book.availableQuantity} exemplares` },
                    ].map((info, idx) => (
                      <Flex key={idx} justify="space-between" align="center" fontSize="xs">
                        <HStack color="gray.500">
                          <Icon as={info.icon} w={4} h={4} color={ACCENT} />
                          <Text>{info.label}</Text>
                        </HStack>
                        <Text fontWeight="semibold" color="gray.800">{info.val}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>

                {/* Livros Semelhantes */}
                <Box bg="#FAF9F6" p={6} borderRadius="16px" border="1px solid" borderColor="#EFEBE3">
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading fontSize="sm" fontFamily="Georgia, serif" color={ACCENT}>Livros semelhantes</Heading>
                    <Button variant="link" color={ACCENT} fontSize="xs">Ver todos →</Button>
                  </Flex>

                  <VStack spacing={3} align="stretch">
                    {book.similarBooks?.map((similarBook) => (
                      <HStack
                        key={similarBook.id}
                        p={2}
                        borderRadius="8px"
                        _hover={{ bg: TAG_BG }}
                        cursor="pointer"
                        transition="background 0.2s"
                        spacing={3}
                      >
                        <Image src={similarBook.coverUrl} alt={similarBook.title} w="40px" h="55px" objectFit="cover" borderRadius="4px" />
                        <Box flex={1}>
                          <Text fontSize="xs" fontWeight="bold" color="gray.800" lineClamp={1}>
                            {similarBook.title}
                          </Text>
                          <Text fontSize="xs" color="gray.500">{similarBook.author}</Text>
                        </Box>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </SimpleGrid>
          </FadeIn>
        </Container>
      </Box>
    </Flex>
  );
}