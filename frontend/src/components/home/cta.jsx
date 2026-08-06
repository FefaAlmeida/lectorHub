import {
 Box,
 Container,
 Heading,
 Text,
 VStack,
 Stack,
 Button,
} from "@chakra-ui/react";

import FadeIn from "@/components/ui/fade-in";

export default function Cta() {
 return (
  <Box py={{ base: 20, md: 32 }} bg="#fafafa">
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
      <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight="light">
       pronto para elevar sua leitura?
      </Heading>

      <Text fontSize="lg" color="gray.400" maxW="2xl">
       junte-se a milhares de leitores que já descobriram o poder de um ambiente
       digital focado em imersão.
      </Text>

      <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
       <Button
        size="lg"
        bg="white"
        color="gray.900"
        px={10}
        borderRadius="full"
       >
        cadastre-se
       </Button>

       <Button
        size="lg"
        variant="outline"
        color="white"
        borderColor="gray.600"
        px={10}
        borderRadius="full"
       >
        faça login
       </Button>
      </Stack>

      <Text fontSize="sm" color="gray.500">
       crie sua conta em menos de 1 minuto.
      </Text>
     </VStack>
    </FadeIn>
   </Container>
  </Box>
 );
}
