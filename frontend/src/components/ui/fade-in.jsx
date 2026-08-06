import { motion } from "framer-motion";

export default function FadeIn({ children, delay = 0 }) {
 return (
  <motion.div
   initial={{ opacity: 0, y: 24 }}
   whileInView={{ opacity: 1, y: 0 }}
   viewport={{ once: true, margin: "-10%" }}
   transition={{
    duration: 1,
    delay,
    ease: [0.16, 1, 0.3, 1],
   }}
  >
   {children}
  </motion.div>
 );
}
