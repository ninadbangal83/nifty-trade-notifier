import React from 'react';

const Header = () => {
  return (
<header className="bg-gray-700 text-white px-6 py-4 rounded-xl shadow-md flex justify-between items-center mb-8">
  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
    📈 Nifty Trade Notifier
  </h1>
  <button className="text-sm md:text-base bg-gray-800 hover:bg-gray-700 px-4 py-1 rounded-lg">
    Log out
  </button>
</header>
  );
};

export default Header;