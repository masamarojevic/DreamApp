// import React from "react";
// import useModalSort from "../modals/sortModal";
// import { SortByOrder } from "../enums/sortEnum";
// import { createContext } from "vm";
// interface sortByModal {
//   modalOptions :{isOpen:boolean}
//   openModal:() => void
//   closeModal:()=> void
//   selectModal:(order: SortByOrder)=> void
// }

// //context
// const defaultModalContext: sortByModal ={
//   modalOptions:{isOpen:false},
//   openModal:()=>{},
//   closeModal:()=>{},
//   selectModal:()=>{}
// }
// const ModalConytext = createContext<sortByModal>(defaultModalContext)

// const SortByDateModal: React.FC = () => {
//   const { modalOptions, openModal, closeModal, selectModal } = useModalSort();
//   console.log("Modal options inside SortByDateModal:", modalOptions);

//   return (
//     <div>
//       <button
//         onClick={openModal}
//         className="px-6 py-2 m-2  bg-white rounded-lg shadow"
//       >
//         Sort:
//       </button>
//       {modalOptions.isOpen && (
//         <div>
//           <button
//             onClick={() => selectModal(SortByOrder.NewToOld)}
//             className="px-3 py-1 m-2 mb-5 bg-white rounded-lg shadow"
//           >
//             Newest to Oldest
//           </button>
//           <button
//             onClick={() => selectModal(SortByOrder.OldToNew)}
//             className="px-3 py-1 m-2 bg-white rounded-lg shadow"
//           >
//             Oldest to Newest
//           </button>
//           <button
//             onClick={closeModal}
//             className="px-3 py-1 m-2 bg-white rounded-lg shadow"
//           >
//             {" "}
//             &times;
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
// export default SortByDateModal;
"use client";

import React, { ReactNode, useContext, useState, createContext } from "react";
import useModalSort from "../modals/sortModal";
import { SortByOrder } from "../enums/sortEnum";

interface sortByModal {
  modalOptions: { isOpen: boolean; isSelected: SortByOrder | null };
  openModal: () => void;
  closeModal: () => void;
  selectModal: (order: SortByOrder) => void;
}
//context but default value
const defaultModalContext: sortByModal = {
  modalOptions: { isOpen: false, isSelected: null },
  openModal: () => {},
  closeModal: () => {},
  selectModal: () => {},
};

//create context
const ModalContext = createContext<sortByModal>(defaultModalContext);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SortByOrder | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const selectModal = (order: SortByOrder) => {
    setSelectedOrder(order);
    closeModal();
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{
        modalOptions: { isOpen, isSelected: selectedOrder },
        openModal,
        closeModal,
        selectModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
