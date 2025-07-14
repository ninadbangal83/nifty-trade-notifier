import React, { useEffect, useState } from 'react';

const SignalList = () => {
  const [signals, setSignals] = useState([]);

  const fetchSignals = async () => {
    try {
      const res = await fetch('/api/signals'); // Replace with your backend endpoint
      const data = await res.json();
      setSignals(data);
    } catch (err) {
      console.error('Error fetching signals:', err);
    }
  };

  useEffect(() => {
    fetchSignals(); // Initial fetch

    const interval = setInterval(() => {
      fetchSignals();
    }, 10000); // every 10 sec

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Signals</h2>
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase border-b">
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {signals.map((s, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="px-4 py-2">{s.symbol}</td>
              <td className="px-4 py-2 font-medium">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    s.type === 'EXIT'
                      ? 'bg-red-100 text-red-700'
                      : s.type === 'WARNING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {s.type}
                </span>
              </td>
              <td className="px-4 py-2">₹{s.price}</td>
              <td className="px-4 py-2">{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignalList;
