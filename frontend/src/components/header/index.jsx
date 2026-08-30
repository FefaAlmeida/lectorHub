"use client";

import { Flex, Text, Box, Button, Menu, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ehRotaAdmin } from "@/components/rotas";

import { getPerfil, logoutUsuario } from "../../api";
import { toaster } from "@/components/ui/toaster";
import { RAIO } from "@/components/tema";

const EASE = [0.16, 1, 0.3, 1];
const ACCENT = "#4A0E17";
const ACCENT_SOFT = "rgba(122, 49, 49, 0.20)";
const BORDER = "#EFEBE3";

// Páginas de autenticação usam layout de tela cheia — sem header em cima.
const ROTAS_SEM_HEADER = ["/login", "/cadastrar", "/redefinir-senha"];

const underlineVariants = {
 rest: { scaleX: 0, opacity: 0 },
 hover: { scaleX: 1, opacity: 1 },
};

const itemVariants = {
 hidden: { opacity: 0, y: -6 },
 visible: { opacity: 1, y: 0 },
};

export default function Header() {
 const pathname = usePathname();

 const [isOpen, setIsOpen] = useState(false);
 const [hoveredItem, setHoveredItem] = useState(null);
 const [usuario, setUsuario] = useState(null);
 const [carregandoSessao, setCarregando] = useState(true);
 const [saindo, setSaindo] = useState(false);
 const shouldReduceMotion = useReducedMotion();

 // O painel tem a própria navegação na barra lateral. Este cabeçalho é da
 // área do cliente: o logo e "Minha Biblioteca" levam para /inicio, e o "Sair"
 // duplica o que já existe na sidebar do admin.
 const escondido = ROTAS_SEM_HEADER.includes(pathname) || ehRotaAdmin(pathname);
 const carregando = carregandoSessao && !escondido;

 // Descobre quem está logado a partir do cookie httpOnly.
 useEffect(() => {
  if (escondido) return;

  let ativo = true;

  async function carregarUsuario() {
   try {
    const response = await getPerfil();
    if (ativo) setUsuario(response?.sucesso ? response.dados : null);
   } catch {
    if (ativo) setUsuario(null);
   } finally {
    if (ativo) setCarregando(false);
   }
  }

  carregarUsuario();

  return () => {
   ativo = false;
  };
 }, [escondido, pathname]);

 const logado = Boolean(usuario);

 async function handleLogout() {
  setSaindo(true);

  try {
   await logoutUsuario();
  } catch (error) {
   console.error(error);
  }

  toaster.create({
   title: "Sessão encerrada",
   description: "Até logo!",
   type: "success",
  });

  window.location.href = "/login";
 }

 if (escondido) return null;

 const nome = usuario?.nome || "";
 const primeiroNome = nome.trim().split(" ")[0] || "";
 const initial = nome.trim()?.[0]?.toUpperCase() || "?";

 return (
  <>
   <header
    style={{
     position: "sticky",
     top: 0,
     zIndex: 100,
     backgroundColor: "#FAF9F6",
     borderBottom: "1px solid #EFEBE3",
     boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    }}
   >
    <Flex
     justify="space-between"
     align="center"
     py="0.9rem"
     px={{ base: "1.5rem", md: "2.5rem" }}
     fontFamily="'Inter', -apple-system, sans-serif"
    >
     {/* Esquerda – LectorHub */}
     <Flex align="center" gap="0.75rem" userSelect="none">
      <Link href={logado ? "/inicio" : "/"}>
       <Text
        fontSize="1.15rem"
        fontWeight="medium"
        letterSpacing="tight"
        fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
        color="black"
        cursor="pointer"
       >
        Lector
        <Text as="span" color={ACCENT}>
         Hub
        </Text>
       </Text>
      </Link>
     </Flex>

     {/* Centro – só faz sentido para quem está logado */}
     {logado && (
      <Box position="relative" color="black">
       <Link href="/inicio">
        <motion.div
         initial="rest"
         animate="rest"
         whileHover="hover"
         style={{ display: "inline-block", cursor: "pointer" }}
        >
         <Text
          as="span"
          fontSize="1.15rem"
          letterSpacing="tight"
          fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
          color="black"
         >
          Minha Biblioteca
         </Text>

         <motion.div
          variants={underlineVariants}
          transition={{ duration: 0.3, ease: EASE }}
          style={{
           position: "absolute",
           left: 0,
           right: 0,
           bottom: "-4px",
           height: "2px",
           background: ACCENT,
           transformOrigin: "left",
          }}
         />
        </motion.div>
       </Link>
      </Box>
     )}

     {/* Direita – ações */}
     <Flex align="center" gap="1.5rem" minH="38px">
      {/* Enquanto verifica a sessão, não mostra nada para evitar piscar */}
      {carregando ? null : !logado ? (
       <Flex align="center" gap="0.75rem">
        <Button
         variant="ghost"
         color="black"
         fontWeight="medium"
         fontSize="0.9rem"
         _hover={{ color: ACCENT, bg: "transparent" }}
         onClick={() => {
          window.location.href = "/login";
         }}
        >
         Entrar
        </Button>

        <Button
         bg={ACCENT}
         color="white"
         fontWeight="medium"
         fontSize="0.9rem"
         borderRadius={RAIO}
         px="1.1rem"
         _hover={{ bg: "#641320" }}
         _active={{ bg: "#4A0E17" }}
         onClick={() => {
          window.location.href = "/cadastrar";
         }}
        >
         Cadastrar
        </Button>
       </Flex>
      ) : (
       <>
        {/* Menu Perfil */}
        <Menu.Root
         open={isOpen}
         onOpenChange={(e) => setIsOpen(e.open)}
         positioning={{ placement: "bottom-end" }}
        >
         <Menu.Trigger asChild>
          <motion.button
           type="button"
           role="group"
           className="lh-focusable"
           style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
           }}
          >
           <Flex
            direction="column"
            align="flex-end"
            justify="center"
            display={{ base: "none", sm: "flex" }}
           >
            <Text
             color="black"
             fontWeight="medium"
             fontSize="0.85rem"
             lineHeight="1.2"
             transition="color 0.2s"
             _groupHover={{ color: ACCENT }}
             lineClamp={1}
            >
             olá, {primeiroNome}!
            </Text>
            <Text color="gray.600" fontSize="0.75rem">
             bem-vindo de volta.
            </Text>
           </Flex>

           {/* Avatar com animação ao abrir */}
           <motion.div
            animate={
             shouldReduceMotion
              ? undefined
              : isOpen
                ? { scale: 1.08, rotate: -3 }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.25, ease: EASE }}
           >
            <Flex
             w="38px"
             h="38px"
             borderRadius="full"
             align="center"
             justify="center"
             color="white"
             fontWeight="medium"
             fontSize="0.9rem"
             bg="black"
             border="1.5px solid"
             borderColor={ACCENT}
             transition="all 0.25s ease"
             _groupHover={{
              borderColor: ACCENT,
              boxShadow: `0 0 0 2px ${ACCENT_SOFT}`,
             }}
            >
             {initial}
            </Flex>
           </motion.div>
          </motion.button>
         </Menu.Trigger>

         <Portal>
          <Menu.Positioner>
           <Menu.Content
            position="relative"
            minW="260px"
            boxShadow="
                      0 24px 48px -16px rgba(122,49,49,0.18),
                      0 12px 24px -8px rgba(0,0,0,0.08),
                      0 0 0 1px rgba(0,0,0,0.03)
                    "
            border="1px solid"
            borderColor="rgba(122,49,49,0.12)"
            borderRadius={RAIO}
            bg="rgba(255,255,255,0.92)"
            backdropFilter="blur(16px)"
            zIndex={200}
            p="0.65rem"
            outline="none"
            overflow="hidden"
            _before={{
             content: '""',
             position: "absolute",
             top: 0,
             left: "15%",
             right: "15%",
             height: "1px",
             background: `linear-gradient(90deg, transparent, ${ACCENT_SOFT}, transparent)`,
            }}
           >
            {/* Cartão do perfil */}
            <motion.div
             initial="hidden"
             animate={isOpen ? "visible" : "hidden"}
             variants={itemVariants}
             transition={{ duration: 0.2, ease: EASE, delay: 0.02 }}
            >
             <Flex align="center" gap="0.85rem" px="0.6rem" py="0.7rem">
              <Flex
               flexShrink={0}
               w="44px"
               h="44px"
               borderRadius="full"
               align="center"
               justify="center"
               bg="black"
               border="1.5px solid"
               borderColor={ACCENT}
               color="white"
               fontWeight="medium"
               fontSize="1.05rem"
               boxShadow={`0 0 0 2px ${ACCENT_SOFT}`}
              >
               {initial}
              </Flex>
              <Box overflow="hidden">
               <Text
                color="black"
                fontWeight="medium"
                fontSize="0.9rem"
                lineHeight="1.2"
                lineClamp={1}
               >
                {nome}
               </Text>
               <Text color="gray.600" fontSize="0.75rem" lineClamp={1}>
                {usuario?.email}
               </Text>
              </Box>
             </Flex>
            </motion.div>

            {/* Separador estilizado */}
            <Box
             my="0.35rem"
             mx="0.5rem"
             height="1px"
             background={`linear-gradient(90deg, transparent, ${BORDER}, transparent)`}
            />

            {/* Sair */}
            <Menu.Item
             value="sair"
             p={0}
             disabled={saindo}
             _hover={{ bg: "transparent", color: "inherit" }}
             _focusVisible={{
              boxShadow: `inset 0 0 0 2px ${ACCENT}`,
             }}
             onMouseEnter={() => setHoveredItem("sair")}
             onMouseLeave={() => setHoveredItem(null)}
             onClick={handleLogout}
            >
             <motion.div
              initial="hidden"
              animate={isOpen ? "visible" : "hidden"}
              variants={itemVariants}
              transition={{ duration: 0.2, ease: EASE, delay: 0.06 }}
              style={{
               display: "flex",
               alignItems: "center",
               gap: "0.7rem",
               fontSize: "0.9rem",
               color: ACCENT,
               fontWeight: 500,
               padding: "0.6rem 0.75rem",
               borderRadius: RAIO,
               width: "100%",
               position: "relative",
               cursor: "pointer",
               background:
                hoveredItem === "sair" ? "rgba(122,49,49,0.06)" : "transparent",
               transition: "background 0.2s ease",
              }}
             >
              <FiLogOut size={16} style={{ flexShrink: 0 }} />
              <span>{saindo ? "Saindo..." : "Sair"}</span>
             </motion.div>
            </Menu.Item>
           </Menu.Content>
          </Menu.Positioner>
         </Portal>
        </Menu.Root>
       </>
      )}
     </Flex>
    </Flex>
   </header>
  </>
 );
}
