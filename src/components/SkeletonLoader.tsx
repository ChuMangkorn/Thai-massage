import React from 'react';
import { cn } from '../utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: ''
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
};

// Predefined skeleton components for common use cases
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 space-y-4', className)}>
    <Skeleton variant="rectangular" height={200} />
    <Skeleton variant="text" height={24} width="60%" />
    <TextSkeleton lines={3} />
    <div className="flex space-x-2">
      <Skeleton variant="rounded" width={80} height={32} />
      <Skeleton variant="rounded" width={100} height={32} />
    </div>
  </div>
);

export const ServiceCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-2xl shadow-xl overflow-hidden p-8 space-y-6', className)}>
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" width={60} height={60} />
      <div className="flex-1">
        <Skeleton variant="text" height={24} width="70%" />
        <Skeleton variant="text" height={16} width="50%" className="mt-2" />
      </div>
    </div>
    <TextSkeleton lines={3} />
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton variant="text" height={20} width="80%" />
        <Skeleton variant="text" height={16} width="60%" />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" height={20} width="80%" />
        <Skeleton variant="text" height={16} width="60%" />
      </div>
    </div>
    <Skeleton variant="rounded" height={48} width="100%" />
  </div>
);

export const HeroSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('relative h-screen flex items-center justify-center', className)}>
    <Skeleton variant="rectangular" className="absolute inset-0" />
    <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto px-4">
      <Skeleton variant="text" height={48} width="80%" className="mx-auto" />
      <Skeleton variant="text" height={24} width="60%" className="mx-auto" />
      <Skeleton variant="rounded" width={200} height={56} className="mx-auto" />
    </div>
  </div>
);

export const AboutSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('py-20', className)}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Skeleton variant="text" height={48} width="40%" className="mx-auto mb-4" />
        <Skeleton variant="text" height={24} width="30%" className="mx-auto mb-6" />
        <Skeleton variant="rectangular" height={4} width={96} className="mx-auto" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <TextSkeleton lines={6} />
        </div>
        <Skeleton variant="rounded" height={400} />
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="text-center space-y-4">
            <Skeleton variant="circular" width={80} height={80} className="mx-auto" />
            <Skeleton variant="text" height={24} width="70%" className="mx-auto" />
            <TextSkeleton lines={2} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const LocationSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('py-20', className)}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Skeleton variant="text" height={48} width="40%" className="mx-auto mb-4" />
        <Skeleton variant="rectangular" height={4} width={96} className="mx-auto" />
      </div>
      
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton variant="text" height={20} width="30%" />
              <Skeleton variant="text" height={16} width="80%" />
            </div>
          ))}
          <Skeleton variant="rounded" height={48} width="200px" />
        </div>
        <Skeleton variant="rounded" height={400} />
      </div>
    </div>
  </div>
);

export default Skeleton;