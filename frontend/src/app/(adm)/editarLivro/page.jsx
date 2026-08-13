"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import {
  FiBookOpen,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";


// =====================================================
// CORES
// =====================================================

const PRIMARY = "#4A0E17";
const PRIMARY_DARK = "#350A10";

const MODAL_BG = "#FFF9F0";
const CONTENT_BG = "#FFFAF3";
const INPUT_BG = "#FFFCF7";

const BORDER = "#E4D2BE";

const TEXT_DARK = "#3D2928";
const TEXT_LIGHT = "#7C6D66";


// =====================================================
// CAMPO NORMAL
// =====================================================

function Campo({
  label,
  placeholder,
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
        placeholder={placeholder}
        h="34px"
        px="11px"
        bg={INPUT_BG}
        border="1px solid"
        borderColor={BORDER}
        borderRadius="6px"
        color={TEXT_DARK}
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
// SELECT FUNCIONAL - SOMENTE FRONTEND
// =====================================================

function SelectVisual({
  label,
  placeholder,
  options = [],
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

      <Box
        as="select"
        defaultValue=""
        h="34px"
        w="100%"
        px="11px"
        pr="32px"
        bg={INPUT_BG}
        border="1px solid"
        borderColor={BORDER}
        borderRadius="6px"
        color={TEXT_DARK}
        fontSize="10px"
        cursor="pointer"
        outline="none"

        _hover={{
          borderColor: "#CDB69B",
        }}

        _focus={{
          borderColor: PRIMARY,
          boxShadow: `0 0 0 1px ${PRIMARY}`,
        }}
      >

        <option
          value=""
          disabled
        >
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </Box>

    </Stack>
  );
}


// =====================================================
// PÁGINA
// =====================================================

export default function EditarLivro() {
  return (

    <Box
      position="fixed"
      inset={0}
      zIndex={9999}
      w="100vw"
      h="100vh"
      overflow="hidden"
      fontFamily="Arial, sans-serif"

      // =================================================
      // IMAGEM DO CATÁLOGO COMO FUNDO
      // =================================================

      bgImage="url('/catalogo-fundo.png')"
      bgSize="cover"
      bgPosition="center center"
      bgRepeat="no-repeat"
    >

      {/* =================================================
          ESCURECIMENTO DA IMAGEM
      ================================================= */}

      <Box
        position="absolute"
        inset={0}
        bg="rgba(27, 23, 22, 0.61)"
        backdropFilter="blur(0.5px)"
      />


      {/* =================================================
          ÁREA DO MODAL
          CENTRALIZADA
      ================================================= */}

      <Flex
        position="absolute"
        inset={0}
        align="center"
        justify="center"
        px="12px"
        py="18px"
        overflowY="auto"
      >

        {/* =================================================
            CAIXA PRINCIPAL
        ================================================= */}

        <Box
          w="650px"
          maxW="94vw"
          bg={MODAL_BG}
          borderRadius="13px"
          overflow="hidden"
          border="1px solid rgba(74,14,23,.14)"
          boxShadow="
            0 22px 60px rgba(0,0,0,.34),
            0 4px 15px rgba(0,0,0,.12)
          "
          flexShrink={0}
        >

          {/* =================================================
              CABEÇALHO
          ================================================= */}

          <Box
            position="relative"
            textAlign="center"
            bg="#FFFAF4"
            pt="13px"
            pb="9px"
            px="40px"
          >

            {/* X */}

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
            >

              <Icon
                as={FiX}
                boxSize="19px"
              />

            </Button>


            {/* TÍTULO */}

            <Heading
              fontFamily="Georgia, serif"
              fontSize="24px"
              fontWeight="normal"
              color={PRIMARY}
              lineHeight="1.1"
            >
              Editar Livro
            </Heading>


            {/* SUBTÍTULO */}

            <Text
              mt="3px"
              fontSize="9px"
              color={TEXT_LIGHT}
            >
              Atualize as informações do livro selecionado.
            </Text>

          </Box>


          {/* =================================================
              FAIXA VINHO
          ================================================= */}

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

            {/* =================================================
                DECORAÇÃO ESQUERDA
            ================================================= */}

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


            {/* =================================================
                LIVRO CENTRAL
            ================================================= */}

            <Icon
              as={FiBookOpen}
              boxSize="47px"
              color="#DDBB75"
              strokeWidth="1"
            />


            {/* =================================================
                DECORAÇÃO DIREITA
            ================================================= */}

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


          {/* =================================================
              FORMULÁRIO
          ================================================= */}

          <Box
            mx="15px"
            mb="14px"
            px="20px"
            pt="13px"
            pb="12px"
            bg={CONTENT_BG}
            border="1px solid"
            borderTop="none"
            borderColor="#E8D7C5"
            borderRadius="0 0 8px 8px"
          >

            {/* =================================================
                LINHA 1
            ================================================= */}

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
            >

              <Campo
                label="Título do livro"
                placeholder="Digite o título do livro"
              />

              <Campo
                label="Autor"
                placeholder="Digite o nome do autor"
              />

            </Grid>


            {/* =================================================
                LINHA 2
            ================================================= */}

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
              mt="9px"
            >

              {/* CATEGORIA FUNCIONAL */}

              <SelectVisual
                label="Categoria"
                placeholder="Selecione a categoria"

                options={[
                  {
                    value: "romance",
                    label: "Romance",
                  },
                  {
                    value: "fantasia",
                    label: "Fantasia",
                  },
                  {
                    value: "ficcao",
                    label: "Ficção",
                  },
                  {
                    value: "misterio",
                    label: "Mistério",
                  },
                  {
                    value: "terror",
                    label: "Terror",
                  },
                  {
                    value: "aventura",
                    label: "Aventura",
                  },
                  {
                    value: "drama",
                    label: "Drama",
                  },
                  {
                    value: "classico",
                    label: "Clássico",
                  },
                  {
                    value: "biografia",
                    label: "Biografia",
                  },
                  {
                    value: "historia",
                    label: "História",
                  },
                  {
                    value: "distopia",
                    label: "Distopia",
                  },
                  {
                    value: "infantil",
                    label: "Infantil",
                  },
                ]}
              />


              <Campo
                label="ISBN"
                placeholder="Ex.: 978-65-123456-7-8"
              />

            </Grid>


            {/* =================================================
                LINHA 3
            ================================================= */}

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
              mt="9px"
            >

              <Campo
                label="Editora"
                placeholder="Digite o nome da editora"
              />

              <Campo
                label="Ano de publicação"
                placeholder="Ex.: 2024"
              />

            </Grid>


            {/* =================================================
                LINHA 4
            ================================================= */}

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
              mt="9px"
            >

              <Campo
                label="Quantidade de exemplares"
                placeholder="Ex.: 3"
              />

              <Campo
                label="Localização / prateleira"
                placeholder="Ex.: Estante A - Prateleira 2"
              />

            </Grid>


            {/* =================================================
                LINHA 5
            ================================================= */}

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
              }}
              gap="16px"
              mt="9px"
            >

              {/* IDIOMA FUNCIONAL */}

              <SelectVisual
                label="Idioma"
                placeholder="Selecione o idioma"

                options={[
                  {
                    value: "portugues",
                    label: "Português",
                  },
                  {
                    value: "ingles",
                    label: "Inglês",
                  },
                  {
                    value: "espanhol",
                    label: "Espanhol",
                  },
                  {
                    value: "frances",
                    label: "Francês",
                  },
                  {
                    value: "italiano",
                    label: "Italiano",
                  },
                  {
                    value: "alemao",
                    label: "Alemão",
                  },
                ]}
              />


              <Campo
                label="Número de páginas"
                placeholder="Ex.: 256"
              />

            </Grid>


            {/* =================================================
                SINOPSE
            ================================================= */}

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
                  h="55px"
                  minH="55px"
                  resize="none"
                  bg={INPUT_BG}
                  border="1px solid"
                  borderColor={BORDER}
                  borderRadius="6px"
                  px="11px"
                  pt="8px"
                  pb="16px"
                  fontSize="9px"
                  color={TEXT_DARK}
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
                  color={TEXT_LIGHT}
                >
                  0/1000
                </Text>

              </Box>

            </Stack>


            {/* =================================================
                UPLOAD + DISPONIBILIDADE
            ================================================= */}

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1.1fr 1fr",
              }}
              gap="19px"
              mt="9px"
            >

              {/* =================================================
                  UPLOAD
              ================================================= */}

              <Stack gap="4px">

                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color={PRIMARY}
                >
                  Upload da capa do livro
                </Text>


                <Flex
                  h="72px"
                  border="1px dashed #C5A381"
                  borderRadius="6px"
                  bg="#FDF8F0"
                  align="center"
                  justify="center"
                  direction="column"
                  textAlign="center"
                  cursor="pointer"

                  _hover={{
                    borderColor: PRIMARY,
                    bg: "#FAF1E7",
                  }}
                >

                  <Icon
                    as={FiUploadCloud}
                    boxSize="27px"
                    color={PRIMARY}
                    mb="1px"
                  />


                  <Text
                    fontSize="8px"
                    lineHeight="1.25"
                    color={TEXT_DARK}
                  >
                    Arraste e solte a imagem aqui
                    <br />
                    ou clique para selecionar
                  </Text>


                  <Text
                    mt="2px"
                    fontSize="6px"
                    color={TEXT_LIGHT}
                  >
                    JPG, PNG - Tamanho máx. 5MB
                  </Text>

                </Flex>

              </Stack>


              {/* =================================================
                  DISPONIBILIDADE
              ================================================= */}

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

                  {/* SWITCH SOMENTE VISUAL */}

                  <Flex
                    w="40px"
                    h="21px"
                    bg={PRIMARY}
                    borderRadius="full"
                    align="center"
                    justify="flex-end"
                    p="2px"
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
                    color={TEXT_DARK}
                  >
                    Disponível
                  </Text>

                </HStack>


                <Text
                  fontSize="7px"
                  lineHeight="1.4"
                  color={TEXT_LIGHT}
                >
                  Quando ativado, o livro ficará disponível
                  <br />
                  para empréstimo após salvo.
                </Text>

              </Stack>

            </Grid>


            {/* =================================================
                BOTÕES
            ================================================= */}

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1.03fr",
              }}
              gap="10px"
              mt="10px"
            >

              {/* CANCELAR */}

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
              >
                Cancelar
              </Button>


              {/* SALVAR */}

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
                  bg: PRIMARY_DARK,
                }}
              >
                Salvar Alterações
              </Button>

            </Grid>

          </Box>

        </Box>

      </Flex>

    </Box>
  );
}