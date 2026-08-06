"use client";

import { Flex, Image, Text, Icon, Box, Menu, Portal } from "@chakra-ui/react";
import { useState } from "react";

export default function Header() {
 const [isOpen, setIsOpen] = useState(false);

 return (
  <Flex
   as="header"
   justify="space-between"
   align="center"
   py="1rem"
   px={{ base: "1.5rem", md: "2.5rem" }}
   bg="rgba(250, 250, 250, 0.85)"
   backdropFilter="blur(12px)"
   borderBottom="1px solid"
   borderColor="gray.100"
   fontFamily="sans-serif"
   position="sticky"
   top={0}
   zIndex={100}
  >
   {/* Lado Esquerdo - Logo */}
   <Flex
    align="center"
    gap="0.75rem"
    fontWeight="medium"
    fontSize="1.1rem"
    color="gray.900"
    cursor="pointer"
    transition="opacity 0.2s"
    _hover={{ opacity: 0.8 }}
    userSelect="none"
   >
    <Image src="/logo.png" alt="logo lectorhub" h="24px" />
    <Text as="span" letterSpacing="tighter">
     minha biblioteca
    </Text>
   </Flex>

   {/* Lado Direito - Ações e Perfil */}
   <Flex align="center" gap="1.5rem">
    {/* Notificações */}
    <Flex
     as="button"
     aria-label="Você tem notificações não lidas"
     position="relative"
     bg="transparent"
     border="none"
     cursor="pointer"
     color="gray.400"
     align="center"
     transition="all 0.2s ease"
     outline="none"
     _hover={{ color: "gray.900", transform: "scale(1.05)" }}
     _active={{ transform: "scale(0.95)" }}
     _focusVisible={{ outline: "none" }}
    >
     <Icon boxSize="20px" color="currentColor">
      <svg
       viewBox="0 0 24 24"
       fill="none"
       stroke="currentColor"
       strokeWidth="1.5"
       strokeLinecap="round"
       strokeLinejoin="round"
      >
       <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
       <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
     </Icon>

     <Box
      position="absolute"
      top="-1px"
      right="-1px"
      w="7px"
      h="7px"
      bg="red.500"
      borderRadius="full"
      border="1.5px solid #fafafa"
     />
    </Flex>

    {/* Menu de Perfil */}
    <Menu.Root
     open={isOpen}
     onOpenChange={(e) => setIsOpen(e.open)}
     positioning={{ placement: "bottom-end" }}
    >
     <Menu.Trigger asChild>
      <Flex
       as="button"
       align="center"
       gap="0.75rem"
       cursor="pointer"
       role="group"
       bg="transparent"
       border="none"
       outline="none"
       transition="all 0.2s ease"
       _active={{ transform: "scale(0.97)" }}
       _focus={{ outline: "none" }}
       _focusVisible={{ outline: "none" }}
       userSelect="none"
      >
       <Flex
        direction="column"
        align="flex-end"
        justify="center"
        display={{ base: "none", sm: "flex" }}
       >
        <Text
         color="gray.900"
         fontWeight="medium"
         fontSize="0.85rem"
         lineHeight="1.2"
         transition="all 0.2s"
         _groupHover={{ color: "gray.600" }}
         noOfLines={1}
        >
         olá, usuario!
        </Text>
        <Text as="span" color="gray.400" fontSize="0.75rem">
         bem-vinda de volta.
        </Text>
       </Flex>

       <Flex
        w="38px"
        h="38px"
        bg="gray.200"
        borderRadius="full"
        align="center"
        justify="center"
        color="gray.600"
        fontWeight="medium"
        fontSize="0.9rem"
        transition="all 0.2s"
        _groupHover={{ bg: "gray.300", color: "gray.800" }}
       >
        u
       </Flex>
      </Flex>
     </Menu.Trigger>

     <Portal>
      <Menu.Positioner>
       <Menu.Content
        minW="220px"
        boxShadow="0 10px 40px -10px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.05)"
        border="1px solid"
        borderColor="gray.100"
        borderRadius="xl"
        bg="white"
        zIndex={200}
        p="0.4rem"
        outline="none"
        _open={{
         animationName: "fade-in, scale-in",
         animationDuration: "150ms",
        }}
        _closed={{
         animationName: "fade-out, scale-out",
         animationDuration: "100ms",
        }}
       >
        <Menu.Item
         value="perfil"
         fontSize="0.9rem"
         color="gray.700"
         cursor="pointer"
         borderRadius="md"
         transition="all 0.15s"
         _hover={{ bg: "gray.50", color: "gray.900" }}
        >
         Meu Perfil
        </Menu.Item>
        <Menu.Item
         value="config"
         fontSize="0.9rem"
         color="gray.700"
         cursor="pointer"
         borderRadius="md"
         transition="all 0.15s"
         _hover={{ bg: "gray.50", color: "gray.900" }}
        >
         Configurações
        </Menu.Item>
        <Menu.Item
         value="leituras"
         fontSize="0.9rem"
         color="gray.700"
         cursor="pointer"
         borderRadius="md"
         transition="all 0.15s"
         _hover={{ bg: "gray.50", color: "gray.900" }}
        >
         Minhas Leituras
        </Menu.Item>

        <Menu.Separator my="0.3rem" borderColor="gray.100" />

        <Menu.Item
         value="sair"
         fontSize="0.9rem"
         color="red.500"
         fontWeight="medium"
         cursor="pointer"
         borderRadius="md"
         transition="all 0.15s"
         _hover={{ bg: "red.50", color: "red.600" }}
        >
         Sair
        </Menu.Item>
       </Menu.Content>
      </Menu.Positioner>
     </Portal>
    </Menu.Root>
   </Flex>
  </Flex>
 );
}
