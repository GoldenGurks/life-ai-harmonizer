
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Shuffle, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

const flashcardData: Flashcard[] = [
  { id: '1', front: 'El gato', back: 'The cat' },
  { id: '2', front: 'La casa', back: 'The house' },
  { id: '3', front: 'El libro', back: 'The book' },
  { id: '4', front: 'La puerta', back: 'The door' },
  { id: '5', front: 'El perro', back: 'The dog' },
];

const Flashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<string[]>([]);
  
  const currentCard = flashcardData[currentIndex];
  const progress = (studiedCards.length / flashcardData.length) * 100;
  
  const handleNext = () => {
    if (currentIndex < flashcardData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      if (!studiedCards.includes(currentCard.id)) {
        setStudiedCards([...studiedCards, currentCard.id]);
      }
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };
  
  const handleReset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setStudiedCards([]);
  };
  
  const handleShuffle = () => {
    setCurrentIndex(0);
    setFlipped(false);
    // In a real app, we would shuffle the cards array
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShuffle}>
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Set
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="study" className="mb-8">
        <TabsList>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="manage">Manage Sets</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="study">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Spanish Vocabulary</h3>
              <div className="text-sm text-muted-foreground">
                {currentIndex + 1} of {flashcardData.length}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex justify-center mb-8">
            <Card 
              className="w-full max-w-lg h-64 cursor-pointer transition-all duration-300 perspective"
              onClick={() => setFlipped(!flipped)}
            >
              <div className={`relative w-full h-full transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}>
                <CardContent className="absolute inset-0 flex items-center justify-center p-6 backface-hidden">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-4">Front</Badge>
                    <h2 className="text-3xl font-bold">{currentCard.front}</h2>
                    <p className="text-muted-foreground mt-4">Click to flip</p>
                  </div>
                </CardContent>
                
                <CardContent className="absolute inset-0 flex items-center justify-center p-6 rotate-y-180 backface-hidden">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-4">Back</Badge>
                    <h2 className="text-3xl font-bold">{currentCard.back}</h2>
                    <p className="text-muted-foreground mt-4">Click to flip back</p>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentIndex === flashcardData.length - 1}>
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Spanish Vocabulary</h3>
                <p className="text-muted-foreground mb-4">Basic Spanish words and phrases.</p>
                <div className="text-sm text-muted-foreground mb-4">
                  5 cards • Last studied 2 days ago
                </div>
                <Button className="w-full">Study Now</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Biology Terms</h3>
                <p className="text-muted-foreground mb-4">Key concepts for biology exam.</p>
                <div className="text-sm text-muted-foreground mb-4">
                  12 cards • New set
                </div>
                <Button className="w-full">Study Now</Button>
              </CardContent>
            </Card>
            
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center h-full p-6">
                <Button variant="ghost">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Set
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">AI Study Assistant</h3>
              <p className="text-muted-foreground mb-4">
                Let our AI create custom flashcard sets based on what you're studying.
                Simply provide a topic or paste study materials, and get a perfect set of flashcards.
              </p>
              <Button>Create AI Flashcards</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Flashcards;
