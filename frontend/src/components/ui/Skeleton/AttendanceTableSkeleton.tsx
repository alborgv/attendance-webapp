import React from 'react';

const AttendanceTableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
      
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="grid grid-cols-5 gap-4 mb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-8 bg-gray-100 rounded"></div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTableSkeleton;