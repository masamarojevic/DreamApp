import { useState, useCallback } from "react";
import { SortByOrder } from "../enums/sortEnum";

interface ModalOptions {
  isOpen: boolean;
  isSelected: SortByOrder | null;
}

function useModalSort() {
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    isOpen: false,
    isSelected: null,
  });

  const openModal = useCallback(() => {
    console.log("Opening modal");
    setModalOptions((prevOpt) => ({ ...prevOpt, isOpen: true }));
  }, []);

  const closeModal = useCallback(() => {
    setModalOptions((prevOpt) => ({ ...prevOpt, isOpen: false }));
  }, []);

  const selectModal = useCallback((option: SortByOrder) => {
    console.log("Option selected for sorting:", option); // Verify the option received
    setModalOptions((prevOpt) => {
      const newOptions = {
        ...prevOpt,
        isOpen: true,
        isSelected: option,
      };
      console.log("Updating modal options to:", newOptions); // Log the new state
      return newOptions;
    });
  }, []);
  return { modalOptions, openModal, closeModal, selectModal };
}
export default useModalSort;
