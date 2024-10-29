import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ResultDisplayProps {
  result: {
    success: boolean;
    message: string;
    schools?: { id: string; group: string }[];
  };
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div
      className={`rounded-lg p-4 ${
        result.success ? 'bg-green-50' : 'bg-red-50'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {result.success ? (
            <CheckCircle2 className="h-5 w-5 text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="ml-3 w-full">
          <h3
            className={`text-sm font-medium ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {result.success ? 'Success' : 'Error'}
          </h3>
          <div
            className={`mt-2 text-sm ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}
          >
            <p>{result.message}</p>
          </div>
          {result.success && result.schools && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                Processed Schools:
              </h4>
              <div className="bg-white rounded-md shadow-sm p-3">
                <ul className="space-y-1">
                  {result.schools.map((school) => (
                    <li
                      key={school.id}
                      className="text-sm text-gray-600"
                    >
                      School ID: {school.id} → Group: {school.group}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;