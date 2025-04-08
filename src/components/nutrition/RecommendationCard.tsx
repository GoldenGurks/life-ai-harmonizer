
import React from 'react';
import { motion } from '@/lib/motion';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecommendationCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  category
}) => {
  return (
    <motion.div 
      className="flex p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-card"
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-base">{title}</h4>
          <Badge variant="outline" className="text-xs capitalize">
            {category}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="flex items-center ml-4">
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
