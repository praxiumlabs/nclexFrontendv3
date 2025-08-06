// src/pages/Practice/Practice.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { 
  Check, X, ChevronLeft, ChevronRight, Clock, BookOpen, 
  AlertCircle, Lightbulb, Flag, Volume2, VolumeX, 
  SkipForward, RotateCcw, Eye, EyeOff, Maximize2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { FullScreenLayout } from '../../components/layout/Layout/Layout';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { Modal } from '../../components/common/Modal/Modal';
import { Loader } from '../../components/common/Loader/Loader';
import {
  startExamSession,
  submitAnswer,
  nextQuestion,
  previousQuestion,
  toggleFlagQuestion,
  selectCurrentQuestion,
  selectProgress,
  selectUserAnswer,
  showRationale,
  hideRationale
} from '../../store/slices/examSlice';
import { updateQuestionProgress } from '../../store/slices/progressSlice';
import { showSuccessToast, showErrorToast } from '../../store/slices/uiSlice';

// Styled components
const PracticeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background.default};
`;

const PracticeHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProgressBar = styled.div`
  position: relative;
  width: 200px;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100px;
  }
`;

const ProgressFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.primary[500]} 0%, 
    ${({ theme }) => theme.colors.primary[600]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width ${({ theme }) => theme.transitions.base};
  width: ${({ $progress }) => $progress}%;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ theme }) => theme.colors.background.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: monospace;
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const PracticeContent = styled.main`
  flex: 1;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const QuestionSection = styled.div`
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
`;

const QuestionCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const QuestionType = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ $type }) => 
    $type === 'SATA' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  color: ${({ $type }) => 
    $type === 'SATA' ? '#8b5cf6' : '#3b82f6'};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const QuestionText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const OptionButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.paper};
  border: 2px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;
  
  ${({ $selected }) => $selected && css`
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.primary[50]};
  `}
  
  ${({ $correct, $showResult }) => $showResult && $correct && css`
    border-color: ${({ theme }) => theme.colors.success.main};
    background: rgba(34, 197, 94, 0.1);
  `}
  
  ${({ $incorrect, $showResult }) => $showResult && $incorrect && css`
    border-color: ${({ theme }) => theme.colors.error.main};
    background: rgba(239, 68, 68, 0.1);
  `}
  
  &:hover:not(:disabled) {
    border-color: ${({ theme, $showResult }) => 
      !$showResult && theme.colors.primary[400]};
    transform: translateY(-1px);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const OptionIndicator = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${({ $type }) => 
    $type === 'SATA' ? '4px' : '50%'};
  border: 2px solid ${({ theme }) => theme.colors.border.main};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ $selected }) => $selected && css`
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  `}
  
  ${({ $correct, $showResult }) => $showResult && $correct && css`
    border-color: ${({ theme }) => theme.colors.success.main};
    background: ${({ theme }) => theme.colors.success.main};
    color: white;
  `}
  
  ${({ $incorrect, $showResult }) => $showResult && $incorrect && css`
    border-color: ${({ theme }) => theme.colors.error.main};
    background: ${({ theme }) => theme.colors.error.main};
    color: white;
  `}
`;

const OptionText = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    
    & > * {
      width: 100%;
    }
  }
`;

const SidePanel = styled.aside`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
  }
`;

const QuestionNav = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`;

const QuestionNavButton = styled.button`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.default};
  border: 1px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ $current }) => $current && css`
    background: ${({ theme }) => theme.colors.primary[500]};
    border-color: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  `}
  
  ${({ $answered }) => $answered && css`
    background: ${({ theme }) => theme.colors.success.light};
    border-color: ${({ theme }) => theme.colors.success.main};
  `}
  
  ${({ $flagged }) => $flagged && css`
    background: ${({ theme }) => theme.colors.warning.light};
    border-color: ${({ theme }) => theme.colors.warning.main};
  `}
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Practice component
const Practice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const currentQuestion = useSelector(selectCurrentQuestion);
  const progress = useSelector(selectProgress);
  const userAnswer = useSelector(selectUserAnswer);
  const examState = useSelector(state => state.exam);
  
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showRationale, setShowRationaleModal] = useState(false);

  // Load exam session on mount
  useEffect(() => {
    const mode = searchParams.get('mode') || 'quick';
    const subjectId = searchParams.get('subject');
    
    dispatch(startExamSession({
      examType: mode,
      params: {
        subjectId,
        limit: mode === 'quick' ? 10 : mode === 'mock' ? 75 : 5
      }
    }));
  }, [dispatch, searchParams]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOptions([]);
    setShowResult(false);
    setShowHint(false);
  }, [currentQuestion]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionId) => {
    if (showResult) return;

    if (currentQuestion.questionType === 'SATA') {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOptions.length === 0) {
      dispatch(showErrorToast('Please select an answer'));
      return;
    }

    setShowResult(true);
    
    await dispatch(submitAnswer({
      questionId: currentQuestion.id,
      selectedOptionIds: selectedOptions,
      timeSpent: timeElapsed
    }));

    // Update progress
    const isCorrect = currentQuestion.questionType === 'SATA'
      ? selectedOptions.length === currentQuestion.options.filter(opt => opt.isCorrect).length &&
        selectedOptions.every(id => currentQuestion.options.find(opt => opt.id === id)?.isCorrect)
      : currentQuestion.options.find(opt => opt.id === selectedOptions[0])?.isCorrect;

    dispatch(updateQuestionProgress({
      isCorrect,
      difficulty: currentQuestion.difficulty,
      questionType: currentQuestion.questionType,
      timeSpent: timeElapsed,
      subjectId: currentQuestion.subjectId,
      chapterId: currentQuestion.chapterId
    }));

    if (isCorrect && soundEnabled) {
      // Play success sound
    }
  };

  const handleNextQuestion = () => {
    if (examState.currentQuestionIndex === examState.questions.length - 1) {
      // Navigate to results
      navigate(`/app/practice/${examState.sessionId}/results`);
    } else {
      dispatch(nextQuestion());
      setTimeElapsed(0);
    }
  };

  const handlePreviousQuestion = () => {
    dispatch(previousQuestion());
  };

  const handleFlagQuestion = () => {
    dispatch(toggleFlagQuestion(currentQuestion.id));
    dispatch(showSuccessToast('Question flagged for review'));
  };

  const handleShowRationale = () => {
    setShowRationaleModal(true);
  };

  const handleExitPractice = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
      navigate('/app/dashboard');
    }
  };

  if (!currentQuestion) {
    return (
      <FullScreenLayout>
        <Loader fullScreen text="Loading questions..." />
      </FullScreenLayout>
    );
  }

  return (
    <FullScreenLayout>
      <PracticeContainer>
        {/* Header */}
        <PracticeHeader>
          <HeaderLeft>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ChevronLeft size={18} />}
              onClick={handleExitPractice}
            >
              Exit
            </Button>
            
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                {examState.examType === 'quick' ? 'Quick Practice' :
                 examState.examType === 'srs' ? 'SRS Review' :
                 'Mock Exam'}
              </h2>
            </div>
          </HeaderLeft>

          <HeaderCenter>
            <ProgressBar>
              <ProgressFill $progress={progress.percentage} />
            </ProgressBar>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {progress.current} of {progress.total}
            </span>
          </HeaderCenter>

          <HeaderRight>
            <Timer>
              <Clock size={16} />
              {formatTime(timeElapsed)}
            </Timer>
            
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={handleFlagQuestion}
            >
              <Flag size={18} fill={examState.flaggedQuestions.includes(currentQuestion.id) ? 'currentColor' : 'none'} />
            </Button>
          </HeaderRight>
        </PracticeHeader>

        {/* Content */}
        <PracticeContent>
          <QuestionSection>
            <QuestionCard variant="elevated">
              <Card.Content>
                <QuestionHeader>
                  <QuestionType $type={currentQuestion.questionType}>
                    <BookOpen size={16} />
                    {currentQuestion.questionType === 'SATA' ? 'Select All That Apply' : 'Multiple Choice'}
                  </QuestionType>
                  
                  {currentQuestion.difficulty && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: i < currentQuestion.difficulty
                              ? '#f59e0b'
                              : 'var(--gray-300)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </QuestionHeader>

                <QuestionText>
                  {currentQuestion.questionText}
                </QuestionText>

                <OptionsContainer>
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptions.includes(option.id);
                    const isCorrect = option.isCorrect;
                    const isIncorrect = showResult && isSelected && !isCorrect;
                    
                    return (
                      <OptionButton
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={showResult}
                        $selected={isSelected}
                        $correct={isCorrect}
                        $incorrect={isIncorrect}
                        $showResult={showResult}
                      >
                        <OptionIndicator
                          $type={currentQuestion.questionType}
                          $selected={isSelected}
                          $correct={isCorrect}
                          $incorrect={isIncorrect}
                          $showResult={showResult}
                        >
                          {showResult && isCorrect && <Check size={16} />}
                          {showResult && isIncorrect && <X size={16} />}
                        </OptionIndicator>
                        <OptionText>{option.optionText}</OptionText>
                      </OptionButton>
                    );
                  })}
                </OptionsContainer>

                <ActionButtons>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handlePreviousQuestion}
                      disabled={examState.currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    
                    {!showResult && (
                      <Button
                        variant="ghost"
                        size="md"
                        leftIcon={<Lightbulb size={18} />}
                        onClick={() => setShowHint(!showHint)}
                      >
                        Hint
                      </Button>
                    )}
                    
                    {showResult && (
                      <Button
                        variant="outline"
                        size="md"
                        leftIcon={<Eye size={18} />}
                        onClick={handleShowRationale}
                      >
                        Rationale
                      </Button>
                    )}
                  </div>

                  <div>
                    {!showResult ? (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleSubmitAnswer}
                        disabled={selectedOptions.length === 0}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="md"
                        rightIcon={examState.currentQuestionIndex < examState.questions.length - 1 
                          ? <ChevronRight size={18} /> 
                          : null}
                        onClick={handleNextQuestion}
                      >
                        {examState.currentQuestionIndex < examState.questions.length - 1 
                          ? 'Next Question' 
                          : 'Finish Practice'}
                      </Button>
                    )}
                  </div>
                </ActionButtons>

                {showHint && currentQuestion.tags && (
                  <Card style={{ marginTop: '24px' }} variant="outlined">
                    <Card.Content>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <Lightbulb size={18} color="#f59e0b" />
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Hint</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                        This question is related to: {currentQuestion.tags.join(', ')}
                      </p>
                    </Card.Content>
                  </Card>
                )}
              </Card.Content>
            </QuestionCard>
          </QuestionSection>

          <SidePanel>
            {/* Question Navigator */}
            <Card variant="elevated">
              <Card.Content>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
                  Question Navigator
                </h3>
                <QuestionNav>
                  {examState.questions.map((_, index) => {
                    const isAnswered = examState.userAnswers.some(
                      answer => answer.questionIndex === index
                    );
                    const isFlagged = examState.flaggedQuestions.includes(
                      examState.questions[index]?.id
                    );
                    
                    return (
                      <QuestionNavButton
                        key={index}
                        onClick={() => dispatch({ type: 'SET_CURRENT_QUESTION', payload: index })}
                        $current={index === examState.currentQuestionIndex}
                        $answered={isAnswered}
                        $flagged={isFlagged}
                      >
                        {index + 1}
                      </QuestionNavButton>
                    );
                  })}
                </QuestionNav>
              </Card.Content>
            </Card>

            {/* Session Stats */}
            <Card variant="elevated">
              <Card.Content>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
                  Session Stats
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      Answered
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {examState.userAnswers.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      Correct
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>
                      {examState.userAnswers.filter(a => a.isCorrect).length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      Accuracy
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      {examState.userAnswers.length > 0
                        ? Math.round((examState.userAnswers.filter(a => a.isCorrect).length / examState.userAnswers.length) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </SidePanel>
        </PracticeContent>

        {/* Rationale Modal */}
        <Modal
          isOpen={showRationaleModal}
          onClose={() => setShowRationaleModal(false)}
          title="Rationale"
          size="md"
        >
          <Modal.Body>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: userAnswer?.isCorrect 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                color: userAnswer?.isCorrect ? '#22c55e' : '#ef4444',
                fontWeight: 600,
                marginBottom: '16px'
              }}>
                {userAnswer?.isCorrect ? <Check size={20} /> : <X size={20} />}
                {userAnswer?.isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
            </div>
            
            <p style={{ lineHeight: 1.6, marginBottom: '16px' }}>
              {currentQuestion.rationale}
            </p>
            
            {currentQuestion.tags && (
              <div>
                <h4 style={{ margin: '16px 0 8px', fontSize: '14px', fontWeight: 600 }}>
                  Related Topics:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentQuestion.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        background: 'var(--gray-100)',
                        borderRadius: '16px',
                        fontSize: '12px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setShowRationaleModal(false);
                if (examState.currentQuestionIndex < examState.questions.length - 1) {
                  handleNextQuestion();
                }
              }}
            >
              {examState.currentQuestionIndex < examState.questions.length - 1 
                ? 'Next Question' 
                : 'Close'}
            </Button>
          </Modal.Footer>
        </Modal>
      </PracticeContainer>
    </FullScreenLayout>
  );
};

export default Practice;