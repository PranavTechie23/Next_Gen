import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    Zap,
    Brain,
    Clock,
    Target,
    ArrowRight,
    CheckCircle2,
    XCircle,
    Trophy,
    RefreshCw,
    ChevronRight,
    Lightbulb,
    TrendingUp,
    Award,
    Star,
    Flame,
    BarChart3,
    BookOpen,
    Sparkles,
    Timer,
    ArrowLeft,
    Share2,
    Download,
    ChevronDown,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const questions = [
    {
        id: 1,
        question: "A block of mass 10kg is pushed with a force of 50N on a frictionless surface. What is the acceleration of the block?",
        options: ["2 m/s²", "5 m/s²", "10 m/s²", "500 m/s²"],
        answer: 1,
        explanation: "Using Newton's Second Law: F = ma. So, a = F/m = 50N / 10kg = 5 m/s².",
        difficulty: "Medium",
        category: "Mechanics",
        hint: "Remember F = ma, where F is force, m is mass, and a is acceleration"
    },
    {
        id: 2,
        question: "What is the equivalent resistance of two 10-ohm resistors connected in parallel?",
        options: ["20 ohms", "10 ohms", "5 ohms", "2.5 ohms"],
        answer: 2,
        explanation: "For parallel resistors: 1/Req = 1/R1 + 1/R2. 1/Req = 1/10 + 1/10 = 2/10. Req = 10/2 = 5 ohms.",
        difficulty: "Easy",
        category: "Circuits",
        hint: "In parallel circuits, the reciprocal of total resistance equals the sum of reciprocals"
    },
    {
        id: 3,
        question: "If a wheel of radius 0.5m is rotating at an angular velocity of 10 rad/s, what is the linear velocity of a point on its rim?",
        options: ["5 m/s", "10 m/s", "20 m/s", "50 m/s"],
        answer: 0,
        explanation: "Linear velocity v = r * ω. So, v = 0.5m * 10 rad/s = 5 m/s.",
        difficulty: "Medium",
        category: "Dynamics",
        hint: "Linear velocity = radius × angular velocity (v = rω)"
    },
    {
        id: 4,
        question: "In a DC circuit, if the voltage is 12V and the resistance is 4 ohms, what is the current flowing through it?",
        options: ["48A", "3A", "0.33A", "16A"],
        answer: 1,
        explanation: "According to Ohm's Law: I = V/R. I = 12V / 4Ω = 3A.",
        difficulty: "Easy",
        category: "Circuits",
        hint: "Ohm's Law: Current = Voltage / Resistance (I = V/R)"
    },
    {
        id: 5,
        question: "Which of the following physical quantities is a scalar?",
        options: ["Force", "Velocity", "Mass", "Acceleration"],
        answer: 2,
        explanation: "Scalar quantities have only magnitude (e.g., Mass, Time). Vector quantities have both magnitude and direction (e.g., Force, Velocity, Acceleration).",
        difficulty: "Easy",
        category: "Fundamentals",
        hint: "Scalars have magnitude only; vectors have both magnitude and direction"
    }
];

interface SkillTestProps {
    onComplete?: (score: number) => void;
    onBack?: () => void;
}

export default function SkillTest({ onComplete, onBack }: SkillTestProps) {
    const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result'>('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(300);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [questionTimes, setQuestionTimes] = useState<number[]>([]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (currentStep === 'quiz' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && currentStep === 'quiz') {
            finishTest();
        }
        return () => clearInterval(timer);
    }, [currentStep, timeLeft]);

    const handleStart = () => {
        setCurrentStep('quiz');
        setAnswers([]);
        setCurrentQuestion(0);
        setTimeLeft(300);
        setSelectedOption(null);
        setShowHint(false);
        setQuestionTimes([]);
        setQuestionStartTime(Date.now());
    };

    const handleAnswer = (optionIndex: number) => {
        setSelectedOption(optionIndex);
        setShowExplanation(true);

        const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
        setQuestionTimes([...questionTimes, timeTaken]);

        setTimeout(() => {
            const newAnswers = [...answers];
            newAnswers[currentQuestion] = optionIndex;
            setAnswers(newAnswers);

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
                setShowExplanation(false);
                setShowHint(false);
                setQuestionStartTime(Date.now());
            } else {
                finishTest();
            }
        }, 2500);
    };

    const finishTest = () => {
        setCurrentStep('result');
        if (onComplete) {
            const score = answers.reduce((acc, curr, idx) => acc + (curr === questions[idx].answer ? 1 : 0), 0);
            onComplete((score / questions.length) * 100);
        }
    };

    const score = answers.reduce((acc, curr, idx) => acc + (curr === questions[idx].answer ? 1 : 0), 0);
    const percentage = Math.round((score / questions.length) * 100);
    const timeTakenSeconds = 300 - timeLeft;
    const avgTimePerQuestion = questionTimes.length > 0 ? Math.floor(questionTimes.reduce((a, b) => a + b, 0) / questionTimes.length) : 0;

    const getPerformanceLevel = () => {
        if (percentage >= 90) return { level: 'Exceptional', color: 'text-purple-500', icon: '🎯' };
        if (percentage >= 80) return { level: 'Excellent', color: 'text-blue-500', icon: '🌟' };
        if (percentage >= 70) return { level: 'Good', color: 'text-green-500', icon: '✨' };
        if (percentage >= 60) return { level: 'Fair', color: 'text-yellow-500', icon: '💫' };
        return { level: 'Needs Improvement', color: 'text-orange-500', icon: '📚' };
    };

    const insightText = percentage >= 80
        ? "Outstanding performance! Your strong grasp of engineering fundamentals places you in the top 15% of test-takers. You demonstrate excellent problem-solving skills across mechanics, circuits, and dynamics. Companies like Google, Tesla, and SpaceX actively seek candidates with your level of technical proficiency."
        : percentage >= 60
            ? "Solid foundation! You understand most core concepts well. With focused practice on circuit analysis and rotational dynamics, you could easily join the elite bracket. Consider reviewing parallel circuit calculations and the relationship between linear and angular motion."
            : "Good start! You've demonstrated understanding of basic principles. Consistent study in Newton's Laws, Ohm's Law, and fundamental physics concepts will significantly boost your readiness. Focus on understanding the 'why' behind formulas, not just memorization.";

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const performance = getPerformanceLevel();

    const categoryBreakdown = questions.reduce((acc, q, idx) => {
        const category = q.category;
        if (!acc[category]) acc[category] = { correct: 0, total: 0 };
        acc[category].total++;
        if (answers[idx] === q.answer) acc[category].correct++;
        return acc;
    }, {} as Record<string, { correct: number; total: number }>);

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
                {currentStep === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        {onBack && (
                            <Button
                                variant="ghost"
                                onClick={onBack}
                                className="group inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors p-0 hover:bg-transparent mb-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-blue-400 group-hover:shadow-md transition-all dark:from-white/5 dark:to-white/5 dark:border-white/10">
                                    <ArrowLeft className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <span className="font-bold text-sm">Back to Dashboard</span>
                            </Button>
                        )}

                        {/* Hero Card */}
                        <Card className="relative overflow-hidden rounded-3xl border-none shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTE2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wLTIwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
                            <CardContent className="relative p-12 text-center space-y-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="mx-auto w-28 h-28 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/30"
                                >
                                    <Brain className="w-14 h-14 text-white" />
                                </motion.div>

                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-1.5 text-xs font-bold tracking-wider">
                                            <Sparkles className="w-3 h-3 mr-2" />
                                            SKILL PROFICIENCY ASSESSMENT
                                        </Badge>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-5xl sm:text-6xl font-black text-white tracking-tight"
                                    >
                                        Engineering<br />Aptitude Test
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed"
                                    >
                                        Master the fundamentals of Mechanics, Circuits, and Dynamics.
                                        Get instant AI-powered insights on your performance.
                                    </motion.p>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4"
                                >
                                    {[
                                        { icon: Clock, label: 'Duration', value: '5 Min', color: 'from-blue-400 to-cyan-400' },
                                        { icon: Target, label: 'Questions', value: '5 Items', color: 'from-purple-400 to-pink-400' },
                                        { icon: Zap, label: 'Difficulty', value: 'Mixed', color: 'from-amber-400 to-orange-400' },
                                        { icon: Trophy, label: 'Reward', value: 'Badge', color: 'from-green-400 to-emerald-400' },
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.7 + idx * 0.1 }}
                                            className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all group cursor-default"
                                        >
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                                                <item.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-2xl font-black text-white mb-1">{item.value}</p>
                                            <p className="text-xs font-bold uppercase tracking-widest text-white/70">{item.label}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                >
                                    <Button
                                        onClick={handleStart}
                                        size="lg"
                                        className="h-16 px-10 rounded-2xl bg-white text-blue-600 font-black text-lg hover:bg-white/90 hover:shadow-2xl hover:scale-105 transition-all shadow-xl gap-3 group"
                                    >
                                        Start Assessment Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            </CardContent>
                        </Card>

                        {/* Info Cards */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[
                                {
                                    icon: Lightbulb,
                                    title: 'Get Instant Feedback',
                                    description: 'See correct answers and detailed explanations after each question',
                                    color: 'from-yellow-500 to-orange-500'
                                },
                                {
                                    icon: BarChart3,
                                    title: 'AI-Powered Analysis',
                                    description: 'Receive personalized insights and career readiness assessment',
                                    color: 'from-blue-500 to-indigo-500'
                                },
                                {
                                    icon: Award,
                                    title: 'Earn Your Badge',
                                    description: 'Complete the test to unlock your engineering proficiency badge',
                                    color: 'from-purple-500 to-pink-500'
                                }
                            ].map((card, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.1 + idx * 0.1 }}
                                >
                                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-default border-slate-200 dark:border-slate-800">
                                        <CardContent className="p-6 space-y-3">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                                                <card.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-bold text-foreground">{card.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {currentStep === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm">
                            <div className="flex items-center gap-3">
                                <Badge className="h-9 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 font-bold">
                                    Question {currentQuestion + 1} / {questions.length}
                                </Badge>
                                <Badge variant="outline" className="h-9 px-4 rounded-xl font-bold">
                                    {questions[currentQuestion].category}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className={`h-9 px-4 rounded-xl font-bold ${questions[currentQuestion].difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            questions[currentQuestion].difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}
                                >
                                    {questions[currentQuestion].difficulty}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    }`}>
                                    <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'animate-pulse' : ''}`} />
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-muted-foreground">
                                <span>Progress</span>
                                <span>{Math.round((currentQuestion / questions.length) * 100)}%</span>
                            </div>
                            <Progress value={(currentQuestion / questions.length) * 100} className="h-3 rounded-full" />
                        </div>

                        {/* Question Card */}
                        <Card className="rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 shadow-2xl">
                            <CardContent className="p-8 sm:p-12 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-foreground">
                                        {questions[currentQuestion].question}
                                    </h3>

                                    {!showHint && !showExplanation && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowHint(true)}
                                            className="rounded-xl font-bold"
                                        >
                                            <Lightbulb className="w-4 h-4 mr-2" />
                                            Show Hint
                                        </Button>
                                    )}

                                    <AnimatePresence>
                                        {showHint && !showExplanation && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">Hint</p>
                                                        <p className="text-sm text-amber-800 dark:text-amber-300">{questions[currentQuestion].hint}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {questions[currentQuestion].options.map((option, idx) => {
                                        const isSelected = selectedOption === idx;
                                        const isCorrect = idx === questions[currentQuestion].answer;
                                        const showResult = showExplanation;

                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => !showExplanation && handleAnswer(idx)}
                                                    disabled={showExplanation}
                                                    className={`w-full h-auto min-h-[4rem] justify-start px-6 py-4 rounded-2xl text-left text-base sm:text-lg font-bold group transition-all ${showResult
                                                            ? isCorrect
                                                                ? 'bg-green-100 border-2 border-green-500 text-green-900 dark:bg-green-900/30 dark:border-green-500 dark:text-green-100'
                                                                : isSelected
                                                                    ? 'bg-red-100 border-2 border-red-500 text-red-900 dark:bg-red-900/30 dark:border-red-500 dark:text-red-100'
                                                                    : 'bg-slate-50 border border-slate-200 text-slate-400 dark:bg-slate-900/30 dark:border-slate-800 dark:text-slate-500'
                                                            : 'bg-white border-2 border-slate-200 hover:bg-blue-50 hover:border-blue-400 text-foreground dark:bg-slate-900/50 dark:border-slate-800 dark:hover:bg-blue-900/30 dark:hover:border-blue-500'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4 w-full">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${showResult
                                                                ? isCorrect
                                                                    ? 'bg-green-500 text-white'
                                                                    : isSelected
                                                                        ? 'bg-red-500 text-white'
                                                                        : 'bg-slate-200 text-slate-400 dark:bg-slate-800'
                                                                : 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white dark:bg-blue-900/50 dark:text-blue-400'
                                                            }`}>
                                                            {showResult ? (
                                                                isCorrect ? (
                                                                    <CheckCircle2 className="w-5 h-5" />
                                                                ) : isSelected ? (
                                                                    <XCircle className="w-5 h-5" />
                                                                ) : (
                                                                    String.fromCharCode(65 + idx)
                                                                )
                                                            ) : (
                                                                String.fromCharCode(65 + idx)
                                                            )}
                                                        </div>
                                                        <span className="flex-1">{option}</span>
                                                    </div>
                                                </Button>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <AnimatePresence>
                                    {showExplanation && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 rounded-2xl bg-blue-50 border-2 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                                        >
                                            <div className="flex items-start gap-3">
                                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                <div className="space-y-2">
                                                    <p className="font-bold text-blue-900 dark:text-blue-200">
                                                        {selectedOption === questions[currentQuestion].answer ? '✓ Correct!' : '✗ Incorrect'}
                                                    </p>
                                                    <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                                                        {questions[currentQuestion].explanation}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Results Hero */}
                        <Card className="relative overflow-hidden rounded-3xl border-none shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:bg-gradient-to-br dark:from-black dark:via-black dark:to-black">
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600" />
                            <CardContent className="p-12 text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", duration: 0.8 }}
                                    className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl mx-auto flex items-center justify-center shadow-2xl border border-white/30"
                                >
                                    <Trophy className="w-12 h-12 text-white" />
                                </motion.div>

                                <div className="space-y-3">
                                    <h2 className="text-4xl sm:text-5xl font-black text-white">Assessment Complete!</h2>
                                    <p className="text-xl text-white/90">Your engineering proficiency results are ready</p>
                                </div>

                                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30">
                                    <span className="text-6xl">{performance.icon}</span>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-white/80">Performance Level</p>
                                        <p className={`text-2xl font-black text-white`}>{performance.level}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Score Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {[
                                { icon: CheckCircle2, label: 'Score', value: `${score}/${questions.length}`, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                                { icon: TrendingUp, label: 'Accuracy', value: `${percentage}%`, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                                { icon: Clock, label: 'Time Taken', value: formatTime(timeTakenSeconds), color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                                { icon: Zap, label: 'Avg per Q', value: `${avgTimePerQuestion}s`, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className={`${stat.bg} border-none shadow-lg hover:shadow-xl transition-all`}>
                                        <CardContent className="p-6 text-center space-y-3">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto shadow-lg`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-3xl font-black text-foreground">{stat.value}</p>
                                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Category Breakdown */}
                        <Card className="rounded-3xl shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                    Performance by Category
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(categoryBreakdown).map(([category, data]) => {
                                    const catPercentage = Math.round((data.correct / data.total) * 100);
                                    return (
                                        <div key={category} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-foreground">{category}</span>
                                                <span className="text-sm font-bold text-muted-foreground">
                                                    {data.correct}/{data.total} ({catPercentage}%)
                                                </span>
                                            </div>
                                            <Progress value={catPercentage} className="h-2.5" />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* AI Insights */}
                        <Card className="rounded-3xl shadow-xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-blue-200 dark:border-blue-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                    AI-Powered Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-foreground leading-relaxed">{insightText}</p>
                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl font-bold border-2"
                                    onClick={() => setIsReportOpen(true)}
                                >
                                    View Detailed Analysis
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            <Button
                                onClick={handleStart}
                                variant="outline"
                                className="h-14 rounded-2xl font-bold border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Retake Test
                            </Button>
                            <Button
                                variant="outline"
                                className="h-14 rounded-2xl font-bold border-2"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                Share Results
                            </Button>
                            <Button
                                onClick={onBack || (() => window.location.reload())}
                                className="h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                Back to Dashboard
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detailed Report Dialog */}
            <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden">
                    <div className="p-8 space-y-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black">Detailed Performance Report</DialogTitle>
                            <DialogDescription className="text-base">
                                Comprehensive analysis of your skill test performance
                            </DialogDescription>
                        </DialogHeader>

                        <Separator />

                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Score', value: `${score}/${questions.length}`, icon: CheckCircle2, color: 'text-blue-600' },
                                    { label: 'Accuracy', value: `${percentage}%`, icon: TrendingUp, color: 'text-purple-600' },
                                    { label: 'Time', value: formatTime(timeTakenSeconds), icon: Clock, color: 'text-amber-600' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                                        <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                                        <p className="text-2xl font-black text-foreground">{stat.value}</p>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800">
                                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-blue-600" />
                                    Performance Analysis
                                </h4>
                                <p className="text-foreground/90 leading-relaxed">{insightText}</p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-foreground flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Question-by-Question Breakdown
                                </h4>
                                {questions.map((q, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${answers[idx] === q.answer
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {answers[idx] === q.answer ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">Question {idx + 1}</p>
                                                <p className="text-xs text-muted-foreground">{q.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-foreground">{questionTimes[idx] || 0}s</p>
                                            <Badge variant={answers[idx] === q.answer ? "default" : "destructive"} className="text-xs">
                                                {answers[idx] === q.answer ? 'Correct' : 'Incorrect'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl font-bold"
                                onClick={() => setIsReportOpen(false)}
                            >
                                Close
                            </Button>
                            <Button
                                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}