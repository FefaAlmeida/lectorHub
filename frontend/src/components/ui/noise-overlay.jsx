import { Box } from "@chakra-ui/react";

export default function NoiseOverlay() {
 return (
  <Box
   position="fixed"
   inset={0}
   pointerEvents="none"
   zIndex={9999}
   opacity={0.03}
   backgroundImage={`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3C/svg%3E")`}
  />
 );
}
