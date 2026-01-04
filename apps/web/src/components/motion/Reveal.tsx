import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealProps = React.ComponentPropsWithoutRef<"div"> & {
  /**
   * Optional transition delay (seconds). Useful if you want to stagger sections.
   */
  delay?: number;
};

export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div {...props}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: -10, opacity: 0, filter: "blur(10px)" }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}


