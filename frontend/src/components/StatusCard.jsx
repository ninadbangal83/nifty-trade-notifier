import React from 'react';

const StatusCard = ({ running }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Bot Status</h2>
      <p className={`text-lg font-bold ${running ? 'text-green-600' : 'text-red-500'}`}> 
        {running ? 'Running' : 'Stopped'}
      </p>
    </div>
  );
};

export default StatusCard;