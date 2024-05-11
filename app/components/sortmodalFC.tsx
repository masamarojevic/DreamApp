import React from "react";
import useModalSort from "../modals/sortModal";
import { SortByOrder } from "../enums/sortEnum";

const SortByDateModal: React.FC = () => {
  const { modalOptions, openModal, closeModal, selectModal } = useModalSort();
  console.log("Modal options inside SortByDateModal:", modalOptions);

  return (
    <div>
      <button
        onClick={openModal}
        className="px-6 py-2 m-2  bg-white rounded-lg shadow"
      >
        Sort:
      </button>
      {modalOptions.isOpen && (
        <div>
          <button
            onClick={() => selectModal(SortByOrder.NewToOld)}
            className="px-3 py-1 m-2 mb-5 bg-white rounded-lg shadow"
          >
            Newest to Oldest
          </button>
          <button
            onClick={() => selectModal(SortByOrder.OldToNew)}
            className="px-3 py-1 m-2 bg-white rounded-lg shadow"
          >
            Oldest to Newest
          </button>
          <button
            onClick={closeModal}
            className="px-3 py-1 m-2 bg-white rounded-lg shadow"
          >
            {" "}
            &times;
          </button>
        </div>
      )}
    </div>
  );
};
export default SortByDateModal;
