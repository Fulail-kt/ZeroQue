// // import { NextResponse } from 'next/server';
// // import path from 'path';
// // import { loadModel, answerQuestion } from '~/utils/tensorflow';
// // import PDFParser from 'pdf2json';

// // export async function POST(req: Request) {
// //   const { question } = await req.json();

// //   try {
// //     // Extract text from PDF
  
// //     const pdfPath = path.join(process.cwd(), 'public', 'assets', 'QnA.pdf');
// //     const pdfParser = new PDFParser();

// //     const parseFile = () => new Promise((resolve, reject) => {
// //       pdfParser.on("pdfParser_dataReady", (pdfData) => {
// //         resolve(pdfData);
// //       });
// //       pdfParser.on("pdfParser_dataError", (error) => {
// //         reject(error);
// //       });
// //       pdfParser.loadPDF(pdfPath);
// //     });

// //     const pdfData = await parseFile() as any;
    
// //     // Extract text from pages
// //     const pdfText = pdfData.Pages.map((page: any) => {
// //       return page.Texts.map((textItem: any) => {
// //         // Decode the text content
// //         return decodeURIComponent(textItem.R[0].T);
// //       }).join(' ');
// //     }).join('\n');


// //     console.log('PDF text extracted:', pdfText.substring(0, 100) + '...');

// //     // Load TensorFlow.js model
// //     const model = await loadModel();

// //     console.log(model,"modle")

// //     // Get answer
// //     // const answers = await answerQuestion(model, pdfText, question);
// //     const answer=question

// //     return NextResponse.json({ answer });
// //   } catch (error) {
// //     console.error(error);
// //     return NextResponse.json(
// //       { error: 'Failed to process question' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export const runtime = 'nodejs'; 


// // import { NextResponse } from 'next/server';
// // import path from 'path';
// // import fs from 'fs/promises';
// // import pdf from 'pdf-parse';

// // export async function POST(req: Request) {
// //   console.log("Callinggggggg----");
// //   const { question } = await req.json();

// //   try {
// //     // Construct the path to the PDF file
// //     const pdfPath = path.join(process.cwd(), 'public', 'assets', 'QnA.pdf');

// //     console.log('Attempting to read PDF from:', pdfPath);

// //     // Read the PDF file as a buffer
// //     const buffer = await fs.readFile(pdfPath);

// //     console.log("pdfstring",buffer.toString())
    
// //     // Parse PDF
// //     console.log(await pdf(buffer),"data")
// //     const data = await pdf(buffer);

// //     const text = data.text;

// //     console.log('PDF text extracted:', text.substring(0, 100) + '...');

// //     return NextResponse.json({ 
// //       answers: `You asked: ${question}`,
// //       pdfText: text 
// //     });
// //   } catch (error) {
// //     console.error('Error processing PDF:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to process question' },
// //       { status: 500 }
// //     );
// //   }
// // }


// // import { NextResponse } from 'next/server';
// // import path from 'path';
// // import fs from 'fs/promises';
// // import PDFParser from 'pdf2json';

// // export async function POST(req: Request) {
// //   const { question } = await req.json();

// //   try {
// //     const pdfPath = path.join(process.cwd(), 'public', 'assets', 'QnA.pdf');
// //     const pdfParser = new PDFParser();

// //     const parseFile = () => new Promise((resolve, reject) => {
// //       pdfParser.on("pdfParser_dataReady", (pdfData) => {
// //         resolve(pdfData);
// //       });
// //       pdfParser.on("pdfParser_dataError", (error) => {
// //         reject(error);
// //       });
// //       pdfParser.loadPDF(pdfPath);
// //     });

// //     const pdfData = await parseFile() as any;
    
// //     // Extract text from pages
// //     const text = pdfData.Pages.map((page: any) => {
// //       return page.Texts.map((textItem: any) => {
// //         // Decode the text content
// //         return decodeURIComponent(textItem.R[0].T);
// //       }).join(' ');
// //     }).join('\n');

// //     console.log('Extracted text:', text); // Debug log

// //     return NextResponse.json({ 
// //       answers: `You asked: ${question}`,
// //       pdfText: text 
// //     });
// //   } catch (error) {
// //     console.error('Error:', error);
// //     return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
// //   }
// // }
// // export const runtime = 'nodejs';






// // src/app/api/qa/route.ts
// import { NextResponse } from 'next/server';
// import path from 'path';
// import { loadModel, answerQuestion } from '~/utils/tensorflow';
// import PDFParser from 'pdf2json';

// export const runtime = 'nodejs'; // Explicitly set nodejs runtime
// export const preferredRegion = 'auto'; // Optional: deployment optimization

// export async function POST(req: Request) {
//   const { question } = await req.json();

//   try {
//     // Extract text from PDF
//     const pdfPath = path.join(process.cwd(), 'public', 'assets', 'QnA.pdf');
//     const pdfParser = new PDFParser();

//     const parseFile = () => new Promise((resolve, reject) => {
//       pdfParser.on("pdfParser_dataReady", (pdfData) => {
//         resolve(pdfData);
//       });
//       pdfParser.on("pdfParser_dataError", (error) => {
//         reject(error);
//       });
//       pdfParser.loadPDF(pdfPath);
//     });

//     const pdfData = await parseFile() as any;
    
//     // Extract text from pages
//     const pdfText = pdfData.Pages.map((page: any) => {
//       return page.Texts.map((textItem: any) => {
//         return decodeURIComponent(textItem.R[0].T);
//       }).join(' ');
//     }).join('\n');

//     console.log('PDF text extracted:', pdfText.substring(0, 100) + '...');

//     try {
//       // Load TensorFlow.js model
//       const model = await loadModel();
//       console.log('Model loaded successfully');

//       const answers = await answerQuestion(model, pdfText, question);
      
//       return NextResponse.json({ answers });
//     } catch (modelError: any) {
//       console.error('Model error:', modelError);
//       return NextResponse.json(
//         { error: 'Model processing failed', details: modelError.message },
//         { status: 500 }
//       );
//     }
//   } catch (error: any) {
//     console.error('General error:', error);
//     return NextResponse.json(
//       { error: 'Request failed', details: error.message },
//       { status: 500 }
//     );
//   }
// }