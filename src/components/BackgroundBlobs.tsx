import React from 'react';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Top Left Organic Sphere - Institutional Blue Blur */}
      <div 
        className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-[#00154e]/10 blur-3xl sm:h-[450px] sm:w-[450px]"
        id="bg-blob-blue-top"
      />
      
      {/* Top Right Organic Sphere - Energetic Orange Blur */}
      <div 
        className="absolute top-10 right-0 h-80 w-80 rounded-full bg-[#ed9524]/15 blur-3xl sm:h-[400px] sm:w-[400px]"
        id="bg-blob-orange-top"
      />

      {/* Mid Center Organic Sphere - Soft Blue */}
      <div 
        className="absolute top-1/2 left-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0c2d82]/8 blur-3xl"
        id="bg-blob-blue-mid"
      />

      {/* Bottom Right Organic Sphere - Soft Orange */}
      <div 
        className="absolute -bottom-20 right-10 h-96 w-96 rounded-full bg-[#ffe4be]/60 blur-3xl"
        id="bg-blob-orange-bottom"
      />
    </div>
  );
};
