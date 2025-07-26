import React from 'react';

interface TestingCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const TestingCard = ({ title, children, actions }: TestingCardProps) => (
  <section className="bg-gradient-to-br from-card/95 to-background/80 rounded-lg shadow-lg p-8 w-full box-border min-w-0 border-l-4 border-primary/40 transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl hover:border-primary/80 backdrop-blur-md bg-opacity-80 animate-fade-in motion-safe:animate-fade-in mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    <div>{children}</div>
  </section>
);

export default TestingCard; 