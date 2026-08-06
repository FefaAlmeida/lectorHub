"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputGroup,
  Button,
  Icon,
  SimpleGrid,
  Image,
  Separator,
  AspectRatio,
  Link,
} from "@chakra-ui/react";
import {
  FiHome,
  FiSearch,
  FiBookOpen,
  FiClock,
  FiUser,
  FiLogOut,
  FiArrowRight,
  FiPlus,
  FiChevronRight,
  FiAlertTriangle,
  FiGift,
} from "react-icons/fi";

// --- CONFIGURAÇÕES VISUAIS ---
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const PRIMARY_COLOR = "#7A3131"; // Vinho principal
const BG_COLOR = "#FFFFFF"; // Fundo geral em branco
const CARD_BG = "#FFFFFF"; // Fundo dos cards
const BORDER_COLOR = "#EFEBE3"; // Cor das bordas
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";

// --- DADOS DA INTERFACE ---

const NAV_ITEMS = [
  { label: "Início", icon: FiHome, active: true },
  { label: "Buscar Livros", icon: FiSearch },
  { label: "Meus Empréstimos", icon: FiBookOpen },
  { label: "Histórico", icon: FiClock },
  { label: "Meu Cadastro", icon: FiUser },
];

const QUICK_ACTIONS = [
  { label: "Buscar Livros", icon: FiSearch, description: "Encontre livros por título, autor ou assunto" },
  { label: "Meus Empréstimos", icon: FiBookOpen, description: "Veja seus livros emprestados e prazos" },
  { label: "Histórico", icon: FiClock, description: "Confira seu histórico de empréstimos" },
  { label: "Meu Cadastro", icon: FiUser, description: "Atualize seus dados cadastrais" },
];

const FEATURED_BOOKS = [
  { 
    title: "O Pequeno Príncipe", 
    author: "Antoine de Saint-Exupéry", 
    cover: "https://m.media-amazon.com/images/I/81TmOZIXvzL._SY466_.jpg" 
  },
  { 
    title: "Harry Potter e as Relíquias da Morte", 
    author: "J.K. Rowling", 
    cover: "https://rocco.com.br/wp-content/uploads/2022/12/9788532522610.jpg" 
  },
  { 
    title: "A Menina que Roubava Livros", 
    author: "Markus Zusak", 
    cover: "https://m.media-amazon.com/images/I/41pVlY-bbaL._SY445_SX342_ML2_.jpg" 
  },
  { 
    title: "Reinações de Narizinho", 
    author: "Monteiro Lobato", 
    cover: "https://m.media-amazon.com/images/I/91YuC183KaL._SY425_.jpg" 
  },
];

const ANNOUNCEMENTS = [
  { title: "Horário de Funcionamento", description: "Segunda a Sexta: 08h às 18h\nSábado: 08h às 12h", icon: FiClock, color: "#F7EAEA" },
  { title: "Devoluções", description: "Fique atento ao prazo de devolução para evitar multas.", icon: FiAlertTriangle, color: "#FBF3EB" },
  { title: "Novidades", description: "Novos livros adicionados ao acervo!\nConfira na busca.", icon: FiGift, color: "#FBF3EB" },
];

// --- COMPONENTES AUXILIARES ---

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

function QuickActionCard({ action }) {
  return (
    <Flex
      align="center"
      bg={CARD_BG}
      p={4}
      borderRadius="12px"
      border="1px solid"
      borderColor={BORDER_COLOR}
      cursor="pointer"
      _hover={{ borderColor: PRIMARY_COLOR, boxShadow: "sm" }}
      transition={`all 0.2s ${EASE}`}
    >
      <Flex
        w={12}
        h={12}
        borderRadius="full"
        bg={PRIMARY_COLOR}
        color="white"
        align="center"
        justify="center"
        mr={3}
        flexShrink={0}
      >
        <Icon as={action.icon} w={5} h={5} />
      </Flex>
      <VStack align="flex-start" spacing={0} flex={1}>
        <Heading fontSize="sm" fontWeight="semibold" color={PRIMARY_COLOR}>
          {action.label}
        </Heading>
        <Text fontSize="xs" color={TEXT_LIGHT} noOfLines={2}>
          {action.description}
        </Text>
      </VStack>
      <Icon as={FiChevronRight} color={PRIMARY_COLOR} w={4} h={4} ml={1} />
    </Flex>
  );
}

function BookCard({ book }) {
  return (
    <VStack align="flex-start" spacing={2} w="full">
      <AspectRatio ratio={2/3} w="full" borderRadius="8px" overflow="hidden" boxShadow="sm" bg="#F2EFE9">
        <Image src={book.cover} alt={book.title} objectFit="cover" w="full" h="full" />
      </AspectRatio>
      <VStack align="flex-start" spacing={0} w="full" minH="50px">
        <Text fontSize="xs" fontWeight="semibold" color={PRIMARY_COLOR} noOfLines={2} lineHeight="tight">
          {book.title}
        </Text>
        <Text fontSize="xs" color={TEXT_LIGHT} noOfLines={1} mt={1}>
          {book.author}
        </Text>
      </VStack>
    </VStack>
  );
}

function AnnouncementCard({ announcement }) {
  return (
    <Flex
      bg={announcement.color}
      p={5}
      borderRadius="12px"
      align="center"
      border="1px solid"
      borderColor="rgba(0,0,0,0.04)"
      h="full"
    >
      <Flex
        w={12}
        h={12}
        borderRadius="full"
        border="2px solid"
        borderColor={PRIMARY_COLOR}
        color={PRIMARY_COLOR}
        align="center"
        justify="center"
        mr={4}
        flexShrink={0}
      >
        <Icon as={announcement.icon} w={5} h={5} />
      </Flex>
      <VStack align="flex-start" spacing={1}>
        <Heading fontSize="sm" fontWeight="semibold" color={PRIMARY_COLOR}>
          {announcement.title}
        </Heading>
        <Text fontSize="xs" color={TEXT_DARK} whiteSpace="pre-line" lineHeight="tall">
          {announcement.description}
        </Text>
      </VStack>
    </Flex>
  );
}

// --- DASHBOARD PRINCIPAL ---

export default function DashboardPage() {
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
      <Box flex={1} p={{ base: 6, md: 8 }} pb={16}>
        {/* Aumentado o spacing principal do container para 12 */}
        <VStack spacing={12} align="stretch">
          
          {/* Boas-vindas + Busca */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} align="center">
            <VStack align="flex-start" spacing={4}>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color={PRIMARY_COLOR}
                fontFamily="Georgia, serif"
              >
                Bem-vinda, Natalia!
              </Heading>
              <Text fontSize="md" color={TEXT_LIGHT}>
                Explore, reserve e gerencie seus livros de forma fácil e rápida.
              </Text>

              <InputGroup
                w="full"
                maxW="lg"
                startElement={<Icon as={FiSearch} color={TEXT_LIGHT} ml={2} />}
                endElement={
                  <Button
                    height="32px"
                    borderRadius="full"
                    bg={PRIMARY_COLOR}
                    color="white"
                    px={5}
                    fontSize="xs"
                    _hover={{ bg: "#632727" }}
                    mr={1}
                  >
                    Buscar
                  </Button>
                }
              >
                <Input
                  placeholder="Pesquise por título, autor ou assunto..."
                  bg={CARD_BG}
                  border="1px solid"
                  borderColor={BORDER_COLOR}
                  borderRadius="full"
                  _placeholder={{ color: "#AAA" }}
                  _focus={{ borderColor: PRIMARY_COLOR }}
                  pl={10}
                />
              </InputGroup>
            </VStack>

            {/* Ilustração da Biblioteca - Imagem Local */}
            <Flex justify="center" align="center">
              <Image
                src="livrosInicialCliente"
                alt="Ilustração da Biblioteca"
                maxW="300px"
                maxH="200px"
                objectFit="contain"
                borderRadius="12px"
              />
            </Flex>
          </SimpleGrid>

          {/* Cards de Ação Rápida com margem adicional */}
          <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap={4} my={2}>
            {QUICK_ACTIONS.map((action, index) => (
              <QuickActionCard key={index} action={action} />
            ))}
          </SimpleGrid>

          {/* Empréstimos + Destaques */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
            
            {/* Meus Empréstimos - Destaque Maior */}
            <VStack
              align="stretch"
              spacing={5}
              p={6}
              bg={CARD_BG}
              borderRadius="12px"
              border="1px solid"
              borderColor={BORDER_COLOR}
              justify="space-between"
            >
              <Heading
                as="h2"
                fontSize="2xl"
                fontWeight="bold"
                color={PRIMARY_COLOR}
                fontFamily="Georgia, serif"
              >
                Meus Empréstimos
              </Heading>

              <Flex border="1px solid" borderColor={BORDER_COLOR} borderRadius="8px" p={4} align="center">
                <AspectRatio ratio={2/3} w="100px" mr={4} flexShrink={0}>
                  <Image 
                    src="https://m.media-amazon.com/images/I/81hCVEC0ExL._SY466_.jpg" 
                    alt="1954" 
                    borderRadius="4px" 
                    objectFit="cover"
                  />
                </AspectRatio>
                <VStack align="flex-start" spacing={1} flex={1}>
                  <Heading fontSize="md" fontWeight="semibold" color={PRIMARY_COLOR}>
                    1954
                  </Heading>
                  <Text fontSize="xs" color={TEXT_LIGHT} mb={1}>
                    J.R.R. Tolkien
                  </Text>
                  <Text fontSize="xs" color={TEXT_DARK}>
                    🗓️ Empréstimo: 01/09/2026
                  </Text>
                  <Text fontSize="xs" color={TEXT_DARK}>
                    🗓️ Devolução: 15/10/2026
                  </Text>
                </VStack>
                <Button variant="outline" size="sm" borderColor={PRIMARY_COLOR} color={PRIMARY_COLOR}>
                  Ver detalhes
                </Button>
              </Flex>

              <Flex
                border="2px dashed"
                borderColor="#DED6C9"
                borderRadius="8px"
                p={4}
                h="90px"
                align="center"
                justify="center"
                color={TEXT_LIGHT}
              >
                <VStack spacing={1}>
                  <Icon as={FiPlus} w={5} h={5} />
                  <Text fontSize="xs">Nenhum outro empréstimo no momento.</Text>
                </VStack>
              </Flex>

              <Link href="#" color={PRIMARY_COLOR} fontSize="sm" fontWeight="medium" textAlign="center" pt={1}>
                Ver todos os empréstimos <Icon as={FiArrowRight} ml={1} display="inline" />
              </Link>
            </VStack>

            {/* Livros em Destaque - Destaque Maior */}
            <VStack
              align="stretch"
              spacing={5}
              p={6}
              bg={CARD_BG}
              borderRadius="12px"
              border="1px solid"
              borderColor={BORDER_COLOR}
              justify="space-between"
            >
              <HStack justify="space-between">
                <Heading
                  as="h2"
                  fontSize="2xl"
                  fontWeight="bold"
                  color={PRIMARY_COLOR}
                  fontFamily="Georgia, serif"
                >
                  Livros em Destaque
                </Heading>
                <Link href="#" color={PRIMARY_COLOR} fontSize="xs" fontWeight="medium">
                  Ver todos <Icon as={FiArrowRight} ml={1} display="inline" />
                </Link>
              </HStack>

              <SimpleGrid columns={{ base: 2, sm: 4 }} gap={5} w="full">
                {FEATURED_BOOKS.map((book, index) => (
                  <BookCard key={index} book={book} />
                ))}
              </SimpleGrid>
            </VStack>
          </SimpleGrid>

          {/* Avisos Importantes - Destaque Maior */}
          <VStack align="stretch" spacing={4} pt={2}>
            <Heading
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              color={PRIMARY_COLOR}
              fontFamily="Georgia, serif"
            >
              Avisos Importantes
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
              {ANNOUNCEMENTS.map((ann, index) => (
                <AnnouncementCard key={index} announcement={ann} />
              ))}
            </SimpleGrid>
          </VStack>

        </VStack>
      </Box>
    </Flex>
  );
}