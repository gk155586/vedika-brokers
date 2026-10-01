// src/components/AdminMorphingSubmit.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * AdminMorphingSubmit
 * Morphing button with progress track, circle badge, and drawn SVG checkmark
 * Used for admin data adding (properties, photos, videos, media).
 */
export default function AdminMorphingSubmit({
  text = "Submit & Publish Property",
  submittingText = "Uploading Media & Saving...",
  successText = "Property & Media Saved Successfully!",
  onValidate,
  onSubmit,
  onComplete,
  className = "",
  disabled = false,
}) {
  // animation stages: 'idle' | 'track' | 'progress' | 'circle' | 'check' | 'success'
  const [stage, setStage] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleClick = async (e) => {
    e.preventDefault();
    if (stage !== 'idle' || disabled) return;

    setErrorMsg('');

    // Step 1: Validate form if validator supplied
    if (onValidate) {
      const validationError = onValidate();
      if (validationError) {
        setErrorMsg(validationError);
        return;
      }
    }

    try {
      // Step 2: Morph to track
      setStage('track');

      // Step 3: Start progress bar filling after track has expanded
      setTimeout(() => {
        setStage('progress');
      }, 500);

      // Execute actual submit/upload in parallel
      const submitPromise = onSubmit ? onSubmit() : Promise.resolve();

      // Step 4: After progress completes (~2s total), morph into circle
      setTimeout(async () => {
        try {
          await submitPromise;
          setStage('circle');

          // Step 5: Draw checkmark inside circle
          setTimeout(() => {
            setStage('check');
            try {
              confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#71DFBE', '#00C4FF', '#fbbf24', '#ffffff']
              });
            } catch (err) {}

            // Step 6: Success state
            setTimeout(() => {
              setStage('success');
              if (onComplete) {
                setTimeout(() => {
                  onComplete();
                  // Reset stage for future use
                  setStage('idle');
                }, 1200);
              }
            }, 600);
          }, 600);
        } catch (err) {
          console.error(err);
          setErrorMsg(err.message || 'Error saving property');
          setStage('idle');
        }
      }, 2400);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Submission failed');
      setStage('idle');
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center my-3 relative ${className}`}>
      {/* Outer wrapper maintaining height so form layout stays smooth */}
      <div className="relative flex items-center justify-center w-full min-h-[72px]">
        {/* The Morphing Button / Track Container */}
        <motion.div
          onClick={stage === 'idle' ? handleClick : undefined}
          initial={false}
          animate={
            stage === 'idle'
              ? {
                  width: 260,
                  height: 54,
                  borderRadius: 12,
                  backgroundColor: '#2B2D2F',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.35)',
                }
              : stage === 'track' || stage === 'progress'
              ? {
                  width: 300,
                  height: 12,
                  borderRadius: 100,
                  backgroundColor: '#2B2D2F',
                  boxShadow: '0 4px 15px -2px rgba(0, 0, 0, 0.4)',
                }
              : {
                  // 'circle', 'check', 'success'
                  width: 60,
                  height: 60,
                  borderRadius: 60,
                  backgroundColor: '#71DFBE',
                  boxShadow: '0 0 30px rgba(113, 223, 190, 0.6)',
                }
          }
          transition={{
            type: 'spring',
            stiffness: stage === 'circle' ? 380 : 300,
            damping: 24,
          }}
          className={`relative overflow-hidden flex items-center justify-center select-none ${
            stage === 'idle' ? 'cursor-pointer hover:brightness-110 active:scale-95' : 'cursor-default'
          }`}
          style={{
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {/* 1. IDLE TEXT */}
          <AnimatePresence>
            {stage === 'idle' && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                className="text-[#71DFBE] font-bold text-xs uppercase tracking-wider px-4 text-center z-10 flex items-center gap-2"
              >
                <span>{text}</span>
              </motion.span>
            )}
          </AnimatePresence>

          {/* 2. PROGRESS BAR (Inside Track) */}
          {(stage === 'track' || stage === 'progress') && (
            <motion.div
              initial={{ width: 0 }}
              animate={stage === 'progress' ? { width: '100%' } : { width: 0 }}
              transition={{
                duration: 1.8,
                ease: 'easeInOut',
              }}
              className="absolute left-0 top-0 bottom-0 bg-[#71DFBE] rounded-full shadow-[0_0_12px_#71DFBE]"
            />
          )}

          {/* 3. DRAWN SVG CHECKMARK (Inside Circle) */}
          {(stage === 'check' || stage === 'success') && (
            <svg
              viewBox="0 0 25 30"
              className="w-7 h-7 relative z-10"
              style={{ overflow: 'visible' }}
            >
              <motion.path
                d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2"
                fill="none"
                stroke="#1D1F20"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.35,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          )}
        </motion.div>
      </div>

      {/* Submitting / Success Status Banner below button */}
      <AnimatePresence>
        {(stage === 'track' || stage === 'progress') && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[11px] font-bold text-[#71DFBE] mt-2 font-mono flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#71DFBE] animate-ping" />
            <span>{submittingText}</span>
          </motion.p>
        )}

        {(stage === 'check' || stage === 'success') && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-black text-emerald-600 mt-2 font-serif"
          >
            {successText}
          </motion.p>
        )}

        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-red-500 mt-2 bg-red-50 border border-red-200 px-3 py-1 rounded-lg"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
