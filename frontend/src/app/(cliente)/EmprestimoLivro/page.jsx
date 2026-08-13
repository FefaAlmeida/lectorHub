'use client';

import React from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Badge,
  Button,
  Tabs,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiHome,
  FiSearch,
  FiBookOpen,
  FiClock,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiVolume2,
} from 'react-icons/fi';

export default function MeusEmprestimosPage() {
  return (
    <Flex minH="100vh" bg="#FAF7F2" color="#2D2D2D" w="100%">
      {/* Sidebar Lateral */}
      <Box
        w={{ base: 'full', md: '260px' }}
        bg="#FAF7F2"
        p={6}
        borderRight="1px solid"
        borderColor="#E8DCC4"
        display={{ base: 'none', md: 'flex' }}
        flexDir="column"
        justifyContent="space-between"
        flexShrink={0}
      >
        <Flex direction="column" gap={3}>
          <Flex align="center" p={3.5} borderRadius="xl" bg="#4A0E17" color="#FFFFFF" fontWeight="bold">
            <FiBookOpen size={22} style={{ marginRight: '14px' }} />
            <Text fontSize="md">Meus Empréstimos</Text>
          </Flex>

          <Flex align="center" p={3.5} borderRadius="xl" color="#2D2D2D" _hover={{ bg: '#E8DCC4' }} cursor="pointer">
            <FiHome size={22} style={{ marginRight: '14px' }} />
            <Text fontSize="md">Início</Text>
          </Flex>

          <Flex align="center" p={3.5} borderRadius="xl" color="#2D2D2D" _hover={{ bg: '#E8DCC4' }} cursor="pointer">
            <FiSearch size={22} style={{ marginRight: '14px' }} />
            <Text fontSize="md">Buscar Livros</Text>
          </Flex>

          <Flex align="center" p={3.5} borderRadius="xl" color="#2D2D2D" _hover={{ bg: '#E8DCC4' }} cursor="pointer">
            <FiClock size={22} style={{ marginRight: '14px' }} />
            <Text fontSize="md">Histórico</Text>
          </Flex>

          <Flex align="center" p={3.5} borderRadius="xl" color="#2D2D2D" _hover={{ bg: '#E8DCC4' }} cursor="pointer">
            <FiUser size={22} style={{ marginRight: '14px' }} />
            <Text fontSize="md">Meu Cadastro</Text>
          </Flex>
        </Flex>

        <Flex align="center" p={3.5} borderRadius="xl" color="#2D2D2D" _hover={{ bg: '#E8DCC4' }} cursor="pointer">
          <FiLogOut size={22} style={{ marginRight: '14px' }} />
          <Text fontSize="md">Sair</Text>
        </Flex>
      </Box>

      {/* Conteúdo Principal sem limite de largura (100% da tela) */}
      <Box flex="1" p={{ base: 6, md: 10 }} w="100%">
        {/* Cabeçalho */}
        <Box mb={8}>
          <Heading size="3xl" color="#4A0E17" fontFamily="serif" mb={2}>
            Meus Empréstimos
          </Heading>
          <Text color="#6B6B6B" fontSize="md">
            Acompanhe os livros que estão com você.
          </Text>
        </Box>

        {/* Abas */}
        <Tabs.Root defaultValue="em-andamento" variant="plain" w="100%">
          <Tabs.List borderBottom="1px solid" borderColor="#E8DCC4" mb={8} w="100%">
            <Tabs.Trigger
              value="em-andamento"
              _selected={{
                color: '#4A0E17',
                borderBottom: '3px solid #4A0E17',
                fontWeight: 'bold',
              }}
              color="#6B6B6B"
              px={5}
              py={3}
              fontSize="md"
              cursor="pointer"
            >
              Em andamento (2)
            </Tabs.Trigger>

            <Tabs.Trigger
              value="devolvidos"
              _selected={{
                color: '#4A0E17',
                borderBottom: '3px solid #4A0E17',
                fontWeight: 'bold',
              }}
              color="#6B6B6B"
              px={5}
              py={3}
              fontSize="md"
              cursor="pointer"
            >
              Devolvidos (3)
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="em-andamento" p={0} w="100%">
            <Flex direction="column" gap={8} w="100%">
              {/* Título da Seção 1 */}
              <Flex align="center" color="#4A0E17" gap={3}>
                <FiBookOpen size={24} />
                <Heading size="md" fontFamily="serif">
                  Livros emprestados
                </Heading>
              </Flex>

              {/* Card Livro 1 - 100% de largura */}
              <Box bg="#FFFFFF" border="1px solid #E8DCC4" borderRadius="2xl" p={6} boxShadow="sm" w="100%">
                <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} justify="space-between" gap={6} w="100%">
                  <Flex gap={5} align="top" flex="1">
                    <Image
                      src="https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg"
                      alt="1984"
                      w="100px"
                      h="145px"
                      fit="cover"
                      borderRadius="lg"
                      boxShadow="md"
                    />
                    <Flex direction="column" gap={1.5}>
                      <Heading size="md" color="#2D2D2D" fontFamily="serif">
                        1984
                      </Heading>
                      <Text fontSize="sm" color="#6B6B6B" pb={3}>
                        George Orwell
                      </Text>
                      <Flex align="center" gap={2} fontSize="sm" color="#6B6B6B">
                        <Box color="#4A0E17"><FiCalendar size={16} /></Box>
                        <Text>Emprestado em: <strong>01/05/2024</strong></Text>
                      </Flex>
                      <Flex align="center" gap={2} fontSize="sm" color="#6B6B6B">
                        <Box color="#4A0E17"><FiCalendar size={16} /></Box>
                        <Text>Devolução até: <strong>15/05/2024</strong></Text>
                      </Flex>
                    </Flex>
                  </Flex>

                  {/* Status e Mensagem Alinhados à Esquerda */}
                  <Flex direction="column" gap={2} minW="285px" align="flex-start">
                    <Badge px={4} py={1.5} borderRadius="md" textTransform="none" fontSize="sm" bg="#E8F5E9" color="#388E3C" display="inline-flex" alignItems="center" gap={2}>
                      <FiCheckCircle size={16} />
                      Em dia
                    </Badge>
                    <Text fontSize="sm" color="#6B6B6B" textAlign="left">
                      Faltam 6 dias para a devolução.
                    </Text>
                  </Flex>

                  <Button variant="outline" borderColor="#4A0E17" color="#4A0E17" size="md" px={6} _hover={{ bg: '#4A0E17', color: '#FFFFFF' }}>
                    Ver detalhes
                  </Button>
                </Flex>
              </Box>

              {/* Card Livro 2 - 100% de largura */}
              <Box bg="#FFFFFF" border="1px solid #E8DCC4" borderRadius="2xl" p={6} boxShadow="sm" w="100%">
                <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} justify="space-between" gap={6} w="100%">
                  <Flex gap={5} align="top" flex="1">
                    <Image
                      src="https://m.media-amazon.com/images/I/81xUeE6yA9L._AC_UF1000,1000_QL80_.jpg"
                      alt="A Menina que Roubava Livros"
                      w="100px"
                      h="145px"
                      fit="cover"
                      borderRadius="lg"
                      boxShadow="md"
                    />
                    <Flex direction="column" gap={1.5}>
                      <Heading size="md" color="#2D2D2D" fontFamily="serif">
                        A Menina que Roubava Livros
                      </Heading>
                      <Text fontSize="sm" color="#6B6B6B" pb={3}>
                        Markus Zusak
                      </Text>
                      <Flex align="center" gap={2} fontSize="sm" color="#6B6B6B">
                        <Box color="#4A0E17"><FiCalendar size={16} /></Box>
                        <Text>Emprestado em: <strong>28/04/2024</strong></Text>
                      </Flex>
                      <Flex align="center" gap={2} fontSize="sm" color="#6B6B6B">
                        <Box color="#4A0E17"><FiCalendar size={16} /></Box>
                        <Text>Devolução até: <strong>12/05/2024</strong></Text>
                      </Flex>
                    </Flex>
                  </Flex>

                  {/* Status e Mensagem Alinhados à Esquerda */}
                  <Flex direction="column" gap={2} minW="260px" align="flex-start">
                    <Badge px={4} py={1.5} borderRadius="md" textTransform="none" fontSize="sm" bg="#FFF3E0" color="#B78103" display="inline-flex" alignItems="center" gap={2}>
                      <FiAlertCircle size={16} />
                      Atenção
                    </Badge>
                    <Text fontSize="sm" color="#6B6B6B" textAlign="left">
                      Vence amanhã. Não se esqueça de devolver!
                    </Text>
                  </Flex>

                  <Button variant="outline" borderColor="#4A0E17" color="#4A0E17" size="md" px={6} _hover={{ bg: '#4A0E17', color: '#FFFFFF' }}>
                    Ver detalhes
                  </Button>
                </Flex>
              </Box>

              {/* Título da Seção 2 */}
              <Flex align="center" color="#4A0E17" gap={3} pt={4}>
                <FiVolume2 size={24} />
                <Heading size="md" fontFamily="serif">
                  Informações importantes
                </Heading>
              </Flex>

              {/* Cards de Informações espalhados em 100% da largura */}
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={5} w="100%">
                <Box bg="#FAF3EA" p={5} borderRadius="2xl" border="1px solid #E8DCC4" w="100%">
                  <Flex gap={4} align="start">
                    <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full" border="2px solid #4A0E17" color="#4A0E17" flexShrink={0}>
                      <FiClock size={20} />
                    </Flex>
                    <Box>
                      <Text fontWeight="bold" fontSize="md" color="#2D2D2D" mb={1}>
                        Prazo de Devolução
                      </Text>
                      <Text fontSize="sm" color="#6B6B6B" lineHeight="relaxed">
                        O prazo padrão de empréstimo é de 14 dias corridos.
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                <Box bg="#FAF3EA" p={5} borderRadius="2xl" border="1px solid #E8DCC4" w="100%">
                  <Flex gap={4} align="start">
                    <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full" border="2px solid #4A0E17" color="#4A0E17" flexShrink={0}>
                      <FiAlertCircle size={20} />
                    </Flex>
                    <Box>
                      <Text fontWeight="bold" fontSize="md" color="#2D2D2D" mb={1}>
                        Atrasos
                      </Text>
                      <Text fontSize="sm" color="#6B6B6B" lineHeight="relaxed">
                        Atrasos podem gerar multas e suspensão de novos empréstimos.
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                <Box bg="#FAF3EA" p={5} borderRadius="2xl" border="1px solid #E8DCC4" w="100%">
                  <Flex gap={4} align="start">
                    <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full" border="2px solid #4A0E17" color="#4A0E17" flexShrink={0}>
                      <FiBookOpen size={20} />
                    </Flex>
                    <Box>
                      <Text fontWeight="bold" fontSize="md" color="#2D2D2D" mb={1}>
                        Cuide dos Livros
                      </Text>
                      <Text fontSize="sm" color="#6B6B6B" lineHeight="relaxed">
                        Mantenha os livros em bom estado e evite rasuras e anotações.
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </SimpleGrid>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="devolvidos" p={0} w="100%">
            <Text color="#6B6B6B" fontSize="md">Nenhum livro devolvido para exibir no momento.</Text>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Flex>
  );
}