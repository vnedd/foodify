import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Modal from "@/components/ui/modal";

interface AlertModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          type="button"
          disabled={loading}
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading ? (
            <div className="flex items-center">
              <p className="mr-2">Continue</p>
              <Loader className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
