'use client';

import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Badge,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import {
  FiGrid,
  FiBook,
  FiFolder,
  FiUsers,
  FiRepeat,
  FiRotateCcw,
  FiBookmark,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiAlertTriangle,
  FiUserCheck,
  FiTool,
  FiClock,
  FiChevronDown,
} from 'react-icons/fi';

export default function AdminDashboardPage() {

  const [mesSelecionado, setMesSelecionado] = useState('Maio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  return (
    <Flex minH="100vh" bg="#FAF7F2" color="#2D2D2D" w="100%">

      <Box
        w={{ base: 'full', md: '280px' }}
        bg="#4A0E17"
        color="#FFFFFF"
        p={6}
        display={{ base: 'none', md: 'flex' }}
        flexDir="column"
        justifyContent="space-between"
        flexShrink={0}
      >
        <Flex direction="column" gap={6}>

          <Flex direction="column" align="center" justify="center" py={4} borderBottom="1px solid rgba(232, 220, 196, 0.2)">
            <Flex
              w="70px"
              h="70px"
              borderRadius="full"
              border="2px solid #E8DCC4"
              align="center"
              justify="center"
              mb={3}
            >
              <FiBook size={32} color="#E8DCC4" />
            </Flex>
            <Heading size="md" color="#E8DCC4" letterSpacing="widest" textAlign="center" fontFamily="serif">
              LECTOR HUB
            </Heading>
            <Text fontSize="xs" color="#E8DCC4" opacity={0.8} letterSpacing="wider">
              MINHA BIBLIOTECA
            </Text>
          </Flex>

          {/* Navegação */}
          <Flex direction="column" gap={1.5}>
            <Flex align="center" p={3} borderRadius="xl" bg="rgba(255, 255, 255, 0.12)" color="#FFFFFF" fontWeight="bold" cursor="pointer">
              <FiGrid size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Dashboard <Text as="span" fontSize="xs" opacity={0.7} display="block">Início</Text></Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiBook size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Livros</Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiFolder size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Categorias</Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiUsers size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Usuários</Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiRepeat size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Empréstimos</Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiRotateCcw size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Devoluções</Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiBookmark size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Reservas</Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiBarChart2 size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Relatórios</Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiSettings size={20} style={{ marginRight: '14px' }} />
              <Text fontSize="sm">Configurações</Text>
            </Flex>
          </Flex>
        </Flex>

        {/* Botão de Sair */}
        <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer" pt={6}>
          <FiLogOut size={20} style={{ marginRight: '12px' }} />
          <Text fontSize="sm">Sair</Text>
        </Flex>
      </Box>

      {/* Conteúdo Principal */}
      <Box flex="1" p={{ base: 6, md: 10 }} w="100%">
        {/* Cabeçalho do Painel */}
        <Flex justify="space-between" align="center" mb={10} w="100%" flexWrap="wrap" gap={4}>
          <Box>
            <Badge px={4} py={1.5} borderRadius="full" bg="#4A0E17" color="#FFFFFF" fontSize="xs" fontWeight="bold" mb={3}>
              Bem-vindo!
            </Badge>
            <Heading size="3xl" color="#4A0E17" fontFamily="serif">
              Central Administrativa
            </Heading>
            <Text color="#6B6B6B" fontSize="md" mt={1}>
              Visão geral e monitoramento da sua biblioteca.
            </Text>
          </Box>
        </Flex>

        {/* Grid de Cards Superiores */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={8} w="100%" mb={12}>
          
          {/* Card 1: Alertas e Pendências */}
          <Flex direction="column" justify="space-between" bg="#FFFFFF" border="1px solid #E8DCC4" borderRadius="2xl" p={8} boxShadow="sm" h="100%">
            <Flex align="center" gap={3} color="#4A0E17" mb={6}>
              <FiAlertTriangle size={22} />
              <Heading size="sm" fontFamily="serif">Alertas e Pendências</Heading>
            </Flex>

            <Flex direction="column" justify="space-between" flex="1" gap={2}>
              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={4}>
                  <Flex align="center" justify="center" w="42px" h="42px" borderRadius="lg" bg="#FFEBEE" color="#D32F2F" flexShrink={0}>
                    <FiAlertTriangle size={20} />
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="xs">Empréstimos em atraso</Text>
                    <Text fontSize="xs" color="#6B6B6B">15 itens • Ver detalhes</Text>
                  </Box>
                </Flex>
                <Badge bg="#FFEBEE" color="#D32F2F" px={2.5} py={1} borderRadius="md" fontSize="xs">15</Badge>
              </Flex>

              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={4}>
                  <Flex align="center" justify="center" w="42px" h="42px" borderRadius="lg" bg="#FFF3E0" color="#E65100" flexShrink={0}>
                    <FiBookmark size={20} />
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="xs">Reservas pendentes</Text>
                    <Text fontSize="xs" color="#6B6B6B">Aguardando separação</Text>
                  </Box>
                </Flex>
                <Badge bg="#FFF3E0" color="#E65100" px={2.5} py={1} borderRadius="md" fontSize="xs">7</Badge>
              </Flex>

              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={4}>
                  <Flex align="center" justify="center" w="42px" h="42px" borderRadius="lg" bg="#FFFDE7" color="#F57F17" flexShrink={0}>
                    <FiUserCheck size={20} />
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="xs">Usuários pendentes</Text>
                    <Text fontSize="xs" color="#6B6B6B">Aguardando aprovação</Text>
                  </Box>
                </Flex>
                <Badge bg="#FFFDE7" color="#F57F17" px={2.5} py={1} borderRadius="md" fontSize="xs">4</Badge>
              </Flex>

              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={4}>
                  <Flex align="center" justify="center" w="42px" h="42px" borderRadius="lg" bg="#E3F2FD" color="#1976D2" flexShrink={0}>
                    <FiBook size={20} />
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="xs">Livros estoque baixo</Text>
                    <Text fontSize="xs" color="#6B6B6B">Reposição recomendada</Text>
                  </Box>
                </Flex>
                <Badge bg="#E3F2FD" color="#1976D2" px={2.5} py={1} borderRadius="md" fontSize="xs">9</Badge>
              </Flex>

              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={4}>
                  <Flex align="center" justify="center" w="42px" h="42px" borderRadius="lg" bg="#F3E5F5" color="#7B1FA2" flexShrink={0}>
                    <FiTool size={20} />
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="xs">Manutenção necessária</Text>
                    <Text fontSize="xs" color="#6B6B6B">Itens com atenção</Text>
                  </Box>
                </Flex>
                <Badge bg="#F3E5F5" color="#7B1FA2" px={2.5} py={1} borderRadius="md" fontSize="xs">3</Badge>
              </Flex>
            </Flex>
          </Flex>

          {/* Card 2: Resumo do Sistema (ÚNICO COM HOVER EM VINHO CLARO SUAVE) */}
          <Flex direction="column" justify="space-between" bg="#FFFFFF" border="1px solid #E8DCC4" borderRadius="2xl" p={8} boxShadow="sm" h="100%">
            <Flex align="center" gap={3} color="#4A0E17" mb={6}>
              <FiBarChart2 size={22} />
              <Heading size="sm" fontFamily="serif">Resumo do Sistema</Heading>
            </Flex>

            <Flex direction="column" justify="space-between" flex="1" gap={2}>
              {/* Item 1 */}
              <Flex
                align="center"
                justify="space-between"
                p={2.5}
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: '#FAF0F2' }} // Vinho claro bem suave
              >
                <Flex align="center" gap={3} color="#4A0E17">
                  <FiBook size={20} />
                  <Text fontSize="sm" fontWeight="medium" color="#2D2D2D">Livros Cadastrados</Text>
                </Flex>
                <Text fontWeight="bold" fontSize="lg" color="#4A0E17">1.248</Text>
              </Flex>

              {/* Item 2 */}
              <Flex
                align="center"
                justify="space-between"
                p={2.5}
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: '#FAF0F2' }}
              >
                <Flex align="center" gap={3} color="#4A0E17">
                  <FiUsers size={20} />
                  <Text fontSize="sm" fontWeight="medium" color="#2D2D2D">Usuários Ativos</Text>
                </Flex>
                <Text fontWeight="bold" fontSize="lg" color="#4A0E17">532</Text>
              </Flex>

              {/* Item 3 */}
              <Flex
                align="center"
                justify="space-between"
                p={2.5}
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: '#FAF0F2' }}
              >
                <Flex align="center" gap={3} color="#4A0E17">
                  <FiRepeat size={20} />
                  <Text fontSize="sm" fontWeight="medium" color="#2D2D2D">Empréstimos</Text>
                </Flex>
                <Text fontWeight="bold" fontSize="lg" color="#4A0E17">87</Text>
              </Flex>

              {/* Item 4 */}
              <Flex
                align="center"
                justify="space-between"
                p={2.5}
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: '#FAF0F2' }}
              >
                <Flex align="center" gap={3} color="#4A0E17">
                  <FiClock size={20} />
                  <Text fontSize="sm" fontWeight="medium" color="#2D2D2D">Devoluções do Mês</Text>
                </Flex>
                <Text fontWeight="bold" fontSize="lg" color="#4A0E17">12</Text>
              </Flex>

              {/* Item 5 */}
              <Flex
                align="center"
                justify="space-between"
                p={2.5}
                borderRadius="xl"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: '#FAF0F2' }}
              >
                <Flex align="center" gap={3} color="#4A0E17">
                  <FiBookmark size={20} />
                  <Text fontSize="sm" fontWeight="medium" color="#2D2D2D">Reservas Ativas</Text>
                </Flex>
                <Text fontWeight="bold" fontSize="lg" color="#4A0E17">25</Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Card 3: Livros Mais Emprestados */}
          <Flex direction="column" justify="space-between" bg="#FFFFFF" border="1px solid #E8DCC4" borderRadius="2xl" p={8} boxShadow="sm" h="100%">
            <Heading size="sm" fontFamily="serif" color="#4A0E17" mb={6}>
              Livros Mais Emprestados
            </Heading>

            <Flex direction="column" justify="space-between" flex="1" gap={2}>
              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={3}>
                  <Text fontWeight="bold" color="#4A0E17" fontSize="sm">1</Text>
                  <Image src="https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg" w="36px" h="50px" fit="cover" borderRadius="sm" alt="1984" />
                  <Box>
                    <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">1984</Text>
                    <Text fontSize="10px" color="#6B6B6B">George Orwell</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">45</Text>
                  <Text fontSize="10px" color="#6B6B6B">empréstimos</Text>
                </Box>
              </Flex>

              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={3}>
                  <Text fontWeight="bold" color="#4A0E17" fontSize="sm">2</Text>
                  <Image src="https://m.media-amazon.com/images/I/81xUeE6yA9L._AC_UF1000,1000_QL80_.jpg" w="36px" h="50px" fit="cover" borderRadius="sm" alt="Dom Casmurro" />
                  <Box>
                    <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">Dom Casmurro</Text>
                    <Text fontSize="10px" color="#6B6B6B">Machado de Assis</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">38</Text>
                  <Text fontSize="10px" color="#6B6B6B">empréstimos</Text>
                </Box>
              </Flex>

              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={3}>
                  <Text fontWeight="bold" color="#4A0E17" fontSize="sm">3</Text>
                  <Image src="https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg" w="36px" h="50px" fit="cover" borderRadius="sm" alt="O Pequeno Príncipe" />
                  <Box>
                    <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">O Pequeno Príncipe</Text>
                    <Text fontSize="10px" color="#6B6B6B">Saint-Exupéry</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">32</Text>
                  <Text fontSize="10px" color="#6B6B6B">empréstimos</Text>
                </Box>
              </Flex>

              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={3}>
                  <Text fontWeight="bold" color="#4A0E17" fontSize="sm">4</Text>
                  <Image src="https://m.media-amazon.com/images/I/81xUeE6yA9L._AC_UF1000,1000_QL80_.jpg" w="36px" h="50px" fit="cover" borderRadius="sm" alt="A Menina que Roubava Livros" />
                  <Box>
                    <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">A Menina que Roubava...</Text>
                    <Text fontSize="10px" color="#6B6B6B">Markus Zusak</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">28</Text>
                  <Text fontSize="10px" color="#6B6B6B">empréstimos</Text>
                </Box>
              </Flex>

              <Flex align="center" justify="space-between" p={2.5} borderRadius="xl">
                <Flex align="center" gap={3}>
                  <Text fontWeight="bold" color="#4A0E17" fontSize="sm">5</Text>
                  <Image src="https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg" w="36px" h="50px" fit="cover" borderRadius="sm" alt="O Hobbit" />
                  <Box>
                    <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">O Hobbit</Text>
                    <Text fontSize="10px" color="#6B6B6B">J.R.R. Tolkien</Text>
                  </Box>
                </Flex>
                <Box textAlign="right">
                  <Text fontWeight="bold" fontSize="xs" color="#2D2D2D">25</Text>
                  <Text fontSize="10px" color="#6B6B6B">empréstimos</Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>

          {/* Card 4: Gráfico de Empréstimos */}
          <Flex direction="column" justify="space-between" bg="#FFFFFF" border="1px solid #E8DCC4" borderRadius="2xl" p={8} boxShadow="sm" h="100%">
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="sm" fontFamily="serif" color="#4A0E17">
                Empréstimos por Mês
              </Heading>

              <Box position="relative">
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  rightIcon={<FiChevronDown size={14} />}
                  bg="transparent"
                  color="#4A0E17"
                  border="1px solid #E8DCC4"
                  borderRadius="full"
                  px={3.5}
                  py={1}
                  fontSize="xs"
                  fontWeight="medium"
                  h="auto"
                  transition="all 0.2s"
                  _hover={{
                    bg: '#FAF0F2',
                    borderColor: '#4A0E17',
                  }}
                >
                  {mesSelecionado}
                </Button>

                {isMenuOpen && (
                  <Box
                    position="absolute"
                    right="0"
                    top="100%"
                    mt={2}
                    bg="#FFFFFF"
                    border="1px solid #E8DCC4"
                    borderRadius="xl"
                    boxShadow="lg"
                    p={1.5}
                    maxH="200px"
                    overflowY="auto"
                    zIndex={10}
                    w="140px"
                  >
                    {meses.map((mes) => (
                      <Box
                        key={mes}
                        onClick={() => {
                          setMesSelecionado(mes);
                          setIsMenuOpen(false);
                        }}
                        borderRadius="lg"
                        fontSize="xs"
                        fontWeight={mesSelecionado === mes ? 'bold' : 'normal'}
                        color={mesSelecionado === mes ? '#4A0E17' : '#2D2D2D'}
                        bg={mesSelecionado === mes ? '#FAF0F2' : 'transparent'}
                        _hover={{
                          bg: '#FAF0F2',
                          color: '#4A0E17',
                          cursor: 'pointer',
                        }}
                        py={1.5}
                        px={3}
                        transition="all 0.15s"
                      >
                        {mes}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Flex>

            {/* Gráfico do Mês */}
            <Flex align="flex-end" justify="space-between" flex="1" pt={6} pb={2} px={2} borderBottom="1px solid #E8DCC4">
              <Flex direction="column" align="center" gap={2}>
                <Text fontSize="10px" fontWeight="bold" color="#6B6B6B">32</Text>
                <Box bg="#4A0E17" w="24px" h="80px" borderRadius="t-sm" />
                <Text fontSize="9px" color="#6B6B6B" mt={2}>Semana 1</Text>
              </Flex>

              <Flex direction="column" align="center" gap={2}>
                <Text fontSize="10px" fontWeight="bold" color="#6B6B6B">48</Text>
                <Box bg="#4A0E17" w="24px" h="120px" borderRadius="t-sm" />
                <Text fontSize="9px" color="#6B6B6B" mt={2}>Semana 2</Text>
              </Flex>

              <Flex direction="column" align="center" gap={2}>
                <Text fontSize="10px" fontWeight="bold" color="#6B6B6B">62</Text>
                <Box bg="#4A0E17" w="24px" h="150px" borderRadius="t-sm" />
                <Text fontSize="9px" color="#6B6B6B" mt={2}>Semana 3</Text>
              </Flex>

              <Flex direction="column" align="center" gap={2}>
                <Text fontSize="10px" fontWeight="bold" color="#6B6B6B">78</Text>
                <Box bg="#4A0E17" w="24px" h="180px" borderRadius="t-sm" />
                <Text fontSize="9px" color="#6B6B6B" mt={2}>Semana 4</Text>
              </Flex>

              <Flex direction="column" align="center" gap={2}>
                <Text fontSize="10px" fontWeight="bold" color="#6B6B6B">64</Text>
                <Box bg="#4A0E17" w="24px" h="155px" borderRadius="t-sm" />
                <Text fontSize="9px" color="#6B6B6B" mt={2}>Semana 5</Text>
              </Flex>
            </Flex>
          </Flex>
        </SimpleGrid>

        {/* Seção Inferior: Ações Rápidas (Limpo, sem hover escuro) */}
        <Box w="100%">
          <Box mb={8}>
            <Heading size="xl" fontFamily="serif" color="#4A0E17" letterSpacing="tight">
              Ações Rápidas
            </Heading>
            <Text color="#6B6B6B" fontSize="sm" mt={1}>
              Atalhos diretos para gerenciar os fluxos mais importantes do sistema
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} gap={6} w="100%">
            <Box
              bg="#FFFFFF"
              border="1px solid #E8DCC4"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: '#4A0E17', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" gap={4}>
                <Flex
                  align="center"
                  justify="center"
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="#4A0E17"
                  color="#FFFFFF"
                  flexShrink={0}
                >
                  <FiBook size={22} />
                </Flex>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="#2D2D2D">Cadastrar Livro</Text>
                  <Text fontSize="xs" color="#6B6B6B" mt={0.5}>Adicionar novo livro</Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="#FFFFFF"
              border="1px solid #E8DCC4"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: '#4A0E17', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" gap={4}>
                <Flex
                  align="center"
                  justify="center"
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="#4A0E17"
                  color="#FFFFFF"
                  flexShrink={0}
                >
                  <FiUsers size={22} />
                </Flex>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="#2D2D2D">Cadastrar Usuário</Text>
                  <Text fontSize="xs" color="#6B6B6B" mt={0.5}>Adicionar novo usuário</Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="#FFFFFF"
              border="1px solid #E8DCC4"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: '#4A0E17', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" gap={4}>
                <Flex
                  align="center"
                  justify="center"
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="#4A0E17"
                  color="#FFFFFF"
                  flexShrink={0}
                >
                  <FiRepeat size={22} />
                </Flex>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="#2D2D2D">Novo Empréstimo</Text>
                  <Text fontSize="xs" color="#6B6B6B" mt={0.5}>Registrar empréstimo</Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="#FFFFFF"
              border="1px solid #E8DCC4"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: '#4A0E17', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" gap={4}>
                <Flex
                  align="center"
                  justify="center"
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="#4A0E17"
                  color="#FFFFFF"
                  flexShrink={0}
                >
                  <FiClock size={22} />
                </Flex>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="#2D2D2D">Registrar Devolução</Text>
                  <Text fontSize="xs" color="#6B6B6B" mt={0.5}>Registrar devolução</Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="#FFFFFF"
              border="1px solid #E8DCC4"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: '#4A0E17', transform: 'translateY(-2px)' }}
            >
              <Flex align="center" gap={4}>
                <Flex
                  align="center"
                  justify="center"
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="#4A0E17"
                  color="#FFFFFF"
                  flexShrink={0}
                >
                  <FiBarChart2 size={22} />
                </Flex>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="#2D2D2D">Relatórios</Text>
                  <Text fontSize="xs" color="#6B6B6B" mt={0.5}>Ver relatórios gerais</Text>
                </Box>
              </Flex>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </Flex>
  );
}