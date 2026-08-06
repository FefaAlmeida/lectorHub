"use client";

import Image from "next/image";
import {
  Flex,
  Box,
  Heading,
  Field,
  Input,
  Link,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Cadastrar() {
  return (
    <Flex
      as="main"
      w="100%"
      minH="100vh"
      bg="#f3e6cd"
      justify="center"
      align="center"
      p={{ base: 6, lg: 10 }}
    >
      <Flex
        w="100%"
        maxW="1150px"
        h={{ base: "auto", lg: "650px" }}
        bg="white"
        borderRadius="22px"
        overflow="hidden"
        direction={{ base: "column", lg: "row" }}
      >
        {/* ========================= */}
        {/* LADO ESQUERDO             */}
        {/* ========================= */}
        <Flex
          w={{ base: "100%", lg: "50%" }}
          bg="#4A0E17"
          justify="center"
          align="center"
          h={{ base: "300px", lg: "auto" }}
          overflow="hidden"
        >
          <Box maxW="80%">
            <Image
              src="/logoLectorHub.png"
              alt="Lector Hub"
              width={350}
              height={350}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Box>
        </Flex>

        {/* ========================= */}
        {/* LADO DIREITO              */}
        {/* ========================= */}
        <Flex
          w={{ base: "100%", lg: "50%" }}
          direction="column"
          justify="center"
          align="center"
          p={{ base: "40px 30px", lg: "70px" }}
        >
          <Heading
            as="h2"
            color="#4A0E17"
            fontSize={{ base: "42px", lg: "52px" }}
            fontFamily="Georgia, serif"
            mb="45px"
            textAlign="center"
          >
            LOGIN
          </Heading>

          <VStack as="form" w="100%" maxW="420px" spacing={5}>
            {/* Input E-mail */}
            <Field.Root>
              <Field.Label color="#666">Username</Field.Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                h="58px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#dbcdb4"
                _hover={{ borderColor: "#c4b59d" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* Input Senha */}
            <Field.Root>
              <Field.Label color="#666">Password</Field.Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                h="58px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#dbcdb4"
                _hover={{ borderColor: "#c4b59d" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* Opções extras (Esqueceu a senha) */}
            <Flex w="100%" justify="flex-start" mt={2} mb={2}>
              <Link
                href="#"
                color="#4A0E17"
                fontSize="15px"
                _hover={{ textDecoration: "underline" }}
              >
                Esqueceu a senha?
              </Link>
            </Flex>

            {/* Botão de Login */}
            <Button
              type="submit"
              w="100%"
              h="54px"
              bg="#4A0E17"
              color="white"
              borderRadius="8px"
              fontSize="18px"
              fontWeight="600"
              transition="0.3s"
              _hover={{ bg: "#641320" }}
              _active={{ bg: "#380a11" }}
            >
              Entrar
            </Button>

            {/* Texto de Cadastro */}
            <Text
              mt="25px"
              textAlign="center"
              fontSize="16px"
              fontWeight="bold"
              color="#4A0E17"
            >
              Não tem uma conta?{" "}
              <Box as="span" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                Cadastra-se
              </Box>
            </Text>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
}