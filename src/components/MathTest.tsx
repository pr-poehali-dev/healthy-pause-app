import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface MathTestProps {
  totalQuestions: number;
  difficulty: string;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

interface Question {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
}

export default function MathTest({ totalQuestions, difficulty, onComplete, onCancel }: MathTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalQuestions * 30);
  const [questions, setQuestions] = useState<Question[]>([]);
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
    const newQuestions: Question[] = [];
    const operators = difficulty === 'Легко' ? ['+', '-'] : difficulty === 'Средне' ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
    
    for (let i = 0; i < totalQuestions; i++) {
      const operator = operators[Math.floor(Math.random() * operators.length)];
      let num1, num2, answer;
      
      if (difficulty === 'Легко') {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
      } else if (difficulty === 'Средне') {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 30) + 1;
      } else {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
      }
      
      switch (operator) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          if (num1 < num2) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          break;
        case '×':
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = num1 * num2;
          break;
        case '÷':
          answer = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 9) + 2;
          num1 = answer * num2;
          break;
        default:
          answer = num1 + num2;
      }
      
      newQuestions.push({ num1, num2, operator, answer });
    }
    
    setQuestions(newQuestions);
  };

  const generateAnswerOptions = (correctAnswer: number) => {
    const options = [correctAnswer];
    while (options.length < 4) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const wrongAnswer = correctAnswer + offset;
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].answer;
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
    }, 1500);
  };

  const finishTest = () => {
    const finalScore = Math.round((score / totalQuestions) * 100);
    onComplete(finalScore);
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Подготовка вопросов...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const answerOptions = generateAnswerOptions(currentQ.answer);
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

      <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600 mb-4">Реши пример:</p>
          <div className="text-6xl font-bold text-purple-600 mb-2">
            {currentQ.num1} {currentQ.operator} {currentQ.num2}
          </div>
          <p className="text-2xl text-gray-400">=  ?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {answerOptions.map((option, index) => (
            <Button
              key={index}
              size="lg"
              className={`text-2xl font-bold py-8 transition-all ${
                showResult
                  ? option === currentQ.answer
                    ? 'bg-green-500 hover:bg-green-500'
                    : option === selectedAnswer
                    ? 'bg-red-500 hover:bg-red-500'
                    : 'bg-gray-300'
                  : 'bg-white hover:bg-purple-100 text-gray-800 border-2 border-purple-200'
              }`}
              onClick={() => !showResult && handleAnswer(option)}
              disabled={showResult}
            >
              {option}
            </Button>
          ))}
        </div>

        {showResult && (
          <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
            isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isCorrect ? '✓ Правильно!' : `✗ Неверно. Правильный ответ: ${currentQ.answer}`}
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
