"use client";

import { AnimatePresence, motion } from "motion/react";
import { Spinner } from "@heroui/react";

function LoadingIndicator(props: { isLoading: boolean; className?: string }) {
  return (
    <div className="min-h-6 flex flex-row items-center justify-center">
      <AnimatePresence>
        {props.isLoading && (
          <motion.div
            className={`flex flex-col items-center justify-center h-full w-fit`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: "0.25" }}
            exit={{ opacity: 0 }}
          >
            <Spinner className={props.className} size="sm" color="current" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LoadingIndicator;
