"use client";

import {
    Box,
    Flex,
    Text,
    Icon,
    VStack,
} from "@chakra-ui/react";

import {
    FiGrid,
    FiBook,
    FiFolder,
    FiUsers,
    FiRefreshCw,
    FiCornerDownLeft,
    FiBookmark,
    FiBarChart2,
    FiSettings,
    FiLogOut,
} from "react-icons/fi";

import { logoutUsuario } from "../../api";

import {
    usePathname,
    useRouter,
} from "next/navigation";

const VINHO = "#4A0E17";
const VINHO_ATIVO = "#69333C";
const TEXTO = "#F8EEE8";

const NAV_ITEMS = [
    {
        label: "Dashboard",
        icon: FiGrid,
        href: "/inicioAdm",
    },
    {
        label: "Livros",
        icon: FiBook,
        href: "/catalogoDeLivros",
    },

    {
        label: "Usuários",
        icon: FiUsers,
        href: "/gestaoUsuarios",
    },
    {
        label: "Empréstimos",
        icon: FiRefreshCw,
        href: "/gestaoEeR",
    }
];

function ItemSidebar({ item, ativo, onClick }) {
    return (
        <Flex
            align="center"
            gap={4}
            px={4}
            py={3}
            borderRadius="10px"
            cursor="pointer"
            bg={ativo ? VINHO_ATIVO : "transparent"}
            color={TEXTO}
            fontWeight={ativo ? "600" : "400"}
            transition="all 0.2s ease"
            _hover={{
                bg: ativo ? VINHO_ATIVO : "rgba(255,255,255,0.08)",
            }}
            onClick={onClick}
        >
            <Icon
                as={item.icon}
                boxSize={5}
            />

            <Text fontSize="15px">
                {item.label}
            </Text>
        </Flex>
    );
}

export default function SideBarAdm() {
    const pathname = usePathname();
    const router = useRouter();

    function verificarAtivo(item) {
        if (item.label === "Livros") {
            return (
                pathname === "/catalogoDeLivros" ||
                pathname === "/cadastroDeLivros" ||
                pathname === "/editarLivro"
            );
        }

        if (item.label === "Empréstimos") {
            return pathname === "/gestaoEeR";
        }

        return pathname === item.href;
    }

    return (
        <Box
            w="280px"
            minH="calc(100vh - 72px)"
            bg={VINHO}
            color={TEXTO}
            px={6}
            py={8}
            flexShrink={0}
        >

            {/* LOGO */}
            {/* LOGO */}
            <VStack
                spacing={4}
                mb={7}
            >
                <Box
                    w="240px"
                    h="240px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box
                        as="img"
                        src="/logoLectorHub.png"
                        alt="Logo Lector Hub"
                        w="210px"
                        h="210px"
                        objectFit="contain"
                    />
                </Box>

               
            </VStack>

            {/* LINHA */}
            <Box
                h="px"
                bg="rgba(255,255,255,0.18)"
                mb={6}
            />

            {/* MENU */}
            <VStack
                align="stretch"
                spacing={2}
            >
                {NAV_ITEMS.map((item) => (
                    <ItemSidebar
                        key={item.label}
                        item={item}
                        ativo={verificarAtivo(item)}
                        onClick={() => router.push(item.href)}
                    />
                ))}
            </VStack>

            {/* LINHA */}
            <Box
                h="px"
                bg="rgba(255,255,255,0.18)"
                my={6}
            />

            {/* SAIR */}
            <ItemSidebar
                item={{ label: "Sair", icon: FiLogOut }}
                ativo={false}
                onClick={async () => {
                    try {
                        await logoutUsuario();
                    } finally {
                        router.push("/login");
                    }
                }}
            />

        </Box>
    );
}