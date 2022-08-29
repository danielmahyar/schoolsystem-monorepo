import React from "react";
import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, type: "spring" }}
      className="w-full h-full flex justify-center items-center bg-primary"
    >
      LoadingPage
    </motion.div>
  );
};

export default LoadingPage;
