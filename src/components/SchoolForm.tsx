import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SchoolFormProps {
  onSubmit: (schoolIds: string, groupName: string) => Promise<void>;
  isLoading: boolean;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ onSubmit, isLoading }) => {
  const [schoolIds, setSchoolIds] = useState('');
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(schoolIds, groupName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="schoolIds"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          School IDs (comma-separated)
        </label>
        <textarea
          id="schoolIds"
          value={schoolIds}
          onChange={(e) => setSchoolIds(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., 1001, 1002, 1003"
          rows={3}
          required
        />
      </div>

      <div>
        <label
          htmlFor="groupName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Group Name
        </label>
        <input
          type="text"
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter group name"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Processing...
          </>
        ) : (
          'Assign Schools to Group'
        )}
      </button>
    </form>
  );
};

export default SchoolForm;