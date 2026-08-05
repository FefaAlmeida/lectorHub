"use client";

import React from "react";
import {
 Box,
 Container,
 Heading,
 Text,
 VStack,
 SimpleGrid,
 Icon,
 Button,
 Image,
 Flex,
 Stack,
} from "@chakra-ui/react";
import { FiEye, FiFeather, FiLayout, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

// 3. animações de revelação suaves
function FadeIn({ children, delay = 0 }) {
 return (
  <motion.div
   initial={{ opacity: 0, y: 24 }}
   whileInView={{ opacity: 1, y: 0 }}
   viewport={{ once: true, margin: "-10%" }}
   transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
  >
   {children}
  </motion.div>
 );
}

// 2. textura tátil (noise) invisível para tirar a frieza do digital
function NoiseOverlay() {
 return (
  <Box
   position="fixed"
   inset={0}
   pointerEvents="none"
   zIndex={9999}
   opacity={0.03}
   backgroundImage={`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}
  />
 );
}

export default function Home() {
 return (
  <Box
   bg="#fafafa"
   color="#1a1a1a"
   minH="100vh"
   fontFamily="sans-serif"
   position="relative"
  >
   <NoiseOverlay />
   <Hero />
   <Features />
   <Cta />
  </Box>
 );
}

function Hero() {
 return (
  <Container maxW="6xl" pt={{ base: 16, md: 24 }} pb={{ base: 16, md: 20 }}>
   <Stack direction={{ base: "column", lg: "row" }} spacing={16} align="center">
    <VStack align="flex-start" spacing={6} flex={1}>
     <FadeIn delay={0.1}>
      <Box px={4} py={1.5} bg="gray.200" borderRadius="full">
       <Text
        fontSize="xs"
        fontWeight="bold"
        color="gray.600"
        letterSpacing="widest"
       >
        nova experiência de leitura
       </Text>
      </Box>
     </FadeIn>

     <FadeIn delay={0.2}>
      <Heading
       as="h1"
       fontSize={{ base: "4xl", md: "5xl", lg: "7xl" }}
       fontWeight="light"
       letterSpacing="tighter"
       lineHeight="1.1"
      >
       leia sem <br />
       <Text as="span" fontWeight="bold" color="gray.900">
        interrupções.
       </Text>
      </Heading>
     </FadeIn>

     <FadeIn delay={0.3}>
      <Text fontSize="lg" color="gray.600" maxW="lg" lineHeight="relaxed">
       redesenhamos a forma de consumir literatura. uma interface que desaparece
       para que as palavras ganhem vida. descubra o refúgio dos leitores
       exigentes.
      </Text>
     </FadeIn>

     <FadeIn delay={0.4}>
      <Button
       mt={4}
       size="lg"
       bg="gray.900"
       color="white"
       px={8}
       h={14}
       _hover={{ bg: "gray.700", transform: "translateY(-2px)" }}
       rightIcon={<Icon as={FiArrowRight} />}
       borderRadius="full"
       fontWeight="medium"
       transition="all 0.2s"
      >
       conheça os benefícios
      </Button>
     </FadeIn>
    </VStack>

    <Box flex={1} w="full" position="relative">
     <FadeIn delay={0.5}>
      <Box
       position="absolute"
       inset="-4"
       bg="gray.200"
       borderRadius="3xl"
       transform="rotate(3deg)"
       zIndex={0}
      />
      <Image
       position="relative"
       zIndex={1}
       src="https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=800&q=80"
       alt="pessoa lendo um livro em ambiente calmo"
       borderRadius="2xl"
       boxShadow="2xl"
       objectFit="cover"
      />
     </FadeIn>
    </Box>
   </Stack>
  </Container>
 );
}

function Features() {
 const features = [
  {
   icon: FiEye,
   title: "design invisível",
   desc:
    "nossa interface foi projetada para não ser notada. sem botões piscando, sem excesso de cores. apenas você, a tela limpa e o texto.",
  },
  {
   icon: FiFeather,
   title: "curadoria artesanal",
   desc:
    "esqueça as recomendações genéricas de algoritmos. nosso acervo é rigorosamente selecionado por especialistas e críticos literários.",
  },
  {
   icon: FiLayout,
   title: "tipografia fluida",
   desc:
    "fontes, contrastes e espaçamentos estudados cientificamente para reduzir a fadiga visual, permitindo horas de leitura imersiva.",
  },
 ];

 return (
  <Box bg="white" py={{ base: 20, md: 32 }} position="relative" zIndex={1}>
   <Container maxW="6xl">
    <VStack spacing={20}>
     <FadeIn>
      <VStack spacing={4} textAlign="center" maxW="2xl" mx="auto">
       <Heading
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight="medium"
        letterSpacing="tight"
       >
        por que escolher nossa plataforma?
       </Heading>
       <Text color="gray.500" fontSize="lg" lineHeight="relaxed">
        diferenciais pensados exclusivamente para quem leva a leitura a sério e
        não abre mão de qualidade.
       </Text>
      </VStack>
     </FadeIn>

     <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
      {features.map((item, i) => (
       <FadeIn key={i} delay={0.15 * (i + 1)}>
        <VStack
         align="flex-start"
         spacing={5}
         p={10}
         bg="#fafafa"
         borderRadius="3xl"
         transition="all 0.3s"
         border="1px solid"
         borderColor="gray.100"
         _hover={{
          transform: "translateY(-8px)",
          bg: "gray.50",
          boxShadow: "lg",
         }}
         h="full"
        >
         <Flex
          w={14}
          h={14}
          bg="gray.900"
          color="white"
          borderRadius="2xl"
          align="center"
          justify="center"
          boxShadow="md"
         >
          <Icon as={item.icon} w={6} h={6} />
         </Flex>
         <Heading fontSize="xl" fontWeight="bold" color="gray.900">
          {item.title}
         </Heading>
         <Text color="gray.600" lineHeight="tall" fontSize="md">
          {item.desc}
         </Text>
        </VStack>
       </FadeIn>
      ))}
     </SimpleGrid>
    </VStack>
   </Container>
  </Box>
 );
}

function Cta() {
 return (
  <Box py={{ base: 20, md: 32 }} bg="#fafafa" position="relative" zIndex={1}>
   <Container maxW="5xl">
    <FadeIn>
     <VStack
      bg="gray.900"
      borderRadius="3xl"
      p={{ base: 10, md: 20 }}
      spacing={8}
      textAlign="center"
      color="white"
      boxShadow="2xl"
     >
      <Heading
       fontSize={{ base: "3xl", md: "5xl" }}
       fontWeight="light"
       letterSpacing="tight"
      >
       pronto para elevar sua leitura?
      </Heading>

      <Text fontSize="lg" color="gray.400" maxW="2xl" lineHeight="relaxed">
       junte-se a milhares de leitores que já descobriram o poder de um ambiente
       digital totalmente focado na imersão.
      </Text>

      <VStack spacing={3} pt={6} w={{ base: "full", sm: "auto" }}>
       <Stack direction={{ base: "column", sm: "row" }} spacing={4} w="full">
        <Button
         size="lg"
         h={14}
         bg="white"
         color="gray.900"
         px={10}
         borderRadius="full"
         _hover={{ bg: "gray.200" }}
         fontWeight="bold"
         w={{ base: "full", sm: "auto" }}
        >
         cadastre-se
        </Button>
        <Button
         size="lg"
         h={14}
         variant="outline"
         color="white"
         borderColor="gray.600"
         px={10}
         borderRadius="full"
         _hover={{ bg: "whiteAlpha.200" }}
         fontWeight="medium"
         w={{ base: "full", sm: "auto" }}
        >
         faça login
        </Button>
       </Stack>

       {/* 7. micro-copy para quebrar objeções e reduzir atrito */}
       <Text fontSize="sm" color="gray.500" fontWeight="medium">
        crie sua conta em menos de 1 minuto.
       </Text>
      </VStack>
     </VStack>
    </FadeIn>
   </Container>
  </Box>
 );
}
