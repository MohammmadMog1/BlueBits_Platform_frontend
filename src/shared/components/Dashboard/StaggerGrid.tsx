import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

interface StaggerGridProps {
  className: string;
  children: ReactNode[];
}

/**
 * شبكة بطاقات تدخل تباعاً بدل الظهور الجماعي الفجائي.
 * تفترض أن كل عنصر بنفس الحجم (بلا col-span مختلف) لأن الحاوية الحركية
 * هي التي تصبح خلية الشبكة الفعلية.
 */
export default function StaggerGrid({ className, children }: StaggerGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants} className="h-full">
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
