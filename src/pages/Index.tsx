import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import MathTest from '@/components/MathTest';

export default function Index() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [screenTime, setScreenTime] = useState(45);
  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(750);
  const [streak, setStreak] = useState(7);
  const [exercisesCompleted, setExercisesCompleted] = useState(4);
  const [testsCompleted, setTestsCompleted] = useState(2);
  const [earnedXpToday, setEarnedXpToday] = useState(320);
  
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showMathTest, setShowMathTest] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [isPauseActive, setIsPauseActive] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(0);

  const exercises = [
    {
      id: 1,
      title: 'Разминка для шеи',
      duration: '3 мин',
      durationSeconds: 180,
      icon: 'User',
      difficulty: 'Легко',
      xp: 50,
      color: 'bg-purple-100',
      instructions: [
        'Медленно наклоните голову вправо к плечу',
        'Задержитесь на 5 секунд',
        'Вернитесь в центр и повторите влево',
        'Выполните 5 повторений в каждую сторону'
      ]
    },
    {
      id: 2,
      title: 'Упражнения для глаз',
      duration: '2 мин',
      durationSeconds: 120,
      icon: 'Eye',
      difficulty: 'Легко',
      xp: 40,
      color: 'bg-blue-100',
      instructions: [
        'Закройте глаза и расслабьте их на 10 секунд',
        'Посмотрите вверх, затем вниз (10 раз)',
        'Посмотрите влево, затем вправо (10 раз)',
        'Нарисуйте глазами круг по часовой стрелке'
      ]
    },
    {
      id: 3,
      title: 'Растяжка спины',
      duration: '5 мин',
      durationSeconds: 300,
      icon: 'Move',
      difficulty: 'Средне',
      xp: 80,
      color: 'bg-orange-100',
      instructions: [
        'Встаньте прямо, ноги на ширине плеч',
        'Наклонитесь вперед, стараясь коснуться пола',
        'Медленно выпрямитесь и прогнитесь назад',
        'Повторите 8-10 раз'
      ]
    },
    {
      id: 4,
      title: 'Разминка рук',
      duration: '4 мин',
      durationSeconds: 240,
      icon: 'Hand',
      difficulty: 'Легко',
      xp: 60,
      color: 'bg-green-100',
      instructions: [
        'Вытяните руки перед собой',
        'Сожмите кулаки и разожмите (10 раз)',
        'Вращайте запястьями по кругу',
        'Встряхните руками для расслабления'
      ]
    },
  ];

  const brainTests = [
    {
      id: 1,
      title: 'Математическая головоломка',
      questions: 10,
      icon: 'Calculator',
      difficulty: 'Средне',
      xp: 100,
      color: 'bg-yellow-100',
      description: 'Решай примеры на скорость и проверь свои математические способности!'
    },
    {
      id: 2,
      title: 'Тест на внимание',
      questions: 8,
      icon: 'Focus',
      difficulty: 'Легко',
      xp: 70,
      color: 'bg-pink-100',
      description: 'Найди отличия и проверь свою наблюдательность!'
    },
    {
      id: 3,
      title: 'Логические задачи',
      questions: 12,
      icon: 'Brain',
      difficulty: 'Сложно',
      xp: 150,
      color: 'bg-indigo-100',
      description: 'Реши логические головоломки и прокачай свой мозг!'
    },
  ];

  const achievements = [
    { id: 1, title: 'Первая пауза', icon: 'Award', unlocked: true, date: '24 янв' },
    { id: 2, title: '7 дней подряд', icon: 'Flame', unlocked: true, date: 'Сегодня' },
    { id: 3, title: 'Мастер разминки', icon: 'Star', unlocked: true, date: '26 янв' },
    { id: 4, title: '100 упражнений', icon: 'Target', unlocked: false, progress: 67 },
    { id: 5, title: 'Гений тестов', icon: 'Trophy', unlocked: false, progress: 45 },
    { id: 6, title: '30 дней подряд', icon: 'Zap', unlocked: false, progress: 23 },
  ];

  const stats = [
    { label: 'Упражнения сегодня', value: exercisesCompleted, icon: 'Activity', color: 'text-purple-600' },
    { label: 'Пройдено тестов', value: testsCompleted, icon: 'Brain', color: 'text-blue-600' },
    { label: 'Заработано XP', value: earnedXpToday, icon: 'Zap', color: 'text-orange-600' },
    { label: 'Серия дней', value: streak, icon: 'Flame', color: 'text-red-600' },
  ];

  const startPause = () => {
    setIsPauseActive(true);
    setPauseTimer(300);
    toast({
      title: "Пауза началась! 🎯",
      description: "Самое время отдохнуть от экрана и размяться!",
    });
  };

  const handleExerciseClick = (exercise: any) => {
    setSelectedExercise(exercise);
    setShowExerciseDialog(true);
  };

  const completeExercise = () => {
    if (selectedExercise) {
      const newXp = xp + selectedExercise.xp;
      const newEarnedXp = earnedXpToday + selectedExercise.xp;
      setXp(newXp);
      setEarnedXpToday(newEarnedXp);
      setExercisesCompleted(exercisesCompleted + 1);
      
      if (newXp >= 1000) {
        setLevel(level + 1);
        setXp(newXp - 1000);
        toast({
          title: "🎉 Новый уровень!",
          description: `Поздравляем! Теперь ты Level ${level + 1}!`,
        });
      } else {
        toast({
          title: "Упражнение завершено! 💪",
          description: `+${selectedExercise.xp} XP получено!`,
        });
      }
      
      setShowExerciseDialog(false);
      setSelectedExercise(null);
    }
  };

  const handleTestClick = (test: any) => {
    setSelectedTest(test);
    if (test.title === 'Математическая головоломка') {
      setShowMathTest(true);
    } else {
      setShowTestDialog(true);
    }
  };

  const completeTest = (score?: number) => {
    if (selectedTest) {
      const earnedXp = score !== undefined 
        ? Math.round((score / 100) * selectedTest.xp)
        : selectedTest.xp;
      
      const newXp = xp + earnedXp;
      const newEarnedXp = earnedXpToday + earnedXp;
      setXp(newXp);
      setEarnedXpToday(newEarnedXp);
      setTestsCompleted(testsCompleted + 1);
      
      if (newXp >= 1000) {
        setLevel(level + 1);
        setXp(newXp - 1000);
        toast({
          title: "🎉 Новый уровень!",
          description: `Поздравляем! Теперь ты Level ${level + 1}!`,
        });
      } else {
        const grade = score !== undefined
          ? score >= 80 ? '🏆 Отлично!' : score >= 60 ? '👍 Хорошо!' : '💪 Продолжай тренироваться!'
          : '🧠 Тест пройден!';
        
        toast({
          title: grade,
          description: score !== undefined 
            ? `Правильных ответов: ${score}%. Получено ${earnedXp} XP!`
            : `+${earnedXp} XP получено!`,
        });
      }
      
      setShowTestDialog(false);
      setShowMathTest(false);
      setSelectedTest(null);
    }
  };

  const cancelTest = () => {
    setShowMathTest(false);
    setShowTestDialog(false);
    setSelectedTest(null);
    toast({
      title: "Тест прерван",
      description: "Попробуй ещё раз когда будешь готов!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl">
                ⏸️
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">HealthyPause</h1>
                <p className="text-sm text-gray-600">Забота о здоровье — это легко!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-4 py-2 text-base font-semibold">
                <Icon name="Flame" size={16} className="mr-1 text-orange-500" />
                {streak} дней
              </Badge>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={() => setShowSettingsDialog(true)}
              >
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>

          <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-purple-100 text-sm mb-1">Твой уровень</p>
                <h2 className="text-4xl font-bold">Level {level}</h2>
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-sm mb-1">Опыт</p>
                <p className="text-2xl font-bold">{xp} / 1000 XP</p>
              </div>
            </div>
            <Progress value={(xp / 1000) * 100} className="h-3 bg-purple-300" />
            <p className="text-purple-100 text-sm mt-2">Ещё {1000 - xp} XP до следующего уровня!</p>
          </Card>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 h-14 bg-white shadow-sm">
            <TabsTrigger value="home" className="flex flex-col gap-1">
              <Icon name="Home" size={20} />
              <span className="text-xs">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex flex-col gap-1">
              <Icon name="Activity" size={20} />
              <span className="text-xs">Упражнения</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex flex-col gap-1">
              <Icon name="Brain" size={20} />
              <span className="text-xs">Тесты</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex flex-col gap-1">
              <Icon name="Award" size={20} />
              <span className="text-xs">Достижения</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Время за экраном</h3>
                <Icon name="Timer" size={24} className="text-purple-500" />
              </div>
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-purple-600 mb-2">{screenTime}</div>
                <p className="text-gray-600 text-lg">минут использовано</p>
                <Progress value={(screenTime / 120) * 100} className="h-2 mt-4" />
                <p className="text-sm text-gray-500 mt-2">Следующая пауза через {120 - screenTime} минут</p>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 text-lg"
                onClick={startPause}
              >
                Начать паузу сейчас
              </Button>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="p-4 bg-white hover-lift cursor-pointer shadow">
                  <Icon name={stat.icon as any} size={24} className={`${stat.color} mb-2`} />
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-white shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Рекомендуем сейчас</h3>
              <div className="space-y-3">
                <div 
                  className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                  onClick={() => handleExerciseClick(exercises[1])}
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-200 flex items-center justify-center">
                    <Icon name="Eye" size={24} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">Упражнения для глаз</h4>
                    <p className="text-sm text-gray-600">2 минуты • +40 XP</p>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-gray-400" />
                </div>
                <div 
                  className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                  onClick={() => handleTestClick(brainTests[0])}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center">
                    <Icon name="Calculator" size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">Математическая головоломка</h4>
                    <p className="text-sm text-gray-600">10 вопросов • +100 XP</p>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-gray-400" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Физические упражнения</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className="p-6 bg-white hover-lift cursor-pointer shadow-lg transition-all" onClick={() => handleExerciseClick(exercise)}>
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${exercise.color} flex items-center justify-center`}>
                      <Icon name={exercise.icon as any} size={28} className="text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{exercise.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">{exercise.difficulty}</Badge>
                        <span className="text-sm text-gray-600">• {exercise.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-purple-600">+{exercise.xp} XP</span>
                        <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                          Начать
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Интеллектуальные тесты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brainTests.map((test) => (
                <Card key={test.id} className="p-6 bg-white hover-lift cursor-pointer shadow-lg transition-all" onClick={() => handleTestClick(test)}>
                  <div className={`w-16 h-16 rounded-2xl ${test.color} flex items-center justify-center mb-4`}>
                    <Icon name={test.icon as any} size={28} className="text-gray-700" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{test.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">{test.difficulty}</Badge>
                    <span className="text-sm text-gray-600">• {test.questions} вопросов</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-600">+{test.xp} XP</span>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      Пройти
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                <h3 className="text-2xl font-bold mb-2">Всего достижений</h3>
                <p className="text-5xl font-bold mb-1">3 / 6</p>
                <p className="text-yellow-100">Продолжай в том же духе!</p>
              </Card>

              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Прогресс</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">До мастера</span>
                      <span className="font-semibold text-gray-800">50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Редкие достижения</span>
                      <span className="font-semibold text-gray-800">33%</span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Твои достижения</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`p-6 transition-all ${
                      achievement.unlocked
                        ? 'bg-white shadow-lg hover-lift cursor-pointer'
                        : 'bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          achievement.unlocked
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                            : 'bg-gray-200'
                        }`}
                      >
                        <Icon
                          name={achievement.icon as any}
                          size={24}
                          className={achievement.unlocked ? 'text-white' : 'text-gray-400'}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{achievement.title}</h3>
                        {achievement.unlocked ? (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Получено {achievement.date}
                          </Badge>
                        ) : (
                          <div className="space-y-2">
                            <Progress value={achievement.progress} className="h-1.5" />
                            <p className="text-xs text-gray-500">{achievement.progress}% выполнено</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedExercise?.title}</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{selectedExercise?.difficulty}</Badge>
                  <span className="text-sm text-gray-600">{selectedExercise?.duration}</span>
                  <span className="text-sm font-semibold text-purple-600">+{selectedExercise?.xp} XP</span>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Инструкция:</h4>
                  <ol className="space-y-2">
                    {selectedExercise?.instructions.map((instruction: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex gap-2">
                        <span className="font-semibold text-purple-600">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <Button 
                  className="w-full bg-purple-500 hover:bg-purple-600 py-6 text-lg"
                  onClick={completeExercise}
                >
                  Завершить упражнение
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTest?.title}</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">{selectedTest?.difficulty}</Badge>
                  <span className="text-sm text-gray-600">{selectedTest?.questions} вопросов</span>
                  <span className="text-sm font-semibold text-purple-600">+{selectedTest?.xp} XP</span>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedTest?.description}</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    ⏱️ У тебя будет {selectedTest?.questions * 30} секунд на прохождение теста. Постарайся ответить правильно на все вопросы!
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-lg"
                  onClick={completeTest}
                >
                  Начать тест
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Настройки</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Интервал пауз</h4>
                  <p className="text-sm text-gray-600">Каждые 120 минут использования</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Уведомления</h4>
                  <p className="text-sm text-gray-600">Включены</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Родительский контроль</h4>
                  <p className="text-sm text-gray-600">Доступен в настройках родителя</p>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => setShowSettingsDialog(false)}
                >
                  Закрыть
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showMathTest} onOpenChange={setShowMathTest}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Математическая головоломка</DialogTitle>
            <DialogDescription>
              <MathTest
                totalQuestions={selectedTest?.questions || 10}
                difficulty={selectedTest?.difficulty || 'Средне'}
                onComplete={completeTest}
                onCancel={cancelTest}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}