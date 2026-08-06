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

// Underline animado (igual ao do "minha biblioteca")
const underlineVariants = {
 rest: { scaleX: 0, opacity: 0 },
 hover: { scaleX: 1, opacity: 1 },
};

// Apenas para aparecer suavemente no dropdown
const itemVariants = {
 hidden: { opacity: 0, y: -6 },
 visible: { opacity: 1, y: 0 },
};

export default function Header({ userName = "usuario", hasUnread = true }) {
 const [isOpen, setIsOpen] = useState(false);
 const [tollTrigger, setTollTrigger] = useState(false);
 const shouldReduceMotion = useReducedMotion();

 // Estado de hover para os itens do menu (perfil e sair)
 const [hoveredItem, setHoveredItem] = useState(null);

 useEffect(() => {
  if (shouldReduceMotion || !hasUnread) return;
  const t1 = setTimeout(() => setTollTrigger(true), 700);
  const t2 = setTimeout(() => setTollTrigger(false), 700 + 900);
  return () => {
   clearTimeout(t1);
   clearTimeout(t2);
  };
 }, [hasUnread, shouldReduceMotion]);

 const handleBellHover = () => {
  if (shouldReduceMotion) return;
  setTollTrigger(true);
  setTimeout(() => setTollTrigger(false), 650);
 };

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

     {/* Centro – minha biblioteca (underline no hover) */}
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
       whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
       whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
       onHoverStart={handleBellHover}
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
         whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
         whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
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
        </motion.button>
       </Menu.Trigger>

       <Portal>
        <Menu.Positioner>
         <Menu.Content
          position="relative"
          minW="240px"
          boxShadow="0 24px 48px -24px rgba(122,49,49,0.25), 0 6px 16px rgba(0,0,0,0.06)"
          border="1px solid"
          borderColor={BORDER}
          borderRadius="xl"
          bg="white"
          backdropFilter="blur(4px)"
          zIndex={200}
          p="0.5rem"
          outline="none"
          overflow="hidden"
          _before={{
           content: '""',
           position: "absolute",
           top: 0,
           left: "10%",
           right: "10%",
           height: "1px",
           background: `linear-gradient(90deg, transparent, ${ACCENT_SOFT}, transparent)`,
          }}
          _open={{
           animationName: "fade-in, scale-in",
           animationDuration: "180ms",
          }}
          _closed={{
           animationName: "fade-out, scale-out",
           animationDuration: "120ms",
          }}
         >
          {/* Cartão do perfil */}
          <motion.div
           initial="hidden"
           animate={isOpen ? "visible" : "hidden"}
           variants={itemVariants}
           transition={{ duration: 0.18, ease: EASE, delay: 0 }}
          >
           <Flex align="center" gap="0.75rem" px="0.6rem" py="0.65rem">
            <Flex
             flexShrink={0}
             w="42px"
             h="42px"
             borderRadius="full"
             align="center"
             justify="center"
             bg="black"
             border="1.5px solid"
             borderColor={ACCENT}
             color="white"
             fontWeight="medium"
             fontSize="1rem"
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

          <Menu.Separator my="0.3rem" borderColor={BORDER} />

          {/* Meu Perfil – com hover controlado manualmente */}
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
               duration: 0.18,
               ease: EASE,
               delay: (i + 1) * 0.035,
              }}
              style={{
               display: "flex",
               alignItems: "center",
               gap: "0.65rem",
               fontSize: "0.9rem",
               color: "black",
               padding: "0.55rem 0.65rem",
               borderRadius: "8px",
               width: "100%",
               position: "relative",
               cursor: "pointer",
              }}
             >
              <ItemIcon size={16} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
              {/* Underline controlado pelo estado isHovered */}
              <motion.div
               initial={{ scaleX: 0, opacity: 0 }}
               animate={{
                scaleX: isHovered ? 1 : 0,
                opacity: isHovered ? 1 : 0,
               }}
               transition={{ duration: 0.3, ease: EASE }}
               style={{
                position: "absolute",
                left: "0.65rem",
                right: "0.65rem",
                bottom: "0",
                height: "2px",
                background: ACCENT,
                transformOrigin: "left",
               }}
              />
             </motion.div>
            </Menu.Item>
           );
          })}

          <Menu.Separator my="0.3rem" borderColor={BORDER} />

          {/* Sair – mesmo esquema */}
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
             duration: 0.18,
             ease: EASE,
             delay: (menuItems.length + 1) * 0.035,
            }}
            style={{
             display: "flex",
             alignItems: "center",
             gap: "0.65rem",
             fontSize: "0.9rem",
             color: ACCENT,
             fontWeight: 500,
             padding: "0.55rem 0.65rem",
             borderRadius: "8px",
             width: "100%",
             position: "relative",
             cursor: "pointer",
            }}
           >
            <FiLogOut size={16} style={{ flexShrink: 0 }} />
            <span>Sair</span>
            <motion.div
             initial={{ scaleX: 0, opacity: 0 }}
             animate={{
              scaleX: hoveredItem === "sair" ? 1 : 0,
              opacity: hoveredItem === "sair" ? 1 : 0,
             }}
             transition={{ duration: 0.3, ease: EASE }}
             style={{
              position: "absolute",
              left: "0.65rem",
              right: "0.65rem",
              bottom: "0",
              height: "2px",
              background: ACCENT,
              transformOrigin: "left",
             }}
            />
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
