import { Box, Flex, Text } from "@chakra-ui/react";

export default function Footer() {
 return (
  <Box
   as="footer"
   w="100%"
   bg="#5c1421"
   color="#e2e0c9"
   px={8}
   py={4}
   mt="auto"
  >
   <Flex
    maxW="1200px"
    mx="auto"
    justify="space-between"
    align="center"
    fontSize="0.85rem"
   >
    <Text as="span">© 2026 Sistema de Biblioteca</Text>
    <Text as="span">Todos os direitos reservados.</Text>
   </Flex>
  </Box>
 );
}
