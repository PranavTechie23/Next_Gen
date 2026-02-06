import React, { useState, useEffect } from 'react';
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
    AlertCircle,
    Trophy,
    RefreshCw,
    ChevronRight,
    Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
    {
        id: 1,
        question: "A block of mass 10kg is pushed with a force of 50N on a frictionless surface. What is the acceleration of the block?",
        options: ["2 m/s²", "5 m/s²", "10 m/s²", "500 m/s²"],
        answer: 1, // 5 m/s²
        explanation: "Using Newton's Second Law: F = ma. So, a = F/m = 50N / 10kg = 5 m/s²."
    },
    {
        id: 2,
        question: "What is the equivalent resistance of two 10-ohm resistors connected in parallel?",
        options: ["20 ohms", "10 ohms", "5 ohms", "2.5 ohms"],
        answer: 2, // 5 ohms
        explanation: "For parallel resistors: 1/Req = 1/R1 + 1/R2. 1/Req = 1/10 + 1/10 = 2/10. Req = 10/2 = 5 ohms."
    },
    {
        id: 3,
        question: "If a wheel of radius 0.5m is rotating at an angular velocity of 10 rad/s, what is the linear velocity of a point on its rim?",
        options: ["5 m/s", "10 m/s", "20 m/s", "50 m/s"],
        answer: 0, // 5 m/s
        explanation: "Linear velocity v = r * ω. So, v = 0.5m * 10 rad/s = 5 m/s."
    },
    {
        id: 4,
        question: "In a DC circuit, if the voltage is 12V and the resistance is 4 ohms, what is the current flowing through it?",
        options: ["48A", "3A", "0.33A", "16A"],
        answer: 1, // 3A
        explanation: "According to Ohm's Law: I = V/R. I = 12V / 4Ω = 3A."
    },
    {
        id: 5,
        question: "Which of the following physical quantities is a scalar?",
        options: ["Force", "Velocity", "Mass", "Acceleration"],
        answer: 2, // Mass
        explanation: "Scalar quantities have only magnitude (e.g., Mass, Time). Vector quantities have both magnitude and direction (e.g., Force, Velocity, Acceleration)."
    }
];

export default function SkillTest({ onComplete, onBack }: { onComplete?: (score: number) => void; onBack?: () => void }) {
    const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result'>('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        let timer: any;
        if (currentStep === 'quiz' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setCurrentStep('result');
        }
        return () => clearInterval(timer);
    }, [currentStep, timeLeft]);

    const handleStart = () => {
        setCurrentStep('quiz');
        setAnswers([]);
        setCurrentQuestion(0);
        setTimeLeft(300);
    };

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIndex;
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setCurrentStep('result');
            if (onComplete) {
                const score = newAnswers.reduce((acc, curr, idx) => acc + (curr === questions[idx].answer ? 1 : 0), 0);
                onComplete((score / questions.length) * 100);
            }
        }
    };

    const score = answers.reduce((acc, curr, idx) => acc + (curr === questions[idx].answer ? 1 : 0), 0);
    const percentage = (score / questions.length) * 100;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
                {currentStep === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {onBack && (
                            <Button
                                variant="ghost"
                                onClick={onBack}
                                className="group flex items-center gap-2 text-muted-foreground hover:text-white transition-colors p-0 hover:bg-transparent"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                                    <ArrowRight className="w-4 h-4 rotate-180 hover:text-blue-500 transition-colors" />
                                </div>
                                <span className="font-bold text-sm uppercase tracking-widest hover:text-blue-500 transition-colors">Back to Dashboard</span>
                            </Button>
                        )}
                        <Card className="rounded-[2.5rem] overflow-hidden border-blue-500/20 bg-card/50 backdrop-blur-xl shadow-2xl">
                            <CardContent className="p-8 sm:p-12 text-center space-y-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20">
                                    <Brain className="w-12 h-12 text-white" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Engineering Aptitude Test</h2>
                                    <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                                        Test your fundamental knowledge in Mechanics, Circuits, and Dynamics.
                                        This 5-question quick assessment will analyze your career readiness.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                        <Clock className="w-5 h-5 text-blue-400 mx-auto" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Time</p>
                                        <p className="text-lg font-black">5 Min</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                        <Target className="w-5 h-5 text-purple-400 mx-auto" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Items</p>
                                        <p className="text-lg font-black">5 Qs</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                        <Zap className="w-5 h-5 text-amber-400 mx-auto" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Focus</p>
                                        <p className="text-lg font-black">Physics</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                        <Trophy className="w-5 h-5 text-green-400 mx-auto" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reward</p>
                                        <p className="text-lg font-black">Badge</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleStart}
                                    className="h-16 px-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl hover:opacity-90 shadow-xl shadow-blue-500/30 gap-3 group"
                                >
                                    Start Assessment
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between gap-4 px-2">
                            <div className="flex items-center gap-3">
                                <Badge className="h-8 px-4 rounded-lg bg-blue-500/10 text-blue-400 border-blue-500/20 font-black tracking-widest text-[10px] uppercase">
                                    Question {currentQuestion + 1} of {questions.length}
                                </Badge>
                                <div className="flex items-center gap-2 text-sm font-black text-amber-400">
                                    <Clock className="w-4 h-4" />
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <div className="w-1/3">
                                <Progress value={(currentQuestion / questions.length) * 100} className="h-2 rounded-full" />
                            </div>
                        </div>

                        <Card className="rounded-[2.5rem] overflow-hidden border-blue-500/20 bg-card/80 backdrop-blur-xl shadow-2xl">
                            <CardContent className="p-8 sm:p-12 space-y-8">
                                <h3 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                                    {questions[currentQuestion].question}
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    {questions[currentQuestion].options.map((option, idx) => (
                                        <Button
                                            key={idx}
                                            variant="ghost"
                                            onClick={() => handleAnswer(idx)}
                                            className="h-16 justify-start px-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/50 text-left text-lg font-bold group transition-all"
                                        >
                                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="rounded-[3rem] overflow-hidden border-blue-500/20 bg-card/80 backdrop-blur-xl shadow-2xl relative">
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600"></div>
                            <CardContent className="p-8 sm:p-12 space-y-10">
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto flex items-center justify-center animate-bounce">
                                        <Trophy className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black">Assessment Complete!</h2>
                                    <p className="text-muted-foreground font-medium">Here's how you performed in your engineering aptitude test.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2">
                                        <p className="text-5xl font-black text-blue-400">{score}/{questions.length}</p>
                                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Correct Answers</p>
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2">
                                        <p className="text-5xl font-black text-purple-400">{percentage}%</p>
                                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2">
                                        <p className="text-5xl font-black text-amber-400">{formatTime(300 - timeLeft)}</p>
                                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Time Taken</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <h4 className="text-xl font-black flex items-center gap-2">
                                        <Lightbulb className="w-6 h-6 text-amber-400" />
                                        AI Insight Report
                                    </h4>
                                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-4 font-medium text-blue-100/80 leading-relaxed">
                                        <p>
                                            {percentage >= 80
                                                ? "Excellent! You have a strong grasp of fundamental engineering principles. You are in the top 10% of candidates for roles at companies like Google or SpaceX."
                                                : percentage >= 60
                                                    ? "Good job! You understand most concepts well, but some refinement in circuits and dynamics would push you into the elite bracket."
                                                    : "Keep practicing! You have the basics down, but consistent study in mechanics and electrical fundamentals will significantly boost your readiness."
                                            }
                                        </p>
                                        <Button variant="link" className="text-blue-400 p-0 font-black uppercase text-xs tracking-widest">
                                            View Detailed Roadmap
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                    <Button
                                        onClick={handleStart}
                                        className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black gap-2 transition-all"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        Retake Test
                                    </Button>
                                    <Button
                                        className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black gap-2 shadow-lg shadow-blue-500/20"
                                        onClick={onBack || (() => window.location.reload())}
                                    >
                                        Return to Dashboard
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
