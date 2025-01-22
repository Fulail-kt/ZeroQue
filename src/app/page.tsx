// 'use client'
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//     ArrowRight,
//     Phone,
//     ShoppingCart,
//     QrCode,
//     Smartphone,
//     Star,
//     Settings,
//     BarChart,
//     Zap
// } from 'lucide-react';
// import { Button } from '~/components/ui/button';
// import { ModeToggle } from './_components/global/darkMode';
// import Link from 'next/link';
// import Image from 'next/image';

// const LandingPage = () => {
//     const companyFeatures = [
//         {
//             icon: <Settings className="w-12 h-12 text-primary" />,
//             title: "Seamless Management",
//             description: "Take control of your business with a simple, clutter-free dashboard that lets you manage products seamlessly."
//         },
//         {
//             icon: <BarChart className="w-12 h-12 text-primary" />,
//             title: "Intuitive Analytics",
//             description: "Access real-time insights into sales, customer trends, and performance with our easy-to-use analytics tools."
//         },
//         {
//             icon: <Zap className="w-12 h-12 text-primary" />,
//             title: "Instant Controls",
//             description: "Quickly manage orders, update menus, and respond to customers with our fast and responsive interface."
//         }
//     ];
//     const userFeatures = [
//         {
//             icon: <ShoppingCart className="w-12 h-12 text-primary" />,
//             title: "Effortless Ordering",
//             description: "Skip the lines and easily order from your favorite restaurant with just a few taps."
//         },
//         {
//             icon: <QrCode className="w-12 h-12 text-primary" />,
//             title: "Quick Checkout",
//             description: "Scan, select, and pay instantly — no queues, just a smooth and fast experience."
//         },
//         {
//             icon: <Smartphone className="w-12 h-12 text-primary" />,
//             title: "Complete Convenience",
//             description: "Get your Updates in real-time, manage your preferences, and stay updated on every step."
//         }
//     ];

//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 delayChildren: 0.3,
//                 staggerChildren: 0.2
//             }
//         }
//     };

//     const itemVariants = {
//         hidden: { y: 50, opacity: 0 },
//         visible: {
//             y: 0,
//             opacity: 1,
//             transition: {
//                 type: "spring",
//                 stiffness: 100,
//                 damping: 10
//             }
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col dark:bg-black bg-white">
//             {/* Header */}
//             <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md">
//                 <div className="container mx-auto flex justify-between items-center p-4">
//                     <div className="flex items-center space-x-2">
//                         <Image
//                             src='/assets/0q-d-rm.png'
//                             alt="ZeroQue Logo"
//                             className=" dark:hidden"
//                             width={50} height={50}
//                         />

//                         <Image
//                             src='/assets/0-q-x.png'
//                             alt="ZeroQue Logo"
//                             className=" hidden dark:block"
//                             width={50} height={50}
//                         />
//                         <h1 className="text-2xl hidden font-bold sm:flex text-primary">{`ZEROQUE`}</h1>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <ModeToggle />
//                         <Link href='/auth/login'><Button variant="outline">Login</Button></Link>
//                         <Link href='/auth/signup'><Button>Sign Up</Button></Link>
//                     </div>
//                 </div>
//             </header>

//             {/* Hero Section */}
//             <main className="flex flex-col-reverse md:flex-row justify-between items-center container mx-auto px-4 py-16 gap-12">
//       <motion.div
//         initial={{ opacity: 0, x: -100 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{
//           type: 'spring',
//           stiffness: 100,
//           damping: 15,
//           duration: 1,
//         }}
//         className="flex-1"
//       >
//         <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
//           Never Be in a Queue
//         </h2>
//         <p className="text-xl mb-8 text-muted-foreground">
//           Revolutionize your food ordering experience with ZeroQue - Skip lines, order smartly, eat happily!
//         </p>
//         <div className="flex space-x-4">
//           <Button size="lg" className="group">
//             Get Started
//             <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
//           </Button>
//           <Button variant="outline" size="lg">
//             Learn More
//           </Button>
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, x: 100 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{
//           type: 'spring',
//           stiffness: 100,
//           damping: 15,
//           duration: 1,
//         }}
//         className="flex-1 flex justify-center bg-transparent"
//       >
//         <Image
//           width={400}
//           height={400}
//            src='/assets/0-q-x.png'
//           alt="ZeroQue App"
//           className="hidden dark:block w-[80%] md:h-56 md:w-56"
//         />
//         <Image
//           width={400}
//           height={400}
//           src='/assets/0q-d-rm.png'
//           alt="ZeroQue App"
//           className="dark:hidden w-[80%] md:h-56 md:w-56"
//         />
//       </motion.div>
//     </main>

//             {/* How ZeroQue Works Section */}
//             <section className="py-16 bg-muted/20">
//             <div className="text-center flex justify-center mb-4">
//             <div className='w-[50%] h-full border-b-2  '>
//                 <h3 className="text-3xl font-bold mb-4">How ZeroQue Works</h3>
//             </div>
          
//           </div>
//                 <div className="container mx-auto px-4">
//                     {/* Companies Section */}
//                     <div className="text-center mb-16">
//                         <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
//                         <p className="text-muted-foreground max-w-2xl mx-auto">
//                             Empower your restaurant or store with seamless digital management and insights.
//                         </p>
//                     </div>

//                     <motion.div
//                         variants={containerVariants}
//                         initial="hidden"
//                         animate="visible"
//                         className="grid md:grid-cols-3 gap-8 mb-16"
//                     >
//                         {companyFeatures.map((feature, index) => (
//                             <motion.div
//                                 key={feature.title}
//                                 variants={itemVariants}
//                                 className="bg-white dark:bg-black/50 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all"
//                             >
//                                 <div className="mb-4 flex justify-center">{feature.icon}</div>
//                                 <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
//                                 <p className="text-muted-foreground">{feature.description}</p>
//                             </motion.div>
//                         ))}
//                     </motion.div>

//                     {/* Users Section */}
//                     <div className="text-center mb-16">
//                         <h3 className="text-2xl font-bold mb-4">For Users</h3>
//                         <p className="text-muted-foreground max-w-2xl mx-auto">
//                             Experience dining like never before with our user-friendly mobile solution.
//                         </p>
//                     </div>

//                     <motion.div
//                         variants={containerVariants}
//                         initial="hidden"
//                         animate="visible"
//                         className="grid md:grid-cols-3 gap-8"
//                     >
//                         {userFeatures.map((feature, index) => (
//                             <motion.div
//                                 key={feature.title}
//                                 variants={itemVariants}
//                                 className="bg-white dark:bg-black/50 p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-all"
//                             >
//                                 <div className="mb-4 flex justify-center">{feature.icon}</div>
//                                 <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
//                                 <p className="text-muted-foreground">{feature.description}</p>
//                             </motion.div>
//                         ))}
//                     </motion.div>
//                 </div>
//             </section>

//             {/* Footer */}
//             <footer className="bg-muted/10 py-12">
//                 <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
//                     <div>
//                         <h5 className="font-bold mb-4 text-primary">ZEROQUE</h5>
//                         <p className="text-sm text-muted-foreground">
//                             {'"Never be in a Queue Or no lines, only convenience"'}
//                         </p>
//                     </div>
//                     <div>
//                         <h6 className="font-semibold mb-3">Quick Links</h6>
//                         <ul className="space-y-2">
//                             <li><Link href="#" className="text-muted-foreground hover:text-primary">Home</Link></li>
//                             <li><Link href="#" className="text-muted-foreground hover:text-primary">Features</Link></li>
//                             <li><Link href="#" className="text-muted-foreground hover:text-primary">About</Link></li>
//                         </ul>
//                     </div>
//                     <div>
//                         <h6 className="font-semibold mb-3">Support</h6>
//                         <ul className="space-y-2">
//                             <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
//                             <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
//                             <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
//                         </ul>
//                     </div>
//                     <div>
//                         <h6 className="font-semibold mb-3">Connect</h6>
//                         <div className="flex space-x-4">
//                             <Link href="#" className="text-muted-foreground hover:text-primary"><Phone size={20} /></Link>
//                             <Link href="#" className="text-muted-foreground hover:text-primary"><Star size={20} /></Link>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="container mx-auto px-4 mt-8 text-center border-t pt-4">
//                     <p className="text-sm text-muted-foreground">
//                         © 2024 ZeroQue. All rights reserved.
//                     </p>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default LandingPage;


'use client'
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight, Phone, ShoppingCart, QrCode,
    Smartphone, Star, Settings, BarChart, Zap
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import { ModeToggle } from './_components/global/darkMode';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import LangSelector from './_components/global/langSelector';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface FeatureCardProps extends Feature {
    delay?: number;
}

interface LinkItem {
    label: string;
    href: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => (
    <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay }}
        className="relative overflow-hidden bg-secondary/50 dark:bg-secondary/30 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border/50"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full transform translate-x-16 -translate-y-16" />
        <div className="relative z-10">
            <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mb-4 inline-block p-2 bg-primary/10 rounded-lg"
            >
                {icon}
            </motion.div>
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    </motion.div>
);

const LandingPage: React.FC = () => {

    const {t} = useTranslation()
    const companyFeatures: Feature[] = [
        {
            icon: <Settings className="w-8 h-8 text-primary" />,
            title: "Seamless Management",
            description: "Take control of your business with a simple, clutter-free dashboard."
        },
        {
            icon: <BarChart className="w-8 h-8 text-primary" />,
            title: "Intuitive Analytics",
            description: "Access real-time insights into sales and customer trends."
        },
        {
            icon: <Zap className="w-8 h-8 text-primary" />,
            title: "Instant Controls",
            description: "Quickly manage orders and update menus with our responsive interface."
        }
    ];

    const userFeatures: Feature[] = [
        {
            icon: <ShoppingCart className="w-8 h-8 text-primary" />,
            title: "Effortless Ordering",
            description: "Skip the lines and order with just a few taps."
        },
        {
            icon: <QrCode className="w-8 h-8 text-primary" />,
            title: "Quick Checkout",
            description: "Scan, select, and pay instantly — no queues, just speed."
        },
        {
            icon: <Smartphone className="w-8 h-8 text-primary" />,
            title: "Complete Convenience",
            description: "Get real-time updates and manage your preferences easily."
        }
    ];

    const footerLinks: Record<string, LinkItem[]> = {
        'Quick Links': [
            { label: 'Home', href: '#' },
            { label: 'Features', href: '#' },
            { label: 'About', href: '#' }
        ],
        'Support': [
            { label: 'Help Center', href: '#' },
            { label: 'Contact Us', href: '#' },
            { label: 'Privacy Policy', href: '#' }
        ]
    };

    const renderFeatureSection = useCallback((features: Feature[], title: string, description: string) => (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
            >
                <h3 className="text-3xl font-bold mb-4">{title}</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {description}
                </p>
            </motion.div>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid md:grid-cols-3 gap-6"
            >
                {features.map((feature, index) => (
                    <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
                ))}
            </motion.div>
        </>
    ), []);

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="container mx-auto flex justify-between items-center py-3 px-4">
                    <motion.div 
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src='/assets/0q-d-rm.png'
                            alt="ZeroQue Logo"
                            className="dark:hidden w-10 h-10"
                            width={40} height={40}
                            priority
                        />
                        <Image
                            src='/assets/0-q-x.png'
                            alt="ZeroQue Logo"
                            className="hidden dark:block w-10 h-10"
                            width={40} height={40}
                            priority
                        />
                        <h1 className="text-xl hidden font-bold sm:flex text-primary">ZEROQUE</h1>
                    </motion.div>
                    <motion.div 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <LangSelector/>
                        <ModeToggle />
                        <Link href='/auth/login'>
                            <Button variant="outline" size="sm">Login</Button>
                        </Link>
                        <Link href='/auth/signup'>
                            <Button size="sm">Sign Up</Button>
                        </Link>
                    </motion.div>
                </div>
            </header>

            <main className="flex flex-col-reverse md:flex-row justify-between items-center container mx-auto px-4 py-16 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 max-w-xl"
                >
                    <motion.h2 
                        className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                         data-translate="true"
                    >
                        {t('home.slogan')}
                    </motion.h2>
                    <motion.p 
                        className="text-lg mb-6 text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                         data-translate="true"
                    >
                        {t('home.sloganDesc')}
                    </motion.p>
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <Button className="group"  data-translate="true">
                        {t('home.buttons.getStarted')}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button  data-translate="true" variant="outline"> {t('home.buttons.learnMore')}</Button>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 flex justify-center"
                >
                    <Image
                        width={300}
                        height={300}
                        src='/assets/0-q-x.png'
                        alt="ZeroQue App"
                        className="hidden dark:block w-64 hover:scale-105 transition-transform duration-300"
                        priority
                    />
                    <Image
                        width={300}
                        height={300}
                        src='/assets/0q-d-rm.png'
                        alt="ZeroQue App"
                        className="dark:hidden w-64 hover:scale-105 transition-transform duration-300"
                        priority
                    />
                </motion.div>
            </main>

            <section className="py-16 bg-muted/5">
                <div  data-translate="true" className="container mx-auto px-4">
                    {renderFeatureSection(
                        companyFeatures,
                        "For Businesses",
                        "Empower your business with smart queue management and real-time analytics."
                    )}
                    <div className="my-16"  data-translate="true" />
                    {renderFeatureSection(
                        userFeatures,
                        "For Users",
                        "Skip the wait, order with confidence, and enjoy more of what matters."
                    )}
                </div>
            </section>

            <footer className="bg-muted/5 py-12 border-t border-border mt-auto">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h5  data-translate="true" className="font-bold text-lg mb-3 text-primary">ZEROQUE</h5>
                            <p  data-translate="true" className="text-sm text-muted-foreground">
                                Where convenience meets innovation.
                            </p>
                        </div>
                        
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div  data-translate="true" key={title}>
                                <h6  className="font-semibold mb-3">{title}</h6>
                                <ul className="space-y-2">
                                    {links.map((link) => (
                                        <li key={link.label}>
                                            <Link 
                                                href={link.href} 
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div>
                            <h6 className="font-semibold mb-3">Connect</h6>
                            <div className="flex space-x-4">
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Phone className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Star className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <p className="text-xs text-muted-foreground">
                            © 2024 ZeroQue. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;