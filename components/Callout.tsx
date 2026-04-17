'use client';

import { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';

type CalloutType = 'tip' | 'warning' | 'note' | 'info';

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  { bg: string; border: string; icon: React.ComponentType<{ size: number; className: string }>; title: string; color: string }
> = {
  tip: {
    bg: 'bg-regcat-callout-tip/10',
    border: 'border-l-4 border-regcat-callout-tip',
    icon: Lightbulb,
    title: 'Tip',
    color: 'text-regcat-callout-tip',
  },
  warning: {
    bg: 'bg-regcat-callout-warning/10',
    border: 'border-l-4 border-regcat-callout-warning',
    icon: AlertTriangle,
    title: 'Warning',
    color: 'text-regcat-callout-warning',
  },
  note: {
    bg: 'bg-regcat-callout-note/10',
    border: 'border-l-4 border-regcat-callout-note',
    icon: Info,
    title: 'Note',
    color: 'text-regcat-callout-note',
  },
  info: {
    bg: 'bg-regcat-callout-info/10',
    border: 'border-l-4 border-regcat-callout-info',
    icon: AlertCircle,
    title: 'Info',
    color: 'text-regcat-callout-info',
  },
};

export default function Callout({ type, title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.title;

  return (
    <div className={`${config.bg} ${config.border} px-4 py-3 rounded-sm my-3 border-b border-regcat-border/30`}>
      <div className="flex gap-3">
        <Icon size={20} className={`${config.color} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h4 className={`font-semibold text-sm mb-1 ${config.color}`}>
            {displayTitle}
          </h4>
          <div className="text-sm text-regcat-text-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
