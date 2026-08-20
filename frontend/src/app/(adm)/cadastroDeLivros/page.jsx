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
} from 'react-icons/fi';

// Componente Customizado de Select com Menu Arredondado e Hover Vinho Claro
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
        h="44px"
        px={4}
        borderRadius="xl"
        border="1px solid #E8DCC4"
        bg="#FFFFFF"
        color={selectedOption ? '#2D2D2D' : '#9E9E9E'}
        fontSize="sm"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ borderColor: '#4A0E17' }}
        _focus={{ borderColor: '#4A0E17' }}
        transition="all 0.2s"
      >
        <Text fontSize="sm">{selectedOption ? selectedOption.label : placeholder}</Text>
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
          boxShadow="lg"
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
              _hover={{ bg: '#FAF0F2', color: '#4A0E17', fontWeight: 'medium' }}
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

  return (
    <Flex minH="100vh" bg="#FAF7F2" color="#2D2D2D" w="100%">
      {/* Sidebar Lateral */}
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
      <Box flex="1" p={{ base: 6, md: 10 }} w="100%">
        <Box mb={8}>
          <Heading fontSize={{ base: '3xl', md: '4xl' }} color="#4A0E17" fontFamily="serif" fontWeight="bold">
            Cadastrar Novo Livro
          </Heading>
          <Text color="#6B6B6B" fontSize="sm" mt={1}>
            Adicione um novo título ao acervo da biblioteca.
          </Text>
        </Box>

        <Box
          bg="#FFFFFF"
          border="1px solid #E8DCC4"
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          boxShadow="sm"
        >
          <Flex direction="column" gap={6}>
            
            {/* Título do Livro */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                Título do livro
              </Text>
              <Input
                placeholder="Digite o título do livro"
                borderColor="#E8DCC4"
                _hover={{ borderColor: '#4A0E17' }}
                _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                borderRadius="xl"
                fontSize="sm"
                h="44px"
              />
            </Box>

            {/* Autor e Categoria */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                  Autor
                </Text>
                <Input
                  placeholder="Digite o nome do autor"
                  borderColor="#E8DCC4"
                  _hover={{ borderColor: '#4A0E17' }}
                  _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                  borderRadius="xl"
                  fontSize="sm"
                  h="44px"
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
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

            {/* ISBN, Editora e Data de Publicação (Dia, Mês e Ano) */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                  ISBN
                </Text>
                <Input
                  placeholder="Ex.: 978-65-123456-7-8"
                  borderColor="#E8DCC4"
                  _hover={{ borderColor: '#4A0E17' }}
                  _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                  borderRadius="xl"
                  fontSize="sm"
                  h="44px"
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                  Editora
                </Text>
                <Input
                  placeholder="Digite a editora"
                  borderColor="#E8DCC4"
                  _hover={{ borderColor: '#4A0E17' }}
                  _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                  borderRadius="xl"
                  fontSize="sm"
                  h="44px"
                />
              </Box>

              {/* Data de Publicação Separada */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                  Data de publicação
                </Text>
                <Flex gap={2}>
                  <Input
                    placeholder="Dia"
                    type="number"
                    min={1}
                    max={31}
                    borderColor="#E8DCC4"
                    _hover={{ borderColor: '#4A0E17' }}
                    _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                    borderRadius="xl"
                    fontSize="sm"
                    h="44px"
                    px={2}
                    textAlign="center"
                  />
                  <Input
                    placeholder="Mês"
                    type="number"
                    min={1}
                    max={12}
                    borderColor="#E8DCC4"
                    _hover={{ borderColor: '#4A0E17' }}
                    _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                    borderRadius="xl"
                    fontSize="sm"
                    h="44px"
                    px={2}
                    textAlign="center"
                  />
                  <Input
                    placeholder="Ano"
                    type="number"
                    borderColor="#E8DCC4"
                    _hover={{ borderColor: '#4A0E17' }}
                    _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                    borderRadius="xl"
                    fontSize="sm"
                    h="44px"
                    px={2}
                    textAlign="center"
                  />
                </Flex>
              </Box>
            </SimpleGrid>

            {/* Quantidade, Localização e Idioma */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                  Quantidade de exemplares
                </Text>
                <Input
                  placeholder="Ex.: 3"
                  type="number"
                  borderColor="#E8DCC4"
                  _hover={{ borderColor: '#4A0E17' }}
                  _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                  borderRadius="xl"
                  fontSize="sm"
                  h="44px"
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                  Localização / prateleira
                </Text>
                <Input
                  placeholder="Ex.: Estante A - Prateleira 3"
                  borderColor="#E8DCC4"
                  _hover={{ borderColor: '#4A0E17' }}
                  _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                  borderRadius="xl"
                  fontSize="sm"
                  h="44px"
                />
              </Box>

              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
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

            {/* Número de Páginas */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                  Número de páginas
                </Text>
                <Input
                  placeholder="Ex.: 320"
                  type="number"
                  borderColor="#E8DCC4"
                  _hover={{ borderColor: '#4A0E17' }}
                  _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                  borderRadius="xl"
                  fontSize="sm"
                  h="44px"
                />
              </Box>
            </SimpleGrid>

            {/* Sinopse / Descrição */}
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                Sinopse / descrição
              </Text>
              <Textarea
                placeholder="Digite uma breve sinopse ou descrição do livro..."
                borderColor="#E8DCC4"
                _hover={{ borderColor: '#4A0E17' }}
                _focus={{ borderColor: '#4A0E17', boxShadow: '0 0 0 1px #4A0E17' }}
                borderRadius="xl"
                fontSize="sm"
                rows={4}
                resize="vertical"
              />
              <Text fontSize="10px" color="#9E9E9E" textAlign="right" mt={1}>
                0 / 2000
              </Text>
            </Box>

            {/* Upload da Capa e Disponibilidade */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={1.5}>
                  Upload da capa do livro
                </Text>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  border="1px dashed #E8DCC4"
                  bg="#FAF7F2"
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
                    w="44px"
                    h="44px"
                    borderRadius="full"
                    bg="#FFFFFF"
                    color="#4A0E17"
                    mb={2}
                    boxShadow="xs"
                  >
                    <FiUploadCloud size={22} />
                  </Flex>
                  <Text fontSize="xs" fontWeight="bold" color="#2D2D2D">
                    Arraste e solte a imagem aqui{' '}
                    <Text as="span" fontWeight="normal" color="#6B6B6B">
                      ou clique para selecionar
                    </Text>
                  </Text>
                  <Text fontSize="10px" color="#8C8C8C" mt={1}>
                    PNG, JPG ou JPEG até 5MB
                  </Text>
                </Flex>
              </Box>

              <Box display="flex" flexDirection="column" justify="center">
                <Text fontSize="xs" fontWeight="bold" color="#2D2D2D" mb={2}>
                  Disponibilidade inicial / status
                </Text>
                <Flex align="center" gap={3}>
                  <Flex
                    align="center"
                    w="48px"
                    h="26px"
                    bg={disponivel ? '#4A0E17' : '#D1D1D1'}
                    borderRadius="full"
                    p="3px"
                    cursor="pointer"
                    transition="all 0.2s"
                    onClick={() => setDisponivel(!disponivel)}
                  >
                    <Box
                      w="20px"
                      h="20px"
                      bg="#FFFFFF"
                      borderRadius="full"
                      boxShadow="sm"
                      transform={disponivel ? 'translateX(22px)' : 'translateX(0px)'}
                      transition="transform 0.2s"
                    />
                  </Flex>
                  <Text fontSize="xs" fontWeight="bold" color="#2D2D2D">
                    Disponível
                  </Text>
                </Flex>
                <Text fontSize="xs" color="#6B6B6B" mt={2}>
                  O livro ficará disponível para empréstimo após ser salvo.
                </Text>
              </Box>
            </SimpleGrid>

            {/* Botões de Ação Inferiores */}
            <Flex justify="space-between" align="center" mt={4} pt={4} borderTop="1px solid #FAF7F2">
              <Button
                variant="outline"
                borderColor="#E8DCC4"
                color="#4A0E17"
                _hover={{ bg: '#FAF0F2', borderColor: '#4A0E17' }}
                borderRadius="xl"
                px={6}
                h="40px"
                fontSize="xs"
                fontWeight="medium"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <FiTrash2 size={16} />
                Limpar
              </Button>

              <Button
                bg="#4A0E17"
                color="#FFFFFF"
                _hover={{ bg: '#360A11' }}
                borderRadius="xl"
                px={8}
                h="40px"
                fontSize="xs"
                fontWeight="medium"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <FiBook size={16} />
                Salvar Livro
              </Button>
            </Flex>

          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}