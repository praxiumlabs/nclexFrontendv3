// src/components/dashboard/Charts/index.js
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// Performance Chart - Shows accuracy over time
export const PerformanceChart = ({ data = [] }) => {
  // Transform data for chart
  const chartData = data.slice(-7).map((item, index) => ({
    day: `Day ${index + 1}`,
    accuracy: item.accuracy || 0,
    questionsAnswered: item.questionsAnswered || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
        />
        <YAxis 
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value, name) => [
            `${value}${name === 'accuracy' ? '%' : ''}`,
            name === 'accuracy' ? 'Accuracy' : 'Questions'
          ]}
        />
        <Area
          type="monotone"
          dataKey="accuracy"
          stroke="#10b981"
          strokeWidth={3}
          fill="url(#accuracyGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Weekly Activity Chart - Shows questions answered per day
export const WeeklyActivityChart = ({ data = {} }) => {
  const { questionsTarget = 350, questionsCompleted = 0 } = data;
  
  // Generate weekly progress data
  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
    const target = Math.floor(questionsTarget / 7);
    const completed = Math.floor(Math.random() * target * 1.5); // Mock data
    
    return {
      day,
      target,
      completed,
      percentage: Math.round((completed / target) * 100),
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={weeklyData} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="day" 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value, name) => [
            value,
            name === 'target' ? 'Target' : 'Completed'
          ]}
        />
        <Bar 
          dataKey="target" 
          fill="#e5e7eb" 
          radius={[4, 4, 0, 0]}
          name="Target"
        />
        <Bar 
          dataKey="completed" 
          fill="#10b981" 
          radius={[4, 4, 0, 0]}
          name="Completed"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Subject Radar Chart - Shows performance across subjects
export const SubjectRadarChart = ({ data = [] }) => {
  // Transform subject data for radar chart
  const radarData = data.slice(0, 6).map(subject => ({
    subject: subject.name || 'Unknown',
    accuracy: subject.accuracy || 0,
    progress: subject.progress || 0,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={radarData}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fontSize: 10, fill: '#6b7280' }}
        />
        <PolarRadiusAxis 
          domain={[0, 100]} 
          tick={false}
          axisLine={false}
        />
        <Radar
          name="Accuracy"
          dataKey="accuracy"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Radar
          name="Progress"
          dataKey="progress"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.1}
          strokeWidth={2}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value, name) => [`${value}%`, name]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Difficulty Distribution Chart - Shows performance by difficulty
export const DifficultyChart = ({ data = {} }) => {
  const { byDifficulty = {} } = data;
  
  const difficultyData = [
    {
      name: 'Easy',
      correct: byDifficulty.easy?.correct || 0,
      total: byDifficulty.easy?.total || 0,
      accuracy: byDifficulty.easy?.accuracy || 0,
      color: '#10b981',
    },
    {
      name: 'Medium',
      correct: byDifficulty.medium?.correct || 0,
      total: byDifficulty.medium?.total || 0,
      accuracy: byDifficulty.medium?.accuracy || 0,
      color: '#f59e0b',
    },
    {
      name: 'Hard',
      correct: byDifficulty.hard?.correct || 0,
      total: byDifficulty.hard?.total || 0,
      accuracy: byDifficulty.hard?.accuracy || 0,
      color: '#ef4444',
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={difficultyData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis type="number" domain={[0, 100]} />
        <YAxis type="category" dataKey="name" width={60} />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Accuracy']}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
          {difficultyData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Score Distribution Pie Chart
export const ScoreDistributionChart = ({ data = [] }) => {
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  // Process score ranges
  const scoreRanges = [
    { name: '90-100%', value: 0, color: '#10b981' },
    { name: '80-89%', value: 0, color: '#3b82f6' },
    { name: '70-79%', value: 0, color: '#f59e0b' },
    { name: 'Below 70%', value: 0, color: '#ef4444' },
  ];

  // Categorize scores (mock data)
  data.forEach(session => {
    const score = session.score || 0;
    if (score >= 90) scoreRanges[0].value++;
    else if (score >= 80) scoreRanges[1].value++;
    else if (score >= 70) scoreRanges[2].value++;
    else scoreRanges[3].value++;
  });

  const hasData = scoreRanges.some(range => range.value > 0);
  
  if (!hasData) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={scoreRanges.filter(range => range.value > 0)}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {scoreRanges.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [value, 'Sessions']}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Study Time Chart - Shows study time over days
export const StudyTimeChart = ({ data = [] }) => {
  const chartData = data.slice(-14).map((item, index) => ({
    date: new Date(Date.now() - (13 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    studyTime: Math.round((item.studyTime || 0) / 60), // Convert to minutes
    target: 60, // 1 hour target
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value, name) => [
            `${value} min`,
            name === 'studyTime' ? 'Study Time' : 'Target'
          ]}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#e5e7eb"
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="studyTime"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};