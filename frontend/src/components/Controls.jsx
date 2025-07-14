import React from 'react';
import { Play, StopCircle, Download } from 'lucide-react';

const Controls = ({ onToggle, onExport, botRunning }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 justify-between">
      <button 
        onClick={onToggle}
        className={`flex items-center gap-2 ${
          botRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        } text-white font-medium py-2 px-4 rounded-lg`}
      >
        {botRunning ? <StopCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {botRunning ? 'Stop Bot' : 'Start Bot'}
      </button>

      <button 
        onClick={onExport}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
    </div>
  );
};

export default Controls;
