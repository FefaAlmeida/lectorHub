import {
 Box,
 Container,
 Heading,
 Text,
 VStack,
 Button,
 Icon,
 Stack,
 Image,
 Flex,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import FadeIn from "@/components/ui/fade-in";
import { RAIO } from "@/components/tema";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ACCENT = "#7A3131"; // vinho — acento pontual

export default function Hero() {
 return (
  <Box position="relative" overflow="hidden">
   {/* Glow blobs decorativos — tom quente + vinho */}
   <Box
    position="absolute"
    top="-10%"
    right="-5%"
    w={{ base: "300px", md: "500px" }}
    h={{ base: "300px", md: "500px" }}
    bg="orange.400"
    opacity={0.06}
    filter="blur(120px)"
    borderRadius="full"
    pointerEvents="none"
    zIndex={0}
   />
   <Box
    position="absolute"
    bottom="-10%"
    left="-5%"
    w={{ base: "250px", md: "400px" }}
    h={{ base: "250px", md: "400px" }}
    bg={ACCENT}
    opacity={0.07}
    filter="blur(100px)"
    borderRadius="full"
    pointerEvents="none"
    zIndex={0}
   />

   <Container
    maxW="6xl"
    pt={{ base: 16, md: 24 }}
    pb={{ base: 16, md: 20 }}
    position="relative"
    zIndex={1}
   >
    <Stack
     direction={{ base: "column", lg: "row" }}
     spacing={16}
     align="center"
    >
     {/* Coluna de texto */}
     <VStack align="flex-start" spacing={6} flex={1}>
      {/* Badge refinada */}
      <FadeIn delay={0.1}>
       <Flex
        px={4}
        py={1.5}
        bg="#FAF9F6"
        border="1px solid"
        borderColor="#EFEBE3"
        borderRadius="full"
        align="center"
        gap={2}
       >
        <Box w={2} h={2} borderRadius="full" bg={ACCENT} />
        <Text
         fontSize="xs"
         fontWeight="semibold"
         color="gray.700"
         letterSpacing="widest"
         textTransform="uppercase"
        >
         nova experiência de leitura
        </Text>
       </Flex>
      </FadeIn>

      {/* Heading com linha decorativa */}
      <FadeIn delay={0.2}>
       <Box
        w="48px"
        h="3px"
        borderRadius="full"
        bgGradient={`linear(to-r, ${ACCENT}, #B54545)`}
        mb={-1}
       />
       <Heading
        as="h1"
        fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
        fontWeight="light"
        letterSpacing="tighter"
        lineHeight="1.1"
        fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
       >
        Leia sem{" "}
        <Text as="span" display={{ base: "inline", md: "block" }}>
         interrupções.
        </Text>
       </Heading>
      </FadeIn>

      {/* Descrição */}
      <FadeIn delay={0.3}>
       <Text fontSize="lg" color="gray.600" maxW="lg" lineHeight="relaxed">
        redesenhamos a forma de consumir literatura. uma interface que
        desaparece para que as palavras ganhem vida.
       </Text>
      </FadeIn>

      {/* Botão com acento vinho */}
      <FadeIn delay={0.4}>
       <Button
        as="a"
        href="#beneficios"
        mt={4}
        size="lg"
        bg={ACCENT}
        color="white"
        px={8}
        h={14}
        rightIcon={<Icon as={FiArrowRight} />}
        borderRadius="full"
        fontWeight="medium"
        fontSize="md"
        transition={`all 0.4s ${EASE}`}
        _hover={{
         bg: "#8B3A3A",
         transform: "scale(1.04)",
         boxShadow: "0 12px 40px -12px rgba(122, 49, 49, 0.5)",
        }}
        _active={{
         transform: "scale(0.97)",
        }}
        sx={{
         "@media (prefers-reduced-motion: reduce)": {
          transform: "none !important",
          transition: "none !important",
         },
        }}
       >
        conheça os benefícios
       </Button>
      </FadeIn>
     </VStack>

     {/* Coluna da imagem */}
     <Box flex={1} w="full" position="relative">
      <FadeIn delay={0.5}>
       {/* Placa decorativa assimétrica atrás da imagem */}
       <Box
        position="absolute"
        inset="-4"
        bg="#FAF9F6"
        border="1px solid"
        borderColor="#EFEBE3"
        borderTopLeftRadius="6px"
        borderTopRightRadius="48px"
        borderBottomLeftRadius="48px"
        borderBottomRightRadius="6px"
        transform="rotate(3deg)"
        boxShadow="0 24px 48px -24px rgba(122, 49, 49, 0.25)"
       />

       {/* Container da imagem com hover sutil */}
       <Box
        position="relative"
        borderRadius={RAIO}
        overflow="hidden"
        boxShadow="0 25px 60px -15px rgba(122, 49, 49, 0.2), 0 0 0 1px rgba(0,0,0,0.05)"
        transition={`transform 0.55s ${EASE}, box-shadow 0.55s ${EASE}`}
        _hover={{
         transform: "translateY(-6px) rotate(-0.3deg)",
         boxShadow:
          "0 30px 70px -15px rgba(122, 49, 49, 0.35), 0 0 0 1px rgba(0,0,0,0.08)",
        }}
        sx={{
         "@media (prefers-reduced-motion: reduce)": {
          transform: "none !important",
          transition: "none !important",
         },
        }}
       >
        <Image
         src="https://images.unsplash.com/photo-1544716278-e513176f20b5"
         alt="pessoa lendo um livro"
         objectFit="cover"
         w="full"
         h="full"
        />
       </Box>
      </FadeIn>
     </Box>
    </Stack>
   </Container>
  </Box>
 );
}
