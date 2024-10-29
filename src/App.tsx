import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, School } from 'lucide-react';
import SchoolForm from './components/SchoolForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    schools?: { id: string; group: string }[];
  } | null>(null);

  const handleSubmit = async (schoolIds: string, groupName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/assign-schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolIds: schoolIds.split(',').map(id => id.trim()),
          groupName,
        }),
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        message: data.message,
        schools: data.schools,
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to process request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <School className="h-12 w-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              School Group Assignment System
            </h1>
            <p className="text-gray-600">
              Assign schools to groups and update system configurations
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
            <SchoolForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {result && (
            <div className="mt-6">
              <ResultDisplay result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;