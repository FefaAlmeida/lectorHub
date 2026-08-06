"use client";

import { Flex, Image, Text, Box, Menu, Portal } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
 motion,
 useReducedMotion,
 useScroll,
 useTransform,
} from "framer-motion";
import { BsBellFill } from "react-icons/bs";
import { FiUser, FiSettings, FiBookOpen, FiLogOut } from "react-icons/fi";

const EASE = [0.16, 1, 0.3, 1];

const ACCENT = "#E2543F"; // vermelho-terracota (mais quente que red.500 puro)
const ACCENT_SOFT = "rgba(226, 84, 63, 0.45)";
const PAPER = "#F6F3ED"; // branco quente, tom "papel"
const AMBER = "#F2A65A"; // segundo acento quente, usado nos aneis de avatar
const MUTED = "#B0A99F";

const menuItems = [
 { value: "perfil", label: "Meu Perfil", icon: FiUser },
 { value: "config", label: "Configurações", icon: FiSettings },
 { value: "leituras", label: "Minhas Leituras", icon: FiBookOpen },
];

const logoGroupVariants = { rest: {}, hover: {} };
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
 const shouldReduceMotion = useReducedMotion();

 const { scrollY } = useScroll();
 const headerBg = useTransform(
  scrollY,
  [0, 80],
  ["rgba(10, 10, 11, 0.7)", "rgba(10, 10, 11, 0.94)"],
 );
 const headerBorder = useTransform(
  scrollY,
  [0, 80],
  ["rgba(255, 255, 255, 0.06)", "rgba(255, 255, 255, 0.14)"],
 );
 const blurPx = useTransform(scrollY, [0, 80], [6, 16]);
 const headerBackdrop = useTransform(blurPx, (v) => `blur(${v}px)`);

 // Toca o sino uma vez ao montar, se houver notificação não lida
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

   <motion.header
    style={{
     position: "sticky",
     top: 0,
     zIndex: 100,
     backgroundColor: headerBg,
     backdropFilter: headerBackdrop,
     WebkitBackdropFilter: headerBackdrop,
     borderBottomWidth: "1px",
     borderBottomStyle: "solid",
     borderBottomColor: headerBorder,
    }}
   >
    <Flex
     justify="space-between"
     align="center"
     py="1rem"
     px={{ base: "1.5rem", md: "2.5rem" }}
     fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    >
     {/* Lado Esquerdo - Logo */}
     <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
      style={{ display: "inline-flex" }}
     >
      <motion.div
       initial="rest"
       animate="rest"
       whileHover="hover"
       variants={logoGroupVariants}
       style={{ display: "inline-flex", cursor: "pointer" }}
      >
       <Flex align="center" gap="0.75rem" userSelect="none">
        <Image src="/logo.png" alt="logo lectorhub" h="24px" />
        <Box position="relative">
         <Text
          as="span"
          color={PAPER}
          fontSize="1.15rem"
          letterSpacing="tight"
          fontFamily="Georgia, 'Iowan Old Style', 'Times New Roman', serif"
         >
          minha{" "}
          <Text as="em" fontStyle="italic" color={PAPER}>
           biblioteca
          </Text>
         </Text>
         <motion.div
          variants={underlineVariants}
          transition={{ duration: 0.3, ease: EASE }}
          style={{
           position: "absolute",
           left: 0,
           right: 0,
           bottom: "-4px",
           height: "1px",
           background: ACCENT,
           transformOrigin: "left",
          }}
         />
        </Box>
       </Flex>
      </motion.div>
     </motion.div>

     {/* Lado Direito - Ações e Perfil */}
     <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
      style={{ display: "inline-flex" }}
     >
      <Flex align="center" gap="1.5rem">
       {/* Notificações */}
       <motion.button
        type="button"
        className="lh-focusable"
        aria-label={
         hasUnread ? "Você tem notificações não lidas" : "Notificações"
        }
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
           fill: PAPER,
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
           border="2px solid black"
          />
         </Box>
        )}
       </motion.button>

       {/* Menu de Perfil */}
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
            color={PAPER}
            fontWeight="medium"
            fontSize="0.85rem"
            lineHeight="1.2"
            transition="color 0.2s"
            _groupHover={{ color: "gray.300" }}
            noOfLines={1}
           >
            olá, {userName}!
           </Text>
           <Text as="span" color="gray.400" fontSize="0.75rem">
            bem-vinda de volta.
           </Text>
          </Flex>

          <Flex
           w="38px"
           h="38px"
           borderRadius="full"
           align="center"
           justify="center"
           color={PAPER}
           fontWeight="medium"
           fontSize="0.9rem"
           bg="whiteAlpha.200"
           border="1.5px solid"
           borderColor="whiteAlpha.300"
           transition="all 0.2s"
           _groupHover={{ bg: "whiteAlpha.300", borderColor: ACCENT }}
          >
           {initial}
          </Flex>
         </motion.button>
        </Menu.Trigger>

        <Portal>
         <Menu.Positioner>
          <Menu.Content
           position="relative"
           minW="270px"
           boxShadow="0 24px 60px -14px rgba(0,0,0,0.55), 0 6px 16px rgba(0,0,0,0.25)"
           border="1px solid"
           borderColor="whiteAlpha.200"
           borderRadius="2xl"
           bg="rgba(21, 19, 24, 0.94)"
           backdropFilter="blur(16px)"
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
            background:
             "linear-gradient(90deg, transparent, whiteAlpha.400, transparent)",
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
           {/* Cartão de perfil */}
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
              bg="whiteAlpha.200"
              border="1.5px solid"
              borderColor={ACCENT}
              color={PAPER}
              fontWeight="medium"
              fontSize="1rem"
             >
              {initial}
             </Flex>
             <Box overflow="hidden">
              <Text
               color={PAPER}
               fontWeight="medium"
               fontSize="0.9rem"
               lineHeight="1.2"
               noOfLines={1}
              >
               olá, {userName}!
              </Text>
              <Text color="gray.400" fontSize="0.75rem" noOfLines={1}>
               bem-vinda de volta.
              </Text>
             </Box>
            </Flex>
           </motion.div>

           <Menu.Separator my="0.3rem" borderColor="whiteAlpha.200" />

           {menuItems.map((item, i) => {
            const ItemIcon = item.icon;
            return (
             <Menu.Item
              key={item.value}
              value={item.value}
              p={0}
              borderRadius="lg"
              overflow="hidden"
              outline="none"
              _focusVisible={{
               boxShadow: `inset 0 0 0 2px ${ACCENT}`,
              }}
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
               whileHover={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#fff",
                x: 2,
               }}
               whileTap={{ scale: 0.98 }}
               style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                fontSize: "0.9rem",
                color: MUTED,
                padding: "0.55rem 0.65rem",
               }}
              >
               <ItemIcon size={16} style={{ flexShrink: 0 }} />
               <span>{item.label}</span>
              </motion.div>
             </Menu.Item>
            );
           })}

           <Menu.Separator my="0.3rem" borderColor="whiteAlpha.200" />

           <Menu.Item
            value="sair"
            p={0}
            borderRadius="lg"
            overflow="hidden"
            outline="none"
            _focusVisible={{
             boxShadow: `inset 0 0 0 2px ${ACCENT}`,
            }}
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
             whileHover={{
              backgroundColor: "rgba(226,84,63,0.16)",
              color: "#FF9C8B",
              x: 2,
             }}
             whileTap={{ scale: 0.98 }}
             style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              fontSize: "0.9rem",
              color: ACCENT,
              fontWeight: 500,
              padding: "0.55rem 0.65rem",
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
     </motion.div>
    </Flex>
   </motion.header>
  </>
 );
}
