'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Phone,
    ShoppingCart,
    QrCode,
    Smartphone,
    Star,
    Settings,
    BarChart,
    Zap
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ModeToggle } from './_components/darkMode';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
    const companyFeatures = [
        {
            icon: <Settings className="w-12 h-12 text-primary" />,
            title: "Seamless Management",
            description: "Take control of your business with a simple, clutter-free dashboard that lets you manage products seamlessly."
        },
        {
            icon: <BarChart className="w-12 h-12 text-primary" />,
            title: "Intuitive Analytics",
            description: "Access real-time insights into sales, customer trends, and performance with our easy-to-use analytics tools."
        },
        {
            icon: <Zap className="w-12 h-12 text-primary" />,
            title: "Instant Controls",
            description: "Quickly manage orders, update menus, and respond to customers with our fast and responsive interface."
        }
    ];
    const userFeatures = [
        {
            icon: <ShoppingCart className="w-12 h-12 text-primary" />,
            title: "Effortless Ordering",
            description: "Skip the lines and easily order from your favorite restaurant with just a few taps."
        },
        {
            icon: <QrCode className="w-12 h-12 text-primary" />,
            title: "Quick Checkout",
            description: "Scan, select, and pay instantly — no queues, just a smooth and fast experience."
        },
        {
            icon: <Smartphone className="w-12 h-12 text-primary" />,
            title: "Complete Convenience",
            description: "Get your Updates in real-time, manage your preferences, and stay updated on every step."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col dark:bg-black bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <div className="flex items-center space-x-2">
                        <Image
                            src='/assets/0q-d-rm.png'
                            alt="ZeroQue Logo"
                            className=" dark:hidden"
                            width={50} height={50}
                        />

                        <Image
                            src='/assets/0-q-x.png'
                            alt="ZeroQue Logo"
                            className=" hidden dark:block"
                            width={50} height={50}
                        />
                        <h1 className="text-2xl hidden font-bold sm:flex text-primary">{`ZEROQUE`}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ModeToggle />
                        <Link href='/auth/login'><Button variant="outline">Login</Button></Link>
                        <Link href='/auth/signup'><Button>Sign Up</Button></Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex flex-col-reverse md:flex-row justify-between items-center container mx-auto px-4 py-16 gap-12">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
          duration: 1,
        }}
        className="flex-1"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
          Never Be in a Queue
        </h2>
        <p className="text-xl mb-8 text-muted-foreground">
          Revolutionize your food ordering experience with ZeroQue - Skip lines, order smartly, eat happily!
        </p>
        <div className="flex space-x-4">
          <Button size="lg" className="group">
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
          duration: 1,
        }}
        className="flex-1 flex justify-center bg-transparent"
      >
        <Image
          width={400}
          height={400}
           src='/assets/0-q-x.png'
          alt="ZeroQue App"
          className="hidden dark:block w-[80%] md:h-56 md:w-56"
        />
        <Image
          width={400}
          height={400}
          src='/assets/0q-d-rm.png'
          alt="ZeroQue App"
          className="dark:hidden w-[80%] md:h-56 md:w-56"
        />
      </motion.div>
    </main>

            {/* How ZeroQue Works Section */}
            <section className="py-16 bg-muted/20">
            <div className="text-center flex justify-center mb-4">
            <div className='w-[50%] h-full border-b-2  '>
                <h3 className="text-3xl font-bold mb-4">How ZeroQue Works</h3>
            </div>
          
          </div>
                <div className="container mx-auto px-4">
                    {/* Companies Section */}
                    <div className="text-center mb-16">
                        <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Empower your restaurant or store with seamless digital management and insights.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-3 gap-8 mb-16"
                    >
                        {companyFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                className="bg-white dark:bg-black/50 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all"
                            >
                                <div className="mb-4 flex justify-center">{feature.icon}</div>
                                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Users Section */}
                    <div className="text-center mb-16">
                        <h3 className="text-2xl font-bold mb-4">For Users</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Experience dining like never before with our user-friendly mobile solution.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {userFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                className="bg-white dark:bg-black/50 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all"
                            >
                                <div className="mb-4 flex justify-center">{feature.icon}</div>
                                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted/10 py-12">
                <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
                    <div>
                        <h5 className="font-bold mb-4 text-primary">ZEROQUE</h5>
                        <p className="text-sm text-muted-foreground">
                            {'"Never be in a Queue Or no lines, only convenience"'}
                        </p>
                    </div>
                    <div>
                        <h6 className="font-semibold mb-3">Quick Links</h6>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Home</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Features</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">About</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-semibold mb-3">Support</h6>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h6 className="font-semibold mb-3">Connect</h6>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary"><Phone size={20} /></Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary"><Star size={20} /></Link>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-8 text-center border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                        © 2024 ZeroQue. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;