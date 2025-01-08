// components/PaymentDialog.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { PaymentStatus, UPIPaymentData } from '../../types';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  upiData: UPIPaymentData | null;
  paymentStatus: PaymentStatus | null;
  remainingTime: number;
  onUPIButtonClick: () => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  upiData,
  paymentStatus,
  remainingTime,
  onUPIButtonClick,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete UPI Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {upiData?.qrCode && (
            <div className="flex justify-center">
              <img 
                src={upiData.qrCode} 
                alt="Payment QR Code"
                className="max-w-[200px]"
              />
            </div>
          )}

          <Alert variant={
            paymentStatus?.status === 'completed' ? 'default' :
            paymentStatus?.status === 'failed' ? 'destructive' : 
            'default'
          }>
            <div className="flex items-center space-x-2">
              {paymentStatus?.status === 'completed' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : paymentStatus?.status === 'failed' ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <AlertTitle>
                {paymentStatus?.status === 'completed' ? 'Payment Successful' :
                 paymentStatus?.status === 'failed' ? 'Payment Failed' :
                 'Awaiting Payment'}
              </AlertTitle>
            </div>
            <AlertDescription>
              {remainingTime > 0 && (
                <p>Time remaining: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}</p>
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={onUPIButtonClick}
              disabled={!upiData?.upiUrl}
            >
              Open UPI App
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};