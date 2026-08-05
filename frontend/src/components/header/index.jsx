import { Flex, Image, Text, Icon, Box } from "@chakra-ui/react";

export default function Header() {
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
   <Flex
    align="center"
    gap="0.75rem"
    fontWeight="medium"
    fontSize="1.1rem"
    color="gray.900"
    cursor="pointer"
   >
    <Image src="/logo.png" alt="logo lectorhub" h="24px" />
    <Text as="span" letterSpacing="tighter">
     minha biblioteca
    </Text>
   </Flex>

   <Flex align="center" gap="1.5rem">
    <Flex
     as="button"
     aria-label="notificações"
     position="relative"
     bg="transparent"
     border="none"
     cursor="pointer"
     color="gray.400"
     align="center"
     transition="all 0.2s"
     _hover={{ color: "gray.900" }}
    >
     <Icon
      boxSize="20px"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
     >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
     </Icon>

     {/* detalhe: ponto indicador de notificação não lida */}
     <Box
      position="absolute"
      top="-1px"
      right="-1px"
      w="7px"
      h="7px"
      bg="gray.900"
      borderRadius="full"
      border="1.5px solid #fafafa"
     />
    </Flex>

    {/* bloco de perfil com hover em grupo */}
    <Flex align="center" gap="0.75rem" cursor="pointer" role="group">
     <Flex direction="column" align="flex-end" justify="center">
      <Text
       color="gray.900"
       fontWeight="medium"
       fontSize="0.85rem"
       lineHeight="1.2"
       transition="all 0.2s"
       _groupHover={{ color: "gray.600" }}
      >
       olá, usuario!
      </Text>
      <Text as="span" color="gray.400" fontSize="0.75rem">
       bem-vinda de volta.
      </Text>
     </Flex>

     {/* avatar minimalista */}
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
      _groupHover={{ bg: "gray.300" }}
     >
      u
     </Flex>
    </Flex>
   </Flex>
  </Flex>
 );
}
