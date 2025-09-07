import React from 'react';

const AnimatedPattern: React.FC = () => {
  return (
    <div className="relative h-full w-full bg-gradient-warm overflow-hidden flex items-center justify-center">
      {/* Background animated shapes */}
      <div className="absolute inset-0">
        {/* Floating circles */}
        {/* <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-float blur-sm"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white/15 rounded-full animate-float animation-delay-1000 blur-sm"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/20 rounded-full animate-float animation-delay-2000"></div> */}

        {/* Floating blog elements */}
        <div className="absolute top-1/6 right-1/3 animate-float animation-delay-500">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="w-16 h-2 bg-white/60 rounded mb-2"></div>
            <div className="w-12 h-2 bg-white/40 rounded mb-1"></div>
            <div className="w-14 h-2 bg-white/40 rounded"></div>
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/6  animation-delay-1500">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="w-6 h-6 bg-white/60 rounded-full mb-2"></div>
            <div className="w-16 h-1.5 bg-white/50 rounded mb-1"></div>
            <div className="w-12 h-1.5 bg-white/40 rounded"></div>
          </div>
        </div>

        {/* Animated lines */}
        {/* <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse-slow"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-slow animation-delay-2000"></div>
        </div> */}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center text-white">
        {/* Blog icon */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>

          </div>
          {/* Orbiting elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-spin-slow origin-center"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white/80 rounded-full animate-spin-slow animation-delay-1000 origin-center"></div>
        </div>

        {/* Title */}

        <h2 className="text-4xl font-bold mb-4">
          Share Your Stories
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-white/80 mb-8 max-w-md mx-auto animation-delay-500">
          Join thousands of writers sharing their thoughts, ideas, and experiences with the world
        </p>

        {/* Feature highlights */}
        <div className="space-y-4 flex flex-col items-center justify-center animation-delay-1000">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm text-white/70">Write & Publish Instantly</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-1000"></div>
            <span className="text-sm text-white/70">Connect with Readers</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-2000"></div>
            <span className="text-sm text-white/70">Build Your Audience</span>
          </div>
        </div>

        {/* Decorative elements */}
        {/* <div className="absolute -top-8 -left-8 w-16 h-16 border-2 border-white/20 rounded-full animate-spin-slow"></div> */}
        {/* <div className="absolute -bottom-8 -right-8 w-12 h-12 border-2 border-white/30 rounded-lg animate-pulse-slow"></div> */}
      </div>

      {/* Additional decorative elements */}
      {/* <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"></div> */}
      {/* <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-tr-full"></div> */}
    </div>
  );
};

export default AnimatedPattern;