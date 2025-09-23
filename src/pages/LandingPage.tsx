
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star, Camera, ShoppingCart, Users, Zap, Target, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';
import heroKitchen from '@/assets/hero-kitchen.jpg';
import tailoredMealsBg from '@/assets/tailored-meals-bg.jpg';
import aiVarietyBg from '@/assets/ai-variety-bg.jpg';
import photoCaptureB from '@/assets/photo-capture-bg.jpg';
import groceryStocksBg from '@/assets/grocery-stocks-bg.jpg';

/**
 * Landing page component for new users
 * Features hero section, feature highlights, shopping & nutrition info,
 * social proof, testimonials, and call-to-action
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    navigate('/meal-planning');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      
      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroKitchen})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90"></div>
        </div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            Your Weekly Meal Plan—
            <span className="gradient-text block mt-2">Effortlessly Intelligent</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            From first click to fully stocked fridge—AI-crafted menus customized just for you. 
            Effortless, nutritious, delicious.
          </p>
          <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4" onClick={handleGetStarted}>
            Build My Perfect Week
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Feature Highlights - Three Columns */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1: Tailored Meals */}
            <Card className="text-center border-2 hover:border-primary/20 transition-colors relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: `url(${tailoredMealsBg})` }}
              />
              <div className="relative z-10 bg-background/90">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Star className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2">
                    🌟 Your Meals, Tailored in Minutes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-2">Instant Start</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Select a goal—Weight Loss, Healthy Eating, Muscle Gain—or customize deeply in just 2 minutes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-2">Swipe, Select, Savor</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Quickly browse meals, thumbs-up your favorites; dislikes refresh your choices immediately.
                    </p>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Feature 2: AI-Powered Variety */}
            <Card className="text-center border-2 hover:border-secondary/20 transition-colors relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: `url(${aiVarietyBg})` }}
              />
              <div className="relative z-10 bg-background/90">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-secondary/10 p-3 rounded-full">
                      <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2">
                    AI-Powered Variety
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Recommendations balance nutrition, pantry stock, budget, and personal tastes—no repeats, 
                    just delicious surprises.
                  </p>
                </CardContent>
              </div>
            </Card>

            {/* Feature 3: Photo to Recipe */}
            <Card className="text-center border-2 hover:border-accent/20 transition-colors relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: `url(${photoCaptureB})` }}
              />
              <div className="relative z-10 bg-background/90">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-accent/10 p-3 rounded-full">
                      <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl mb-2">
                    Capture nutrients by photo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Can't cook yourself today? Simply capture your nutrition by taking a foto.
                  </p>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Shopping & Nutrition - Two Columns */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${groceryStocksBg})` }}
        >
          <div className="absolute inset-0 bg-background/70"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
                  🛒 Simplify Your Shopping & Nutrition
                </h2>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Smart Grocery List</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Auto-generated lists subtract your pantry items and organize groceries by store aisle.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <div className="bg-accent/10 p-2 rounded-lg flex-shrink-0">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Budget-Friendly Plans</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Clear cost-per-meal estimates to keep your budget on track.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Nutrition Clarity & Visual Element */}
            <div className="space-y-6">
              <div className="flex gap-3 sm:gap-4">
                <div className="bg-secondary/10 p-2 rounded-lg flex-shrink-0">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2">Nutrition Clarity</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Macros at a glance, expand for full vitamin & mineral breakdowns.
                  </p>
                </div>
              </div>
              
              <Card className="p-6 sm:p-8 border-2 shadow-lg">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">This Week's Plan</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Calories</span>
                      <span className="text-primary font-medium">1,850 / 2,000</span>
                    </div>
                    <div className="bg-primary/20 rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-[92%]"></div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Shopping list: 12 items • Est. cost: $47.50
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Community */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12">
            🤝 Eat Better, Together
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <Card className="p-6 sm:p-8">
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-3">Social Sharing Made Easy</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Share recipes or weekly meal plans with friends—one click, zero hassle.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex justify-center mb-4">
                <Star className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-3">Connect to Your Favorite Chefs</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Follow your favorite Instagram chefs and get their recipes directly in the app.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
            What Our Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="p-6 sm:p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base text-muted-foreground mb-4">
                "I used to spend hours planning meals. Now it takes 5 minutes and the variety is incredible!"
              </blockquote>
              <cite className="text-xs sm:text-sm font-medium">— Sarah M., busy mom of 3</cite>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base text-muted-foreground mb-4">
                "The photo feature is amazing! I saw a dish on Instagram, snapped it, and had the recipe in seconds."
              </blockquote>
              <cite className="text-xs sm:text-sm font-medium">— Mike T., fitness enthusiast</cite>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base text-muted-foreground mb-4">
                "My grocery bills dropped 30% and I'm eating better than ever. This app changed everything."
              </blockquote>
              <cite className="text-xs sm:text-sm font-medium">— Emma L., college student</cite>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Personalized Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Whether you're cutting, bulking, or maintaining - our AI adapts to your fitness goals.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Zap className="h-8 w-8 text-secondary mx-auto mb-2" />
                <CardTitle className="text-lg">Instant Adaptations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Don't like a recipe? Our algorithm learns and suggests better alternatives immediately.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Heart className="h-8 w-8 text-accent mx-auto mb-2" />
                <CardTitle className="text-lg">Family Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create meal plans that work for the whole family, with options for different dietary needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Meal Planning?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10">
            Join 50,000+ home cooks who've ditched meal-planning stress
          </p>
          
          <Button size="lg" className="text-lg px-8 py-4 mb-6" onClick={handleGetStarted}>
            Build My Perfect Week
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <p>Free to start • No credit card required</p>
            <p>Setup takes less than 2 minutes</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
