export const mockGuestData = {
  progress: {
    overview: {
      currentLevel: 'Intermediate',
      nextLevel: 'Advanced',
      overallAccuracy: 75,
      totalQuestionsAnswered: 248,
      totalStudyTime: 1440, // 24 hours in minutes
      currentStreak: 5,
      longestStreak: 12,
      lastStudyDate: new Date().toISOString(),
    },
    subjectProgress: [
      { id: 1, name: 'Pharmacology', progress: 65, accuracy: 72 },
      { id: 2, name: 'Med-Surg', progress: 80, accuracy: 78 },
      { id: 3, name: 'Pediatrics', progress: 45, accuracy: 68 },
      { id: 4, name: 'Mental Health', progress: 55, accuracy: 74 },
    ],
    weeklyGoals: {
      questionsTarget: 350,
      questionsCompleted: 180,
      studyTimeTarget: 600,
      studyTimeCompleted: 320,
      daysActiveTarget: 5,
      daysActive: 3,
      accuracy: 75,
    }
  },
  
  examHistory: [
    {
      id: 1,
      type: 'practice',
      date: new Date(Date.now() - 86400000).toISOString(),
      score: 78,
      totalQuestions: 25,
      correctAnswers: 19,
      timeSpent: 1800 // 30 minutes
    },
    {
      id: 2,
      type: 'quick',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      score: 70,
      totalQuestions: 10,
      correctAnswers: 7,
      timeSpent: 600 // 10 minutes
    },
  ],
  
  sampleQuestions: [
    {
      id: 1,
      questionText: "A nurse is caring for a client with heart failure. Which assessment finding would be most concerning?",
      questionType: "MCQ",
      difficulty: 2,
      subject: "Med-Surg",
      chapter: "Cardiovascular",
      options: [
        { id: 'a', optionText: 'Weight gain of 3 pounds in 24 hours', isCorrect: true },
        { id: 'b', optionText: 'Mild ankle edema', isCorrect: false },
        { id: 'c', optionText: 'Heart rate of 88 bpm', isCorrect: false },
        { id: 'd', optionText: 'Blood pressure of 130/80', isCorrect: false }
      ],
      rationale: "A weight gain of 3 pounds in 24 hours indicates fluid retention and worsening heart failure, requiring immediate intervention.",
      tags: ["heart failure", "assessment", "fluid retention"]
    }
  ]
};