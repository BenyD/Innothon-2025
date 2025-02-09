import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("text-center space-y-4 mb-12", className)}
    >
      <div className="flex items-center justify-center gap-4">
        <div className="h-px w-8 bg-gradient-to-r from-blue-500 to-purple-500" />
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
          {title}
        </h2>
        <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-pink-500" />
      </div>
      {subtitle && (
        <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </motion.div>
  );
} 