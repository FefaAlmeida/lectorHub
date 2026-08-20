'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Button,
  Input,
  Textarea,
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
  FiUploadCloud,
  FiTrash2,
  FiChevronDown,
  FiInfo,
  FiLayers,
  FiCheckCircle,
} from 'react-icons/fi';

function CustomSelect({ placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Box position="relative" w="100%" ref={dropdownRef}>
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        h="46px"
        px={4}
        borderRadius="xl"
        border="1px solid"
        borderColor="#E8DCC4"
        bg="#FCFAF7"
        color={selectedOption ? '#2D2D2D' : '#8C8C8C'}
        fontSize="sm"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ borderColor: '#4A0E17', bg: '#FFFFFF' }}
        transition="all 0.2s"
      >
        <Text fontSize="sm" fontWeight={selectedOption ? 'medium' : 'normal'}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Box
          color="#4A0E17"
          transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
          transition="transform 0.2s"
        >
          <FiChevronDown size={18} />
        </Box>
      </Flex>

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left="0"
          w="100%"
          bg="#FFFFFF"
          border="1px solid #E8DCC4"
          borderRadius="xl"
          boxShadow="0 10px 25px -5px rgba(74, 14, 23, 0.1)"
          py={2}
          zIndex={100}
          overflow="hidden"
        >
          {options.map((option) => (
            <Box
              key={option.value}
              px={4}
              py={2.5}
              cursor="pointer"
              fontSize="sm"
              color="#2D2D2D"
              _hover={{ bg: '#FAF0F2', color: '#4A0E17', fontWeight: 'bold' }}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              transition="background-color 0.15s"
            >
              {option.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function CadastrarLivroPage() {
  const [disponivel, setDisponivel] = useState(true);
  const [categoria, setCategoria] = useState('');
  const [idioma, setIdioma] = useState('');

  const opcoesCategoria = [
    { value: 'ficcao', label: 'Ficção' },
    { value: 'nao-ficcao', label: 'Não-Ficção' },
    { value: 'romance', label: 'Romance' },
    { value: 'tecnologia', label: 'Tecnologia' },
    { value: 'historia', label: 'História' },
  ];

  const opcoesIdioma = [
    { value: 'pt', label: 'Português' },
    { value: 'en', label: 'Inglês' },
    { value: 'es', label: 'Espanhol' },
  ];

  const inputStyles = {
    bg: '#FCFAF7',
    borderColor: '#E8DCC4',
    borderRadius: 'xl',
    fontSize: 'sm',
    h: '46px',
    _hover: { borderColor: '#4A0E17', bg: '#FFFFFF' },
    _focus: { borderColor: '#4A0E17', bg: '#FFFFFF', boxShadow: '0 0 0 1px #4A0E17' },
    transition: 'all 0.2s',
  };

  return (
    <Flex minH="100vh" bg="#FAF7F2" color="#2D2D2D" w="100%">
      {/* Sidebar Lateral Original */}
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

          <Flex direction="column" gap={1.5}>
            <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer">
              <FiGrid size={20} style={{ marginRight: '12px' }} />
              <Text fontSize="sm">Dashboard</Text>
            </Flex>

            <Flex align="center" p={3} borderRadius="xl" bg="rgba(255, 255, 255, 0.12)" color="#FFFFFF" fontWeight="bold" cursor="pointer">
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

        <Flex align="center" p={3} borderRadius="xl" color="#E8DCC4" _hover={{ bg: 'rgba(255, 255, 255, 0.08)' }} cursor="pointer" pt={6}>
          <FiLogOut size={20} style={{ marginRight: '12px' }} />
          <Text fontSize="sm">Sair</Text>
        </Flex>
      </Box>

      {/* Conteúdo Principal */}
      <Box flex="1" p={{ base: 6, md: 10 }} maxW="1200px" mx="auto" w="100%">
        {/* Cabeçalho */}
        <Box mb={8}>
          <Heading fontSize={{ base: '3xl', md: '4xl' }} color="#4A0E17" fontFamily="serif" fontWeight="bold">
            Cadastrar Novo Livro
          </Heading>
          <Text color="#6B6B6B" fontSize="sm" mt={1}>
            Adicione um novo título ao acervo da biblioteca.
          </Text>
        </Box>

        {/* Form Container */}
        <Flex direction="column" gap={6}>
          {/* Seção 1: Informações Principais */}
          <Box bg="#FFFFFF" border="1px solid" borderColor="#E8DCC4" borderRadius="2xl" p={{ base: 6, md: 8 }} boxShadow="0 4px 15px rgba(74, 14, 23, 0.03)">
            <Flex align="center" gap={2} mb={6} pb={3} borderBottom="2px solid" borderColor="#FAF7F2">
              <Box p={2} bg="#FAF0F2" color="#4A0E17" borderRadius="lg">
                <FiInfo size={18} />
              </Box>
              <Text fontSize="md" fontWeight="bold" color="#4A0E17">
                Informações da Obra
              </Text>
            </Flex>

            <Flex direction="column" gap={5}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                  Título do Livro
                </Text>
                <Input placeholder="Digite o título do livro" {...inputStyles} />
              </Box>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    Autor
                  </Text>
                  <Input placeholder="Digite o nome do autor" {...inputStyles} />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    Categoria
                  </Text>
                  <CustomSelect
                    placeholder="Selecione uma categoria"
                    options={opcoesCategoria}
                    value={categoria}
                    onChange={setCategoria}
                  />
                </Box>
              </SimpleGrid>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                  Sinopse / Descrição
                </Text>
                <Textarea
                  placeholder="Digite uma breve sinopse ou descrição do livro..."
                  bg="#FCFAF7"
                  borderColor="#E8DCC4"
                  _hover={{ borderColor: '#4A0E17', bg: '#FFFFFF' }}
                  _focus={{ borderColor: '#4A0E17', bg: '#FFFFFF', boxShadow: '0 0 0 1px #4A0E17' }}
                  borderRadius="xl"
                  fontSize="sm"
                  rows={4}
                  resize="vertical"
                  transition="all 0.2s"
                />
                <Text fontSize="10px" color="#9E9E9E" textAlign="right" mt={1}>
                  0 / 2000
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Seção 2: Detalhes de Edição e Acervo */}
          <Box bg="#FFFFFF" border="1px solid" borderColor="#E8DCC4" borderRadius="2xl" p={{ base: 6, md: 8 }} boxShadow="0 4px 15px rgba(74, 14, 23, 0.03)">
            <Flex align="center" gap={2} mb={6} pb={3} borderBottom="2px solid" borderColor="#FAF7F2">
              <Box p={2} bg="#FAF0F2" color="#4A0E17" borderRadius="lg">
                <FiLayers size={18} />
              </Box>
              <Text fontSize="md" fontWeight="bold" color="#4A0E17">
                Detalhes de Edição & Localização
              </Text>
            </Flex>

            <Flex direction="column" gap={5}>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    ISBN
                  </Text>
                  <Input placeholder="Ex.: 978-65-123456-7-8" {...inputStyles} />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    Editora
                  </Text>
                  <Input placeholder="Digite a editora" {...inputStyles} />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    Data de Publicação
                  </Text>
                  <Flex gap={2}>
                    <Input placeholder="Dia" type="number" min={1} max={31} textAlign="center" px={1} {...inputStyles} />
                    <Input placeholder="Mês" type="number" min={1} max={12} textAlign="center" px={1} {...inputStyles} />
                    <Input placeholder="Ano" type="number" textAlign="center" px={1} {...inputStyles} />
                  </Flex>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    Quantidade de Exemplares
                  </Text>
                  <Input placeholder="Ex.: 3" type="number" min={1} {...inputStyles} />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    Localização / Prateleira
                  </Text>
                  <Input placeholder="Ex.: Estante A - Prateleira 3" {...inputStyles} />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    Idioma
                  </Text>
                  <CustomSelect
                    placeholder="Selecione o idioma"
                    options={opcoesIdioma}
                    value={idioma}
                    onChange={setIdioma}
                  />
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={1.5}>
                    Número de Páginas
                  </Text>
                  <Input placeholder="Ex.: 320" type="number" {...inputStyles} />
                </Box>
              </SimpleGrid>
            </Flex>
          </Box>

          {/* Seção 3: Capa e Disponibilidade */}
          <Box bg="#FFFFFF" border="1px solid" borderColor="#E8DCC4" borderRadius="2xl" p={{ base: 6, md: 8 }} boxShadow="0 4px 15px rgba(74, 14, 23, 0.03)">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              {/* Upload da Capa */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={2}>
                  Upload da Capa do Livro
                </Text>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  border="2px dashed #E8DCC4"
                  bg="#FCFAF7"
                  borderRadius="xl"
                  p={6}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ bg: '#FAF0F2', borderColor: '#4A0E17' }}
                  transition="all 0.2s"
                >
                  <Flex
                    align="center"
                    justify="center"
                    w="52px"
                    h="52px"
                    borderRadius="full"
                    bg="#FFFFFF"
                    color="#4A0E17"
                    mb={3}
                    boxShadow="0 2px 8px rgba(74, 14, 23, 0.08)"
                  >
                    <FiUploadCloud size={24} />
                  </Flex>
                  <Text fontSize="xs" fontWeight="bold" color="#2D2D2D">
                    Arraste e solte a imagem aqui{' '}
                    <Text as="span" fontWeight="normal" color="#6B6B6B">
                      ou clique para selecionar
                    </Text>
                  </Text>
                  <Text fontSize="10px" color="#8C8C8C" mt={2}>
                    PNG, JPG ou JPEG até 5MB
                  </Text>
                </Flex>
              </Box>

              {/* Status / Disponibilidade */}
              <Flex direction="column" justify="center" bg="#FCFAF7" p={6} borderRadius="xl" border="1px solid #E8DCC4">
                <Text fontSize="xs" fontWeight="bold" color="#4A0E17" mb={3}>
                  Disponibilidade Inicial / Status
                </Text>
                <Flex align="center" justify="space-between" bg="#FFFFFF" p={4} borderRadius="xl" border="1px solid #E8DCC4">
                  <Flex align="center" gap={3}>
                    <Box color={disponivel ? '#4A0E17' : '#9E9E9E'}>
                      <FiCheckCircle size={22} />
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color="#2D2D2D">
                        Disponível
                      </Text>
                      <Text fontSize="10px" color="#6B6B6B">
                        O livro ficará disponível para empréstimo após ser salvo.
                      </Text>
                    </Box>
                  </Flex>
                  <Flex
                    align="center"
                    w="50px"
                    h="28px"
                    bg={disponivel ? '#4A0E17' : '#D1D1D1'}
                    borderRadius="full"
                    p="3px"
                    cursor="pointer"
                    transition="all 0.2s"
                    onClick={() => setDisponivel(!disponivel)}
                  >
                    <Box
                      w="22px"
                      h="22px"
                      bg="#FFFFFF"
                      borderRadius="full"
                      boxShadow="md"
                      transform={disponivel ? 'translateX(22px)' : 'translateX(0px)'}
                      transition="transform 0.2s"
                    />
                  </Flex>
                </Flex>
              </Flex>
            </SimpleGrid>

            {/* Ações Inferiores */}
            <Flex justify="space-between" align="center" mt={8} pt={6} borderTop="1px solid" borderColor="#FAF7F2">
              <Button
                variant="outline"
                borderColor="#E8DCC4"
                color="#4A0E17"
                _hover={{ bg: '#FAF0F2', borderColor: '#4A0E17' }}
                borderRadius="xl"
                px={6}
                h="44px"
                fontSize="xs"
                fontWeight="medium"
                display="flex"
                alignItems="center"
                gap={2}
                transition="all 0.2s"
              >
                <FiTrash2 size={16} />
                Limpar
              </Button>

              <Button
                bg="#4A0E17"
                color="#FFFFFF"
                _hover={{ bg: '#360A11', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(74, 14, 23, 0.25)' }}
                _active={{ transform: 'translateY(0)' }}
                borderRadius="xl"
                px={8}
                h="44px"
                fontSize="xs"
                fontWeight="medium"
                display="flex"
                alignItems="center"
                gap={2}
                boxShadow="0 2px 8px rgba(74, 14, 23, 0.15)"
                transition="all 0.2s"
              >
                <FiBook size={16} />
                Salvar Livro
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}