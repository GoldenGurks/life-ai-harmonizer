
import React from 'react';
import { Button } from '@/components/ui/button';

interface DaySelectorProps {
  days: string[];
  currentDay: string;
  onDayChange: (day: string) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ days, currentDay, onDayChange }) => {
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {days.map(day => (
        <Button
          key={day}
          variant={currentDay === day ? "default" : "outline"}
          onClick={() => onDayChange(day)}
          className="px-4"
        >
          {day.substring(0, 3)}
        </Button>
      ))}
    </div>
  );
};

export default DaySelector;
