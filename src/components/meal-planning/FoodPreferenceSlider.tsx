
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion } from '@/lib/motion';

interface Dish {
  id: string;
  name: string;
  ingredients: string[];
  image: string;
}

interface FoodPreferenceSliderProps {
  onPreferenceChange: (dishId: string, liked: boolean) => void;
}

const FoodPreferenceSlider: React.FC<FoodPreferenceSliderProps> = ({ onPreferenceChange }) => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  
  // Sample dish data
  const dishes: Dish[] = [
    {
      id: '1',
      name: 'Greek Quinoa Bowl',
      ingredients: ['Quinoa', 'Chickpeas', 'Cucumber', 'Tomato', 'Feta', 'Olives'],
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'
    },
    {
      id: '2',
      name: 'Teriyaki Salmon',
      ingredients: ['Salmon fillet', 'Teriyaki sauce', 'Brown rice', 'Broccoli', 'Sesame seeds'],
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'
    },
    {
      id: '3',
      name: 'Vegetable Curry',
      ingredients: ['Sweet potato', 'Chickpeas', 'Spinach', 'Coconut milk', 'Curry paste'],
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd'
    },
    {
      id: '4',
      name: 'Avocado Toast',
      ingredients: ['Sourdough bread', 'Avocado', 'Cherry tomatoes', 'Feta', 'Microgreens'],
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8'
    },
    {
      id: '5',
      name: 'Berry Smoothie Bowl',
      ingredients: ['Mixed berries', 'Banana', 'Greek yogurt', 'Honey', 'Granola', 'Chia seeds'],
      image: 'https://images.unsplash.com/photo-1504310578167-435ac09e69f3'
    },
  ];

  const handleLike = () => {
    if (currentIndex < dishes.length) {
      setDirection('right');
      onPreferenceChange(dishes[currentIndex].id, true);
      
      toast({
        title: "Added to preferences",
        description: `You liked ${dishes[currentIndex].name}`,
      });

      // After animation completes, move to next dish
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  const handleDislike = () => {
    if (currentIndex < dishes.length) {
      setDirection('left');
      onPreferenceChange(dishes[currentIndex].id, false);
      
      // After animation completes, move to next dish
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection(null);
      }, 300);
    }
  };

  // Create a swipe handler
  const handleSwipe = (event: React.TouchEvent<HTMLDivElement>, initialX: number) => {
    const currentX = event.touches[0].clientX;
    const difference = initialX - currentX;
    
    // Threshold for swipe
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        // Swiped left
        handleDislike();
      } else {
        // Swiped right
        handleLike();
      }
    }
  };

  let touchStartX = 0;

  if (currentIndex >= dishes.length) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-medium">Thank you!</h3>
        <p className="text-muted-foreground mt-2">
          We've recorded your preferences and will use them to create your personalized meal plan.
        </p>
      </div>
    );
  }

  const currentDish = dishes[currentIndex];

  return (
    <div className="mx-auto max-w-md">
      <div 
        className="relative overflow-hidden"
        onTouchStart={(e) => { touchStartX = e.touches[0].clientX; }}
        onTouchMove={(e) => handleSwipe(e, touchStartX)}
      >
        <motion.div
          animate={
            direction === 'left' 
              ? { x: -300, opacity: 0, rotate: -5 } 
              : direction === 'right' 
                ? { x: 300, opacity: 0, rotate: 5 }
                : { x: 0, opacity: 1, rotate: 0 }
          }
          transition={{ duration: 0.3 }}
          className="transform-gpu"
        >
          <Card className="overflow-hidden">
            {/* Dish image takes up half the card */}
            <div 
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentDish.image})` }}
            >
              <div className="p-4 bg-gradient-to-b from-black/60 to-transparent">
                <h3 className="text-xl font-bold text-white">{currentDish.name}</h3>
              </div>
            </div>
            
            {/* Ingredients list takes up the other half */}
            <div className="p-4">
              <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
              <div className="flex flex-wrap gap-1">
                {currentDish.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline">{ingredient}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <div className="flex justify-center space-x-8 mt-6">
        <Button 
          size="lg"
          variant="outline"
          className="h-14 w-14 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          onClick={handleDislike}
        >
          <X className="h-8 w-8" />
        </Button>
        
        <Button 
          size="lg"
          variant="outline"
          className="h-14 w-14 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          onClick={handleLike}
        >
          <Check className="h-8 w-8" />
        </Button>
      </div>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Dish {currentIndex + 1} of {dishes.length}</p>
        <p>Swipe left to dislike, right to like</p>
      </div>
    </div>
  );
};

export default FoodPreferenceSlider;
