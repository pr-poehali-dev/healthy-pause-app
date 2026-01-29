import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface AttentionTestProps {
  totalQuestions: number;
  difficulty: string;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export default function AttentionTest({ totalQuestions, difficulty, onComplete, onCancel }: AttentionTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(totalQuestions * 30);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [pattern, setPattern] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showPattern, setShowPattern] = useState(true);
  const [memoryTime, setMemoryTime] = useState(5);

  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍒', '🥝', '🍑', '🥭'];
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];

  useEffect(() => {
    generatePattern();
  }, [currentQuestion]);

  useEffect(() => {
    if (showPattern && memoryTime > 0) {
      const timer = setTimeout(() => setMemoryTime(memoryTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPattern && memoryTime === 0) {
      setShowPattern(false);
    }
  }, [memoryTime, showPattern]);

  useEffect(() => {
    if (!showPattern && timeLeft > 0 && currentQuestion < totalQuestions) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishTest();
    }
  }, [timeLeft, currentQuestion, showPattern]);

  const generatePattern = () => {
    const patternLength = difficulty === 'Легко' ? 4 : difficulty === 'Средне' ? 6 : 8;
    const availableItems = difficulty === 'Легко' ? emojis.slice(0, 4) : difficulty === 'Средне' ? emojis.slice(0, 6) : emojis;
    
    const newPattern: string[] = [];
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(availableItems[Math.floor(Math.random() * availableItems.length)]);
    }
    
    setPattern(newPattern);
    setUserAnswer([]);
    setShowPattern(true);
    setMemoryTime(difficulty === 'Легко' ? 5 : difficulty === 'Средне' ? 4 : 3);
  };

  const handleEmojiClick = (emoji: string) => {
    if (showPattern || userAnswer.length >= pattern.length) return;
    
    const newAnswer = [...userAnswer, emoji];
    setUserAnswer(newAnswer);
    
    if (newAnswer.length === pattern.length) {
      checkAnswer(newAnswer);
    }
  };

  const checkAnswer = (answer: string[]) => {
    const correct = answer.every((item, index) => item === pattern[index]);
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(currentQuestion + 1);
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

  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
  const availableEmojis = difficulty === 'Легко' ? emojis.slice(0, 4) : difficulty === 'Средне' ? emojis.slice(0, 6) : emojis;

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
          <span className="text-lg font-semibold text-gray-700">
            {showPattern ? `${memoryTime}с` : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
          </span>
        </div>
      </div>

      <Progress value={progressPercentage} className="h-2" />

      <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
        {showPattern ? (
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Запомни последовательность!</h3>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {pattern.map((emoji, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl shadow-lg border-2 border-pink-300"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <Badge variant="secondary" className="text-lg px-6 py-3">
              Осталось {memoryTime} секунд
            </Badge>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {userAnswer.length === 0 ? 'Повтори последовательность!' : `Выбрано: ${userAnswer.length} / ${pattern.length}`}
              </h3>
              <div className="flex flex-wrap justify-center gap-3 min-h-[80px]">
                {userAnswer.map((emoji, index) => (
                  <div
                    key={index}
                    className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow border-2 border-purple-300"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {availableEmojis.map((emoji, index) => (
                <Button
                  key={index}
                  size="lg"
                  className="h-16 text-3xl bg-white hover:bg-purple-100 border-2 border-purple-200"
                  onClick={() => handleEmojiClick(emoji)}
                  disabled={userAnswer.length >= pattern.length}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </>
        )}

        {showResult && (
          <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
            isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isCorrect ? '✓ Правильно! Отличная память!' : '✗ Неверно. Попробуй ещё раз!'}
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
