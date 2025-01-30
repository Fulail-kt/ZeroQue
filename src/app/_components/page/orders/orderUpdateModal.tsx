import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Order } from './types';

type OrderStatus = "failed" | "pending" | "confirmed" | "preparing" | "ready" | "cancelled";
type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data:{status:OrderStatus,prepTime?:number}) => void;
    order: Order|null;
    newStatus: OrderStatus;
}

const StatusChangeDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  order,
  newStatus,
}) => {
  const [prepTime, setPrepTime] = useState("15");
  const isPreparing = newStatus === "preparing";
  const isPaymentIncomplete = order?.payment?.status !== "completed";

  const handleConfirm = () => {
    onConfirm(isPreparing ? { status: newStatus, prepTime: parseInt(prepTime) } : { status: newStatus });
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
          <div className="space-y-4">
            {/* {isPaymentIncomplete && (
              <div className="text-red-500 font-medium">
                Payment is not completed yet.
              </div>
            )} */}
            
            <AlertDialogDescription>
              Are you sure you want to change the order status to {newStatus}?
            </AlertDialogDescription>

            {isPreparing && (
              <div className="space-y-2">
                <label htmlFor="prepTime" className="block text-sm font-medium">
                  Preparation Time (minutes)
                </label>
                <Select value={prepTime} onValueChange={setPrepTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select prep time" />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 30, 45, 60].map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {time} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StatusChangeDialog;