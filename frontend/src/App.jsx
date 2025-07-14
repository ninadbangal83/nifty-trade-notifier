import React, { useEffect, useState } from 'react';
import Header from './components/Header'; // ✅ Add this
import Controls from './components/Controls';
import StatusCard from './components/StatusCard';
import SignalList from './components/SignalList';
import { getStatus, startBot, stopBot, getSignals } from './services/botService';

const App = () => {
  const [botRunning, setBotRunning] = useState(false);
  const [signals, setSignals] = useState([]);

  const fetchStatus = async () => {
    const status = await getStatus();
    setBotRunning(status.running);
  };

  const fetchSignals = async () => {
    const data = await getSignals();
    setSignals(data);
  };

  const handleToggle = async () => {
    if (botRunning) {
      await stopBot();
    } else {
      await startBot();
    }
    fetchStatus();
  };

  const handleExport = () => {
    window.open('http://localhost:3001/api/export', '_blank');
  };

  useEffect(() => {
    fetchStatus();
    fetchSignals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ✅ Now using actual Header component */}
        <Header />

        {/* Main section */}
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow p-6 mt-6">
          
          {/* Left: Status + Controls */}
          <div className="flex flex-col gap-6 md:w-1/3">
            <StatusCard running={botRunning} />
            <Controls onToggle={handleToggle} onExport={handleExport} botRunning={botRunning} />
          </div>

          {/* Right: Signals */}
          <div className="md:w-2/3">
            <SignalList signals={signals} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
