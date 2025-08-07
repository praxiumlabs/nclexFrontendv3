// src/pages/Results/Results.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { 
  CheckCircle, XCircle, Clock, Target, TrendingUp, 
  BarChart3, Download, Share2, RefreshCw, Home,
  Award, AlertTriangle, BookOpen, Brain, X  // Add X here
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout } from '../../components/layout/layout/layout';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { Badge } from '../../components/common/Badge/Badge';
import { Loader } from '../../components/common/Loader/Loader';
import { 
  DifficultyChart, 
  ScoreDistributionChart, 
  PerformanceChart 
} from '../../components/dashboard/Charts';
import { getExamResults } from '../../store/slices/examSlice';
import { addActivity } from '../../store/slices/progressSlice';
import { showSuccessToast } from '../../store/slices/uiSlice';
import { formatTime, formatPercentage, getPerformanceLevel } from '../../utils/helpers';
import { useAnimatedValue } from '../../hooks/useAnimatedValue';

// Styled components
const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const ResultsHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[50]} 0%, 
    ${({ theme }) => theme.colors.primary[100]} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, 
      rgba(255, 255, 255, 0.8) 0%, 
      transparent 70%);
    z-index: 1;
  }
`;

const ResultsContent = styled.div`
  position: relative;
  z-index: 2;
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ScoreCircle = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(
      ${({ $score, theme }) => 
        $score >= 90 ? theme.colors.success.main :
        $score >= 80 ? theme.colors.primary[500] :
        $score >= 70 ? theme.colors.warning.main :
        theme.colors.error.main
      } ${({ $score }) => $score * 3.6}deg,
      ${({ theme }) => theme.colors.gray[200]} 0deg
    );
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 80%;
    height: 80%;
    background: ${({ theme }) => theme.colors.background.paper};
    border-radius: 50%;
  }
`;

const ScoreValue = styled.div`
  position: relative;
  z-index: 1;
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ScoreDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    text-align: center;
  }
`;

const PerformanceLevel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ $level }) => 
    $level === 'Excellent' ? '#10b981' :
    $level === 'Good' ? '#3b82f6' :
    $level === 'Satisfactory' ? '#f59e0b' :
    '#ef4444'};
`;

const ResultsSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SummaryCard = styled(Card)`
  text-align: center;
  transition: transform ${({ theme }) => theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const SummaryIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  background: ${({ $color }) => `${$color}20`};
  color: ${({ $color }) => $color};
`;

const SummaryValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SummaryLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const AnalysisSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const QuestionReview = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QuestionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
`;

const QuestionStatus = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $correct }) => $correct ? '#22c55e' : '#ef4444'};
  color: white;
`;

const QuestionContent = styled.div`
  flex: 1;
`;

const QuestionText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  line-height: ${({ theme }) => theme.lineHeight.relaxed};
`;

const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RecommendationsCard = styled(Card)`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.background.paper} 0%, 
    ${({ theme }) => theme.colors.primary[25]} 100%);
`;

const RecommendationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.8);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RecommendationIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $type }) => 
    $type === 'study' ? '#3b82f6' :
    $type === 'practice' ? '#10b981' :
    $type === 'review' ? '#f59e0b' :
    '#8b5cf6'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
`;

// Results component
const Results = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const examResults = useSelector(state => state.exam.results);
  const loading = useSelector(state => state.exam.loadingResults);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  
  // Animated values
  const animatedScore = useAnimatedValue(0, examResults?.score || 0, { 
    duration: 2000,
    easing: 'easeOutCubic'
  });

  useEffect(() => {
    if (sessionId) {
      dispatch(getExamResults(sessionId));
      
      // Add activity to history
      dispatch(addActivity({
        type: 'exam_completed',
        sessionId,
        timestamp: new Date().toISOString()
      }));
    }
  }, [dispatch, sessionId]);

  const handleRetryPractice = () => {
    navigate('/app/practice?mode=practice');
  };

  const handleNewSession = () => {
    navigate('/app/practice');
  };

  const handleViewProgress = () => {
    navigate('/app/progress');
  };

  const handleDownloadResults = () => {
    if (!examResults) return;
    
    const reportData = {
      sessionId,
      date: new Date().toLocaleDateString(),
      score: examResults.score,
      totalQuestions: examResults.totalQuestions,
      correctAnswers: examResults.correctAnswers,
      timeSpent: examResults.timeSpent,
      accuracy: examResults.accuracy,
      subjectBreakdown: examResults.subjectBreakdown
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nclex-results-${sessionId}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    dispatch(showSuccessToast('Results downloaded successfully'));
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My NCLEX Practice Results',
          text: `I scored ${examResults?.score}% on my NCLEX practice session!`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      const shareText = `I scored ${examResults?.score}% on my NCLEX practice session! Check out NCLEX Portal for your exam prep.`;
      try {
        await navigator.clipboard.writeText(shareText);
        dispatch(showSuccessToast('Results copied to clipboard'));
      } catch (err) {
        console.error('Error copying:', err);
      }
    }
  };

  if (loading || !examResults) {
    return (
      <Layout>
        <Loader fullScreen text="Loading your results..." />
      </Layout>
    );
  }

  const performanceLevel = getPerformanceLevel(examResults.score);
  const incorrectQuestions = examResults.questions?.filter(q => !q.isCorrect) || [];
  const recommendations = generateRecommendations(examResults);

  return (
    <Layout>
      <ResultsContainer>
        {/* Results Header */}
        <ResultsHeader>
          <ResultsContent>
            <ScoreDisplay>
              <ScoreCircle $score={animatedScore.value}>
                <ScoreValue>{Math.round(animatedScore.value)}%</ScoreValue>
              </ScoreCircle>
              
              <ScoreDetails>
                <PerformanceLevel $level={performanceLevel.name}>
                  {performanceLevel.name === 'Excellent' && <Award size={32} />}
                  {performanceLevel.name === 'Good' && <CheckCircle size={32} />}
                  {performanceLevel.name === 'Satisfactory' && <Target size={32} />}
                  {performanceLevel.name === 'Needs Improvement' && <AlertTriangle size={32} />}
                  {performanceLevel.name}
                </PerformanceLevel>
                <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                  {examResults.examType === 'mock' 
                    ? 'Mock Exam Results'
                    : examResults.examType === 'srs'
                    ? 'SRS Review Results'
                    : 'Practice Session Results'}
                </div>
              </ScoreDetails>
            </ScoreDisplay>

            <ResultsSummary>
              <SummaryCard variant="elevated">
                <Card.Content>
                  <SummaryIcon $color="#10b981">
                    <CheckCircle size={24} />
                  </SummaryIcon>
                  <SummaryValue>{examResults.correctAnswers}</SummaryValue>
                  <SummaryLabel>Correct Answers</SummaryLabel>
                </Card.Content>
              </SummaryCard>

              <SummaryCard variant="elevated">
                <Card.Content>
                  <SummaryIcon $color="#ef4444">
                    <XCircle size={24} />
                  </SummaryIcon>
                  <SummaryValue>{examResults.incorrectAnswers}</SummaryValue>
                  <SummaryLabel>Incorrect Answers</SummaryLabel>
                </Card.Content>
              </SummaryCard>

              <SummaryCard variant="elevated">
                <Card.Content>
                  <SummaryIcon $color="#3b82f6">
                    <Clock size={24} />
                  </SummaryIcon>
                  <SummaryValue>{formatTime(examResults.timeSpent)}</SummaryValue>
                  <SummaryLabel>Time Spent</SummaryLabel>
                </Card.Content>
              </SummaryCard>

              <SummaryCard variant="elevated">
                <Card.Content>
                  <SummaryIcon $color="#8b5cf6">
                    <TrendingUp size={24} />
                  </SummaryIcon>
                  <SummaryValue>{formatPercentage(examResults.correctAnswers, examResults.totalQuestions)}</SummaryValue>
                  <SummaryLabel>Accuracy Rate</SummaryLabel>
                </Card.Content>
              </SummaryCard>
            </ResultsSummary>

            <ActionButtons>
              <Button
                variant="outline"
                leftIcon={<Home size={18} />}
                onClick={() => navigate('/app/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                leftIcon={<Download size={18} />}
                onClick={handleDownloadResults}
              >
                Download
              </Button>
              <Button
                variant="outline"
                leftIcon={<Share2 size={18} />}
                onClick={handleShareResults}
              >
                Share
              </Button>
              <Button
                variant="primary"
                leftIcon={<RefreshCw size={18} />}
                onClick={handleRetryPractice}
              >
                Practice Again
              </Button>
            </ActionButtons>
          </ResultsContent>
        </ResultsHeader>

        {/* Analysis Section */}
        <AnalysisSection>
          {/* Performance Analysis */}
          <Card variant="elevated">
            <Card.Content>
              <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 600 }}>
                Performance Analysis
              </h3>
              
              {examResults.statistics && (
                <div style={{ height: '300px', marginBottom: '24px' }}>
                  <DifficultyChart data={examResults.statistics} />
                </div>
              )}
              
              {examResults.subjectBreakdown && (
                <div>
                  <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
                    Subject Breakdown
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(examResults.subjectBreakdown).map(([subject, stats]) => (
                      <div key={subject} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'var(--gray-50)',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontWeight: 500 }}>{subject}</span>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span>{stats.correct}/{stats.total}</span>
                          <Badge 
                            variant={stats.accuracy >= 80 ? 'success' : stats.accuracy >= 70 ? 'warning' : 'error'}
                            size="sm"
                          >
                            {stats.accuracy}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Recommendations */}
          <RecommendationsCard variant="elevated">
            <Card.Content>
              <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 600 }}>
                Personalized Recommendations
              </h3>
              
              {recommendations.map((rec, index) => (
                <RecommendationItem key={index}>
                  <RecommendationIcon $type={rec.type}>
                    {rec.type === 'study' && <BookOpen size={12} />}
                    {rec.type === 'practice' && <Target size={12} />}
                    {rec.type === 'review' && <Brain size={12} />}
                  </RecommendationIcon>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {rec.title}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {rec.description}
                    </div>
                  </div>
                </RecommendationItem>
              ))}
            </Card.Content>
          </RecommendationsCard>
        </AnalysisSection>

        {/* Question Review */}
        {incorrectQuestions.length > 0 && (
          <Card variant="elevated">
            <Card.Content>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                  Questions to Review ({incorrectQuestions.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                >
                  {showAllQuestions ? 'Show Less' : 'Show All'}
                </Button>
              </div>
              
              <QuestionReview>
                {(showAllQuestions ? incorrectQuestions : incorrectQuestions.slice(0, 3))
                  .map((question, index) => (
                  <QuestionItem key={index}>
                    <QuestionStatus $correct={false}>
                      <X size={14} />
                    </QuestionStatus>
                    <QuestionContent>
                      <QuestionText>
                        {question.questionText.substring(0, 150)}...
                      </QuestionText>
                      <QuestionMeta>
                        <Badge size="xs" variant="outline">
                          {question.subject}
                        </Badge>
                        <Badge 
                          size="xs" 
                          variant={
                            question.difficulty === 1 ? 'success' :
                            question.difficulty === 2 ? 'warning' : 'error'
                          }
                        >
                          {question.difficulty === 1 ? 'Easy' :
                           question.difficulty === 2 ? 'Medium' : 'Hard'}
                        </Badge>
                        <span>{formatTime(question.timeSpent || 0)}</span>
                      </QuestionMeta>
                    </QuestionContent>
                  </QuestionItem>
                ))}
              </QuestionReview>
            </Card.Content>
          </Card>
        )}
      </ResultsContainer>
    </Layout>
  );
};

// Helper function to generate recommendations
const generateRecommendations = (results) => {
  const recommendations = [];
  const { score, subjectBreakdown, statistics } = results;

  // Score-based recommendations
  if (score < 70) {
    recommendations.push({
      type: 'study',
      title: 'Focus on Fundamentals',
      description: 'Review core nursing concepts and strengthen your foundation knowledge.'
    });
  } else if (score < 80) {
    recommendations.push({
      type: 'practice',
      title: 'Increase Practice Volume',
      description: 'Practice more questions to improve pattern recognition and speed.'
    });
  } else if (score < 90) {
    recommendations.push({
      type: 'review',
      title: 'Refine Test-Taking Skills',
      description: 'Focus on advanced strategies and critical thinking questions.'
    });
  }

  // Subject-based recommendations
  if (subjectBreakdown) {
    const weakSubjects = Object.entries(subjectBreakdown)
      .filter(([_, stats]) => stats.accuracy < 75)
      .sort((a, b) => a[1].accuracy - b[1].accuracy);

    if (weakSubjects.length > 0) {
      recommendations.push({
        type: 'study',
        title: `Focus on ${weakSubjects[0][0]}`,
        description: `You scored ${weakSubjects[0][1].accuracy}% in this area. Consider additional study time.`
      });
    }
  }

  // Difficulty-based recommendations
  if (statistics?.byDifficulty) {
    const hardAccuracy = statistics.byDifficulty.hard?.accuracy || 0;
    if (hardAccuracy < 60) {
      recommendations.push({
        type: 'practice',
        title: 'Challenge Yourself More',
        description: 'Practice more advanced-level questions to build confidence.'
      });
    }
  }

  return recommendations.slice(0, 4); // Limit to 4 recommendations
};

export default Results;