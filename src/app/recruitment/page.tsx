"use client";

import { motion } from "framer-motion";

export default function Recruitment() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-slate-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex flex-col items-center gap-8"
      >
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="font-mono text-4xl md:text-5xl font-bold text-sky-300">
            Join Our Team
          </h1>
          <p className="text-slate-200 text-lg md:text-xl max-w-2xl">
            Interested in helping organize Howard County's Hour of Code? We're
            looking for passionate volunteers to help make this event amazing!
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-slate-800 bg-opacity-50 rounded-lg border-2 border-sky-900 p-1 shadow-lg"
        >
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfBLjHwEOo2Etq2oZjRfiYl_wSmWwPcg3Y3F6NSFt6QoXm1ZQ/viewform?usp=dialog"
            className="w-full min-h-screen rounded-md"
            frameBorder="0"
            title="Recruitment Form"
            loading="lazy"
          ></iframe>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-slate-400 text-sm"
        >
          <p>
            Thank you for your interest in helping us spread computer science
            education!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
