"use client";

import { Box, Flex } from "@chakra-ui/react";

import NoiseOverlay from "@/components/ui/noise-overlay";

import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import Cta from "@/components/home/cta";

export default function Home() {
 return (
  <Box
   bg="#fafafa"
   color="#1a1a1a"
   minH="100vh"
   fontFamily="sans-serif"
   position="relative"
  >
   <NoiseOverlay />

   <Hero />
   <Features />
   <Box backgroundColor={"black"}>
    <Cta />
   </Box>
  </Box>
 );
}
