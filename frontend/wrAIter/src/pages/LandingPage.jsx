import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Star, Sparkles } from 'lucide-react';
import { FEATURES, TESTIMONIALS } from '../utils/data';
import Button from '../components/ui/Button';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 glass border-b border-border/40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                            <BookOpen size={18} className="text-white" />
                        </div>
                        <span className="text-lg font-bold">wr<span className="gradient-text">AI</span>ter</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Sign in</Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 gradient-bg-soft" />
                <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
                        <Sparkles size={14} />
                        AI-Powered Book Writing Platform
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6 animate-fade-in-up">
                        Write your next book{' '}
                        <span className="gradient-text">with AI</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        From outline to finished ebook — wrAIter helps you create professionally written books in minutes, not months. Powered by advanced AI.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/signup">
                            <Button size="lg" icon={ArrowRight} iconPosition="right">
                                Start Writing Free
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" size="lg">
                                Sign in
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 sm:py-28 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                            Everything you need to write
                        </h2>
                        <p className="text-text-secondary text-lg max-w-xl mx-auto">
                            Powerful tools that make book writing simple, fast, and beautiful.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="group p-6 rounded-2xl bg-white border border-border/60 hover:border-primary/20 hover:shadow-elevated transition-all duration-300"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon size={22} className="text-white" />
                                    </div>
                                    <h3 className="text-base font-semibold text-text-primary mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 gradient-bg-soft">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                            Loved by writers
                        </h2>
                        <p className="text-text-secondary text-lg">
                            See what our users are saying about wrAIter.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 border border-border/60 shadow-soft hover:shadow-elevated transition-all duration-300"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <Star key={j} size={14} className="fill-warning text-warning" />
                                    ))}
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed mb-5 italic">
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={t.avatar}
                                        alt={t.author}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">{t.author}</p>
                                        <p className="text-xs text-text-muted">{t.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 sm:py-28 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                        Ready to start writing?
                    </h2>
                    <p className="text-text-secondary text-lg mb-8">
                        Join thousands of writers who use wrAIter to bring their ideas to life.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" icon={ArrowRight} iconPosition="right">
                            Create your free account
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md gradient-bg flex items-center justify-center">
                            <BookOpen size={12} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold">wr<span className="gradient-text">AI</span>ter</span>
                    </div>
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} wrAIter. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
