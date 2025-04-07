
// A simple wrapper around the HTML div element for animations
// In a real app, you might use Framer Motion or React Spring
import React from 'react';

interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: {
    x?: number;
    y?: number;
    opacity?: number;
    rotate?: number;
  };
  transition?: {
    duration?: number;
    ease?: string;
  };
  className?: string;
  children?: React.ReactNode;
}

export const motion = {
  div: ({ animate, transition, className, children, ...props }: MotionProps) => {
    const style: React.CSSProperties = {
      transform: `${animate?.x ? `translateX(${animate.x}px)` : ''} ${animate?.y ? `translateY(${animate.y}px)` : ''} ${animate?.rotate ? `rotate(${animate.rotate}deg)` : ''}`,
      opacity: animate?.opacity,
      transition: transition ? `all ${transition.duration}s ${transition.ease || 'ease'}` : undefined,
    };

    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }
};
