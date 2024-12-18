"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from "~/trpc/react";
import { toast } from "sonner";

 function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verificationStatus, setVerificationStatus] = useState<{
    loading: boolean;
    success: boolean;
    message: string;
  }>({
    loading: true,
    success: false,
    message: 'Verifying your email...'
  });

  // Use the verification mutation
  const verifyEmailMutation = api.company.verifyEmail.useMutation({
    onSuccess: (result) => {
      setVerificationStatus({
        loading: false,
        success: true,
        message: result.message || 'Email verified successfully!'
      });
      
      // Redirect or show success message
      toast.success('Email Verified', {
        description: 'You can now access all features',
        duration: 3000
      });

      // Redirect to dashboard or login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: (error) => {
      setVerificationStatus({
        loading: false,
        success: false,
        message: error.message || 'Email verification failed'
      });
      
      toast.error('Verification Failed', {
        description: error.message || 'Unable to verify your email',
        duration: 3000
      });
    }
  });

  useEffect(() => {
    // Verify email on component mount
    if (token) {
      verifyEmailMutation.mutate({ token });
    } else {
      setVerificationStatus({
        loading: false,
        success: false,
        message: 'Invalid verification link'
      });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {verificationStatus.loading ? (
          <div className="animate-pulse">
            <h2 className="text-2xl font-bold mb-4">Verifying Email</h2>
            <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-2 bg-gray-300 rounded w-1/2 mx-auto"></div>
          </div>
        ) : (
          <>
            <h2 className={`text-2xl font-bold mb-4 ${
              verificationStatus.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {verificationStatus.success ? 'Verification Successful' : 'Verification Failed'}
            </h2>
            <p className="text-gray-600 mb-6">
              {verificationStatus.message}
            </p>
            
            {verificationStatus.success ? (
              <div className="text-green-500">
                ✓ Redirecting to Login
              </div>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Return to Login
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}