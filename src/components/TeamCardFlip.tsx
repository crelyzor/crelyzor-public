'use client';

import { useState } from 'react';

export function TeamCardFlip({
  htmlContent,
  htmlBackContent,
}: {
  htmlContent: string;
  htmlBackContent: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={() => setFlipped((f) => !f)}
      title={flipped ? 'Click to see front' : 'Click to flip'}
    >
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="rounded-2xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            inset: 0,
          }}
          className="rounded-2xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: htmlBackContent }}
        />
      </div>
      <p className="text-center text-[10px] text-neutral-500 mt-2 tracking-widest uppercase">
        Tap to flip
      </p>
    </div>
  );
}
