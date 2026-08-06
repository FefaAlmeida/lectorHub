"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  NativeSelect,
  SimpleGrid,
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
  FiHome,
  FiClock,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

// --- CONFIGURAÇÕES VISUAIS DA SUA AMIGA ---
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const PRIMARY_COLOR = "#7A3131"; // Vinho/marrom principal
const BG_COLOR = "#FDFBF7"; // Fundo bege claro
const CARD_BG = "#FFFFFF"; // Fundo dos cards
const BORDER_COLOR = "#EFEBE3"; // Cor das bordas
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";

// --- DADOS DA NAVEGAÇÃO ---
const NAV_ITEMS = [
  { label: "Início", icon: FiHome, active: false },
  { label: "Buscar Livros", icon: FiSearch, active: true }, // Página atual ativa
  { label: "Meus Empréstimos", icon: FiBookOpen, active: false },
  { label: "Histórico", icon: FiClock, active: false },
  { label: "Meu Cadastro", icon: FiUser, active: false },
];

// --- SEUS DADOS (CONTEÚDO INTACTO) ---
const livros = [
  {
    id: 1,
    titulo: "1984",
    autor: "George Orwell",
    tags: ["Ficção", "Distopia"],
    imagem: "/livros/1984.jpg",
    status: "Disponível",
  },
  {
    id: 2,
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    tags: ["Infantil", "Clássico"],
    imagem: "/livros/principe.jpg",
    status: "Disponível",
  },
  {
    id: 3,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    tags: ["Romance", "Clássico"],
    imagem: "/livros/dom.jpg",
    status: "Disponível",
  },
  {
    id: 4,
    titulo: "A Menina que Roubava Livros",
    autor: "Markus Zusak",
    tags: ["Ficção Histórica"],
    imagem: "/livros/menina.jpg",
    status: "Disponível",
  },
  {
    id: 5,
    titulo: "O Hobbit",
    autor: "J.R.R Tolkien",
    tags: ["Fantasia", "Aventura"],
    imagem: "/livros/hobbit.jpg",
    status: "Indisponível",
  },
  {
    id: 6,
    titulo: "Sapiens",
    autor: "Yuval Noah Harari",
    tags: ["Não Ficção", "História"],
    imagem: "/livros/sapiens.jpg",
    status: "Disponível",
  },
];

// --- COMPONENTE AUXILIAR DA SIDEBAR ---
function NavItem({ item }) {
  return (
    <HStack
      as="a"
      href="#"
      spacing={3}
      p={3}
      pl={4}
      borderRadius="6px"
      color={item.active ? "white" : TEXT_DARK}
      bg={item.active ? PRIMARY_COLOR : "transparent"}
      _hover={!item.active ? { bg: "#F5F1E9" } : {}}
      transition={`all 0.2s ${EASE}`}
      cursor="pointer"
      fontWeight={item.active ? "semibold" : "normal"}
    >
      <Icon as={item.icon} w={5} h={5} mr={3} />
      <Text fontSize="md">{item.label}</Text>
    </HStack>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function BuscarLivros() {
  return (
    <Flex minH="100vh" bg={BG_COLOR}>
      {/* BARRA LATERAL (Idêntica à da amiga) */}
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
        <Stack spacing={3} align="stretch" gap={2}>
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
            color={TEXT_DARK}
            _hover={{ bg: "#F5F1E9", color: PRIMARY_COLOR }}
            transition={`all 0.2s ${EASE}`}
            cursor="pointer"
          >
            <Icon as={FiLogOut} w={5} h={5} mr={3} />
            <Text fontSize="md">Sair</Text>
          </HStack>
        </Stack>
      </Box>

      {/* CONTEÚDO PRINCIPAL (Seu conteúdo) */}
      <Box flex={1} p={{ base: 6, md: 8 }} pb={16}>
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

          {/* Barra de Busca e Botões (Estilo arredondado igual o dela) */}
          <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <InputGroup
              flex="1"
              startElement={<Icon as={FiSearch} color={TEXT_LIGHT} ml={2} />}
            >
              <Input
                placeholder="Digite título, autor ou assunto..."
                bg={CARD_BG}
                border="1px solid"
                borderColor={BORDER_COLOR}
                borderRadius="full"
                _placeholder={{ color: "#AAA" }}
                _focus={{ borderColor: PRIMARY_COLOR }}
                pl={10}
                size="lg"
              />
            </InputGroup>

            <Button bg={PRIMARY_COLOR} color="white" _hover={{ bg: "#632727" }} size="lg" px={10} borderRadius="full">
              Buscar
            </Button>

            <Button variant="outline" color={TEXT_DARK} borderColor={BORDER_COLOR} _hover={{ bg: "#F5F1E9" }} size="lg" borderRadius="full">
              <Icon mr={2}><FiSliders /></Icon>
              Busca Avançada
            </Button>
          </Flex>

          {/* Filtros */}
          <Flex gap={6} wrap="wrap" align="flex-end">
            <Field.Root flex={{ base: "1 1 100%", md: "1" }}>
              <Text fontSize="sm" color={TEXT_DARK} mb={2} fontWeight="medium">Categoria</Text>
              <NativeSelect.Root>
                <NativeSelect.Field bg={CARD_BG} borderColor={BORDER_COLOR} borderRadius="8px">
                  <option>Todas</option>
                  <option>Romance</option>
                  <option>Fantasia</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root flex={{ base: "1 1 100%", md: "1" }}>
              <Text fontSize="sm" color={TEXT_DARK} mb={2} fontWeight="medium">Gênero</Text>
              <NativeSelect.Root>
                <NativeSelect.Field bg={CARD_BG} borderColor={BORDER_COLOR} borderRadius="8px">
                  <option>Todos</option>
                  <option>Clássico</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root flex={{ base: "1 1 100%", md: "1" }}>
              <Text fontSize="sm" color={TEXT_DARK} mb={2} fontWeight="medium">Disponibilidade</Text>
              <NativeSelect.Root>
                <NativeSelect.Field bg={CARD_BG} borderColor={BORDER_COLOR} borderRadius="8px">
                  <option>Todos</option>
                  <option>Disponível</option>
                  <option>Indisponível</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root flex={{ base: "1 1 100%", md: "1" }}>
              <Text fontSize="sm" color={TEXT_DARK} mb={2} fontWeight="medium">Ordenar por</Text>
              <NativeSelect.Root>
                <NativeSelect.Field bg={CARD_BG} borderColor={BORDER_COLOR} borderRadius="8px">
                  <option>Mais relevantes</option>
                  <option>A-Z</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field.Root>

            <Button variant="ghost" color={TEXT_LIGHT} _hover={{ bg: "transparent", color: PRIMARY_COLOR, textDecoration: "underline" }} px={2}>
              <Icon mr={2}><FiRefreshCcw /></Icon>
              Limpar filtros
            </Button>
          </Flex>

          {/* Cabeçalho dos Resultados */}
          <Flex justify="space-between" align="center" mt={4} borderBottom="1px solid" borderColor={BORDER_COLOR} pb={4}>
            <HStack gap={4}>
              <Flex bg={CARD_BG} p={3} rounded="full" border="1px solid" borderColor={BORDER_COLOR} color={PRIMARY_COLOR}>
                <FiBookOpen size={18} />
              </Flex>
              <Stack gap={0}>
                <Text fontWeight="bold" color={TEXT_DARK} fontSize="lg">
                  {livros.length} livros encontrados
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

          {/* Grid de Livros (Estilo de card da sua amiga) */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={6} mt={4}>
            {livros.map((livro) => (
              <Card.Root
                key={livro.id}
                variant="outline"
                bg={CARD_BG}
                borderRadius="12px"
                border="1px solid"
                borderColor={BORDER_COLOR}
                overflow="hidden"
                transition={`all 0.2s ${EASE}`}
                _hover={{ transform: "translateY(-4px)", boxShadow: "sm", borderColor: "#DED6C9" }}
              >
                {/* Imagem com AspectRatio igual ao dela */}
                <Box p={4} pb={0} position="relative">
                  <Icon
                    as={FiHeart}
                    position="absolute"
                    top={6}
                    right={6}
                    color="gray.400"
                    cursor="pointer"
                    zIndex={2}
                    _hover={{ color: PRIMARY_COLOR }}
                  />
                  <AspectRatio ratio={2/3} w="full" borderRadius="8px" overflow="hidden" bg="#F2EFE9">
                    <Image
                      src={livro.imagem}
                      alt={livro.titulo}
                      objectFit="cover"
                      fallback={<Box w="full" h="full" bg="#EFEBE3" />}
                    />
                  </AspectRatio>
                </Box>

                <Card.Body pt={4} pb={3} px={4} gap={2}>
                  <Heading size="sm" color={TEXT_DARK} noOfLines={1}>
                    {livro.titulo}
                  </Heading>
                  
                  <Text color={TEXT_LIGHT} fontSize="xs" mb={1} noOfLines={1}>
                    {livro.autor}
                  </Text>

                  <HStack flexWrap="wrap" gap={1} mb={2}>
                    {livro.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        bg="#F7EAEA"
                        color={PRIMARY_COLOR}
                        fontSize="2xs"
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        fontWeight="medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>

                  <HStack align="center" gap={2}>
                    <Box
                      w={2}
                      h={2}
                      borderRadius="full"
                      bg={livro.status === "Disponível" ? "#48BB78" : "#E53E3E"}
                    />
                    <Text fontSize="xs" color={TEXT_DARK} fontWeight="medium">
                      {livro.status}
                    </Text>
                  </HStack>
                </Card.Body>

                <Card.Footer px={4} pb={4} pt={1}>
                  <Button
                    w="full"
                    variant="outline"
                    color={TEXT_DARK}
                    borderColor={BORDER_COLOR}
                    _hover={{ bg: "#F5F1E9", color: PRIMARY_COLOR }}
                    size="sm"
                    borderRadius="6px"
                    fontWeight="medium"
                  >
                    Ver detalhes
                  </Button>
                </Card.Footer>
              </Card.Root>
            ))}
          </SimpleGrid>

          {/* Paginação */}
          <Flex justify="center" align="center" mt={8} gap={2}>
            <IconButton variant="ghost" color={TEXT_LIGHT} aria-label="Anterior" size="sm">
              <FiChevronLeft />
            </IconButton>
            
            <Button bg={PRIMARY_COLOR} color="white" size="sm" w={8} p={0} borderRadius="6px">1</Button>
            <Button variant="ghost" color={TEXT_DARK} size="sm" w={8} p={0} borderRadius="6px">2</Button>
            <Button variant="ghost" color={TEXT_DARK} size="sm" w={8} p={0} borderRadius="6px">3</Button>
            
            <Text color={TEXT_LIGHT} mx={1}>...</Text>
            
            <Button variant="ghost" color={TEXT_DARK} size="sm" w={8} p={0} borderRadius="6px">11</Button>
            
            <IconButton variant="ghost" color={TEXT_LIGHT} aria-label="Próximo" size="sm">
              <FiChevronRight />
            </IconButton>
          </Flex>

        </Stack>
      </Box>
    </Flex>
  );
}