import {
 Box,
 Container,
 Heading,
 Text,
 VStack,
 SimpleGrid,
 Flex,
 Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import FadeIn from "@/components/ui/fade-in";
import { FiEye, FiFeather, FiLayout } from "react-icons/fi";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ACCENT = "#7A3131"; // vinho — usado só como acento pontual

const FEATURES = [
 {
  icon: FiEye,
  title: "Design invisível",
  desc:
   "nossa interface foi projetada para não ser notada. sem botões piscando, sem excesso de cores. apenas você, a tela limpa e o texto.",
 },
 {
  icon: FiFeather,
  title: "Curadoria artesanal",
  desc:
   "esqueça as recomendações genéricas de algoritmos. nosso acervo é rigorosamente selecionado por especialistas e críticos literários.",
 },
 {
  icon: FiLayout,
  title: "Tipografia fluida",
  desc:
   "fontes, contrastes e espaçamentos estudados cientificamente para reduzir a fadiga visual.",
 },
];

function FeatureCard({ item }) {
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
   p={{ base: 8, md: 10 }}
   h="full"
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
   <VStack align="center" spacing={5}>
    {/* Ícone centralizado */}
    <Flex
     w={14}
     h={14}
     borderRadius="full"
     align="center"
     justify="center"
     border="1.5px solid"
     borderColor={hover ? ACCENT : "#E4DED2"}
     color={hover ? ACCENT : "gray.900"}
     transform={hover ? "scale(1.06)" : "scale(1)"}
     transition={`all 0.4s ${EASE}`}
    >
     <Icon as={item.icon} w={6} h={6} />
    </Flex>

    {/* Linha decorativa centralizada (agora depois do ícone) */}
    <Box
     alignSelf="center"
     w={hover ? "40px" : "0px"}
     h="2px"
     bg={ACCENT}
     transition={`width 0.45s ${EASE}`}
    />

    {/* Título e descrição continuam à esquerda */}
    <Heading
     fontSize="xl"
     fontWeight="semibold"
     color="gray.900"
     fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
    >
     {item.title}
    </Heading>

    <Text color="gray.600" lineHeight="tall" fontSize="md">
     {item.desc}
    </Text>
   </VStack>
  </Box>
 );
}

export default function Features() {
 return (
  <Box
   py={{ base: 20, md: 32 }}
   position="relative"
   zIndex={1}
   boxShadow="0 -8px 24px -12px rgba(0,0,0,0.15)"
  >
   <Container maxW="6xl">
    <VStack spacing={20}>
     <FadeIn>
      <VStack spacing={4} textAlign="center" maxW="2xl" mx="auto" p={50}>
       <Heading
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight="600"
        letterSpacing="tight"
        lineHeight={1}
        color={"gray.800"}
       >
        Por que escolher nossa plataforma?
       </Heading>
       <Text color="gray.600" fontSize="lg" lineHeight="relaxed" mt={1}>
        diferenciais pensados exclusivamente para quem leva a leitura a sério e
        não abre mão de qualidade.
       </Text>
      </VStack>
     </FadeIn>

     <SimpleGrid
      columns={{ base: 1, md: 3 }}
      spacing={{ base: 8, md: 10 }}
      w="full"
      gap={4}
     >
      {FEATURES.map((item, i) => (
       <FadeIn key={item.title} delay={0.12 * (i + 1)}>
        <FeatureCard item={item} />
       </FadeIn>
      ))}
     </SimpleGrid>
    </VStack>
   </Container>
  </Box>
 );
}
