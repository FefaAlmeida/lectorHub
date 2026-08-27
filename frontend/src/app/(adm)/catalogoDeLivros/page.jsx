"use client";

import SideBarADM from "@/components/sideBarADM/sideBarADM";
import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  Menu,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import {
  FiBook,
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiFileText,
  FiGrid,
  FiHome,
  FiLayers,
  FiPlus,
  FiRefreshCw,
  FiRepeat,
  FiSave,
  FiSearch,
  FiSettings,
  FiTrash2,
  FiUploadCloud,
  FiUser,
  FiUsers,
  FiX,
  FiClock,
} from "react-icons/fi";

// =====================================================
// CORES
// =====================================================

const PRIMARY = "#4A0E17";
const PRIMARY_DARK = "#360A11";

const BACKGROUND = "#F5F2EE";
const WHITE = "#FFFFFF";

const BORDER = "#EFEBE3";

const TEXT = "#333333";
const TEXT_LIGHT = "#777777";

// =====================================================
// DADOS INICIAIS
// =====================================================

const LIVROS_INICIAIS = [
  {
    id: 1,
    titulo: "1984",
    autor: "George Orwell",
    categoria: "Ficção",
    ano: 1949,
    isbn: "9780451524935",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
  },
  {
    id: 2,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    categoria: "Romance",
    ano: 1899,
    isbn: "9788535902778",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9788535902778-L.jpg",
  },
  {
    id: 3,
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    categoria: "Infantil",
    ano: 1943,
    isbn: "9780156012195",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg",
  },
  {
    id: 4,
    titulo: "A Menina que Roubava Livros",
    autor: "Markus Zusak",
    categoria: "Drama",
    ano: 2005,
    isbn: "9780375842207",
    disponivel: false,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg",
  },
  {
    id: 5,
    titulo: "O Hobbit",
    autor: "J.R.R. Tolkien",
    categoria: "Fantasia",
    ano: 1937,
    isbn: "9780547928227",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
  },
  {
    id: 6,
    titulo: "Orgulho e Preconceito",
    autor: "Jane Austen",
    categoria: "Romance",
    ano: 1813,
    isbn: "9780141439518",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
  },
  {
    id: 7,
    titulo: "Harry Potter e a Pedra Filosofal",
    autor: "J.K. Rowling",
    categoria: "Fantasia",
    ano: 1997,
    isbn: "9780590353427",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg",
  },
  {
    id: 8,
    titulo: "O Alquimista",
    autor: "Paulo Coelho",
    categoria: "Ficção",
    ano: 1988,
    isbn: "9780062315007",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
  },
  {
    id: 9,
    titulo: "Cem Anos de Solidão",
    autor: "Gabriel García Márquez",
    categoria: "Romance",
    ano: 1967,
    isbn: "9780060883287",
    disponivel: false,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg",
  },
  {
    id: 10,
    titulo: "O Caçador de Pipas",
    autor: "Khaled Hosseini",
    categoria: "Drama",
    ano: 2003,
    isbn: "9781594631931",
    disponivel: false,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg",
  },
];

// =====================================================
// MENU
// =====================================================

const MENU = [
  {
    label: "Dashboard",
    icon: FiHome,
    emBreve: true,
  },
  {
    label: "Livros",
    icon: FiBook,
    href: "/catalogoDeLivros",
    active: true,
  },
  {
    label: "Categorias",
    icon: FiGrid,
    emBreve: true,
  },
  {
    label: "Usuários",
    icon: FiUsers,
    emBreve: true,
  },
  {
    label: "Empréstimos",
    icon: FiClock,
    href: "/gestaoEeR",
  },
  {
    label: "Devoluções",
    icon: FiRefreshCw,
    href: "/gestaoEeR",
  },
  {
    label: "Prazos",
    icon: FiRepeat,
    href: "/editarPrazo",
  },
  {
    label: "Relatórios",
    icon: FiFileText,
    emBreve: true,
  },
  {
    label: "Configurações",
    icon: FiSettings,
    emBreve: true,
  },
];

// =====================================================
// ITEM DO MENU
// =====================================================

function MenuItem({ item }) {
  return (
    <HStack
      as={item.emBreve ? "div" : "a"}
      href={item.emBreve ? undefined : item.href}
      title={item.emBreve ? "Em breve" : undefined}
      px={3}
      py={2.5}
      borderRadius="5px"
      bg={item.active ? PRIMARY_DARK : "transparent"}
      color={
        item.active
          ? WHITE
          : item.emBreve
          ? "rgba(255,255,255,.35)"
          : "rgba(255,255,255,.85)"
      }
      cursor={item.emBreve ? "default" : "pointer"}
      gap={3}
      transition="all .2s ease"
      _hover={{
        bg: item.active
          ? PRIMARY_DARK
          : item.emBreve
          ? "transparent"
          : "rgba(255,255,255,.08)",
      }}
    >
      <Icon
        as={item.icon}
        boxSize={3.5}
      />

      <Text
        fontSize="11px"
        fontWeight={item.active ? "600" : "400"}
      >
        {item.label}
      </Text>
    </HStack>
  );
}

// =====================================================
// INDICADOR
// =====================================================

function Indicador({ icon, titulo, valor }) {
  return (
    <Card.Root
      bg={WHITE}
      border="1px solid"
      borderColor={BORDER}
      borderRadius="7px"
      boxShadow="none"
    >
      <Card.Body p={5}>
        <HStack gap={3}>
          <Box
            w="48px"
            h="48px"
            flexShrink={0}
            borderRadius="full"
            bg={PRIMARY}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              as={icon}
              color={WHITE}
              boxSize={5}
            />
          </Box>

          <Stack gap={0}>
            <Text
              fontSize="11px"
              color={TEXT_LIGHT}
            >
              {titulo}
            </Text>

            <Text
              fontSize="20px"
              fontWeight="700"
              color={TEXT}
            >
              {valor}
            </Text>
          </Stack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

// =====================================================
// DROPDOWN PADRONIZADO
// =====================================================

function FiltroSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <Stack gap={1}>
      <Text
        fontSize="11px"
        color={TEXT_LIGHT}
      >
        {label}
      </Text>

      <Menu.Root
        positioning={{
          sameWidth: true,
        }}
      >
        <Menu.Trigger asChild>
          <Button
            variant="outline"
            h="42px"
            w="100%"
            px={3}
            justifyContent="space-between"
            bg={WHITE}
            color={TEXT}
            border="1px solid"
            borderColor="#E5DED6"
            borderRadius="8px"
            fontSize="12px"
            fontWeight="400"
            cursor="pointer"
            transition="all .2s ease"
            _hover={{
              bg: "#FCF9F6",
              borderColor: PRIMARY,
            }}
            _focus={{
              borderColor: PRIMARY,
              boxShadow: `0 0 0 1px ${PRIMARY}`,
              outline: "none",
            }}
          >
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
            >
              {value}
            </Text>

            <Icon
              as={FiChevronDown}
              color={PRIMARY}
              boxSize={4}
              flexShrink={0}
            />
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content
            bg={WHITE}
            border="1px solid"
            borderColor="#E7DED8"
            borderRadius="10px"
            boxShadow="0 8px 24px rgba(74,14,23,.12)"
            p={2}
            zIndex={1500}
          >
            {options.map((option) => (
              <Menu.Item
                key={option}
                value={option}
                px={3}
                py={2.5}
                borderRadius="7px"
                cursor="pointer"
                fontSize="12px"
                color={TEXT}
                fontWeight="400"
                bg="transparent"
                transition="all .2s ease"
                onClick={() => onChange(option)}
                _hover={{
                  bg: "#F2E6E8",
                  color: PRIMARY,
                }}
              >
                {option}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Stack>
  );
}

// =====================================================
// CARD DO LIVRO
// =====================================================

function LivroCard({
  livro,
  onEditar,
  onExcluir,
  onInformacoes,
}) {
  return (
    <Card.Root
      bg={WHITE}
      border="1px solid"
      borderColor={BORDER}
      borderRadius="7px"
      overflow="hidden"
      boxShadow="none"
      transition="all .2s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow:
          "0 5px 15px rgba(74,14,23,.08)",
      }}
    >
      <Card.Body p={2}>
        <Box
          h="220px"
          bg="#F1EDE7"
          borderRadius="5px"
          overflow="hidden"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {livro.imagem ? (
            <Box
              as="img"
              src={livro.imagem}
              alt={livro.titulo}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          ) : (
            <Icon
              as={FiBookOpen}
              boxSize={10}
              color="#B7AAA0"
            />
          )}
        </Box>

        <Stack
          gap={0.5}
          px={1}
          pt={2}
        >
          <Text
            fontSize="12px"
            fontWeight="700"
            color={TEXT}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {livro.titulo}
          </Text>

          <Text
            fontSize="7px"
            color={TEXT_LIGHT}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {livro.autor}
          </Text>

          <Text
            fontSize="7px"
            color={
              livro.disponivel
                ? "#347A45"
                : "#9A3434"
            }
            fontWeight="600"
          >
            {livro.disponivel
              ? "Disponível"
              : "Emprestado"}
          </Text>
        </Stack>

        <Flex
          gap={1}
          mt={2}
        >
          <Button
            flex="1"
            h="25px"
            fontSize="11px"
            bg={PRIMARY}
            color={WHITE}
            borderRadius="4px"
            onClick={() =>
              onInformacoes(livro)
            }
            _hover={{
              bg: PRIMARY_DARK,
            }}
          >
            Informações
          </Button>

          <Button
            minW="25px"
            h="25px"
            p={0}
            bg="#F4E8E8"
            color={PRIMARY}
            borderRadius="4px"
            onClick={() =>
              onEditar(livro)
            }
            _hover={{
              bg: "#EAD7D7",
            }}
            title="Editar livro"
          >
            <Icon
              as={FiEdit3}
              boxSize={3}
            />
          </Button>

          <Button
            minW="25px"
            h="25px"
            p={0}
            bg="#F9EAEA"
            color="#9A3434"
            borderRadius="4px"
            onClick={() =>
              onExcluir(livro.id)
            }
            _hover={{
              bg: "#F1D2D2",
            }}
            title="Excluir livro"
          >
            <Icon
              as={FiTrash2}
              boxSize={5}
            />
          </Button>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

// =====================================================
// MODAL DE LIVRO
// =====================================================

function CampoModal({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}) {
  return (
    <Stack gap="4px">
      <Text
        fontSize="10px"
        fontWeight="600"
        color={PRIMARY}
      >
        {label}
      </Text>

      <Input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        h="34px"
        px="11px"
        bg="#FFFCF7"
        border="1px solid"
        borderColor="#E4D2BE"
        borderRadius="6px"
        color="#3D2928"
        fontSize="10px"
        _placeholder={{
          color: "#9B908A",
        }}
        _hover={{
          borderColor: "#CDB69B",
        }}
        _focus={{
          borderColor: PRIMARY,
          boxShadow: `0 0 0 1px ${PRIMARY}`,
        }}
      />
    </Stack>
  );
}


// =====================================================
// SELECT DO MODAL
// =====================================================

function SelectVisualModal({
  label,
  placeholder,
  options = [],
  value,
  onChange,
}) {
  const selecionada =
    options.find((option) => option.value === value) || null;

  return (
    <Stack gap="4px">
      <Text
        fontSize="10px"
        fontWeight="600"
        color={PRIMARY}
      >
        {label}
      </Text>

      <Menu.Root
        positioning={{
          sameWidth: true,
        }}
        onSelect={(detalhe) =>
          onChange(detalhe.value)
        }
      >
        <Menu.Trigger asChild>
          <Button
            variant="outline"
            h="34px"
            w="100%"
            px="11px"
            justifyContent="space-between"
            bg="#FFFCF7"
            border="1px solid"
            borderColor="#E7DED8"
            borderRadius="14px"
            color={
              selecionada
                ? "#3D2928"
                : "#9B908A"
            }
            fontSize="10px"
            fontWeight="400"
            cursor="pointer"
            transition="all .25s cubic-bezier(0.16, 1, 0.3, 1)"
            _hover={{
              borderColor: PRIMARY,
              bg: "#FAF5F6",
              boxShadow:
                "0 3px 10px rgba(74,14,23,.07)",
            }}
            _focus={{
              borderColor: PRIMARY,
              bg: "#FFFFFF",
              boxShadow:
                "0 0 0 3px rgba(74,14,23,.15)",
              outline: "none",
            }}
          >
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              textAlign="left"
            >
              {selecionada
                ? selecionada.label
                : placeholder}
            </Text>

            <Icon
              as={FiChevronDown}
              color={PRIMARY}
              boxSize={3.5}
              flexShrink={0}
              ml={2}
            />
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content
            bg="#FFFFFF"
            border="1px solid"
            borderColor="#E7DED8"
            borderRadius="16px"
            boxShadow="0 8px 24px rgba(74,14,23,.12)"
            p={2}
            zIndex={1500}
            overflow="hidden"
          >
            {options.map((option) => (
              <Menu.Item
                key={option.value}
                value={option.value}
                px={3}
                py={2.5}
                borderRadius="8px"
                cursor="pointer"
                fontSize="10px"
                color="#3D2928"
                fontWeight="500"
                bg="transparent"
                transition="all .2s ease"
                _hover={{
                  bg: "#F2E6E8",
                  color: PRIMARY,
                }}
                _focus={{
                  bg: "#F2E6E8",
                  color: PRIMARY,
                }}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Stack>
  );
}


// =====================================================
// MODAL ADICIONAR / EDITAR LIVRO
// VISUAL SUBSTITUÍDO PELO MODELO ENVIADO
// =====================================================

function ModalLivro({
  aberto,
  livro,
  onFechar,
  onSalvar,
}) {
  const [form, setForm] = useState(
    livro || {
      titulo: "",
      autor: "",
      categoria: "",
      ano: "",
      isbn: "",
      editora: "",
      quantidade: "",
      localizacao: "",
      idioma: "",
      paginas: "",
      sinopse: "",
      imagem: "",
      disponivel: true,
    }
  );

  if (!aberto) {
    return null;
  }

  function alterar(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function salvar() {
    onSalvar({
      ...form,
      ano: Number(form.ano) || "",
    });
  }

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      w="100vw"
      h="100vh"
      overflow="hidden"
      fontFamily="Arial, sans-serif"
    >
      {/* FUNDO ESCURECIDO DO CATÁLOGO */}
      <Box
        position="absolute"
        inset={0}
        bg="rgba(27, 23, 22, 0.61)"
        backdropFilter="blur(0.5px)"
      />

      {/* ÁREA DO MODAL */}
      <Flex
        position="absolute"
        inset={0}
        align="center"
        justify="center"
        px="12px"
        py="18px"
        overflowY="auto"
      >
        {/* CAIXA PRINCIPAL */}
        <Box
          w="650px"
          maxW="94vw"
          bg="#FFF9F0"
          borderRadius="13px"
          overflow="hidden"
          border="1px solid rgba(74,14,23,.14)"
          boxShadow="
            0 22px 60px rgba(0,0,0,.34),
            0 4px 15px rgba(0,0,0,.12)
          "
          flexShrink={0}
        >
          {/* CABEÇALHO */}
          <Box
            position="relative"
            textAlign="center"
            bg="#FFFAF4"
            pt="13px"
            pb="9px"
            px="40px"
          >
            <Button
              position="absolute"
              top="7px"
              right="10px"
              minW="28px"
              w="28px"
              h="28px"
              p={0}
              bg="transparent"
              color={PRIMARY}
              borderRadius="full"
              _hover={{
                bg: "#F4E8E1",
              }}
              onClick={onFechar}
            >
              <Icon
                as={FiX}
                boxSize="19px"
              />
            </Button>

            <Heading
              fontFamily="Georgia, serif"
              fontSize="24px"
              fontWeight="normal"
              color={PRIMARY}
              lineHeight="1.1"
            >
              {livro ? "Editar Livro" : "Adicionar Livro"}
            </Heading>

            <Text
              mt="3px"
              fontSize="9px"
              color="#7C6D66"
            >
              {livro
                ? "Atualize as informações do livro selecionado."
                : "Preencha as informações do novo livro."}
            </Text>
          </Box>

          {/* FAIXA VINHO */}
          <Flex
            mx="15px"
            h="64px"
            position="relative"
            overflow="hidden"
            align="center"
            justify="center"
            borderRadius="8px 8px 0 0"
            bg="
              linear-gradient(
                110deg,
                #570810 0%,
                #771018 35%,
                #8A161E 52%,
                #741018 70%,
                #570810 100%
              )
            "
          >
            {/* DECORAÇÃO ESQUERDA */}
            <Box
              position="absolute"
              left="15px"
              bottom="-21px"
              w="120px"
              h="90px"
              opacity=".22"
            >
              <Box
                position="absolute"
                left="42px"
                bottom="0"
                w="1px"
                h="83px"
                bg="#DDAE68"
                transform="rotate(26deg)"
              />

              <Box
                position="absolute"
                left="18px"
                top="27px"
                w="38px"
                h="1px"
                bg="#DDAE68"
                transform="rotate(41deg)"
              />

              <Box
                position="absolute"
                left="43px"
                top="42px"
                w="39px"
                h="1px"
                bg="#DDAE68"
                transform="rotate(-35deg)"
              />

              <Box
                position="absolute"
                left="13px"
                top="51px"
                w="31px"
                h="1px"
                bg="#DDAE68"
                transform="rotate(50deg)"
              />
            </Box>

            <Icon
              as={FiBookOpen}
              boxSize="47px"
              color="#DDBB75"
              strokeWidth="1"
            />

            {/* DECORAÇÃO DIREITA */}
            <Box
              position="absolute"
              right="15px"
              bottom="-21px"
              w="120px"
              h="90px"
              opacity=".22"
              transform="scaleX(-1)"
            >
              <Box
                position="absolute"
                left="42px"
                bottom="0"
                w="1px"
                h="83px"
                bg="#DDAE68"
                transform="rotate(26deg)"
              />

              <Box
                position="absolute"
                left="18px"
                top="27px"
                w="38px"
                h="1px"
                bg="#DDAE68"
                transform="rotate(41deg)"
              />

              <Box
                position="absolute"
                left="43px"
                top="42px"
                w="39px"
                h="1px"
                bg="#DDAE68"
                transform="rotate(-35deg)"
              />

              <Box
                position="absolute"
                left="13px"
                top="51px"
                w="31px"
                h="1px"
                bg="#DDAE68"
                transform="rotate(50deg)"
              />
            </Box>
          </Flex>

          {/* FORMULÁRIO */}
          <Box
            mx="15px"
            mb="14px"
            px="20px"
            pt="13px"
            pb="12px"
            bg="#FFFAF3"
            border="1px solid"
            borderTop="none"
            borderColor="#E8D7C5"
            borderRadius="0 0 8px 8px"
          >
            {/* LINHA 1 */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
            >
              <CampoModal
                label="Título do livro"
                placeholder="Digite o título do livro"
                value={form.titulo}
                onChange={(valor) =>
                  alterar("titulo", valor)
                }
              />

              <CampoModal
                label="Autor"
                placeholder="Digite o nome do autor"
                value={form.autor}
                onChange={(valor) =>
                  alterar("autor", valor)
                }
              />
            </Grid>

            {/* LINHA 2 */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
              mt="9px"
            >
              <SelectVisualModal
                label="Categoria"
                placeholder="Selecione a categoria"
                value={form.categoria || ""}
                onChange={(valor) =>
                  alterar("categoria", valor)
                }
                options={[
                  { value: "Romance", label: "Romance" },
                  { value: "Fantasia", label: "Fantasia" },
                  { value: "Ficção", label: "Ficção" },
                  { value: "Mistério", label: "Mistério" },
                  { value: "Terror", label: "Terror" },
                  { value: "Aventura", label: "Aventura" },
                  { value: "Drama", label: "Drama" },
                  { value: "Clássico", label: "Clássico" },
                  { value: "Biografia", label: "Biografia" },
                  { value: "História", label: "História" },
                  { value: "Distopia", label: "Distopia" },
                  { value: "Infantil", label: "Infantil" },
                ]}
              />

              <CampoModal
                label="ISBN"
                placeholder="Ex.: 978-65-123456-7-8"
                value={form.isbn}
                onChange={(valor) =>
                  alterar("isbn", valor)
                }
              />
            </Grid>

            {/* LINHA 3 */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
              mt="9px"
            >
              <CampoModal
                label="Editora"
                placeholder="Digite o nome da editora"
                value={form.editora}
                onChange={(valor) =>
                  alterar("editora", valor)
                }
              />

              <CampoModal
                label="Ano de publicação"
                placeholder="Ex.: 2024"
                type="number"
                value={form.ano}
                onChange={(valor) =>
                  alterar("ano", valor)
                }
              />
            </Grid>

            {/* LINHA 4 */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
              mt="9px"
            >
              <CampoModal
                label="Quantidade de exemplares"
                placeholder="Ex.: 3"
                type="number"
                value={form.quantidade}
                onChange={(valor) =>
                  alterar("quantidade", valor)
                }
              />

              <CampoModal
                label="Localização / prateleira"
                placeholder="Ex.: Estante A - Prateleira 2"
                value={form.localizacao}
                onChange={(valor) =>
                  alterar("localizacao", valor)
                }
              />
            </Grid>

            {/* LINHA 5 */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
              mt="9px"
            >
              <SelectVisualModal
                label="Idioma"
                placeholder="Selecione o idioma"
                value={form.idioma || ""}
                onChange={(valor) =>
                  alterar("idioma", valor)
                }
                options={[
                  { value: "Português", label: "Português" },
                  { value: "Inglês", label: "Inglês" },
                  { value: "Espanhol", label: "Espanhol" },
                  { value: "Francês", label: "Francês" },
                  { value: "Italiano", label: "Italiano" },
                  { value: "Alemão", label: "Alemão" },
                ]}
              />

              <CampoModal
                label="Número de páginas"
                placeholder="Ex.: 256"
                type="number"
                value={form.paginas}
                onChange={(valor) =>
                  alterar("paginas", valor)
                }
              />
            </Grid>

            {/* SINOPSE */}
            <Stack
              gap="4px"
              mt="9px"
            >
              <Text
                fontSize="10px"
                fontWeight="600"
                color={PRIMARY}
              >
                Sinopse / descrição
              </Text>

              <Box position="relative">
                <Textarea
                  value={form.sinopse || ""}
                  onChange={(e) =>
                    alterar(
                      "sinopse",
                      e.target.value.slice(0, 1000)
                    )
                  }
                  h="55px"
                  minH="55px"
                  resize="none"
                  bg="#FFFCF7"
                  border="1px solid"
                  borderColor="#E4D2BE"
                  borderRadius="6px"
                  px="11px"
                  pt="8px"
                  pb="16px"
                  fontSize="9px"
                  color="#3D2928"
                  placeholder="Digite uma breve sinopse ou descrição do livro..."
                  _placeholder={{
                    color: "#9B908A",
                  }}
                  _hover={{
                    borderColor: "#CDB69B",
                  }}
                  _focus={{
                    borderColor: PRIMARY,
                    boxShadow: `0 0 0 1px ${PRIMARY}`,
                  }}
                />

                <Text
                  position="absolute"
                  right="7px"
                  bottom="4px"
                  fontSize="6px"
                  color="#7C6D66"
                >
                  {(form.sinopse || "").length}/1000
                </Text>
              </Box>
            </Stack>

            {/* UPLOAD + DISPONIBILIDADE */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1.1fr 1fr",
              }}
              gap="19px"
              mt="9px"
            >
              <Stack gap="4px">
                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color={PRIMARY}
                >
                  Upload da capa do livro
                </Text>

                <Flex
                  as="label"
                  h="72px"
                  border="1px dashed #C5A381"
                  borderRadius="6px"
                  bg="#FDF8F0"
                  align="center"
                  justify="center"
                  direction="column"
                  textAlign="center"
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    borderColor: PRIMARY,
                    bg: "#FAF1E7",
                  }}
                >
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    display="none"
                    onChange={(e) => {
                      const arquivo = e.target.files?.[0];

                      if (!arquivo) {
                        return;
                      }

                      const leitor = new FileReader();

                      leitor.onload = () => {
                        alterar(
                          "imagem",
                          String(leitor.result || "")
                        );
                      };

                      leitor.readAsDataURL(arquivo);
                    }}
                  />

                  <Icon
                    as={FiUploadCloud}
                    boxSize="27px"
                    color={PRIMARY}
                    mb="1px"
                  />

                  <Text
                    fontSize="8px"
                    lineHeight="1.25"
                    color="#3D2928"
                  >
                    Arraste e solte a imagem aqui
                    <br />
                    ou clique para selecionar
                  </Text>

                  <Text
                    mt="2px"
                    fontSize="6px"
                    color="#7C6D66"
                  >
                    JPG, PNG - Tamanho máx. 5MB
                  </Text>
                </Flex>
              </Stack>

              {/* DISPONIBILIDADE */}
              <Stack gap="4px">
                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color={PRIMARY}
                >
                  Disponibilidade inicial / status
                </Text>

                <HStack
                  mt="5px"
                  gap="9px"
                >
                  <Flex
                    w="40px"
                    h="21px"
                    bg={
                      form.disponivel
                        ? PRIMARY
                        : "#CFC4BB"
                    }
                    borderRadius="full"
                    align="center"
                    justify={
                      form.disponivel
                        ? "flex-end"
                        : "flex-start"
                    }
                    p="2px"
                    cursor="pointer"
                    transition="all .2s ease"
                    onClick={() =>
                      alterar(
                        "disponivel",
                        !form.disponivel
                      )
                    }
                  >
                    <Box
                      w="17px"
                      h="17px"
                      bg="white"
                      borderRadius="full"
                      boxShadow="0 1px 3px rgba(0,0,0,.25)"
                    />
                  </Flex>

                  <Text
                    fontSize="9px"
                    color="#3D2928"
                  >
                    {form.disponivel
                      ? "Disponível"
                      : "Indisponível"}
                  </Text>
                </HStack>

                <Text
                  fontSize="7px"
                  lineHeight="1.4"
                  color="#7C6D66"
                >
                  Quando ativado, o livro ficará disponível
                  <br />
                  para empréstimo após salvo.
                </Text>
              </Stack>
            </Grid>

            {/* BOTÕES */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1.03fr",
              }}
              gap="10px"
              mt="10px"
            >
              <Button
                h="34px"
                bg="transparent"
                color={PRIMARY}
                border="1px solid"
                borderColor={PRIMARY}
                borderRadius="6px"
                fontFamily="Georgia, serif"
                fontWeight="normal"
                fontSize="11px"
                _hover={{
                  bg: "#F8EEE6",
                }}
                onClick={onFechar}
              >
                Cancelar
              </Button>

              <Button
                h="34px"
                bg={PRIMARY}
                color="white"
                borderRadius="6px"
                fontFamily="Georgia, serif"
                fontWeight="normal"
                fontSize="11px"
                boxShadow="0 3px 8px rgba(74,14,23,.15)"
                _hover={{
                  bg: "#350A10",
                }}
                onClick={salvar}
              >
                {livro
                  ? "Salvar Alterações"
                  : "Adicionar Livro"}
              </Button>
            </Grid>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

// =====================================================
// MODAL DE INFORMAÇÕES
// =====================================================

function ModalInformacoes({
  livro,
  onFechar,
}) {
  if (!livro) {
    return null;
  }

  return (
    <Box
      position="fixed"
      inset={0}
      bg="rgba(0,0,0,.45)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Card.Root
        w="100%"
        maxW="500px"
        bg={WHITE}
        borderRadius="12px"
        boxShadow="0 15px 40px rgba(0,0,0,.2)"
      >
        <Card.Header
          px={6}
          pt={6}
        >
          <Flex
            justify="space-between"
            align="center"
          >
            <Heading
              fontFamily="Georgia, serif"
              fontSize="22px"
              color={PRIMARY}
            >
              Informações do Livro
            </Heading>

            <Button
              variant="ghost"
              p={0}
              minW="30px"
              h="30px"
              onClick={onFechar}
            >
              <Icon as={FiX} />
            </Button>
          </Flex>
        </Card.Header>

        <Card.Body
          px={6}
          pb={6}
        >
          <Flex gap={5}>
            <Box
              w="130px"
              h="180px"
              bg="#F1EDE7"
              borderRadius="7px"
              overflow="hidden"
              flexShrink={0}
            >
              {livro.imagem ? (
                <Box
                  as="img"
                  src={livro.imagem}
                  alt={livro.titulo}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : (
                <Flex
                  w="100%"
                  h="100%"
                  align="center"
                  justify="center"
                >
                  <Icon
                    as={FiBookOpen}
                    boxSize={8}
                    color="#B7AAA0"
                  />
                </Flex>
              )}
            </Box>

            <Stack gap={2}>
              <Text
                fontSize="18px"
                fontWeight="700"
                color={TEXT}
              >
                {livro.titulo}
              </Text>

              <Text
                fontSize="11px"
                color={TEXT_LIGHT}
              >
                {livro.autor}
              </Text>

              <Text
                fontSize="10px"
                color={TEXT}
              >
                Categoria:{" "}
                <strong>
                  {livro.categoria}
                </strong>
              </Text>

              <Text
                fontSize="10px"
                color={TEXT}
              >
                Ano:{" "}
                <strong>
                  {livro.ano}
                </strong>
              </Text>

              <Text
                fontSize="10px"
                color={TEXT}
              >
                ISBN:{" "}
                <strong>
                  {livro.isbn || "—"}
                </strong>
              </Text>

              <Text
                fontSize="10px"
                fontWeight="600"
                color={
                  livro.disponivel
                    ? "#347A45"
                    : "#9A3434"
                }
              >
                {livro.disponivel
                  ? "Disponível"
                  : "Emprestado"}
              </Text>
            </Stack>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

// =====================================================
// PÁGINA PRINCIPAL
// =====================================================

export default function CatalogoLivros() {
  const [livros, setLivros] = useState(
    LIVROS_INICIAIS
  );

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] =
    useState("Todas");
  const [disponibilidade, setDisponibilidade] =
    useState("Todas");
  const [ano, setAno] =
    useState("Todos");
  const [ordenacao, setOrdenacao] =
    useState("Mais recentes");

  const [modalLivro, setModalLivro] =
    useState(false);

  const [livroEditando, setLivroEditando] =
    useState(null);

  const [livroInformacoes, setLivroInformacoes] =
    useState(null);

  // ===================================================
  // ADICIONAR
  // ===================================================

  function adicionarLivro() {
    setLivroEditando(null);
    setModalLivro(true);
  }

  // ===================================================
  // EDITAR
  // ===================================================

  function editarLivro(livro) {
    setLivroEditando(livro);
    setModalLivro(true);
  }

  // ===================================================
  // EXCLUIR
  // ===================================================

  function excluirLivro(id) {
    const livro = livros.find(
      (item) => item.id === id
    );

    if (!livro) {
      return;
    }

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir "${livro.titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    setLivros((listaAtual) =>
      listaAtual.filter(
        (item) => item.id !== id
      )
    );
  }

  // ===================================================
  // SALVAR LIVRO
  // ===================================================

  function salvarLivro(form) {
    if (
      !form.titulo.trim() ||
      !form.autor.trim()
    ) {
      alert(
        "Preencha pelo menos o título e o autor."
      );

      return;
    }

    if (livroEditando) {
      setLivros((listaAtual) =>
        listaAtual.map((livro) =>
          livro.id === livroEditando.id
            ? {
                ...livro,
                ...form,
                id: livro.id,
              }
            : livro
        )
      );
    } else {
      const novoLivro = {
        ...form,
        id: Date.now(),
        ano: Number(form.ano) || "",
      };

      setLivros((listaAtual) => [
        novoLivro,
        ...listaAtual,
      ]);
    }

    setModalLivro(false);
    setLivroEditando(null);
  }

  // ===================================================
  // FILTROS
  // ===================================================

  let livrosFiltrados = livros.filter(
    (livro) => {
      const texto =
        `${livro.titulo} ${livro.autor} ${
          livro.isbn || ""
        }`.toLowerCase();

      const correspondeBusca =
        texto.includes(
          busca.toLowerCase()
        );

      const correspondeCategoria =
        categoria === "Todas" ||
        livro.categoria === categoria;

      const correspondeDisponibilidade =
        disponibilidade === "Todas" ||
        (
          disponibilidade === "Disponíveis" &&
          livro.disponivel
        ) ||
        (
          disponibilidade === "Indisponíveis" &&
          !livro.disponivel
        );

      const correspondeAno =
        ano === "Todos" ||
        String(livro.ano) === ano;

      return (
        correspondeBusca &&
        correspondeCategoria &&
        correspondeDisponibilidade &&
        correspondeAno
      );
    }
  );

  // ===================================================
  // ORDENAÇÃO
  // ===================================================

  if (ordenacao === "A-Z") {
    livrosFiltrados.sort((a, b) =>
      a.titulo.localeCompare(b.titulo)
    );
  }

  if (ordenacao === "Z-A") {
    livrosFiltrados.sort((a, b) =>
      b.titulo.localeCompare(a.titulo)
    );
  }

  if (ordenacao === "Mais recentes") {
    livrosFiltrados.sort(
      (a, b) =>
        Number(b.ano || 0) -
        Number(a.ano || 0)
    );
  }

  // ===================================================
  // LIMPAR FILTROS
  // ===================================================

  function limparFiltros() {
    setBusca("");
    setCategoria("Todas");
    setDisponibilidade("Todas");
    setAno("Todos");
    setOrdenacao("Mais recentes");
  }

  // ===================================================
  // CONTADORES
  // ===================================================

  const totalLivros = livros.length;

  const disponiveis = livros.filter(
    (livro) => livro.disponivel
  ).length;

  const emprestados = livros.filter(
    (livro) => !livro.disponivel
  ).length;

  const categorias = new Set(
    livros.map(
      (livro) => livro.categoria
    )
  ).size;

  // ===================================================
  // INTERFACE
  // ===================================================

  return (
    <Flex
      minH="100vh"
      bg={BACKGROUND}
    >
      <SideBarADM />

      <Box
        flex="1"
        minW={0}
        px={{
          base: 5,
          md: 7,
          lg: 9,
          xl: 10,
        }}
        py={{
          base: 6,
          md: 8,
        }}
      >
        <Stack
          gap={6}
          w="100%"
        >
          {/* CABEÇALHO */}

          <Flex
            justify="space-between"
            align="center"
            gap={4}
            flexWrap="wrap"
          >
            <Stack gap={2}>
              <Text
                fontFamily="Georgia, serif"
                fontSize={{
                  base: "34px",
                  md: "42px",
                  lg: "46px",
                }}
                color={PRIMARY}
                lineHeight="1.05"
              >
                Catálogo de Livros
              </Text>

              <Text
                fontSize="13px"
                color={TEXT_LIGHT}
              >
                Gerencie os livros cadastrados no
                acervo da biblioteca.
              </Text>
            </Stack>

            <Button
              bg={PRIMARY}
              color={WHITE}
              borderRadius="8px"
              px={5}
              h="40px"
              fontSize="12px"
              fontWeight="600"
              boxShadow="0 4px 12px rgba(74,14,23,.15)"
              onClick={adicionarLivro}
              _hover={{
                bg: PRIMARY_DARK,
                transform:
                  "translateY(-1px)",
              }}
              transition="all .2s ease"
            >
              <Icon
                as={FiPlus}
                mr={2}
                boxSize={5}
              />

              Adicionar livro
            </Button>
          </Flex>

          {/* INDICADORES */}

          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
          >
            <Indicador
              icon={FiBookOpen}
              titulo="Total de livros"
              valor={totalLivros}
            />

            <Indicador
              icon={FiCheckCircle}
              titulo="Disponíveis"
              valor={disponiveis}
            />

            <Indicador
              icon={FiUser}
              titulo="Emprestados"
              valor={emprestados}
            />

            <Indicador
              icon={FiLayers}
              titulo="Categorias"
              valor={categorias}
            />
          </Grid>

          {/* FILTROS */}

          <Card.Root
            bg={WHITE}
            border="1px solid"
            borderColor={BORDER}
            borderRadius="7px"
          >
            <Card.Body p={5}>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md:
                    "2fr 1fr 1fr 1fr 1fr auto",
                }}
                gap={3}
                alignItems="end"
              >
                {/* BUSCA */}

                <Stack gap={1}>
                  <Text
                    fontSize="11px"
                    color={TEXT_LIGHT}
                  >
                    Buscar
                  </Text>

                  <Box position="relative">
                    <Icon
                      as={FiSearch}
                      position="absolute"
                      left="12px"
                      top="50%"
                      transform="translateY(-50%)"
                      color="#999"
                      boxSize={4}
                      zIndex={1}
                    />

                    <Input
                      pl="38px"
                      h="42px"
                      fontSize="12px"
                      placeholder="Buscar por título, autor ou ISBN..."
                      value={busca}
                      onChange={(e) =>
                        setBusca(
                          e.target.value
                        )
                      }
                      borderColor="#E5DED6"
                      borderRadius="8px"
                      _focus={{
                        borderColor: PRIMARY,
                        boxShadow:
                          `0 0 0 1px ${PRIMARY}`,
                      }}
                    />
                  </Box>
                </Stack>

                {/* CATEGORIA */}

                <FiltroSelect
                  label="Categoria"
                  value={categoria}
                  onChange={setCategoria}
                  options={[
                    "Todas",
                    "Ficção",
                    "Romance",
                    "Fantasia",
                    "Drama",
                    "Infantil",
                  ]}
                />

                {/* DISPONIBILIDADE */}

                <FiltroSelect
                  label="Disponibilidade"
                  value={disponibilidade}
                  onChange={
                    setDisponibilidade
                  }
                  options={[
                    "Todas",
                    "Disponíveis",
                    "Indisponíveis",
                  ]}
                />

                {/* ANO */}

                <FiltroSelect
                  label="Ano"
                  value={ano}
                  onChange={setAno}
                  options={[
                    "Todos",
                    "2026",
                    "2025",
                    "2024",
                    "2005",
                    "2003",
                    "1997",
                    "1988",
                    "1967",
                    "1949",
                    "1943",
                    "1937",
                    "1899",
                    "1813",
                  ]}
                />

                {/* ORDENAR */}

                <FiltroSelect
                  label="Ordenar por"
                  value={ordenacao}
                  onChange={setOrdenacao}
                  options={[
                    "Mais recentes",
                    "A-Z",
                    "Z-A",
                  ]}
                />

                {/* LIMPAR */}

                <Button
                  h="42px"
                  px={4}
                  variant="outline"
                  borderColor="#E5DED6"
                  color={PRIMARY}
                  fontSize="12px"
                  borderRadius="8px"
                  onClick={limparFiltros}
                  _hover={{
                    bg: "#F7EEEE",
                    borderColor: PRIMARY,
                  }}
                >
                  <Icon
                    as={FiTrash2}
                    mr={1}
                    boxSize={3}
                  />

                  Limpar
                </Button>
              </Grid>
            </Card.Body>
          </Card.Root>

          {/* LIVROS */}

          <Card.Root
            bg={WHITE}
            border="1px solid"
            borderColor={BORDER}
            borderRadius="7px"
          >
            <Card.Body p={5}>
              <Grid
                templateColumns={{
                  base:
                    "repeat(2, 1fr)",
                  sm:
                    "repeat(3, 1fr)",
                  md:
                    "repeat(4, 1fr)",
                  lg:
                    "repeat(5, 1fr)",
                }}
                gap={3}
              >
                {livrosFiltrados.map(
                  (livro) => (
                    <LivroCard
                      key={livro.id}
                      livro={livro}
                      onEditar={
                        editarLivro
                      }
                      onExcluir={
                        excluirLivro
                      }
                      onInformacoes={
                        setLivroInformacoes
                      }
                    />
                  )
                )}
              </Grid>

              {livrosFiltrados.length ===
                0 && (
                <Stack
                  align="center"
                  py={12}
                  gap={2}
                >
                  <Icon
                    as={FiBook}
                    boxSize={8}
                    color="#B5AAA2"
                  />

                  <Text
                    fontSize="13px"
                    fontWeight="600"
                    color={TEXT}
                  >
                    Nenhum livro encontrado
                  </Text>

                  <Text
                    fontSize="10px"
                    color={TEXT_LIGHT}
                  >
                    Tente alterar os filtros.
                  </Text>
                </Stack>
              )}
            </Card.Body>

            {/* PAGINAÇÃO */}

            <Box
              borderTop="1px solid"
              borderColor={BORDER}
              px={4}
              py={3}
            >
              <Flex
                justify="space-between"
                align="center"
              >
                <Text
                  fontSize="11px"
                  color={TEXT_LIGHT}
                >
                  Mostrando{" "}
                  {livrosFiltrados.length} de{" "}
                  {livros.length} livros
                </Text>

                <HStack gap={1}>
                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    <Icon
                      as={FiChevronLeft}
                    />
                  </Button>

                  <Button
                    size="xs"
                    bg={PRIMARY}
                    color={WHITE}
                    borderRadius="4px"
                  >
                    1
                  </Button>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    2
                  </Button>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    3
                  </Button>

                  <Text
                    px={1}
                    fontSize="12px"
                    color={TEXT_LIGHT}
                  >
                    ...
                  </Text>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    156
                  </Button>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    <Icon
                      as={FiChevronRight}
                    />
                  </Button>
                </HStack>
              </Flex>
            </Box>
          </Card.Root>
        </Stack>
      </Box>

      {/* MODAL ADICIONAR / EDITAR */}

      <ModalLivro
        key={livroEditando?.id ?? (modalLivro ? "novo" : "fechado")}
        aberto={modalLivro}
        livro={livroEditando}
        onFechar={() => {
          setModalLivro(false);
          setLivroEditando(null);
        }}
        onSalvar={salvarLivro}
      />

      {/* MODAL INFORMAÇÕES */}

      <ModalInformacoes
        livro={livroInformacoes}
        onFechar={() =>
          setLivroInformacoes(null)
        }
      />
    </Flex>
  );
}