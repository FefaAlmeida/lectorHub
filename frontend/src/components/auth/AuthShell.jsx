"use client";

import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { RAIO } from "@/components/tema";

// Moldura das telas de autenticação (login, cadastro, redefinir senha).
//
// Existe porque as três eram cópias com números diferentes em cada dimensão:
// altura do cartão 650px numa e 700px na outra, painel do logo 300px x 280px,
// padding "70px" x "40px 60px", título 42px x 38px. O resultado era cada tela
// com um tamanho, e nenhuma se adaptando à altura da janela.
//
// Regras aqui:
// - Altura é `minH`, nunca `h`: notebook de 768px não corta, monitor alto não
//   deixa o cartão boiando com altura fixa.
// - O logo tem teto em px; com `width: 100%` dentro de uma coluna de 50% ele
//   crescia até ~575px e era cortado pelo `overflow: hidden`.
// - Três degraus (base / md / xl) em vez de um salto só em `lg`: entre 992px e
//   1150px as duas colunas ficavam espremidas.

export const AUTH_BG = "#F8F5F0";
export const AUTH_VINHO = "#4A0E17";

// Fundo decorativo — restaurado exatamente como estava nas telas originais
// (gradiente, manchas borradas, textura de pontos e as linhas de circuito).
// A responsividade foi resolvida no cartão, não aqui: este bloco é só pintura,
// fica atrás de tudo e é recortado pelo `overflow: hidden` do wrapper.
function FundoDecorativo() {
  return (
  <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        w="100%"
        h="100%"
        pointerEvents="none"
        zIndex={0}
        overflow="hidden"
        bg="radial-gradient(circle at 50% 50%, #FAF8F5 0%, #F0EAE1 60%, #E6DCD0 100%)"
      >
        {/* Padrão Sutil de Pontos para Textura */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.35}
          backgroundImage="radial-gradient(#A39382 0.8px, transparent 0.8px)"
          backgroundSize="24px 24px"
        />

        {/* Holofote Suave Aatrás do Card */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w={{ base: "700px", md: "1100px" }}
          h={{ base: "700px", md: "1100px" }}
          borderRadius="full"
          bg="radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(232, 220, 196, 0.3) 45%, rgba(248, 245, 240, 0) 70%)"
          filter="blur(50px)"
        />

        {/* Glow Suave - Canto Superior Esquerdo */}
        <Box
          position="absolute"
          top="-15%"
          left="-10%"
          w="650px"
          h="650px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(74, 14, 23, 0.06) 0%, rgba(248, 245, 240, 0) 70%)"
          filter="blur(80px)"
        />

        {/* Glow Suave - Canto Inferior Direito */}
        <Box
          position="absolute"
          bottom="-15%"
          right="-10%"
          w="700px"
          h="700px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(74, 14, 23, 0.07) 0%, rgba(248, 245, 240, 0) 70%)"
          filter="blur(80px)"
        />

        {/* Linhas de Circuito Finas em Tom Champanhe/Taupe */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.45 }}
        >
          <path d="M -50 150 L 300 150 L 420 270 L 650 270" stroke="#8C7A6B" strokeWidth="1.2" />
          <circle cx="650" cy="270" r="4" fill="#4A0E17" />
          <circle cx="650" cy="270" r="8" stroke="#8C7A6B" strokeWidth="1" />

          <path d="M 150 -50 L 150 200 L 280 330 L 280 500" stroke="#8C7A6B" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="280" cy="500" r="3" fill="#8C7A6B" />

          <path d="M 1970 150 L 1620 150 L 1500 270 L 1270 270" stroke="#8C7A6B" strokeWidth="1.2" />
          <circle cx="1270" cy="270" r="4" fill="#4A0E17" />
          <circle cx="1270" cy="270" r="8" stroke="#8C7A6B" strokeWidth="1" />

          <path d="M 1770 -50 L 1770 200 L 1640 330 L 1640 500" stroke="#8C7A6B" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="1640" cy="500" r="3" fill="#8C7A6B" />

          <path d="M -50 930 L 300 930 L 450 780 L 680 780" stroke="#8C7A6B" strokeWidth="1.2" />
          <circle cx="680" cy="780" r="4" fill="#4A0E17" />
          <circle cx="680" cy="780" r="8" stroke="#8C7A6B" strokeWidth="1" />

          <path d="M 220 1130 L 220 880 L 350 750 L 350 600" stroke="#8C7A6B" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="350" cy="600" r="3" fill="#8C7A6B" />

          <path d="M 1970 930 L 1620 930 L 1470 780 L 1240 780" stroke="#8C7A6B" strokeWidth="1.2" />
          <circle cx="1240" cy="780" r="4" fill="#4A0E17" />
          <circle cx="1240" cy="780" r="8" stroke="#8C7A6B" strokeWidth="1" />

          <path d="M 1700 1130 L 1700 880 L 1570 750 L 1570 600" stroke="#8C7A6B" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="1570" cy="600" r="3" fill="#8C7A6B" />

          <path d="M 960 -50 L 960 180" stroke="#8C7A6B" strokeWidth="1.2" />
          <circle cx="960" cy="180" r="4" fill="#4A0E17" />

          <path d="M 960 1130 L 960 900" stroke="#8C7A6B" strokeWidth="1.2" />
          <circle cx="960" cy="900" r="4" fill="#4A0E17" />

          <circle cx="420" cy="270" r="2.5" fill="#8C7A6B" />
          <circle cx="1500" cy="270" r="2.5" fill="#8C7A6B" />
          <circle cx="450" cy="780" r="2.5" fill="#8C7A6B" />
          <circle cx="1470" cy="780" r="2.5" fill="#8C7A6B" />
        </svg>
      </Box>
  );
}

export default function AuthShell({ largura = "1150px", children }) {
  return (
    <Flex
      as="main"
      w="100%"
      minH="100vh"
      position="relative"
      justify="center"
      p={{ base: 4, md: 6, lg: 8 }}
      bg={AUTH_BG}
    >
      <FundoDecorativo />

      <Flex
        w="100%"
        maxW={largura}
        // Era `h` fixo (650px no login, 700px no cadastro): em notebook de
        // 768px o conteúdo não cabia e em monitor alto o cartão boiava.
        // `minH` mantém a mesma presença e deixa crescer quando precisa.
        // `m="auto"` no lugar de align="center" no pai: quando o conteúdo
        // passa da altura da janela, o centralizado por flex corta o topo e
        // não deixa rolar até ele. Com margem automática, centraliza quando
        // cabe e rola normalmente quando não cabe.
        m="auto"
        // O piso de 650px só existe em tela alta. Regra única (min-height em
        // vez de duas competindo) para não depender de ordem de precedência
        // entre o style prop responsivo e a media query.
        minH="auto"
        css={{ "@media (min-height: 1001px)": { minHeight: "650px" } }}
        bg="#FFFFFF"
        borderRadius={RAIO}
        overflow="hidden"
        direction={{ base: "column", lg: "row" }}
        boxShadow="0 25px 60px -15px rgba(74, 14, 23, 0.12), 0 10px 30px -10px rgba(0, 0, 0, 0.05)"
        border="1px solid rgba(255, 255, 255, 0.8)"
        position="relative"
        zIndex={1}
      >
        <Flex
          w={{ base: "100%", lg: "50%" }}
          bg={AUTH_VINHO}
          justify="center"
          align="center"
          minH={{ base: "200px", lg: "auto" }}
          p={{ base: 6, lg: 8 }}
          overflow="hidden"
          flexShrink={0}
        >
          {/* Teto de largura: com `width: 100%` numa coluna de 50% de 1150px
              o logo passava de 500px e era cortado pelo overflow. */}
          <Box
            w="100%"
            maxW={{ base: "180px", lg: "300px" }}
            css={{ "@media (max-height: 1000px)": { maxWidth: "220px" } }}
          >
            <Image
              src="/logoLectorHub.png"
              alt="Lector Hub"
              width={350}
              height={350}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Box>
        </Flex>

        <Flex
          w={{ base: "100%", lg: "50%" }}
          direction="column"
          justify="center"
          align="center"
          p={{ base: "32px 24px", md: "40px 40px", lg: "56px" }}
          bg="#FFFFFF"
          // Vale para quase todo monitor: 1080p com barras do navegador dá
          // ~950px de altura útil. Só tela alta mantém o respiro maior.
          // comprime o respiro e o título em vez de estourar a tela.
          css={{
            "@media (max-height: 1000px)": {
              padding: "32px 40px",
              "& h2": { fontSize: "30px" },
              "& form > *": { marginBottom: "14px" },
            },
          }}
        >
          <Box w="100%" maxW="420px">
            {children}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
