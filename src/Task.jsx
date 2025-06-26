import React from "react";

const Task = ({user , work}) => {
  return (
   <>
  <div className="min-w-50 min-h-40 flex items-center justify-center bg-gradient-to-br rounded-2xl from-blue-100 to-blue-200 p-6">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm transition-transform transform hover:scale-105 duration-300">
      <h1 className="text-2xl font-bold text-blue-700 mb-2 text-center">{user}</h1>
      <p className="text-gray-700 text-center">{work}</p>
    </div>
  </div>
</>

  );
};

export default Task;
