import React from 'react';

export interface ResultCardProps {
  length: number;
  words: string[];
}

export const ResultCard: React.FC<ResultCardProps> = ({ length, words }) => {
  return (
    <section className="bg-gray-700 p-5 rounded border-l-[3px] border-blue-500 mb-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">{length}-Letter Words</h3>
      <div className="text-base text-gray-100 leading-relaxed">{words.join(' ')}</div>
    </section>
  );
};

export default ResultCard;
