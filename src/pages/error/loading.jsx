import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="flex justify-center items-center max-h-screen h-[200dvh]">
      <AiOutlineLoading className="size-9 text-gray-500 animate-spin" />
    </div>
  );
};

export default Loading;
