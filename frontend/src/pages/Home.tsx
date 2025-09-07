// Homepage.tsx
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {  Users, PenTool, Globe } from 'lucide-react'; // Lucide icons for features

export const Home: React.FC = () => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  return (
    <div className="min-h-screen bg-background text-foreground font-manrope">
      {/* Hero Section */}
      <section className="relative py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-5xl font-bold mb-6 tracking-tighter">
            Discover Stories That Inspire with <span className="text-gradient-primary">BlogVia</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 tracking-tight">
            BlogVia is your platform to explore, share, and connect through captivating blogs on Technology, Lifestyle, Health, and more. Join a vibrant community of storytellers today!
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/blogs">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-6 py-6 rounded-full">
                Explore Blogs
              </Button>
            </Link>
            {!authUser && (
              <Link to="/signup">
                <Button variant="outline" className="border-primary-foreground text-lg px-6 py-6 rounded-full hover:bg-accent">
                  Join Now
                </Button>
              </Link>
            )}
            {authUser && (
              <Link to="/dashboard">
                <Button variant="outline" className="border-primary-foreground text-lg px-6 py-6 rounded-full hover:bg-accent">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold  text-center mb-12">Why Choose BlogVia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <PenTool className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Create & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Write and publish your own blogs on any topic, from tech insights to personal stories. Share your voice with a global audience.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Join the Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with like-minded readers and writers. Follow your favorite authors, like posts, and engage in meaningful discussions.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">Explore Diverse Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dive into a wide range of categories like Technology, Lifestyle, Health, and Education. Find stories that spark your curiosity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>





      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold  mb-6">Ready to Share Your Story?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Whether you're a writer, reader, or both, BlogVia is the place to share your ideas and connect with a global community. Start today!
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/blogs">
              <Button className="bg-background text-primary hover:bg-background/90 text-lg px-6 py-6 rounded-full">
                Browse Blogs
              </Button>
            </Link>
            {!authUser && (
              <Link to="/signup">
                <Button variant="outline" className="border-background text-background hover:bg-accent text-lg px-6 py-6 rounded-full">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 px-4 md:px-8 lg:px-16 text-center font-nunito">
        <div className="mx-auto">
          <h2 className="text-7xl md:text-9xl font-bold bg-gradient-to-b text-transparent bg-clip-text from-orange-300 via-orange-500 to-orange-700 uppercase tracking-widest mb-4">
            BLOGVIA
          </h2>

        </div>
      </footer>
    </div>
  );
};
