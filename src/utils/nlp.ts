import { NlpManager } from "node-nlp";

// Define interfaces for our data structures
interface FAQ {
  question: string;
  variations: string[];
  answers: string[];
}

interface QNAData {
  faqs: FAQ[];
  fallback: string[];
}

// Type guard for checking if value is QNAData
function isQNAData(value: unknown): value is QNAData {
  const data = value as QNAData;
  return Array.isArray(data?.faqs) && Array.isArray(data?.fallback);
}

// Define manager configuration type
interface NlpManagerOptions {
  languages: string[];
  [key: string]: unknown;
}

// Define type for NlpManager
interface TypedNlpManager {
  addDocument: (language: string, text: string, intent: string) => void;
  addAnswer: (language: string, intent: string, answer: string) => void;
  train: () => Promise<void>;
  process: (language: string, text: string) => Promise<{
    intent: string;
    score: number;
    [key: string]: unknown;
  }>;
}

// Create typed manager instance
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const manager = new NlpManager({ languages: ["en"] }) as TypedNlpManager;
// Create typed manager instance
// const manager: TypedNlpManager = new NlpManager({ languages: ["en"] }) as TypedNlpManager;

const qnaData = {
  "faqs": [
    {
    "question":'how are you',
    "variations": ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "how are you", "how's it going", "what's up", "howdy"],
    "answers": [
      "Hello! How can I help with your recruitment questions today?",
      "Hi there! I'm your AI recruitment assistant. What can I help with?",
      "Hey! Welcome to our AI recruitment platform. What would you like to know?",
      "Good day! I'm here to answer your questions about our recruitment system."
    ]},
    {
      "question": "What is this AI recruitment application?",
      "variations": [
        "What is this platform?",
        "Tell me about this AI recruitment tool",
        "What does this application do?",
        "What's this AI recruitment system?",
        "Explain this AI recruitment platform"
      ],
      "answers": [
        "It's an intelligent system that helps recruiters find the best candidates by automating screening and assessments.",
        "This platform uses AI to streamline hiring, making it easier for recruiters to evaluate applicants.",
        "Think of it as an AI-powered hiring assistant that analyzes resumes and shortlists top candidates."
      ]
    },
    {
      "question": "How does AI help in recruitment?",
      "variations": [
        "How does this work?",
        "How does the AI work?",
        "Working?",
        "It works?",
        "How it works",
        "How this platform working",
        "How this platform works",
        "Tell me how AI helps recruiting",
        "What's the working principle?",
        "How does the AI assist in hiring?"
      ],
      "answers": [
        "AI automates resume screening, matches candidates to roles, and conducts initial assessments.",
        "By using AI, recruiters save time as the system pre-screens candidates based on skills and experience.",
        "Our AI helps match job seekers to roles efficiently, ensuring the right candidates get noticed."
      ]
    },
    {
      "question": "How do I create an account?",
      "variations": [
        "Sign up process",
        "How to register",
        "Account creation",
        "How can I join?",
        "How to make an account"
      ],
      "answers": [
        "Just click 'Sign Up,' enter your details, upload your resume, and verify your email. Simple!",
        "Creating an account is easy—just sign up, upload your CV, and confirm your email.",
        "Sign up by filling in your details, adding your resume, and verifying your email."
      ]
    },
    {
      "question": "How do I reset my password?",
      "variations": [
        "Forgot password",
        "Can't login",
        "Password recovery",
        "Lost my password",
        "Change password"
      ],
      "answers": [
        "Click 'Forgot Password,' enter your email, and follow the instructions to reset it.",
        "If you forget your password, just go to the login page and click 'Forgot Password' to reset it.",
        "No worries! Click 'Forgot Password,' enter your email, and check your inbox for reset instructions."
      ]
    },
    {
      "question": "How do I contact support?",
      "variations": [
        "Need help",
        "Customer service",
        "Contact details",
        "Get assistance",
        "Support email"
      ],
      "answers": [
        "You can reach out via email at support@example.com or use our live chat on the website.",
        "Need help? Contact our support team at support@example.com or visit the Help section.",
        "Our team is happy to assist! Email support@example.com or check our FAQs."
      ]
    },
    {
      "question": "Can I edit my application after submission?",
      "variations": [
        "Change my application",
        "Update application",
        "Modify submitted application",
        "Revise my application",
        "Fix my application",'edit application'
      ],
      "answers": [
        "No, but you can withdraw your application and submit a new one if necessary.",
        "You can't edit after submission, but you can always withdraw and reapply.",
        "Once submitted, applications can't be edited. However, you can withdraw and apply again."
      ]
    },
    {
      "question": "How does AI filter applications?",
      "variations": [
        "Application filtering",
        "AI screening process",
        "How are candidates selected",
        "Selection criteria",
        "How does the AI choose candidates",
        "Screening mechanism"
      ],
      "answers": [
        "Our AI scans resumes for keywords, skills, and experience to shortlist the best candidates.",
        "The AI looks at job requirements and matches them with applicant profiles to filter top candidates.",
        "By analyzing skills, experience, and job descriptions, AI ensures only the most relevant candidates are shortlisted."
      ]
    },
    {
      "question": "Is my data safe?",
      "variations": [
        "Data security",
        "Privacy concerns",
        "How secure is my information",
        "Data protection",
        "Information privacy"
      ],
      "answers": [
        "Yes! We use top-level encryption and security measures to keep your information protected.",
        "Your data security is our priority. We use industry-standard encryption to protect all your information.",
        "We implement robust security protocols to ensure your personal and professional data remains confidential."
      ]
    },
    {
      "question": "Who can use this platform?",
      "variations": [
        "Intended users",
        "Who is this for",
        "Target audience",
        "Can anyone use this",
        "User types"
      ],
      "answers": [
        "Both recruiters and job seekers! Recruiters can post jobs, review applications, and schedule interviews. Job seekers can apply for jobs and take AI-powered assessments.",
        "Our platform serves both hiring teams and candidates. Companies post positions while job seekers find opportunities that match their skills.",
        "We welcome recruiters looking to streamline hiring and candidates searching for their next role."
      ]
    }
  ],
  "fallback": [
    "I'm not sure about that. Can you rephrase your question?",
    "Could you clarify your question? I'll try my best to help.",
    "I don't have an answer for that right now, but I'm learning every day!"
  ]
};



let isModelTrained = false;

async function trainModel(): Promise<void> {
  if (isModelTrained) return;
  
  console.log("Training NLP model with variations...");
  
  if (!isQNAData(qnaData)) {
    throw new Error("Invalid QNA data format");
  }
  
  qnaData.faqs.forEach((faq: FAQ) => {
    manager.addDocument("en", faq.question, faq.question);

    if (Array.isArray(faq.variations)) {
      faq.variations.forEach((variation: string) => {
        manager.addDocument("en", variation, faq.question);
      });
    }
    
    faq.answers.forEach((answer: string) => {
      manager.addAnswer("en", faq.question, answer);
    });
  });
  
  await manager.train();
  console.log("NLP model training complete");
  isModelTrained = true;
  
  const testResponse = await manager.process("en", "How does this platform work?");
  console.log("Test response:", JSON.stringify(testResponse, null, 2));
}

// Handle the promise properly
void trainModel().catch((error) => {
  console.error("Error training model:", error);
});

export { manager, qnaData };