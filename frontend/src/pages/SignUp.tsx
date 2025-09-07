import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AnimatedPattern from '../components/AnimatedPattern';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signup } from '@/store/authSlice';
import { type SignUpDataType } from '@/types';

const signupSchema = z.object({
  fullName: z.string()
    .min(2, {
      message: 'Full name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Full name must not exceed 50 characters.',
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Full name can only contain letters and spaces.',
    }),
  email: z.string()
    .min(1, { message: 'Email is required.' })
    .email({
      message: 'Please enter a valid email address.',
    }),
  password: z.string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .max(100, {
      message: 'Password must not exceed 100 characters.',
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    }),
});

export const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isSigningUp, authUser } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<SignUpDataType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (authUser) {
      navigate('/dashboard');
    }
  }, [authUser, navigate]);

  const onSubmit = async (values: SignUpDataType) => {
    try {
      // Trim whitespace from inputs
      const cleanValues = {
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };

      await dispatch(signup(cleanValues)).unwrap();
      // Navigation will be handled by the useEffect when authUser changes
    } catch (error) {
      // Error handling is done in the slice
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gradient-primary">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Start your blogging journey today
            </p>
          </div>

          {/* Signup Form */}
          <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
              <CardDescription className="text-center">
                Enter your details to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            className="transition-all duration-200 focus:border-primary focus:ring-primary"
                            disabled={isSigningUp}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="transition-all duration-200 focus:border-primary focus:ring-primary"
                            disabled={isSigningUp}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pr-10 transition-all duration-200 focus:border-primary focus:ring-primary"
                              disabled={isSigningUp}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isSigningUp}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity duration-200"
                    disabled={isSigningUp}
                  >
                    {isSigningUp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Animated pattern */}
      <div className="hidden lg:block flex-1">
        <AnimatedPattern />
      </div>
    </div>
  );
};
