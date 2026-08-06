import {
 Box,
 Container,
 Heading,
 Text,
 VStack,
 Stack,
 Button,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import FadeIn from "@/components/ui/fade-in";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ACCENT = "#7A3131"; // vinho

// SVG decorativo de livro aberto (minimalista, em linha)

export default function Cta() {
 return (
  <Box position="relative" bg="gray.900" overflow="hidden">
   {/* Glow blobs — mesmos tons do Hero */}
   <Box
    position="absolute"
    top="-15%"
    right="-10%"
    w={{ base: "250px", md: "450px" }}
    h={{ base: "250px", md: "450px" }}
    bg="orange.400"
    opacity={0.07}
    filter="blur(100px)"
    borderRadius="full"
    pointerEvents="none"
    zIndex={0}
   />
   <Box
    position="absolute"
    bottom="-10%"
    left="-5%"
    w={{ base: "200px", md: "350px" }}
    h={{ base: "200px", md: "350px" }}
    bg={ACCENT}
    opacity={0.06}
    filter="blur(90px)"
    borderRadius="full"
    pointerEvents="none"
    zIndex={0}
   />

   <Box py={{ base: 20, md: 32 }} position="relative" zIndex={1}>
    <Container maxW="5xl" position="relative">
     <FadeIn>
      <Box position="relative">
       <VStack
        position="relative"
        zIndex={1}
        bg="#FAF9F6"
        border="1px solid"
        borderColor="#EFEBE3"
        borderTopLeftRadius="6px"
        borderTopRightRadius="36px"
        borderBottomLeftRadius="36px"
        borderBottomRightRadius="6px"
        p={{ base: 10, md: 20 }}
        spacing={8}
        textAlign="center"
        boxShadow="0 25px 60px -15px rgba(122, 49, 49, 0.12), 0 0 0 1px rgba(0,0,0,0.02)"
        transition={`transform 0.55s ${EASE}, box-shadow 0.55s ${EASE}`}
        _hover={{
         transform: "translateY(-4px)",
         boxShadow:
          "0 30px 70px -15px rgba(122, 49, 49, 0.25), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
        sx={{
         "@media (prefers-reduced-motion: reduce)": {
          transform: "none !important",
          transition: "none !important",
         },
        }}
       >
        {/* Barra decorativa com gradiente vinho */}
        <Box
         w="56px"
         h="4px"
         borderRadius="full"
         bgGradient={`linear(to-r, ${ACCENT}, #B54545)`}
         mb={-2}
        />

        <Heading
         fontSize={{ base: "3xl", md: "5xl" }}
         fontWeight="semibold"
         letterSpacing="-0.02em"
         lineHeight="1.15"
         maxW="3xl"
         color="gray.900"
         fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
        >
         Pronto para elevar sua leitura?
        </Heading>

        <Text
         fontSize={{ base: "md", md: "lg" }}
         color="gray.600"
         maxW="2xl"
         lineHeight="1.7"
        >
         Junte-se a milhares de leitores que já descobriram o poder de um
         ambiente digital focado em imersão.
        </Text>

        <Stack direction={{ base: "column", sm: "row" }} spacing={4} pt={2}>
         {/* Botão primário — acento vinho */}
         <Button
          size="lg"
          bg={ACCENT}
          color="white"
          px={10}
          py={7}
          borderRadius="full"
          fontWeight="medium"
          fontSize="md"
          rightIcon={<FiArrowRight />}
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
          Cadastre-se
         </Button>

         {/* Botão secundário — outline com tom vinho */}
         <Button
          size="lg"
          variant="outline"
          borderColor={ACCENT}
          color={ACCENT}
          bg="transparent"
          px={10}
          py={7}
          borderRadius="full"
          fontWeight="medium"
          fontSize="md"
          transition={`all 0.4s ${EASE}`}
          _hover={{
           bg: "rgba(122, 49, 49, 0.06)",
           transform: "scale(1.04)",
           borderColor: "#8B3A3A",
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
          Faça login
         </Button>
        </Stack>
       </VStack>
      </Box>
     </FadeIn>
    </Container>
   </Box>
  </Box>
 );
}
