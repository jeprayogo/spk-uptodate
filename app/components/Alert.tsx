'use client';

import { CircleX } from 'lucide-react';
import React, { useState } from "react";


type AlertProps = {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

const Alert: React.FC<AlertProps> = ({ message, type = 'info' }: AlertProps) => {
  const [showAlert, setShowAlert] = useState(true);

  if (!showAlert) return null;

  const alertStyle: Record<typeof type, string> = {
    info: 'text-blue-800 bg-blue-50',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  }


  return (
    <div onClick={() => setShowAlert(false)} className={`flex items-center p-4 mb-4 rounded-lg ${alertStyle[type]} shadow-md    cursor-pointer`} role="alert">
      {message}
      <button
        onClick={() => setShowAlert(false)}
        className="ms-auto -mx-1.5 -my-1.5 rounded-lg inline-flex items-center justify-center h-8 w-8"
      >
        <CircleX />
      </button>
    </div>
  );

};
export default Alert;
