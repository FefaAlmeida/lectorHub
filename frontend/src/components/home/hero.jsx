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
} from "@chakra-ui/react";

import { FiArrowRight } from "react-icons/fi";

import FadeIn from "@/components/ui/fade-in";

export default function Hero() {
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
       para que as palavras ganhem vida.
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
       rightIcon={<Icon as={FiArrowRight} />}
       borderRadius="full"
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
      />

      <Image
       position="relative"
       src="https://images.unsplash.com/photo-1544716278-e513176f20b5"
       alt="pessoa lendo um livro"
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
