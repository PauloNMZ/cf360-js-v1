
import React from 'react';

const FormHeader = () => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-lg mb-6">
      <h2 className="text-xl text-white font-medium">CADASTRO DE CONVENENTE</h2>
      <button className="text-white opacity-80 hover:opacity-100">✕</button>
    </div>
  );
};

export default FormHeader;
