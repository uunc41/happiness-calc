import React, { useState } from 'react';
import { Sparkles, Moon, Sun, Zap, TrendingUp, ClipboardCheck } from 'lucide-react';

interface HappinessResult {
  score: number;
  label: string;
  color: string;
  feedback: string;
}

const happinesscalc: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'neon'>('dark');
  const [happinessText, setHappinessText] = useState('');
  const [currentHappiness, setCurrentHappiness] = useState<HappinessResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeHappiness = (): HappinessResult => {
    let score = 50;
    const lowerText = happinessText.toLowerCase();

    const positivePatterns = [
      { regex: /\b(i'?m\s+)?(feeling\s+)?(really\s+|super\s+|very\s+|pretty\s+|extremely\s+)?(happy|great|amazing|wonderful|fantastic|awesome|excellent|excited|joyful|blessed|good|ecstatic|thrilled)\b/gi, weight: 29 },
      { regex: /\b(love|loving|adore|enjoy|delighted)\b/gi, weight: 20 },
      { regex: /\b(positive|optimistic|hopeful|confident|proud)\b/gi, weight: 17 },
      { regex: /\b(calm|relaxed|peaceful|zen)\b/gi, weight: 16 },
      { regex: /\b(best\s+day|perfect|phenomenal|outstanding|brilliant)\b/gi, weight: 25 },
      { regex: /😊|😄|😃|🙂|😁|🥰|😍|🤗|✨|⭐|🌟|💪|🎉|🔥|❤️|💖|😎/g, weight: 14 },
    ];

    const negativePatterns = [
      { regex: /\b(i'?m\s+)?(feeling\s+)?(really\s+|super\s+|very\s+|pretty\s+|so\s+|extremely\s+)?(sad|depressed|down|low|blue|miserable|awful|bad|terrible|horrible|devastated)\b/gi, weight: 29 },
      { regex: /\b(tired|exhausted|drained|burnt\s+out)\b/gi, weight: 20 },
      { regex: /\b(stressed|anxious|worried|nervous|overwhelmed|panicked)\b/gi, weight: 17 },
      { regex: /\b(angry|mad|furious|frustrated)\b/gi, weight: 20 },
      { regex: /\b(lonely|isolated|alone|abandoned)\b/gi, weight: 23 },
      { regex: /\b(hopeless|helpless|worthless|broken)\b/gi, weight: 35 },
      { regex: /\b(worst\s+day|nightmare|disaster)\b/gi, weight: 29 },
      { regex: /😢|😭|😔|😞|😣|😩|😤|😠|😡|💔|😰|😱/g, weight: 14 },
    ];

    positivePatterns.forEach(({ regex, weight }) => {
      const matches = lowerText.match(regex);
      if (matches) {
        matches.forEach(match => {
          let multiplier = /really|super|pretty|very|extremely|incredibly/.test(match) ? 1.5 : 1;
          score += weight * multiplier;
        });
      }
    });

    negativePatterns.forEach(({ regex, weight }) => {
      const matches = lowerText.match(regex);
      if (matches) {
        matches.forEach(match => {
          let multiplier = /really|super|pretty|very|so|extremely|incredibly/.test(match) ? 1.5 : 1;
          score -= weight * multiplier;
        });
      }
    });

    score += Math.random() * 10 - 5;
    score = Math.max(0, Math.min(100, score));

    let label: string, color: string;
    if (score >= 80) {
      label = 'Amazing';
      color = '#10b981';
    } else if (score >= 65) {
      label = 'Happy';
      color = '#3b82f6';
    } else if (score >= 50) {
      label = 'Good';
      color = '#8b5cf6';
    } else if (score >= 35) {
      label = 'Okay';
      color = '#f59e0b';
    } else if (score >= 20) {
      label = 'Low';
      color = '#ef4444';
    } else {
      label = 'Poor';
      color = '#dc2626';
    }

    const feedback = generateFeedback(lowerText, score);
    return { score: Math.round(score), label, color, feedback };
  };

  const generateFeedback = (text: string, score: number): string => {
    if (score >= 80) return "You're very happy, keep going!";
    if (score >= 65) return "You're happy today, good job!";
    if (score >= 50) return "You're decently happy right now.";
    if (score >= 35) return "You're not feeling great right now, it'll get better.";
    if (score < 35) return "You're having a bad time right now, don't worry it'll pass.";
    return "Thanks for using HappinessCalc!";
  };

  const handleAnalyze = () => {
    if (!happinessText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeHappiness();
      setCurrentHappiness(result);
      setIsAnalyzing(false);
    }, 1200);
  };

  const themes = {
    light: {
      bg: 'bg-gradient-to-br from-blue-50 to-purple-50',
      card: 'bg-white/80 backdrop-blur-sm',
      text: 'text-gray-800',
      border: 'border-gray-200',
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900',
      card: 'bg-gray-800/50 backdrop-blur-lg',
      text: 'text-white',
      border: 'border-gray-700',
    },
    neon: {
      bg: 'bg-gradient-to-br from-black via-purple-950 to-black',
      card: 'bg-black/50 backdrop-blur-lg border-2 border-cyan-500/30',
      text: 'text-cyan-100',
      border: 'border-cyan-500/30',
    },
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-all duration-500 px-4 md:px-8 flex flex-col items-center justify-center pt-8 md:pt-16 overflow-x-hidden overflow-y-auto`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -webkit-overflow-scrolling-touch">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          >
            <Sparkles className="text-purple-500/20" size={16} />
          </div>
        ))}
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className={`${theme === 'neon' ? 'text-cyan-400' : 'text-purple-500'} animate-pulse`} size={36} />
            <h1 className={`text-4xl md:text-5xl font-bold ${currentTheme.text} tracking-tight`}>
              Happiness<span className={theme === 'neon' ? 'text-cyan-400' : 'text-purple-600'}>Calc</span>
            </h1>
          </div>
          <p className={`${currentTheme.text} opacity-80`}> Quick happiness calculation in seconds </p>
        </header>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setTheme('light')}
            className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-white/10 text-black/60 border'}`}
          >
            <Sun size={18} />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-purple-500 text-white' : 'bg-white/10 text-black/60 border'}`}
          >
            <Moon size={18} />
          </button>
          <button
            onClick={() => setTheme('neon')}
            className={`p-2 rounded-lg transition-all ${theme === 'neon' ? 'bg-cyan-500 text-black' : 'bg-white/10 text-black/60 border'}`}
          >
            <Zap size={18} />
          </button>
        </div>

        <div className={`${currentTheme.card} rounded-3xl p-8 shadow-2xl border ${currentTheme.border} animate-slide-up`}>
          <div className="mb-6">
            <label className={`block ${currentTheme.text} mb-3 font-medium text-lg`}>
              How are you feeling?
            </label>
            <textarea
              value={happinessText}
              onChange={(e) => setHappinessText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
              className={`w-full ${currentTheme.card} ${currentTheme.text} ${currentTheme.border} border rounded-2xl p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all resize-none text-lg`}
              rows={4}
              placeholder="I'm feeling..."
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !happinessText.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-105 active:scale-90 transition-all duration-100 shadow-lg mb-6 ${
              isAnalyzing || !happinessText.trim()
                ? 'bg-gray-500 cursor-not-allowed'
                : theme === 'neon'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <TrendingUp size={20} /> Analyze Happiness
              </span>
            )}
          </button>

          {currentHappiness && (
            <div
              className={`${currentTheme.border} border rounded-2xl p-6 backdrop-blur-sm animate-slide-up`}
              style={{ boxShadow: theme === 'neon' ? `0 0 30px ${currentHappiness.color}30` : undefined }}
            >
              <div className="flex justify-center mb-4">
                <div
                  className="relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500"
                  style={{
                    background: `radial-gradient(circle, ${currentHappiness.color}30, transparent)`,
                    boxShadow: `0 0 40px ${currentHappiness.color}40`,
                  }}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-1 animate-bounce">
                      <ClipboardCheck size={48} color={currentHappiness.color} />
                    </div>
                    <div className={`text-2xl font-bold ${currentTheme.text}`}>{currentHappiness.score}</div>
                  </div>
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className={`text-2xl font-bold ${currentTheme.text}`} style={{ color: currentHappiness.color }}>
                  {currentHappiness.label}
                </h3>
              </div>
              <p className={`${currentTheme.text} opacity-90 text-center leading-relaxed`}>{currentHappiness.feedback}</p>
              <div className="mt-4">
                <div className="h-2 bg-gray-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out rounded-full"
                    style={{
                      width: `${currentHappiness.score}%`,
                      backgroundColor: currentHappiness.color,
                      boxShadow: `0 0 15px ${currentHappiness.color}`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float linear infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default happinesscalc;
