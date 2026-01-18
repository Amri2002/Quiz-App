'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Trophy, Clock, Target, TrendingUp, Medal, Award, Crown, BarChart3, PieChart, LineChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const leaderboardData = [
  {
    rank: 1,
    name: 'Emma Wilson',
    score: 98,
    time: '12:34',
    correctAnswers: 19,
    totalQuestions: 20,
    avatar: 'EW',
  },
  {
    rank: 2,
    name: 'Michael Brown',
    score: 95,
    time: '14:22',
    correctAnswers: 19,
    totalQuestions: 20,
    avatar: 'MB',
  },
  {
    rank: 3,
    name: 'Sarah Davis',
    score: 92,
    time: '13:45',
    correctAnswers: 18,
    totalQuestions: 20,
    avatar: 'SD',
  },
  {
    rank: 4,
    name: 'James Miller',
    score: 88,
    time: '15:12',
    correctAnswers: 17,
    totalQuestions: 20,
    avatar: 'JM',
  },
  {
    rank: 5,
    name: 'Lisa Anderson',
    score: 85,
    time: '16:30',
    correctAnswers: 17,
    totalQuestions: 20,
    avatar: 'LA',
  },
]

export default function ReportsPage() {
  const [selectedQuiz, setSelectedQuiz] = useState('Biology Chapter 5 Quiz')
  const [selectedClass, setSelectedClass] = useState('all')

  const classPerformanceData = [
    { class: 'Biology 101', average: 89, total: 28 },
    { class: 'Chemistry 201', average: 82, total: 32 },
    { class: 'Physics 301', average: 91, total: 25 },
    { class: 'Math Algebra', average: 76, total: 30 },
  ]

  const weeklyTrendsData = [
    { week: 'Week 1', average: 72 },
    { week: 'Week 2', average: 78 },
    { week: 'Week 3', average: 85 },
    { week: 'Week 4', average: 89 },
  ]

  const scoreDistributionData = [
    { range: '90-100%', count: 12, percentage: 43, color: 'bg-green-500' },
    { range: '80-89%', count: 9, percentage: 32, color: 'bg-blue-500' },
    { range: '70-79%', count: 5, percentage: 18, color: 'bg-orange-500' },
    { range: 'Below 70%', count: 2, percentage: 7, color: 'bg-red-500' },
  ]

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <Crown className="w-7 h-7 text-white" />
          </div>
        )
      case 2:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
            <Medal className="w-7 h-7 text-white" />
          </div>
        )
      case 3:
        return (
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <Award className="w-7 h-7 text-white" />
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-bold text-lg">{rank}</span>
          </div>
        )
    }
  }

  return (
    <DashboardLayout title="Reports & Analytics" subtitle="View student performance and quiz statistics">
      <div className="space-y-8">
        {/* Filter Controls */}
        <div className="flex gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="biology">Biology 101</SelectItem>
              <SelectItem value="chemistry">Chemistry 201</SelectItem>
              <SelectItem value="physics">Physics 301</SelectItem>
              <SelectItem value="math">Math Algebra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quiz Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">28</CardTitle>
                <Target className="w-8 h-8 text-blue-500 opacity-70" />
              </div>
              <p className="text-sm text-gray-600">Total Submissions</p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">89%</CardTitle>
                <Trophy className="w-8 h-8 text-green-500 opacity-70" />
              </div>
              <p className="text-sm text-gray-600">Average Score</p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">14:32</CardTitle>
                <Clock className="w-8 h-8 text-purple-500 opacity-70" />
              </div>
              <p className="text-sm text-gray-600">Avg. Completion Time</p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">85%</CardTitle>
                <TrendingUp className="w-8 h-8 text-orange-500 opacity-70" />
              </div>
              <p className="text-sm text-gray-600">Pass Rate</p>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Performance Bar Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle>Class Performance</CardTitle>
              </div>
              <p className="text-sm text-gray-600">Average scores by class</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classPerformanceData.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">{item.class}</span>
                      <span className="font-bold text-primary">{item.average}%</span>
                    </div>
                    <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${item.average}%` }}
                      >
                        <span className="text-xs font-bold text-white">{item.total} students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                <CardTitle>Score Distribution</CardTitle>
              </div>
              <p className="text-sm text-gray-600">Students by score range</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Visual Pie Representation */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {(() => {
                        let cumulativePercent = 0
                        return scoreDistributionData.map((item, idx) => {
                          const startPercent = cumulativePercent
                          cumulativePercent += item.percentage
                          const startAngle = (startPercent / 100) * 360
                          const endAngle = (cumulativePercent / 100) * 360
                          const largeArcFlag = item.percentage > 50 ? 1 : 0

                          const startRad = (startAngle * Math.PI) / 180
                          const endRad = (endAngle * Math.PI) / 180
                          const x1 = 50 + 40 * Math.cos(startRad)
                          const y1 = 50 + 40 * Math.sin(startRad)
                          const x2 = 50 + 40 * Math.cos(endRad)
                          const y2 = 50 + 40 * Math.sin(endRad)

                          const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
                          
                          return (
                            <path
                              key={idx}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={colors[idx]}
                              className="hover:opacity-80 transition-opacity"
                            />
                          )
                        })
                      })()}
                      {/* Center circle for donut effect */}
                      <circle cx="50" cy="50" r="25" fill="white" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">28</p>
                        <p className="text-xs text-gray-600">Students</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-3">
                  {scoreDistributionData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.range}</p>
                        <p className="text-xs text-gray-600">{item.count} students ({item.percentage}%)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Trends Line Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-primary" />
                <CardTitle>Weekly Performance Trend</CardTitle>
              </div>
              <p className="text-sm text-gray-600">Average score progression over time</p>
            </CardHeader>
            <CardContent>
              <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-600 pr-4">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* Chart area */}
                <div className="ml-12 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-t border-gray-200"></div>
                    ))}
                  </div>

                  {/* Data visualization */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      points={weeklyTrendsData.map((d, i) => {
                        const x = (i / (weeklyTrendsData.length - 1)) * 100
                        const y = 100 - d.average
                        return `${x},${y}`
                      }).join(' ')}
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Area under line */}
                    <polygon
                      fill="url(#areaGradient)"
                      points={`0,100 ${weeklyTrendsData.map((d, i) => {
                        const x = (i / (weeklyTrendsData.length - 1)) * 100
                        const y = 100 - d.average
                        return `${x},${y}`
                      }).join(' ')} 100,100`}
                    />
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a020f0" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a020f0" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#a020f0" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Data points */}
                  {weeklyTrendsData.map((d, i) => {
                    const x = (i / (weeklyTrendsData.length - 1)) * 100
                    const y = 100 - d.average
                    return (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        title={`${d.week}: ${d.average}%`}
                      />
                    )
                  })}
                </div>

                {/* X-axis labels */}
                <div className="ml-12 mt-2 flex justify-between text-xs text-gray-600">
                  {weeklyTrendsData.map((d, i) => (
                    <span key={i}>{d.week}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Leaderboard</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{selectedQuiz}</p>
              </div>
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center space-x-4 mb-8 pb-8 border-b">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-xl">{leaderboardData[1].avatar}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{leaderboardData[1].name.split(' ')[0]}</p>
                <p className="text-2xl font-bold text-gray-700">{leaderboardData[1].score}%</p>
                <div className="mt-2 bg-gray-200 rounded-lg px-3 py-1">
                  <p className="text-xs text-gray-600">{leaderboardData[1].time}</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center -mt-6">
                <Crown className="w-8 h-8 text-yellow-500 mb-1 animate-pulse" />
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mb-2 ring-4 ring-yellow-200">
                    <span className="text-white font-bold text-2xl">{leaderboardData[0].avatar}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white font-bold">1</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">{leaderboardData[0].name.split(' ')[0]}</p>
                <p className="text-3xl font-bold text-yellow-600">{leaderboardData[0].score}%</p>
                <div className="mt-2 bg-yellow-100 rounded-lg px-3 py-1">
                  <p className="text-xs text-yellow-700 font-medium">{leaderboardData[0].time}</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-xl">{leaderboardData[2].avatar}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{leaderboardData[2].name.split(' ')[0]}</p>
                <p className="text-2xl font-bold text-orange-600">{leaderboardData[2].score}%</p>
                <div className="mt-2 bg-orange-100 rounded-lg px-3 py-1">
                  <p className="text-xs text-orange-700">{leaderboardData[2].time}</p>
                </div>
              </div>
            </div>

            {/* Rest of Leaderboard */}
            <div className="space-y-3">
              {leaderboardData.map((student) => (
                <div
                  key={student.rank}
                  className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {getRankBadge(student.rank)}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        {student.correctAnswers}/{student.totalQuestions} correct
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{student.score}%</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {student.time}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
