import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Home, RefreshCw, Search, Coffee, Ghost, Skull, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [clicks, setClicks] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [currentMeme, setCurrentMeme] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const memes = [
    {
      title: "404",
      subtitle: "This page went to buy milk",
      message: "It's been 5 years... I don't think it's coming back 😢",
      emoji: "🥛",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "ERROR 404",
      subtitle: "Page.exe has stopped working",
      message: "Windows is searching for a solution... (It won't find one)",
      emoji: "💀",
      color: "from-red-500 to-orange-500"
    },
    {
      title: "404",
      subtitle: "This page is on vacation",
      message: "Somewhere in the Bahamas... without internet 🏝️",
      emoji: "🌴",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "BIG OOF",
      subtitle: "You found the secret nowhere",
      message: "Congratulations! Your reward is... nothing 🎉",
      emoji: "🤡",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "BRUH",
      subtitle: "This URL is sus",
      message: "Among us players would vote this page out",
      emoji: "📮",
      color: "from-indigo-500 to-violet-500"
    }
  ];

  const funFacts = [
    "Did you know? 404 errors are named after room 404 at CERN (not really)",
    "Fun fact: This page doesn't exist in 196 countries",
    "You're the 69,420th visitor to this non-existent page",
    "Breaking: Local person discovers page that doesn't exist",
    "This page took 0 seconds to not load",
    "Achievement Unlocked: Found the void! +0 points"
  ];

  const handleClick = () => {
    setClicks(clicks + 1);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    if (clicks === 9) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
  };

  const changeMeme = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setCurrentMeme((currentMeme + 1) % memes.length);
      setIsSpinning(false);
    }, 300);
  };

  const goHome = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentMemeData = memes[currentMeme];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background transition-colors duration-300 overflow-hidden relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Floating emojis background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {['😭', '💀', '🤡', '👻', '🚫', '❌'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        @keyframes bounce-shake {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-10px) rotate(5deg); }
        }
        .bounce-shake {
          animation: bounce-shake 0.5s ease-in-out;
        }
        @keyframes spin-scale {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(0.8); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .spin-scale {
          animation: spin-scale 0.6s ease-in-out;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .wiggle {
          animation: wiggle 0.3s ease-in-out infinite;
        }
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .rainbow {
          animation: rainbow 3s linear infinite;
        }
      `}</style>

      <Card className={`w-full max-w-2xl mx-4 shadow-2xl border border-border bg-card/80 backdrop-blur-xl overflow-hidden ${isShaking ? 'bounce-shake' : ''}`}>
        <div className={`h-3 bg-gradient-to-r ${currentMemeData.color}`} />

        <CardContent className="pt-12 pb-12 text-center relative">
          {/* Easter egg confetti */}
          {showEasterEgg && (
            <div className="absolute inset-0 pointer-events-none z-50">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: '1s'
                  }}
                >
                  🎉
                </div>
              ))}
            </div>
          )}

          {/* Clickable emoji */}
          <div
            className="flex justify-center mb-6 cursor-pointer"
            onClick={handleClick}
          >
            <div className={`relative group ${isSpinning ? 'spin-scale' : ''}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${currentMemeData.color} rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />
              <div className="relative text-8xl hover:scale-110 transition-transform">
                {currentMemeData.emoji}
              </div>
            </div>
          </div>

          {clicks >= 10 && (
            <div className="mb-4">
              <span className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold animate-pulse rainbow">
                🎮 ACHIEVEMENT: Click Master! You clicked {clicks} times!
              </span>
            </div>
          )}

          <h1 className={`text-6xl font-black mb-2 bg-gradient-to-r ${currentMemeData.color} bg-clip-text text-transparent ${clicks > 5 ? 'wiggle' : ''}`}>
            {currentMemeData.title}
          </h1>

          <h2 className="text-2xl font-bold text-foreground mb-4 font-black">
            {currentMemeData.subtitle}
          </h2>

          <p className="text-muted-foreground mb-6 text-lg leading-relaxed px-4 font-medium">
            {currentMemeData.message}
          </p>

          <div className="mb-8 p-4 bg-muted/50 border border-border rounded-2xl mx-auto max-w-md">
            <p className="text-sm text-foreground font-black uppercase tracking-wider">
              💡 {funFacts[clicks % funFacts.length]}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Button
              onClick={goHome}
              className="bg-primary text-white px-8 py-6 rounded-2xl transition-all duration-200 shadow-xl shadow-primary/20 hover:scale-105 font-black uppercase tracking-widest text-lg"
            >
              <Home className="w-5 h-5 mr-1.5" />
              Go Back Home
            </Button>

            <Button
              onClick={changeMeme}
              variant="outline"
              className="px-8 py-6 rounded-2xl transition-all duration-200 border-2 border-border hover:bg-muted font-black uppercase tracking-widest text-lg"
            >
              <RefreshCw className="w-5 h-5 mr-1.5" />
              New Meme
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 rounded-full">
              <Coffee className="w-3 h-3" />
              Still lost?
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 rounded-full">
              <Ghost className="w-3 h-3" />
              Not alone
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 rounded-full">
              <Skull className="w-3 h-3" />
              RIP Page
            </span>
          </div>

          {/* Secret click counter */}
          {clicks > 0 && (
            <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
              Secret clicks: {clicks} {clicks >= 10 ? '🏆' : ''}
              {clicks < 10 && ' (Keep clicking!)'}
            </div>
          )}
        </CardContent>

        <div className={`h-2 bg-gradient-to-r ${currentMemeData.color}`} />
      </Card>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-6xl opacity-20 animate-pulse">😵</div>
      <div className="absolute bottom-8 right-8 text-6xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>🤷</div>
    </div>
  );
}
