// // import * as tf from '@tensorflow/tfjs';
// // import { load as loadQnAModel } from '@tensorflow-models/qna';


// // export async function loadModel() {
// //   const model = await loadQnAModel();
// //   return model;
// // }



// // export async function answerQuestion(model:any, pdfText:any, question:any) {
// //     const answers = await model.findAnswers(question, pdfText);
// //     return answers;
// //   }


// // // src/utils/tensorflow.ts
// // import * as tf from '@tensorflow/tfjs';  // Using regular tfjs instead of tfjs-node
// // import { load as loadQnAModel } from '@tensorflow-models/qna';

// // export async function loadModel() {
// //   try {
// //     // Initialize backend
// //     await tf.setBackend('cpu');  // Use CPU backend for compatibility
// //     await tf.ready();
// //     console.log('TensorFlow backend initialized');
    
// //     const model = await loadQnAModel();
// //     console.log('QnA model loaded successfully');
// //     return model;
// //   } catch (error) {
// //     console.error('Error loading model:', error);
// //     throw error;
// //   }
// // }

// // export async function answerQuestion(model: any, pdfText: string, question: string) {
// //   try {
// //     if (!model) {
// //       throw new Error('Model not loaded');
// //     }

// //     console.log("finding the answers")
    
// //     const answers = await model.findAnswers(question, pdfText);
// //     console.log(answers,"ans")
// //     return answers;
// //   } catch (error) {
// //     console.error('Error during inference:', error);
// //     throw error;
// //   }
// // }



// // import * as tf from "@tensorflow/tfjs";  
// // import { load  } from "@tensorflow-models/qna";

// // export async function loadModel() {
// //   try {
// //     await tf.setBackend("webgl"); // ✅ Using WebGL for better performance
// //     await tf.ready();
// //     console.log("TensorFlow backend initialized");

// //     const model = await loadQnAModel();
// //     console.log("QnA model loaded successfully");
// //     return model;
// //   } catch (error) {
// //     console.error("Error loading model:", error);
// //     throw error;
// //   }
// // }
// import * as tf from "@tensorflow/tfjs";  
// import { load } from "@tensorflow-models/qna";

// export async function loadModel() {
//   try {
//     // Set specific TensorFlow.js flags for better performance
//     tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
//     tf.env().set('WEBGL_VERSION', 2);
//     tf.env().set('WEBGL_CPU_FORWARD', true); // Set WEBGL_CPU_FORWARD flag
//     tf.env().set('WEBGL_SIZE_UPLOAD_UNIFORM', 4); // Set WEBGL_SIZE_UPLOAD_UNIFORM flag

//     // Set the backend to WebGL
//     await tf.setBackend("webgl");
    
//     // Ensure TensorFlow.js is ready
//     await tf.ready();
    
//     // Load the model with explicit configuration
//     const model = await load({
//       modelUrl: '/assets/mobilebert/model.json',
//       fromTFHub: false
//     });
    
//     console.log("Model loaded with configuration:", {
//       backend: tf.getBackend(),
//       webglVersion: tf.env().get('WEBGL_VERSION'),
//     });
    
//     return model;
//   } catch (error) {
//     console.error("Detailed error loading model:", error);
//     throw error;
//   }
// }
// export async function answerQuestion(model: any, pdfText: string, question: string) {
//   console.log(question,"question",pdfText,"pdf")
//   try {
//     if (!model) {
//       throw new Error("Model not loaded");
//     }
//     if (!pdfText) {
//       throw new Error("No text provided");
//     }

//     console.log("Finding answers...");
//     const answers = await model.findAnswers(question, pdfText);
//     console.log("Extracted Answers:", answers);
//     return answers;
//   } catch (error) {
//     console.error("Error during inference:", error);
//     throw error;
//   }
// }
