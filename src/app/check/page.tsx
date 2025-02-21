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