import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowLeft, Check, X, Sparkles, GraduationCap, Users, Zap, Shield, BookOpen, Award, Star, HelpCircle, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function StudentPricing(props: any) {
  const isDashboard = props?.isDashboard || false;
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const handleBack = () => {
    window.history.back();
  };

  const plans = [
    {
      name: 'Free',
      icon: BookOpen,
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: [
        { text: 'Up to 3 active projects', included: true },
        { text: '100 MB storage', included: true },
        { text: 'Basic collaboration tools', included: true },
        { text: 'Community support', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Advanced analytics', included: false },
        { text: 'Priority support', included: false },
        { text: 'Custom integrations', included: false }
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'from-slate-500 to-slate-600'
    },
    {
      name: 'Student',
      icon: GraduationCap,
      price: { monthly: 4.99, annual: 49.99 },
      description: 'Ideal for individual students',
      badge: '50% OFF',
      features: [
        { text: 'Unlimited projects', included: true },
        { text: '10 GB storage', included: true },
        { text: 'Advanced collaboration', included: true },
        { text: 'Email support', included: true },
        { text: 'Mobile & desktop apps', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Export & backup tools', included: true },
        { text: 'Custom integrations', included: false }
      ],
      cta: 'Start Free Trial',
      popular: true,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Team',
      icon: Users,
      price: { monthly: 9.99, annual: 99.99 },
      description: 'For student groups & clubs',
      badge: 'BEST VALUE',
      features: [
        { text: 'Everything in Student, plus:', included: true },
        { text: 'Up to 10 team members', included: true },
        { text: '100 GB shared storage', included: true },
        { text: 'Team collaboration hub', included: true },
        { text: 'Priority support', included: true },
        { text: 'Admin controls', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Video conferencing', included: true }
      ],
      cta: 'Start Free Trial',
      popular: false,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const faqs = [
    {
      question: 'How do I verify my student status?',
      answer: 'Simply sign up with your .edu email address or upload your student ID. Verification is typically instant for .edu emails.'
    },
    {
      question: 'How long does student pricing last?',
      answer: 'Student pricing is valid as long as you maintain your student status. We verify annually to ensure continued eligibility.'
    },
    {
      question: 'Can I switch plans anytime?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'All paid plans come with a 14-day free trial. No credit card required to start your trial.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, PayPal, and student payment platforms like Flywire.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'No, we do not offer refunds for any reason. All payments are final and non-refundable.'
    }
  ];



  const formatPrice = (plan: typeof plans[0]) => {
    if (billingPeriod === 'monthly' && plan.price.monthly === 0) return 'Free';
    if (billingPeriod === 'annual' && plan.price.annual === 0) return 'Free';
    return billingPeriod === 'monthly'
      ? `$${plan.price.monthly}/mo`
      : `$${(plan.price.annual / 12).toFixed(2)}/mo`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingPeriod === 'annual' && plan.price.annual > 0) {
      const monthlyCost = plan.price.monthly * 12;
      const savings = monthlyCost - plan.price.annual;
      return `Save $${savings.toFixed(2)}/year`;
    }
    return null;
  };

  return (
    <div className={`${!isDashboard ? "min-h-screen bg-background" : "bg-transparent"} transition-colors duration-300`}>
      <div className={`${!isDashboard ? "container mx-auto px-4 py-12 max-w-7xl" : "p-0"}`}>
        {!isDashboard && (
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="hover:bg-white/50 dark:hover:bg-slate-800/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <ThemeToggle />
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Special Student Pricing
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
            Build Your Future Today
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium max-w-3xl mx-auto mb-8 leading-relaxed">
            Exclusive pricing designed for students. Connect with peers, collaborate on projects, and achieve your academic goals.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${billingPeriod === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${billingPeriod === 'annual'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 rounded-[2.5rem] backdrop-blur-3xl ${plan.popular
                  ? 'border-4 border-blue-500 shadow-2xl scale-105 z-10'
                  : 'bg-white/80 dark:bg-slate-900/50 border-slate-100 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-700 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-xl'
                  }`}
              >
                {plan.badge && (
                  <div className={`absolute top-0 right-0 bg-gradient-to-r ${plan.color} text-white px-4 py-1 text-xs font-bold`}>
                    {plan.badge}
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{plan.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-slate-600 dark:text-slate-400 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="text-center">
                    <div className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                      {formatPrice(plan)}
                    </div>
                    {billingPeriod === 'annual' && plan.price.annual > 0 && (
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        ${plan.price.annual} billed annually
                      </div>
                    )}
                    {getSavings(plan) && (
                      <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        {getSavings(plan)}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Button
                    className={`w-full mb-6 h-12 rounded-2xl font-black uppercase tracking-widest ${plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-900/20'
                      } text-white`}
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included
                          ? 'text-slate-700 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-500'
                          }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>



        {/* Trust Badges */}<Card className="
  bg-gradient-to-r from-blue-600 to-indigo-200 
  dark:bg-gradient-to-r dark:from-black dark:to-gray-900
  border-0 dark:border-2 dark:border-gray-500
  text-white
">

          <CardContent className="py-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Trusted by Students Worldwide</h2>
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-8">
              <div>
                <div className="text-4xl font-bold mb-2">500K+</div>
                <div className="text-blue-100">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1,200+</div>
                <div className="text-blue-100">Universities</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4.9/5</div>
                <div className="text-blue-100">Student Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto mb-16 px-4">
          <h2 className="text-3xl font-black text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
            {faqs.map((faq, index) => (
              <Accordion type="single" collapsible key={index} className="w-full">
                <AccordionItem value={`item-${index}`} className="border-2 rounded-[1.5rem] px-6 py-1 hover:border-blue-300 dark:hover:border-blue-700 transition-all bg-white/50 dark:bg-slate-900/30">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-base font-bold tracking-tight">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>

        {/* CTA Section */}<Card className="
  bg-gradient-to-r from-purple-600 to-pink-600 
  dark:bg-gradient-to-r dark:from-black dark:to-gray-900
  border-0 dark:border-2 dark:border-gray-500
  text-white
">

          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 text-purple-100 max-w-2xl mx-auto">
              Join thousands of students already using our platform to collaborate, learn, and succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}