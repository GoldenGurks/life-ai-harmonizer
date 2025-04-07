
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, to, color = "bg-primary/10" }) => {
  return (
    <div className="feature-card">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <Button asChild variant="ghost" className="p-0 hover:bg-transparent">
        <Link to={to} className="flex items-center gap-1 text-sm">
          Explore <ArrowRight size={16} />
        </Link>
      </Button>
    </div>
  );
};

export default FeatureCard;
