import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface LogicTestProps {
  totalQuestions: number;
  difficulty: string;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

interface LogicQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'sequence' | 'riddle' | 'pattern';
}

export default function LogicTest({ totalQuestions, difficulty, onComplete, onCancel }: LogicTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalQuestions * 30);
  const [questions, setQuestions] = useState<LogicQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && currentQuestion < totalQuestions) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishTest();
    }
  }, [timeLeft, currentQuestion]);

  const generateQuestions = () => {
    const newQuestions: LogicQuestion[] = [];
    
    const easyQuestions = [
      { question: 'Продолжи последовательность: 2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], correctAnswer: 1, type: 'sequence' as const },
      { question: 'Что лишнее: собака, кошка, стол, попугай?', options: ['собака', 'кошка', 'стол', 'попугай'], correctAnswer: 2, type: 'riddle' as const },
      { question: 'Если все розы — цветы, а некоторые цветы красные, то...', options: ['Все розы красные', 'Некоторые розы могут быть красными', 'Нет роз', 'Все цветы розы'], correctAnswer: 1, type: 'riddle' as const },
      { question: '3, 6, 9, 12, ?', options: ['13', '14', '15', '16'], correctAnswer: 2, type: 'sequence' as const },
      { question: 'Какое число пропущено: 1, 1, 2, 3, 5, ?', options: ['6', '7', '8', '9'], correctAnswer: 2, type: 'sequence' as const },
    ];

    const mediumQuestions = [
      { question: 'Продолжи: 1, 4, 9, 16, 25, ?', options: ['30', '32', '36', '40'], correctAnswer: 2, type: 'sequence' as const },
      { question: 'Если A > B и B > C, то...', options: ['C > A', 'A > C', 'C = A', 'Нельзя определить'], correctAnswer: 1, type: 'riddle' as const },
      { question: '2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], correctAnswer: 1, type: 'sequence' as const },
      { question: 'Что общего: квадрат, куб, треугольник?', options: ['Все круглые', 'Все фигуры', 'Все имеют углы', 'Все красные'], correctAnswer: 1, type: 'pattern' as const },
      { question: 'Продолжи: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], correctAnswer: 1, type: 'sequence' as const },
      { question: 'Сколько треугольников можно составить из 6 палочек?', options: ['1', '2', '3', '4'], correctAnswer: 1, type: 'riddle' as const },
    ];

    const hardQuestions = [
      { question: 'Продолжи: 1, 1, 2, 3, 5, 8, 13, ?', options: ['18', '19', '20', '21'], correctAnswer: 3, type: 'sequence' as const },
      { question: 'Если все A — это B, но не все B — это A, то...', options: ['A шире B', 'B шире A', 'A = B', 'Противоречие'], correctAnswer: 1, type: 'riddle' as const },
      { question: '2, 3, 5, 7, 11, 13, ?', options: ['15', '16', '17', '18'], correctAnswer: 2, type: 'sequence' as const },
      { question: 'Сколько способов выбрать 2 предмета из 5?', options: ['8', '10', '12', '15'], correctAnswer: 1, type: 'riddle' as const },
      { question: '1, 8, 27, 64, 125, ?', options: ['150', '175', '200', '216'], correctAnswer: 3, type: 'sequence' as const },
      { question: 'Что следующее: ◯, △, ☐, ◯, △, ?', options: ['◯', '△', '☐', '★'], correctAnswer: 2, type: 'pattern' as const },
    ];

    const pool = difficulty === 'Легко' ? easyQuestions : difficulty === 'Средне' ? mediumQuestions : hardQuestions;
    
    for (let i = 0; i < totalQuestions; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      newQuestions.push(pool[randomIndex]);
    }
    
    setQuestions(newQuestions);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        finishTest();
      }
    }, 2000);
  };

  const finishTest = () => {
    const finalScore = Math.round((score / totalQuestions) * 100);
    onComplete(finalScore);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Подготовка вопросов...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-base px-4 py-2">
            Вопрос {currentQuestion + 1} / {totalQuestions}
          </Badge>
          <Badge variant="outline" className="text-base px-4 py-2">
            Счёт: {score}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Timer" size={20} className="text-orange-500" />
          <span className="text-lg font-semibold text-gray-700">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      <Progress value={progressPercentage} className="h-2" />

      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            {currentQ.type === 'sequence' ? '📊 Последовательность' : currentQ.type === 'pattern' ? '🎨 Паттерн' : '🧩 Загадка'}
          </Badge>
          <p className="text-xl font-semibold text-gray-800 leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              size="lg"
              className={`w-full text-lg font-medium py-6 transition-all justify-start ${
                showResult
                  ? index === currentQ.correctAnswer
                    ? 'bg-green-500 hover:bg-green-500 text-white'
                    : index === selectedAnswer
                    ? 'bg-red-500 hover:bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                  : 'bg-white hover:bg-indigo-100 text-gray-800 border-2 border-indigo-200'
              }`}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
            >
              <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
            isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isCorrect ? '✓ Правильно! Отличная логика!' : `✗ Неверно. Правильный ответ: ${String.fromCharCode(65 + currentQ.correctAnswer)}`}
          </div>
        )}
      </Card>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={onCancel}
      >
        Прервать тест
      </Button>
    </div>
  );
}
