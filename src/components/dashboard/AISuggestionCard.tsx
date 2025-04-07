
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface AISuggestionCardProps {
  title: string;
  suggestion: string;
  onAccept?: () => void;
  onCustomize?: () => void;
}

const AISuggestionCard: React.FC<AISuggestionCardProps> = ({ 
  title, 
  suggestion, 
  onAccept = () => {}, 
  onCustomize = () => {} 
}) => {
  return (
    <Card className="border-dashed border-primary/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-muted-foreground mt-1 mb-4">{suggestion}</p>
            <div className="flex gap-3">
              <Button size="sm" onClick={onAccept}>Accept</Button>
              <Button size="sm" variant="outline" onClick={onCustomize}>Customize</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISuggestionCard;
