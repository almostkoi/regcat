'use client';

import { useState } from 'react';
import { Menu, X, Code, FileText, Zap, BookOpen, Sparkles, Bug } from 'lucide-react';

interface SidebarProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export default function Sidebar({ activeSection = 'pattern', onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    {
      id: 'pattern',
      name: 'Pattern',
      icon: Code,
      description: 'Regex input & flags',
      shortcut: 'Ctrl+1',
    },
    {
      id: 'test',
      name: 'Test Data',
      icon: FileText,
      description: 'Test string input',
      shortcut: 'Ctrl+2',
    },
    {
      id: 'results',
      name: 'Results',
      icon: Zap,
      description: 'Match results & details',
    },
    {
      id: 'debug',
      name: 'Debug',
      icon: Bug,
      description: 'Step-through debugger',
    },
    {
      id: 'reference',
      name: 'Reference',
      icon: BookOpen,
      description: 'Regex cheat sheet',
    },
    {
      id: 'explain',
      name: 'Explain',
      icon: Sparkles,
      description: 'AI-powered explanation',
    },
  ];

  const handleNavigate = (sectionId: string) => {
    onNavigate?.(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-regcat-surface border border-regcat-border rounded-sm hover:bg-regcat-hover transition-colors"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <X size={20} className="text-regcat-text" />
        ) : (
          <Menu size={20} className="text-regcat-text" />
        )}
      </button>

      {/* Overlay on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-40 left-0 top-0 h-screen w-64
          bg-regcat-surface border-r border-regcat-border
          overflow-y-auto transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-regcat-border">
          <div className="flex items-center gap-3">
            <img
              src="/regcat.svg"
              alt="Regcat"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <div>
              <h1 className="text-lg font-semibold text-regcat-text">Regcat</h1>
              <p className="text-xs text-regcat-text-tertiary">Regex Tester</p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-4 space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => handleNavigate(section.id)}
                className={`
                  w-full text-left px-4 py-3 rounded-sm transition-all duration-200
                  flex items-start justify-between gap-2
                  ${
                    activeSection === section.id
                      ? 'bg-regcat-hover border-l-2 border-regcat-accent text-regcat-accent'
                      : 'text-regcat-text-secondary hover:bg-regcat-hover hover:text-regcat-text'
                  }
                `}
              >
                <div className="flex-1 flex items-start gap-2">
                  <Icon size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{section.name}</div>
                    <p className="text-xs text-regcat-text-tertiary mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>
                {section.shortcut && (
                  <span className="text-xs px-2 py-1 bg-regcat-bg rounded text-regcat-text-secondary whitespace-nowrap ml-2">
                    {section.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-regcat-border" />

        {/* Help Section */}
        <div className="p-4 space-y-3">
          <h3 className="text-xs font-semibold text-regcat-text-secondary uppercase tracking-wider">
            Quick Tips
          </h3>
          <ul className="space-y-2 text-xs text-regcat-text-tertiary">
            <li className="flex gap-2">
              <span className="text-regcat-accent">•</span>
              <span>Use Ctrl+K to clear all fields</span>
            </li>
            <li className="flex gap-2">
              <span className="text-regcat-accent">•</span>
              <span>The 'g' flag finds all matches</span>
            </li>
            <li className="flex gap-2">
              <span className="text-regcat-accent">•</span>
              <span>Copy results with one click</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-regcat-border bg-regcat-bg">
          <p className="text-xs text-regcat-text-tertiary text-center">
            v1.0 • <span className="text-regcat-accent">Regcat</span>
          </p>
        </div>
      </aside>
    </>
  );
}
