'use client';

import { getExampleQuestions } from '@/lib/keryBot';

interface QuickQuestionsProps {
  onSelectQuestion: (question: string) => void;
  isVisible: boolean;
}

export default function QuickQuestions({ onSelectQuestion, isVisible }: QuickQuestionsProps) {
  const questions = getExampleQuestions();

  if (!isVisible) return null;

  return (
    <div className="px-4 pb-4 pt-2">
      <p className="text-xs text-gray-500 mb-2 font-medium">Preguntas sugeridas:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors border border-blue-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Pregunta sugerida: ${question}`}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

