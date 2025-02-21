

'use client'
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MessageCircle, Send, Bot, User, Cpu, Sparkles, HelpCircle, X } from "lucide-react";

// Define hint categories and their items
const hintCategories = {
  account: [
    "How do I create an account?",
    "How do I delete my account?",
    "How do I reset my password?"
  ],
  application: [
    "How does AI filter applications?",
    "Can I edit my application after submission?",
    "What happens after I submit my application?"
  ],
  ai: [
    "How does AI help in recruitment?",
    "Is my data safe with AI?",
    "What skills does the AI analyze?"
  ]
};

const ChatWidget = () => {
  const [messages, setMessages] = useState<{ text: string | undefined; isBot: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [hints, setHints] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showFallbackHints, setShowFallbackHints] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Check system preference for dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
      
      // Add listener for changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);
  
  const { mutateAsync: getResponse, isPending } = api.message.getBotResponse.useMutation({
    onSuccess: (data) => {
      const isFallbackResponse = 
        data?.response?.includes("I'm not sure") ?? 
        data?.response?.includes("Could you clarify") ??
        data?.response?.includes("I don't have an answer");
      
      setMessages((prev) => [...prev, { text: data.response, isBot: true }]);
      
      // Show hints if it's a fallback response - just open the main hints panel
      if (isFallbackResponse) {
        setShowHints(true);
      }
    },
  });

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: messageText, isBot: false }]);
    setShowFallbackHints(false);
    
    try {
      // Get bot response
      await getResponse(messageText);
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages((prev) => [...prev, { 
        text: "Sorry, I couldn't process your request at this time.", 
        isBot: true 
      }]);
    }

    // Clear input
    setInput("");
  };

  const toggleHints = () => {
    setShowHints(!showHints);
    setExpandedCategory(null);
  };

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  return (
    <Card className={`w-full  max-w-3xl h-[550px] border-0 shadow-xl rounded-xl overflow-hidden 
      ${darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-blue-50 to-indigo-50 text-gray-800'}`}>
      <CardHeader className={`px-6 py-4 
        ${darkMode 
          ? 'bg-gradient-to-r from-indigo-900 to-purple-900' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'}`}>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Bot className={`h-6 w-6 ${darkMode ? 'text-purple-300' : 'text-white'}`} />
            </motion.div>
            <span className={darkMode ? 'text-white' : 'text-white'}>AI Recruitment Assistant</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              <Sparkles className={`h-5 w-5 ml-2 ${darkMode ? 'text-purple-300' : 'text-yellow-300'}`} />
            </motion.div>
          </CardTitle>
          
          <Button
            onClick={toggleHints}
            variant="ghost"
            size="icon"
            className={`rounded-full ${darkMode ? 'text-purple-300 hover:bg-purple-900' : 'text-white hover:bg-blue-600'}`}
          >
            {showHints ? <X className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 relative flex flex-col h-[calc(100%-4rem)]">
        <div className="flex-1 relative overflow-y-auto scrollbar-thin px-6 py-4">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-full space-y-4 text-center"
            >
              <div className={`${darkMode ? 'bg-indigo-900' : 'bg-blue-100'} p-6 rounded-full`}>
                <Cpu className={`h-12 w-12 ${darkMode ? 'text-purple-300' : 'text-blue-600'}`} />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  AI Recruitment Assistant
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ask me anything about our AI recruitment platform! I can help with account setup, 
                  application processes, and how our AI enhances the hiring experience.
                </p>
              </div>
            </motion.div>
          )}
          
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                className={`flex items-start gap-2 my-4 ${msg.isBot ? "justify-start" : "justify-end"}`}
              >
                {msg.isBot && (
                  <div className={`${darkMode ? 'bg-indigo-800' : 'bg-blue-100'} rounded-full p-2 flex-shrink-0`}>
                    <Bot className={`h-5 w-5 ${darkMode ? 'text-purple-300' : 'text-blue-700'}`} />
                  </div>
                )}
                
                <div 
                  className={`p-3 rounded-2xl max-w-[70%] shadow-sm ${
                    msg.isBot 
                      ? darkMode 
                        ? "bg-gray-800 text-white rounded-tl-none border border-gray-700" 
                        : "bg-white text-gray-800 rounded-tl-none" 
                      : darkMode
                        ? "bg-gradient-to-r from-indigo-800 to-purple-800 text-white rounded-tr-none"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
                
                {!msg.isBot && (
                  <div className={`${darkMode ? 'bg-purple-900' : 'bg-indigo-100'} rounded-full p-2 flex-shrink-0`}>
                    <User className={`h-5 w-5 ${darkMode ? 'text-purple-300' : 'text-indigo-700'}`} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 my-4"
            >
              <div className={`${darkMode ? 'bg-indigo-800' : 'bg-blue-100'} rounded-full p-2`}>
                <Bot className={`h-5 w-5 ${darkMode ? 'text-purple-300' : 'text-blue-700'}`} />
              </div>
              <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2`}>
                <div className="flex items-center space-x-1">
                  <motion.span
                    className={`block h-2 w-2 rounded-full ${darkMode ? 'bg-purple-500' : 'bg-blue-600'}`}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.span
                    className={`block h-2 w-2 rounded-full ${darkMode ? 'bg-purple-500' : 'bg-blue-600'}`}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className={`block h-2 w-2 rounded-full ${darkMode ? 'bg-purple-500' : 'bg-blue-600'}`}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
          <button  title="click here for hints"
  onClick={toggleHints}
  className={`rounded-full absolute flex items-center justify-center w-7 h-7 ${showHints?'bottom-1':'bottom-4'} right-6 shadow-lg z-10  ${
    darkMode 
      ? 'bg-gray-800 text-purple-300 hover:bg-gray-700 border border-gray-700' 
      : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-200'
  }`}
  aria-label={showHints ? "Hide help" : "Show help"}
>
  {showHints ? <X className="h-5 w-5" /> : <HelpCircle className="h-5 w-5" />}
</button>
        </div>
        
        {/* Hints panel */}
        <AnimatePresence>
          {showHints && (
            <motion.div
              
              className={`${darkMode ? 'bg-transparent  border-gray-700' : 'bg-white border-t'} p-2 overflow-hidden`}
            >
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(hintCategories).map((category) => (
                  <div key={category} className="flex flex-col">
                    <Button
                      variant={darkMode ? "ghost" : "outline"}
                      onClick={() => toggleCategory(category)}
                      className={`justify-center  border rounded-full  ${expandedCategory?'mb-2':'mb-0'}  ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-purple-300 border-gray-700' 
                          : 'hover:bg-blue-50 text-blue-600'
                      } ${expandedCategory === category ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Centralized hints display area with horizontal scroll */}
              <>
                {expandedCategory && (
                  <motion.div
                 
                    className=" w-full"
                  >
                    <div className="overflow-x-auto scrollbar-none ">
                      <div className="flex justify-center space-x-2">
                        {hintCategories[expandedCategory as keyof typeof hintCategories].map((hint, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSend(hint)}
                            className={`whitespace-nowrap flex-shrink-0 px-2 py-1 rounded-full ${
                              darkMode 
                                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            {hint}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className={`p-4 border-t ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isPending && handleSend()}
              className={`flex-1 py-6 px-4 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-500' 
                  : 'focus-visible:ring-blue-500'
              }`}
              placeholder="Type your message..."
              disabled={isPending}
            />
            <Button 
              onClick={() => handleSend()}
              disabled={isPending || !input.trim()}
              className={`h-12 w-12 rounded-full p-0 shadow-md ${
                darkMode
                  ? 'bg-gradient-to-r from-indigo-800 to-purple-800 hover:from-indigo-900 hover:to-purple-900'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              } transition-all duration-300`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send className="h-5 w-5" />
              </motion.div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Check system preference for dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
      
      // Add listener for changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`flex justify-center items-center min-h-screen p-4 ${
        darkMode ? 'bg-gradient-to-b from-gray-950 to-gray-900' : 'bg-gradient-to-b from-gray-50 to-gray-100'
      }`}
    >
      <ChatWidget />
    </motion.div>
  );
}