import { useGameState } from '@/hooks/useGameState';

export default function CompletedTerms() {
  const { state } = useGameState();

  if (state.completedTerms.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mt-4 w-full max-w-md">
        <h3 className="font-bold text-lg mb-2 text-gray-800">完成した用語:</h3>
        <p className="text-gray-500 italic">まだ用語が見つかっていません</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-4 w-full max-w-md">
      <h3 className="font-bold text-lg mb-2 text-gray-800">完成した用語:</h3>
      <div className="max-h-60 overflow-y-auto">
        {state.completedTerms.map((term, index) => (
          <div key={index} className="p-2 mb-2 bg-gray-50 rounded border-l-4 border-blue-500">
            <div className="font-bold text-blue-800">{term.term}</div>
            <div className="text-gray-700">{term.fullName}</div>
            <div className="text-sm text-gray-600">{term.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}