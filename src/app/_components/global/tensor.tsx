// // 'use client'
// // import React, { useState } from 'react';
// // import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
// // import { Button } from '~/components/ui/button';
// // import { Input } from '~/components/ui/input';

// // const TensorQA = () => {
// //   const [question, setQuestion] = useState('');
// //   const [answer, setAnswer] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     console.log("calling the api")

// //     try {
// //       const response = await fetch('/api/tensor/answer', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ question }),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to get answer');
// //       }

// //       const data = await response.json();
// //       setAnswer(data.answers);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Something went wrong');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Card className="w-full max-w-xl mx-auto mt-8">
// //       <CardHeader>
// //         <CardTitle>TensorFlow Q&A</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="space-y-2">
// //             <Input
// //               type="text"
// //               value={question}
// //               onChange={(e) => setQuestion(e.target.value)}
// //               placeholder="Enter your question..."
// //               className="w-full"
// //               disabled={loading}
// //             />
// //           </div>
// //           <Button type="submit" disabled={loading} className="w-full">
// //             {loading ? 'Processing...' : 'Ask Question'}
// //           </Button>
// //         </form>

// //         {error && (
// //           <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
// //             {error}
// //           </div>
// //         )}

// //         {answer && (
// //           <div className="mt-4 p-4 bg-gray-50 rounded-md">
// //             <h3 className="font-medium mb-2">Answer:</h3>
// //             <p>{answer}</p>
// //           </div>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default TensorQA;


// // 'use client'
// // import React, { useState } from 'react';
// // import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
// // import { Button } from '~/components/ui/button';
// // import { Input } from '~/components/ui/input';

// // const TensorQA = () => {
// //   const [question, setQuestion] = useState('');
// //   const [answer, setAnswer] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     console.log("calling the api");

// //     try {
// //       const response = await fetch('/api/tensor/answer', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ question }),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to get answer');
// //       }

// //       const data = await response.json();
// //       setAnswer(data.answers);
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Something went wrong');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Card className="w-full max-w-xl mx-auto mt-8">
// //       <CardHeader>
// //         <CardTitle>TensorFlow Q&A</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="space-y-2">
// //             <Input
// //               type="text"
// //               value={question}
// //               onChange={(e) => setQuestion(e.target.value)}
// //               placeholder="Enter your question..."
// //               className="w-full"
// //               disabled={loading}
// //             />
// //           </div>
// //           <Button type="submit" disabled={loading} className="w-full">
// //             {loading ? 'Processing...' : 'Ask Question'}
// //           </Button>
// //         </form>

// //         {error && (
// //           <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
// //             {error}
// //           </div>
// //         )}

// //         {answer && (
// //           <div className="mt-4 p-4 bg-gray-50 rounded-md">
// //             <h3 className="font-medium mb-2">Answer:</h3>
// //             <p>{answer}</p>
// //           </div>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default TensorQA;



// // 'use client'
// // import React, { useState,useEffect,useRef } from 'react';
// // import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
// // import { Button } from '~/components/ui/button';
// // import { Input } from '~/components/ui/input';
// // import * as tf from '@tensorflow/tfjs'
// // import * as qna from '@tensorflow-models/qna'
// // import path from 'path';
// // import PDFParser from 'pdf2json';

// // const TensorQA = () => {
// //   const [question, setQuestion] = useState('');
// //   const [answer, setAnswer] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const passageRef = useRef(null);
// //   const questionRef = useRef(null);
// //   const [model, setModel] = useState(null);

// //   const loadModel=async()=>{
// //     const loadedModel = await qna.load();
// //     setModel(loadedModel);
// //     console.log("model loaded")
// //   }

// //   useEffect(()=>{loadModel()},[])

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     console.log("calling the api");

// //     try {

// //        const pdfPath = path.join(process.cwd(), 'public', 'assets', 'QnA.pdf');
// //           const pdfParser = new PDFParser();
      
// //           const parseFile = () => new Promise((resolve, reject) => {
// //             pdfParser.on("pdfParser_dataReady", (pdfData) => {
// //               resolve(pdfData);
// //             });
// //             pdfParser.on("pdfParser_dataError", (error) => {
// //               reject(error);
// //             });
// //             pdfParser.loadPDF(pdfPath);
// //           });
      
// //           const pdfData = await parseFile() as any;
          
// //           // Extract text from pages
// //           const pdfText = pdfData.Pages.map((page: any) => {
// //             return page.Texts.map((textItem: any) => {
// //               return decodeURIComponent(textItem.R[0].T);
// //             }).join(' ');
// //           }).join('\n');

// //       if(model!==null){


// //         const answers = await model.findAnswers(question, pdfText);
// //         setAnswer(answers);
      
// //       }
    
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Something went wrong');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Card className="w-full max-w-xl mx-auto mt-8">
// //       <CardHeader>
// //         <CardTitle>TensorFlow Q&A</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="space-y-2">
// //             <Input
// //               type="text"
// //               value={question}
// //               onChange={(e) => setQuestion(e.target.value)}
// //               placeholder="Enter your question..."
// //               className="w-full"
// //               disabled={loading}
// //             />
// //           </div>
// //           <Button type="submit" disabled={loading} className="w-full">
// //             {loading ? 'Processing...' : 'Ask Question'}
// //           </Button>
// //         </form>

// //         {error && (
// //           <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
// //             {error}
// //           </div>
// //         )}

// //         {answer && (
// //           <div className="mt-4 p-4 bg-gray-50 text-black rounded-md">
// //             <h3 className="font-medium mb-2">Answer:</h3>
// //             <p>{answer?.map(answer,index)=>(
// //               <div>{index+1} {answer}</div>
// //             )}</p>
// //           </div>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default TensorQA;


// // 'use client'
// // import React, { useState, useEffect, useRef } from 'react';
// // import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
// // import { Button } from '~/components/ui/button';
// // import { Input } from '~/components/ui/input';
// // import * as tf from '@tensorflow/tfjs';
// // import * as qna from '@tensorflow-models/qna';
// // import path from 'path';
// // import PDFParser from 'pdf2json';
// // import { answerQuestion, loadModel } from '~/utils/tensorflow';

// // type Answer = {
// //   text: string;
// //   score: number;
// //   startIndex: number;
// //   endIndex: number;
// // };

// // const TensorQA: React.FC = () => {
// //   const [question, setQuestion] = useState<string>('');
// //   const [answers, setAnswers] = useState<Answer[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string>('');
// //   const [model, setModel] = useState<qna.QuestionAndAnswer | null>(null);

// //   // Load the QnA model
// //   const loadQaModel = async () => {
// //     const loadedModel = await loadModel();
// //     setModel(loadedModel);
// //     console.log('Model loaded');
// //   };

// //   useEffect(() => {
// //     loadQaModel();
// //   }, []);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     try {
// //       // Parse the PDF file
// //       const pdfPath = path.join(process.cwd(), 'public', 'assets', 'QnA.pdf');
// //       const pdfParser = new PDFParser();

// //       const parseFile = () =>
// //         new Promise((resolve, reject) => {
// //           pdfParser.on('pdfParser_dataReady', (pdfData) => {
// //             resolve(pdfData);
// //           });
// //           pdfParser.on('pdfParser_dataError', (error) => {
// //             reject(error);
// //           });
// //           pdfParser.loadPDF(pdfPath);
// //         });

// //       const pdfData = (await parseFile()) as any;

// //       // Extract text from the PDF
// //       const pdfText = pdfData.Pages.map((page: any) => {
// //         return page.Texts.map((textItem: any) => {
// //           return decodeURIComponent(textItem.R[0].T);
// //         }).join(' ');
// //       }).join('\n');

// //       // Get answers from the model
// //       if (model) {
// //         const answers = await answerQuestion(model, pdfText, question);
// //         setAnswers(answers);
// //       }
// //     } catch (err) {
// //       setError(err instanceof Error ? err.message : 'Something went wrong');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Card className="w-full max-w-xl mx-auto mt-8">
// //       <CardHeader>
// //         <CardTitle>TensorFlow Q&A</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="space-y-2">
// //             <Input
// //               type="text"
// //               value={question}
// //               onChange={(e) => setQuestion(e.target.value)}
// //               placeholder="Enter your question..."
// //               className="w-full"
// //               disabled={loading}
// //             />
// //           </div>
// //           <Button type="submit" disabled={loading} className="w-full">
// //             {loading ? 'Processing...' : 'Ask Question'}
// //           </Button>
// //         </form>

// //         {error && (
// //           <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
// //             {error}
// //           </div>
// //         )}

// //         {answers.length > 0 && (
// //           <div className="mt-4 p-4 bg-gray-50 text-black rounded-md">
// //             <h3 className="font-medium mb-2">Answers:</h3>
// //             {answers.map((answer, index) => (
// //               <div key={index} className="mb-2">
// //                 <strong>{index + 1}.</strong> {answer.text} (Score: {answer.score.toFixed(2)})
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default TensorQA;


// 'use client'
// import React, { useState, useEffect, useRef } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
// import { Button } from '~/components/ui/button';
// import { Input } from '~/components/ui/input';
// import * as tf from '@tensorflow/tfjs';
// import * as qna from '@tensorflow-models/qna';
// import * as pdfjsLib from 'pdfjs-dist';
// import { answerQuestion, loadModel } from '~/utils/tensorflow';

// type Answer = {
//   text: string;
//   score: number;
//   startIndex: number;
//   endIndex: number;
// };

// const TensorQA: React.FC = () => {
//   const [question, setQuestion] = useState<string>('');
//   const [answers, setAnswers] = useState<Answer[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [model, setModel] = useState<qna.QuestionAndAnswer | null>(null);
//   const [pdfText, setPdfText] = useState<string>('');

//   // Load the QnA model
//   const loadQaModel = async () => {
//     const loadedModel = await loadModel();
//     setModel(loadedModel);
//     console.log('Model loaded');
//   };

//   useEffect(() => {
//     loadQaModel();
//   }, []);

//   // Load and parse the PDF file
//   const loadPdf = async (url: string) => {
//     const loadingTask = pdfjsLib.getDocument(url);
//     const pdf = await loadingTask.promise;
//     let text = '';

//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       text += content.items.map((item: any) => item.str).join(' ');
//     }

//     setPdfText(text);
//   };

//   useEffect(() => {
//     // Load the PDF when the component mounts
//     loadPdf('/assets/QnA.pdf');
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // Get answers from the model
//       if (model && pdfText) {
//         const answers = await answerQuestion(model, pdfText, question);
//         setAnswers(answers);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-xl mx-auto mt-8">
//       <CardHeader>
//         <CardTitle>TensorFlow Q&A</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Input
//               type="text"
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               placeholder="Enter your question..."
//               className="w-full"
//               disabled={loading}
//             />
//           </div>
//           <Button type="submit" disabled={loading} className="w-full">
//             {loading ? 'Processing...' : 'Ask Question'}
//           </Button>
//         </form>

//         {error && (
//           <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
//             {error}
//           </div>
//         )}

//         {answers.length > 0 && (
//           <div className="mt-4 p-4 bg-gray-50 text-black rounded-md">
//             <h3 className="font-medium mb-2">Answers:</h3>
//             {answers.map((answer, index) => (
//               <div key={index} className="mb-2">
//                 <strong>{index + 1}.</strong> {answer.text} (Score: {answer.score.toFixed(2)})
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default TensorQA;