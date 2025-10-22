import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

export default function ResponsiveWrapper({ 
  children, 
  className = '',
  size = 'lg',
  padding = 'md',
  maxWidth = '7xl'
}: ResponsiveWrapperProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-4 py-4',
    lg: 'px-6 py-6',
    xl: 'px-8 py-8'
  };

  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      sizeClasses[size],
      paddingClasses[padding],
      maxWidth !== 'none' && maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive grid container
export function ResponsiveGrid({ 
  children, 
  className = '',
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md'
}: ResponsiveWrapperProps & {
  cols?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const gridCols = {
    sm: `grid-cols-${cols.sm || 1}`,
    md: `md:grid-cols-${cols.md || cols.sm || 1}`,
    lg: `lg:grid-cols-${cols.lg || cols.md || cols.sm || 1}`,
    xl: `xl:grid-cols-${cols.xl || cols.lg || cols.md || cols.sm || 1}`
  };

  return (
    <div className={cn(
      'grid',
      gridCols.sm,
      gridCols.md,
      gridCols.lg,
      gridCols.xl,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive flex container
export function ResponsiveFlex({ 
  children, 
  className = '',
  direction = { sm: 'col', md: 'row' },
  justify = 'start',
  align = 'start',
  gap = 'md'
}: ResponsiveWrapperProps & {
  direction?: { sm?: 'row' | 'col'; md?: 'row' | 'col'; lg?: 'row' | 'col' };
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const flexDirection = {
    sm: `flex-${direction.sm || 'col'}`,
    md: `md:flex-${direction.md || direction.sm || 'col'}`,
    lg: `lg:flex-${direction.lg || direction.md || direction.sm || 'col'}`
  };

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  return (
    <div className={cn(
      'flex',
      flexDirection.sm,
      flexDirection.md,
      flexDirection.lg,
      justifyClasses[justify],
      alignClasses[align],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive text sizing
export function ResponsiveText({ 
  children, 
  className = '',
  size = { sm: 'base', md: 'lg', lg: 'xl' }
}: ResponsiveWrapperProps & {
  size?: { sm?: string; md?: string; lg?: string };
}) {
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  };

  const responsiveSizes = {
    sm: textSizes[size.sm as keyof typeof textSizes] || 'text-base',
    md: `md:${textSizes[size.md as keyof typeof textSizes] || 'text-lg'}`,
    lg: `lg:${textSizes[size.lg as keyof typeof textSizes] || 'text-xl'}`
  };

  return (
    <div className={cn(
      responsiveSizes.sm,
      responsiveSizes.md,
      responsiveSizes.lg,
      className
    )}>
      {children}
    </div>
  );
}

// Responsive spacing
export function ResponsiveSpacing({ 
  children, 
  className = '',
  spacing = { sm: 'md', md: 'lg', lg: 'xl' }
}: ResponsiveWrapperProps & {
  spacing?: { sm?: string; md?: string; lg?: string };
}) {
  const spacingClasses = {
    none: '',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12'
  };

  const responsiveSpacing = {
    sm: spacingClasses[spacing.sm as keyof typeof spacingClasses] || 'space-y-4',
    md: `md:${spacingClasses[spacing.md as keyof typeof spacingClasses] || 'space-y-6'}`,
    lg: `lg:${spacingClasses[spacing.lg as keyof typeof spacingClasses] || 'space-y-8'}`
  };

  return (
    <div className={cn(
      responsiveSpacing.sm,
      responsiveSpacing.md,
      responsiveSpacing.lg,
      className
    )}>
      {children}
    </div>
  );
}






