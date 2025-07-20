import React from 'react';

export default function ModelTestingSection() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-2">
      <h1 className="text-3xl font-bold mb-6">Model Testing</h1>
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          type="search"
          placeholder="Search models, results..."
          className="border rounded px-4 py-2 text-base focus:ring focus:outline-none w-full md:w-80"
        />
        <select className="border rounded px-2 py-1">
          <option>All Types</option>
          <option>Validation</option>
          <option>Performance</option>
          <option>Bias</option>
        </select>
        <select className="border rounded px-2 py-1">
          <option>Newest</option>
          <option>Best Accuracy</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Model Testing cards will go here */}
      </div>
    </div>
  );
} 