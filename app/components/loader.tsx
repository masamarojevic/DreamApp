import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-purple-900">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-pink-800"></div>
    </div>
  );
};

export default Loader;
