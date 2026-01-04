import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type RevealProps = Omit<
  HTMLMotionProps<"div">,
  "initial" | "whileInView" | "viewport" | "transition"
> & {
  /**
   * Optional transition delay (seconds). Useful if you want to stagger sections.
   */
  delay?: number;
};

export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : { y: -10, opacity: 0, filter: "blur(10px)" }
      }
      whileInView={
        shouldReduceMotion
          ? undefined
          : { y: 0, opacity: 1, filter: "blur(0px)" }
      }
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.2 }}
      transition={
        shouldReduceMotion
          ? undefined
          : { duration: 0.6, ease: "easeOut", delay }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
