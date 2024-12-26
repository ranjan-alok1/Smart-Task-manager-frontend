import React from 'react';
import { Lightbulb } from 'lucide-react';

const SuggestionPanel = ({ suggestions, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="flex items-start space-x-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
        >
          <Lightbulb className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-primary-700 dark:text-primary-300">
              {suggestion.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {suggestion.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionPanel;