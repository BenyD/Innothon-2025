"use client";

import { motion } from "framer-motion";
import RegistrationForm from "@/components/RegistrationForm";
import RegisterNav from "@/components/RegisterNav";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-black/95">
      <RegisterNav />
      <div className="pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RegistrationForm />
        </motion.div>
      </div>
    </div>
  );
}
