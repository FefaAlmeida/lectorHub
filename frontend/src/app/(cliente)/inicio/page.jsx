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
 SimpleGrid,
 Icon,
 Button,
 Avatar,
 Menu,
 Container,
} from "@chakra-ui/react";
import { useState } from "react";
import {
 FiHome,
 FiBookOpen,
 FiShoppingBag,
 FiUsers,
 FiSearch,
 FiSettings,
 FiLogOut,
 FiPlus,
 FiGrid,
 FiTrendingUp,
 FiClock,
 FiAward,
} from "react-icons/fi";
import FadeIn from "@/components/ui/fade-in";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ACCENT = "#7A3131"; // vinho

// Itens da barra lateral
const NAV_ITEMS = [
 { label: "Início", icon: FiHome, active: true },
 { label: "Minhas Leituras", icon: FiBookOpen },
 { label: "Catálogo", icon: FiGrid },
 { label: "Comunidade", icon: FiUsers },
 { label: "Conquistas", icon: FiAward },
];

// Cards de acesso rápido
const QUICK_CARDS = [
 {
  icon: FiBookOpen,
  title: "Continue lendo",
  description: "Retome seu livro atual exatamente de onde parou.",
  accent: ACCENT,
 },
 {
  icon: FiTrendingUp,
  title: "Seu progresso",
  description: "Você leu 12 livros este mês — melhor marca pessoal.",
  accent: "#B54545",
 },
 {
  icon: FiClock,
  title: "Histórico recente",
  description: "Acesse os últimos títulos e retome suas anotações.",
  accent: "#8B3A3A",
 },
 {
  icon: FiGrid,
  title: "Explorar gêneros",
  description: "Navegue por ficção, não-ficção, poesia e muito mais.",
  accent: "#6E2F2F",
 },
];

// Componente de card reaproveitado (mesmo estilo dos cards de Features)
function QuickCard({ item }) {
 const [hover, setHover] = useState(false);

 return (
  <Box
   as="article"
   onMouseEnter={() => setHover(true)}
   onMouseLeave={() => setHover(false)}
   bg="#FAF9F6"
   border="1px solid"
   borderColor={hover ? "transparent" : "#EFEBE3"}
   borderTopLeftRadius="6px"
   borderTopRightRadius="28px"
   borderBottomLeftRadius="28px"
   borderBottomRightRadius="6px"
   p={{ base: 6, md: 8 }}
   h="full"
   cursor="pointer"
   transform={
    hover ? "translateY(-8px) rotate(-0.4deg)" : "translateY(0) rotate(0deg)"
   }
   boxShadow={
    hover
     ? "0 24px 48px -24px rgba(122, 49, 49, 0.35)"
     : "0 1px 2px rgba(0,0,0,0.03)"
   }
   transition={`transform 0.55s ${EASE}, box-shadow 0.55s ${EASE}, border-color 0.4s ${EASE}`}
   sx={{
    "@media (prefers-reduced-motion: reduce)": {
     transform: "none !important",
     transition: "none !important",
    },
   }}
  >
   <VStack align="center" spacing={4}>
    {/* Ícone centralizado */}
    <Flex
     w={12}
     h={12}
     borderRadius="full"
     align="center"
     justify="center"
     border="1.5px solid"
     borderColor={hover ? item.accent : "#E4DED2"}
     color={hover ? item.accent : "gray.900"}
     transform={hover ? "scale(1.06)" : "scale(1)"}
     transition={`all 0.4s ${EASE}`}
    >
     <Icon as={item.icon} w={5} h={5} />
    </Flex>

    {/* Linha decorativa */}
    <Box
     alignSelf="center"
     w={hover ? "32px" : "0px"}
     h="2px"
     bg={item.accent}
     transition={`width 0.45s ${EASE}`}
    />

    <Heading
     fontSize="lg"
     fontWeight="semibold"
     color="gray.900"
     fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
     textAlign="center"
    >
     {item.title}
    </Heading>

    <Text color="gray.600" lineHeight="tall" fontSize="sm" textAlign="center">
     {item.description}
    </Text>
   </VStack>
  </Box>
 );
}

export default function Dashboard() {
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
     {/* Navegação */}
     <VStack as="nav" spacing={1} align="stretch">
      {NAV_ITEMS.map((item) => (
       <Button
        key={item.label}
        variant="ghost"
        justifyContent="flex-start"
        startIcon={<Icon as={item.icon} w={5} h={5} />}
        fontWeight={item.active ? "semibold" : "normal"}
        color={item.active ? ACCENT : "gray.600"}
        bg={item.active ? "rgba(122, 49, 49, 0.06)" : "transparent"}
        borderLeft={
         item.active ? `3px solid ${ACCENT}` : "3px solid transparent"
        }
        borderRadius="6px"
        _hover={{
         bg: "rgba(122, 49, 49, 0.04)",
         color: ACCENT,
        }}
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

     {/* Perfil / Menu dropdown */}
     <Menu.Root positioning={{ placement: "right-end" }}>
      <Menu.Trigger asChild>
       <Button
        variant="ghost"
        w="full"
        justifyContent="flex-start"
        startIcon={
         <Avatar
          size="sm"
          name="Maria Oliveira"
          src="https://i.pravatar.cc/150?img=5"
          border="2px solid"
          borderColor={ACCENT}
         />
        }
        fontWeight="medium"
        color="gray.700"
        _hover={{ bg: "rgba(122, 49, 49, 0.04)" }}
        borderRadius="6px"
        h={12}
        pl={2}
       >
        Maria Oliveira
       </Button>
      </Menu.Trigger>
      <Menu.Content
       bg="#FAF9F6"
       borderColor="#EFEBE3"
       borderRadius="12px"
       boxShadow="0 12px 40px -12px rgba(122, 49, 49, 0.25)"
       p={2}
      >
       <Menu.Item value="settings" borderRadius="6px">
        <Icon as={FiSettings} mr={2} />
        Configurações
       </Menu.Item>
       <Menu.Item value="profile" borderRadius="6px">
        <Icon as={FiUsers} mr={2} />
        Perfil
       </Menu.Item>
       <Menu.Separator borderColor="#EFEBE3" />
       <Menu.Item
        value="logout"
        color="red.500"
        borderRadius="6px"
        _hover={{ bg: "red.50" }}
       >
        <Icon as={FiLogOut} mr={2} />
        Sair
       </Menu.Item>
      </Menu.Content>
     </Menu.Root>
    </VStack>
   </Box>

   {/* CONTEÚDO PRINCIPAL */}
   <Box flex={1} p={{ base: 4, md: 8 }} overflowY="auto">
    <Container maxW="6xl" px={0}>
     <VStack spacing={10} align="stretch">
      {/* Cabeçalho de boas-vindas + pesquisa */}
      <FadeIn>
       <Box
        bg="#FAF9F6"
        border="1px solid"
        borderColor="#EFEBE3"
        borderTopLeftRadius="6px"
        borderTopRightRadius="36px"
        borderBottomLeftRadius="36px"
        borderBottomRightRadius="6px"
        p={{ base: 6, md: 10 }}
        boxShadow="0 4px 20px -8px rgba(122, 49, 49, 0.08)"
       >
        <VStack spacing={5} align="flex-start" maxW="3xl">
         {/* Barra decorativa */}
         <Box
          w="40px"
          h="3px"
          borderRadius="full"
          bgGradient={`linear(to-r, ${ACCENT}, #B54545)`}
         />

         <Heading
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="semibold"
          letterSpacing="tight"
          lineHeight="1.2"
          color="gray.900"
          fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
         >
          Bom dia, Maria.
         </Heading>

         <Text fontSize="lg" color="gray.600" lineHeight="relaxed">
          Você está a{" "}
          <Text as="span" fontWeight="bold" color="gray.900">
           3 capítulos
          </Text>{" "}
          de concluir{" "}
          <Text as="span" fontStyle="italic">
           “Cem Anos de Solidão”
          </Text>
          . Continue sua imersão literária.
         </Text>

         {/* Campo de pesquisa estilizado */}
         <InputGroup
          maxW="sm"
          size="lg"
          startElement={<Icon as={FiSearch} color="gray.400" />}
         >
          <Input
           placeholder="Buscar livros, autores..."
           bg="white"
           border="1px solid"
           borderColor="#E4DED2"
           borderRadius="full"
           color="gray.900"
           _placeholder={{ color: "gray.400" }}
           _hover={{ borderColor: "#C4B8A8" }}
           _focus={{
            borderColor: ACCENT,
            boxShadow: `0 0 0 3px rgba(122, 49, 49, 0.15)`,
           }}
           transition={`all 0.3s ${EASE}`}
          />
         </InputGroup>
        </VStack>
       </Box>
      </FadeIn>

      {/* Cards de acesso rápido */}
      <Box>
       <FadeIn>
        <Heading
         fontSize="2xl"
         fontWeight="semibold"
         color="gray.900"
         mb={6}
         fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
        >
         Acesse rapidamente
        </Heading>
       </FadeIn>

       <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
        {QUICK_CARDS.map((card) => (
         <FadeIn key={card.title} delay={0.1}>
          <QuickCard item={card} />
         </FadeIn>
        ))}
       </SimpleGrid>
      </Box>
     </VStack>
    </Container>
   </Box>
  </Flex>
 );
}
