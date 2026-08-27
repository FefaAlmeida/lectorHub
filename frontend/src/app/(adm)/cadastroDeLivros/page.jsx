'use client';
import SideBarADM from "../../../components/sideBarADM/sideBarADM";
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Button,
  Input,
  Textarea,
  Menu,
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
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Box w="100%">
      <Menu.Root
        positioning={{ sameWidth: true }}
        onSelect={(details) => onChange(details.value)}
      >
        <Menu.Trigger asChild>
          <Button
            variant="outline"
            bg="#FFFFFF"
            border="1px solid"
            borderColor="#E7DED8"
            borderRadius="14px"
            h="48px"
            px={4}
            w="100%"
            justifyContent="space-between"
            color={selectedOption ? '#2D2D2D' : '#8C8C8C'}
            fontSize="sm"
            fontWeight={selectedOption ? '500' : '400'}
            transition="all .25s cubic-bezier(0.16, 1, 0.3, 1)"
            _hover={{
              borderColor: '#4A0E17',
              bg: '#FAF5F6',
              boxShadow: '0 4px 12px rgba(74,14,23,.08)',
            }}
            _focus={{
              borderColor: '#4A0E17',
              boxShadow: '0 0 0 3px rgba(74,14,23,.15)',
            }}
          >
            <Text fontSize="sm" fontWeight={selectedOption ? '500' : '400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </Text>

            <Box color="#4A0E17" display="flex" alignItems="center">
              <FiChevronDown size={18} />
            </Box>
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content
            bg="#FFFFFF"
            borderRadius="16px"
            border="1px solid"
            borderColor="#E7DED8"
            boxShadow="0 8px 24px rgba(74,14,23,.12)"
            p={2}
            zIndex="popover"
          >
            {options.map((option) => (
              <Menu.Item
                key={option.value}
                value={option.value}
                px={3}
                py={2.5}
                borderRadius="10px"
                cursor="pointer"
                color="#2D2D2D"
                fontSize="sm"
                fontWeight="500"
                transition="all 0.2s ease"
                _hover={{
                  bg: '#F2E6E8',
                  color: '#4A0E17',
                }}
                _focus={{
                  bg: '#F2E6E8',
                  color: '#4A0E17',
                }}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
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
    bg: '#FFFFFF',
    border: '1px solid',
    borderColor: '#E7DED8',
    borderRadius: '14px',
    fontSize: 'sm',
    h: '48px',
    _placeholder: { color: '#AAA' },
    _hover: {
      borderColor: '#4A0E17',
      bg: '#FAF5F6',
    },
    _focus: {
      borderColor: '#4A0E17',
      bg: '#FFFFFF',
      boxShadow: '0 0 0 3px rgba(74,14,23,.15)',
      outline: 'none',
    },
    transition: 'all .25s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return (
    <Flex minH="100vh" bg="#FAF7F2" color="#2D2D2D" w="100%">
      {/* Sidebar Lateral Original */}
      <SideBarADM />

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
                  bg="#FFFFFF"
                  border="1px solid"
                  borderColor="#E7DED8"
                  _placeholder={{ color: '#AAA' }}
                  _hover={{ borderColor: '#4A0E17', bg: '#FAF5F6' }}
                  _focus={{ borderColor: '#4A0E17', bg: '#FFFFFF', boxShadow: '0 0 0 3px rgba(74,14,23,.15)', outline: 'none' }}
                  borderRadius="14px"
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