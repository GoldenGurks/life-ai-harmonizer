
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star, Camera, ShoppingCart, Users, Zap, Target, Heart } from 'lucide-react';

/**
 * Landing page component for new users
 * Features hero section, feature highlights, shopping & nutrition info,
 * social proof, testimonials, and call-to-action
 */
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 px-4 py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
            Your Weekly Meal Plan—
            <span className="gradient-text block mt-2">Effortlessly Intelligent</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            From first click to fully stocked fridge—AI-crafted menus customized just for you. 
            Effortless, nutritious, delicious.
          </p>
          <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
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
            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
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
            </Card>

            {/* Feature 2: AI-Powered Variety */}
            <Card className="text-center border-2 hover:border-secondary/20 transition-colors">
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
            </Card>

            {/* Feature 3: Photo to Recipe */}
            <Card className="text-center border-2 hover:border-accent/20 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl mb-2">
                  One Photo, Endless Recipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Snap a dish, and our AI instantly creates your personalized recipe, complete with nutrition data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Shopping & Nutrition - Two Columns */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
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

            {/* Right Column - Visual Element */}
            <div className="relative">
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

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Meal Planning?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10">
            Join 50,000+ home cooks who've ditched meal-planning stress
          </p>
          
          <Button size="lg" className="text-lg px-8 py-4 mb-4">
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
