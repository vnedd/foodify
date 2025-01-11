import Modal from "@/components/ui/modal";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const QuickIngredientModal = ({ open, setOpen }: Props) => {
  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      QuickIngredientModal
    </Modal>
  );
};

export default QuickIngredientModal;
