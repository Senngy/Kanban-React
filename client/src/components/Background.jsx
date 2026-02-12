import React from 'react';

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated Gradient Meshes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400 opacity-30 blur-[100px] animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-blue-400 opacity-30 blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] rounded-full bg-pink-400 opacity-30 blur-[100px] animate-blob animation-delay-4000"></div>
      
      {/* Glass overlay pattern for texture (optional) */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
    </div>
  );
}
