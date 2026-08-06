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
  Menu, // Adicionado para substituir o NativeSelect
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
  FiChevronDown, // Adicionado para a setinha do Menu
  FiHome,
  FiClock,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

// --- CONFIGURAÇÕES VISUAIS ---
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const PRIMARY_COLOR = "#4A0E17"; 
const BG_COLOR="#F5F2EE"; 
const CARD_BG = "#FFFFFF"; 
const BORDER_COLOR = "#EFEBE3"; 
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";

// --- DADOS DA NAVEGAÇÃO ---
const NAV_ITEMS = [
  { label: "Início", icon: FiHome, active: false },
  { label: "Buscar Livros", icon: FiSearch, active: true },
  { label: "Meus Empréstimos", icon: FiBookOpen, active: false },
  { label: "Histórico", icon: FiClock, active: false },
  { label: "Meu Cadastro", icon: FiUser, active: false },
];

// --- SEUS DADOS ---
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

// --- PÁGINA PRINCIPAL ---
export default function BuscarLivros() {
  return (
    <Flex minH="100vh" bg={BG_COLOR}>
      {/* BARRA LATERAL */}
      <Box
        as="nav"
        w="260px"
        bg="#FFFFFF"
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
              bg={PRIMARY_COLOR}
              borderRadius="14px"
              boxShadow="0 6px 18px rgba(74,14,23,.18)"
              _hover={{
                  bg:"#360A11",
                  transform:"translateY(-2px)"
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

          {/* Filtros - Mais harmônicos e customizados usando o Menu */}
          <Flex gap={4} wrap="wrap" align="flex-end">
            {[
              { label: "Categoria", options: ["Todas", "Romance", "Fantasia", "Ficção"] },
              { label: "Gênero", options: ["Todos", "Clássico", "Aventura", "Infantil"] },
              { label: "Disponibilidade", options: ["Todos", "Disponível", "Indisponível"] },
              { label: "Ordenar por", options: ["Mais relevantes", "A-Z", "Recentes"] },
            ].map((filtro, index) => (
              <Field.Root key={index} flex={{ base: "1 1 100%", md: "1" }}>
                <Text fontSize="xs" color={TEXT_DARK} mb={1.5} fontWeight="semibold" ml={2}>
                  {filtro.label}
                </Text>
                
                <Menu.Root positioning={{ sameWidth: true }}>
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
                      {filtro.options[0]}
                      <Icon as={FiChevronDown} color={PRIMARY_COLOR} fontSize="lg" />
                    </Button>
                  </Menu.Trigger>

                  <Menu.Content
                    bg="white"
                    borderRadius="16px" // Caixa mais redonda
                    border="1px solid"
                    borderColor="#E7DED8"
                    boxShadow="0 8px 24px rgba(74,14,23,.12)" // Sombra harmônica
                    p={2} // Respiro interno
                    zIndex="popover"
                  >
                    {filtro.options.map((opt) => (
                      <Menu.Item
                        key={opt}
                        value={opt}
                        px={3}
                        py={2.5}
                        borderRadius="8px" // Cantos arredondados dentro das opções
                        cursor="pointer"
                        color={TEXT_DARK}
                        fontWeight="500"
                        transition="all 0.2s ease" // Transição suave
                        _hover={{
                          bg: "#F2E6E8", // Vinho claro lindo no hover!
                          color: PRIMARY_COLOR,
                        }}
                      >
                        {opt}
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Root>

              </Field.Root>
            ))}

            <Button variant="ghost" color={PRIMARY_COLOR} _hover={{ bg: "transparent", textDecoration: "underline" }} px={2} h="10">
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

          {/* Container dos Cards */}
          <Flex
            gap={6}
            overflowX="auto"
            py={4} 
            px={2} 
            css={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
                display: "none",
            },
            }}
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
                transition={`all 0.3s ${EASE}`}
                _hover={{
                    transform:"translateY(-8px)",
                    borderColor:PRIMARY_COLOR,
                    boxShadow:"0 18px 35px rgba(74,14,23,.18)",
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
                  />
                  <AspectRatio ratio={2/3}
                    borderRadius="12px"
                    overflow="hidden"
                    bg="#F7F3EF">
                    <Image
                    src={livro.imagem}
                    alt={livro.titulo}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                    transition=".35s"
                    _hover={{
                        transform: "scale(1.05)",
                    }}
                    fallback={<Box w="100%" h="100%" bg="#EFEBE3" />}
                    />
                  </AspectRatio>
                </Box>

                <Card.Body pt={3} pb={2} px={3} gap={1}>
                  <Heading size="sm" color={TEXT_DARK} noOfLines={1} fontSize="sm">
                    {livro.titulo}
                  </Heading>
                  
                  <Text color={TEXT_LIGHT} fontSize="xs" mb={1} noOfLines={1}>
                    {livro.autor}
                  </Text>

                  <HStack flexWrap="wrap" gap={1} mb={2}>
                    {livro.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        bg="#FAF5F6"
                        color={PRIMARY_COLOR}
                        fontWeight="600"
                        borderRadius="99px"
                        px={3}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>

                  <HStack align="center" gap={1.5}>
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

          {/* Paginação */}
          <Flex justify="center" align="center" mt={4} gap={2}>
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