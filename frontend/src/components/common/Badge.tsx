import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'subtle'
  icon?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  icon,
}) => {
  const className = variant === 'outline' ? 'badge badge-outline' : 'badge'
  return (
    <span className={className}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </span>
  )
}
