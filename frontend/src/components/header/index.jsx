"use client";

import { Flex, Text, Box, Menu, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BsBellFill } from "react-icons/bs";
import { FiUser, FiLogOut } from "react-icons/fi";

const EASE = [0.16, 1, 0.3, 1];
const ACCENT = "#7A3131";
const ACCENT_SOFT = "rgba(122, 49, 49, 0.20)";
const BORDER = "#EFEBE3";

const menuItems = [{ value: "perfil", label: "Meu Perfil", icon: FiUser }];

const underlineVariants = {
 rest: { scaleX: 0, opacity: 0 },
 hover: { scaleX: 1, opacity: 1 },
};

const itemVariants = {
 hidden: { opacity: 0, y: -6 },
 visible: { opacity: 1, y: 0 },
};

export default function Header({ userName = "usuario", hasUnread = true }) {
 const [isOpen, setIsOpen] = useState(false);
 const [tollTrigger, setTollTrigger] = useState(false);
 const [hoveredItem, setHoveredItem] = useState(null); // ← corrigido
 const shouldReduceMotion = useReducedMotion();

 useEffect(() => {
  if (shouldReduceMotion || !hasUnread) return;
  const t1 = setTimeout(() => setTollTrigger(true), 700);
  const t2 = setTimeout(() => setTollTrigger(false), 700 + 900);
  return () => {
   clearTimeout(t1);
   clearTimeout(t2);
  };
 }, [hasUnread, shouldReduceMotion]);

 const initial = userName?.trim()?.[0]?.toUpperCase() || "?";

 return (
  <>
   <style>{`
        .lh-focusable:focus-visible {
          outline: 2px solid ${ACCENT};
          outline-offset: 2px;
          border-radius: 8px;
        }
      `}</style>

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
      <Text
       fontSize="1.15rem"
       fontWeight="medium"
       letterSpacing="tight"
       fontFamily="Georgia, 'Source Serif Pro', ui-serif, serif"
       color="black"
      >
       Lector
       <Text as="span" color={ACCENT}>
        Hub
       </Text>
      </Text>
     </Flex>

     {/* Centro – minha biblioteca */}
     <Box position="relative" color="black">
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
        minha biblioteca
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
     </Box>

     {/* Direita – ações */}
     <Flex align="center" gap="1.5rem">
      {/* Sino */}
      <motion.button
       type="button"
       className="lh-focusable"
       aria-label={hasUnread ? "Notificações não lidas" : "Notificações"}
       animate={
        tollTrigger ? { rotate: [0, -14, 11, -8, 5, -2, 0] } : { rotate: 0 }
       }
       transition={{ duration: 0.9, ease: "easeInOut" }}
       style={{
        position: "relative",
        background: "transparent",
        border: "none",
        padding: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: "none",
       }}
      >
       <Box
        as="span"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxSize="22px"
       >
        <BsBellFill
         style={{
          width: "100%",
          height: "100%",
          fill: "gray.900",
          stroke: ACCENT,
          strokeWidth: "1",
         }}
        />
       </Box>

       {hasUnread && (
        <Box position="absolute" top="-2px" right="-2px" w="10px" h="10px">
         <motion.span
          aria-hidden
          animate={
           shouldReduceMotion
            ? undefined
            : { scale: [1, 1.35, 1], opacity: [0.85, 0.25, 0.85] }
          }
          transition={
           shouldReduceMotion
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
           position: "absolute",
           inset: "-4px",
           borderRadius: "9999px",
           background: ACCENT_SOFT,
           filter: "blur(1.5px)",
          }}
         />
         <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={ACCENT}
          borderRadius="full"
          border="2px solid white"
         />
        </Box>
       )}
      </motion.button>

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
           noOfLines={1}
          >
           olá, {userName}!
          </Text>
          <Text color="gray.600" fontSize="0.75rem">
           bem-vinda de volta.
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
          borderRadius="2xl"
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
              noOfLines={1}
             >
              olá, {userName}!
             </Text>
             <Text color="gray.600" fontSize="0.75rem" noOfLines={1}>
              bem-vinda de volta.
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

          {/* Itens do menu */}
          {menuItems.map((item, i) => {
           const ItemIcon = item.icon;
           const isHovered = hoveredItem === item.value;
           return (
            <Menu.Item
             key={item.value}
             value={item.value}
             p={0}
             _hover={{ bg: "transparent", color: "inherit" }}
             _focusVisible={{
              boxShadow: `inset 0 0 0 2px ${ACCENT}`,
             }}
             onMouseEnter={() => setHoveredItem(item.value)}
             onMouseLeave={() => setHoveredItem(null)}
            >
             <motion.div
              initial="hidden"
              animate={isOpen ? "visible" : "hidden"}
              variants={itemVariants}
              transition={{
               duration: 0.2,
               ease: EASE,
               delay: (i + 1) * 0.04,
              }}
              style={{
               display: "flex",
               alignItems: "center",
               gap: "0.7rem",
               fontSize: "0.9rem",
               color: isHovered ? ACCENT : "black",
               padding: "0.6rem 0.75rem",
               borderRadius: "10px",
               width: "100%",
               position: "relative",
               cursor: "pointer",
               background: isHovered ? "rgba(122,49,49,0.05)" : "transparent",
               transition: "background 0.2s ease, color 0.2s ease",
              }}
             >
              <ItemIcon
               size={16}
               style={{
                flexShrink: 0,
                transition: "color 0.2s ease",
                color: isHovered ? ACCENT : "currentColor",
               }}
              />
              <span>{item.label}</span>
             </motion.div>
            </Menu.Item>
           );
          })}

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
           _hover={{ bg: "transparent", color: "inherit" }}
           _focusVisible={{
            boxShadow: `inset 0 0 0 2px ${ACCENT}`,
           }}
           onMouseEnter={() => setHoveredItem("sair")}
           onMouseLeave={() => setHoveredItem(null)}
          >
           <motion.div
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            variants={itemVariants}
            transition={{
             duration: 0.2,
             ease: EASE,
             delay: (menuItems.length + 1) * 0.04,
            }}
            style={{
             display: "flex",
             alignItems: "center",
             gap: "0.7rem",
             fontSize: "0.9rem",
             color: hoveredItem === "sair" ? ACCENT : ACCENT,
             fontWeight: 500,
             padding: "0.6rem 0.75rem",
             borderRadius: "10px",
             width: "100%",
             position: "relative",
             cursor: "pointer",
             background:
              hoveredItem === "sair" ? "rgba(122,49,49,0.06)" : "transparent",
             transition: "background 0.2s ease",
            }}
           >
            <FiLogOut size={16} style={{ flexShrink: 0 }} />
            <span>Sair</span>
           </motion.div>
          </Menu.Item>
         </Menu.Content>
        </Menu.Positioner>
       </Portal>
      </Menu.Root>
     </Flex>
    </Flex>
   </header>
  </>
 );
}
