// import TensorQA from '../_components/global/tensor'
// import * as tf from '@tensorflow/tfjs'
// import * as qna from '@tensorflow-models/qna'
// const page = () => {
//   const loadModel=async()=>{
//     const loadedModel = await qna.load();
//     console.log("model loaded")
//   }

  

//   return (
//     // <TensorQA/>
//     <div><p>Testing for ....</p>
//     <button onClick={loadModel} className='bg-purple text-white rounded-lg p-2'>Click</button></div>
//   )
// }

// export default page



// "use client";

// import { useEffect, useState } from "react";
// import * as qna from "@tensorflow-models/qna";
// import * as pdfjsLib from 'pdfjs-dist';
// import { answerQuestion, loadModel } from '~/utils/tensorflow';

// const TensorClient = () => {
//   const [loading, setLoading] = useState(false);
//   const [pdfText, setPdfText] = useState('');
//   const [answer, setAnswer] = useState([]);
//   const [model, setModel] = useState<qna.QuestionAndAnswer|null>(null);

//   const loadQaModel = async () => {
//     setLoading(true);
//     const model = await loadModel();
//     console.log("Model loaded:", model);
//     setLoading(false);
//     setModel(model);
//   };

//   useEffect(()=>{
//     loadQaModel()
//   },[])

//   const loadPdf = async (url: string) => {
//       const loadingTask = pdfjsLib.getDocument(url);
//       const pdf = await loadingTask.promise;
//       let text = '';
  
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         text += content.items.map((item: any) => item.str).join(' ');
//       }
  
//       setPdfText(text);
//     };
  
//     useEffect(() => {
//       // Load the PDF when the component mounts
//       loadPdf('/assets/QnA.pdf');
//     }, []);
  

//      const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         // setError('');
    
//         try {
//           // Get answers from the model
//           console.log(model,pdfText,"------------------")
//           if (model && pdfText) {
//             console.log('for answer')
//             const question = 'how ai working?';
//             const answers = await answerQuestion(model, pdfText, question);
//             setAnswer(answers);
//           }
//         } catch (err) {
//           window.alert(err instanceof Error ? err.message : 'Something went wrong')
//         } finally {
//           setLoading(false);
//         }
//       };
//   return (
//     <div>
//       <p>Testing for ....</p>
//       <button
//         onClick={handleSubmit}
//         className="bg-purple-600 text-white rounded-lg p-2"
//         disabled={loading}
//       >
//         {loading ? "Loading..." : "Click"}
//       </button>
//       <p>{answer}</p>
//     </div>
//   );
// };

// export default TensorClient;
// "use client";

// import { useEffect, useState } from "react";
// import * as qna from "@tensorflow-models/qna";
// import { loadModel } from "~/utils/tensorflow";

// const TensorClient = () => {
//   const [loading, setLoading] = useState(false);
//   const [pdfText, setPdfText] = useState('');
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState<any[]>([]);
//   const [model, setModel] = useState<qna.QuestionAndAnswer | null>(null);
//   const [error, setError] = useState<string>('');

//   // Load the TensorFlow model
//   const loadQaModel = async () => {
//     setLoading(true);
//     try {
//       const loadedModel = await loadModel();
//       console.log("Model loaded successfully");
//       setModel(loadedModel);
//     } catch (err) {
//       setError('Failed to load model: ' + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       try {
//         console.log("Starting model loading...");
//         await loadQaModel();
//         console.log("Loading dummy data...");
//         loadDummyData();
//         console.log("Initialization complete");
//       } catch (err:any) {
//         console.error("Initialization error:", err);
//         setError("Failed to initialize: " + err.message);
//       }
//     };
    
//     init();
//   }, []);

//  // ✅ Provide a longer text sample
// const loadDummyData = () => {
//   const dummyText = `
//     This AI recruitment application uses artificial intelligence to streamline the hiring process 
//     by screening candidates, analyzing resumes, and providing insights to recruiters. AI automates 
//     resume screening, matches candidates to job roles, and conducts preliminary assessments to ensure 
//     the best-fit candidates are shortlisted efficiently. The platform is designed for both recruiters 
//     and job seekers. Recruiters can post job listings and evaluate candidates, while job seekers can 
//     apply for positions and take AI-based assessments.
//     Job seekers can create an account by clicking on 'Sign Up', entering their details, uploading their resume, 
//     and verifying their email. Once logged in, they can browse job listings, click on a suitable job, and submit 
//     their resume. Some jobs may require AI-based skill assessments. The AI system evaluates candidates based on 
//     job descriptions, asking relevant questions or providing coding challenges. Applications cannot be edited after 
//     submission, but they can be withdrawn and resubmitted. Shortlisted candidates receive email notifications and 
//     can track their application status on their profile dashboard.Recruiters can post job listings by signing into their accounts, filling in job details, setting AI screening 
//     preferences, and publishing the listing. The AI filters applications based on keywords, skills, experience, and 
//     predefined criteria to shortlist top candidates. Recruiters can manually review applications and schedule 
//     interviews via the platform. They can also conduct live video interviews or use AI-assisted interviews. 
//     Communication with shortlisted candidates is facilitated through the platform’s built-in messaging system.Users who forget their password can reset it by clicking 'Forgot Password' on the login page and following 
//     the instructions. The platform ensures data security through encryption and secure authentication methods. 
//     Users can contact support through the 'Help & Support' section or email support@example.com. If needed, users 
//     can permanently delete their accounts via 'Account Settings'.
//   `.trim();
//   setPdfText(dummyText);
// };


// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setLoading(true);
//   setError('');

//   if (!model) {
//     setError("Model is not loaded yet.");
//     setLoading(false);
//     return;
//   }

//   if (!pdfText || !question.trim()) {
//     setError("Please provide both text and a question.");
//     setLoading(false);
//     return;
//   }

//   try {
//     const processedQuestion = question.trim();
//     console.log("Processing question:", processedQuestion);

//     // Split context into paragraphs
//     const paragraphs = pdfText.split('\n').filter(p => p.trim().length > 0);

//     let bestAnswers = [];
//     for (const paragraph of paragraphs) {
//       console.log("Context being processed:", paragraph);
//       const answers = await model.findAnswers(processedQuestion, paragraph);
//       if (answers.length > 0) {
//         bestAnswers = bestAnswers.concat(answers);
//       }
//     }

//     // Sort by confidence and take top 3
//     bestAnswers.sort((a, b) => b.score - a.score);
//     bestAnswers = bestAnswers.slice(0, 3);

//     console.log("Found answers:", bestAnswers);

//     if (bestAnswers.length === 0) {
//       setError("No answers found. Try rephrasing your question to be more specific or ask about a different topic.");
//     } else {
//       setAnswer(bestAnswers);
//     }
//   } catch (err) {
//     console.error("Error during inference:", err);
//     setError("Error finding answers: " + err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Testing TensorFlow QnA Model</h2>

//       <div className="mb-4">
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Enter your question"
//           className="w-full p-2 border rounded mb-2"
//         />
        
//         <button
//           onClick={handleSubmit}
//           className="bg-purple-600 text-white rounded-lg px-4 py-2"
//           disabled={loading || !model}
//         >
//           {loading ? "Loading..." : "Find Answer"}
//         </button>
//       </div>

//       {error && (
//         <div className="text-red-500 mb-4">
//           {error}
//         </div>
//       )}

//       {answer.length > 0 && (
//         <div className="mt-4 p-3 bg-gray-100 rounded-lg">
//           <h3 className="font-semibold">Answer:</h3>
//           {answer.map((ans, index) => (
//             <p key={index} className="text-gray-800">
//               {ans.text} (Confidence: {Math.round(ans.score * 100)}%)
//             </p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TensorClient;


// import * as use from "@tensorflow-models/universal-sentence-encoder";
// import * as tf from "@tensorflow/tfjs";

// const TensorClient = () => {
//   const [loading, setLoading] = useState(false);
//   const [pdfText, setPdfText] = useState("");
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [model, setModel] = useState<use.UniversalSentenceEncoder | null>(null);
//   const [error, setError] = useState("");

//   // Load the Universal Sentence Encoder model
//   const loadUseModel = async () => {
//     setLoading(true);
//     try {
//       const loadedModel = await use.load();
//       console.log("USE model loaded successfully");
//       setModel(loadedModel);
//     } catch (err) {
//       setError("Failed to load model: " + err.message);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUseModel();
//     loadDummyData();
//   }, []);

//   const loadDummyData = () => {
//     const dummyText = `
//       This AI recruitment application uses artificial intelligence to streamline the hiring process 
//       by screening candidates, analyzing resumes, and providing insights to recruiters. AI automates 
//       resume screening, matches candidates to job roles, and conducts preliminary assessments to ensure 
//       the best-fit candidates are shortlisted efficiently. The platform is designed for both recruiters 
//       and job seekers. Recruiters can post job listings and evaluate candidates, while job seekers can 
//       apply for positions and take AI-based assessments.
//     `.trim();
//     setPdfText(dummyText);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!model || !pdfText || !question.trim()) {
//       setError("Please provide both text and a question.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Split context into sentences
//       const sentences = pdfText.split(".").filter((s) => s.trim().length > 0);

//       // Encode the question and sentences
//       const questionEmbedding = await model.embed([question.trim()]);
//       const sentenceEmbeddings = await model.embed(sentences);

//       // Compute cosine similarity between the question and each sentence
//       const similarities = tf.matMul(
//         questionEmbedding,
//         sentenceEmbeddings,
//         false,
//         true
//       );
//       const scores = await similarities.data();
//       similarities.dispose();

//       // Find the sentence with the highest similarity score
//       const maxScoreIndex = scores.indexOf(Math.max(...scores));
//       setAnswer(sentences[maxScoreIndex]);
//     } catch (err) {
//       console.error("Error during inference:", err);
//       setError("Error finding answers: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Testing USE Model</h2>
//       <div className="mb-4">
//         <input
//           type="text"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Enter your question"
//           className="w-full p-2 border rounded mb-2"
//         />
//         <button
//           onClick={handleSubmit}
//           className="bg-purple-600 text-white rounded-lg px-4 py-2"
//           disabled={loading || !model}
//         >
//           {loading ? "Loading..." : "Find Answer"}
//         </button>
//       </div>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       {answer && (
//         <div className="mt-4 p-3 bg-gray-100 rounded-lg">
//           <h3 className="font-semibold">Answer:</h3>
//           <p className="text-gray-800">{answer}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TensorClient;


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