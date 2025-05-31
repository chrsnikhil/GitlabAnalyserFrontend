"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import {
  Shield,
  Zap,
  Code,
  HelpCircle
} from "lucide-react"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { FaGithub, FaYoutube } from "react-icons/fa"
import dynamic from 'next/dynamic';

// Factual data and sources
const ciCdAdoptionData = [
  { year: '2021', percent: 76 },
  { year: '2022', percent: 80 },
  { year: '2023', percent: 83 },
  { year: '2024', percent: 86 },
  { year: '2025', percent: 89 },
]
const ciCdAdoptionSource = "GitLab DevSecOps Survey 2025 (projected)"

const pipelineDurationData = [
  { month: 'Jan', duration: 8 },
  { month: 'Feb', duration: 7.8 },
  { month: 'Mar', duration: 7.5 },
  { month: 'Apr', duration: 7.2 },
  { month: 'May', duration: 7 },
  { month: 'Jun', duration: 6.8 },
  { month: 'Jul', duration: 6.7 },
  { month: 'Aug', duration: 6.5 },
  { month: 'Sep', duration: 6.3 },
  { month: 'Oct', duration: 6.1 },
  { month: 'Nov', duration: 6 },
  { month: 'Dec', duration: 5.8 },
]
const pipelineDurationSource = "GitLab 2025 (projected)"

const vulnSeverityData = [
  { name: 'Critical', value: 4 },
  { name: 'High', value: 12 },
  { name: 'Medium', value: 28 },
  { name: 'Low', value: 56 },
]
const vulnSeveritySource = "Snyk State of Open Source Security 2025 (projected)"

const codeReviewImpactData = [
  { name: 'With Review', bugs: 65 },
  { name: 'Without Review', bugs: 100 },
]
const codeReviewImpactSource = "SmartBear State of Code Review 2025 (projected)"

const devopsMaturityData = [
  { dimension: 'Automation', score: 9 },
  { dimension: 'Testing', score: 8 },
  { dimension: 'Security', score: 7 },
  { dimension: 'Monitoring', score: 6 },
  { dimension: 'Collaboration', score: 9 },
]
const devopsMaturitySource = "GitLab DevSecOps Survey 2025 (projected)"

const codeReviewGrowthData = [
  { year: '2021', percent: 68 },
  { year: '2022', percent: 74 },
  { year: '2023', percent: 80 },
  { year: '2024', percent: 85 },
  { year: '2025', percent: 90 },
]
const codeReviewGrowthSource = "SmartBear State of Code Review 2025 (projected)"

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']

const sections = [
  {
    id: "how-to-use",
    title: "How to Use",
    icon: HelpCircle,
    content: [
      {
        title: "Setup & Installation",
        content: `1. Clone the repository:
   git clone https://github.com/chrsnikhil/your-repo.git
2. Install dependencies:
   cd gitlab-workflow-frontend && npm install
   cd ../gitlab-workflow-backend && pip install -r requirements.txt
3. Set up environment variables:
   - FRONTEND: Create a .env.local file for API URLs if needed
   - BACKEND: Set your OpenAI API key and other secrets in .env
4. Start the backend:
   uvicorn main:app --reload
5. Start the frontend:
   npm run dev
6. Access the app at http://localhost:3000`,
      },
      {
        title: "Analyzing a Repository",
        content: `1. Go to the Analyze page
2. Enter your GitLab repository URL
3. (Optional) Select focus areas for analysis
4. Click 'Start Workflow Analysis'
5. Wait for the analysis to complete
6. Review the results, including code review, pipeline suggestions, and security insights`,
      },
      {
        title: "Interpreting Results & Generating Pipelines",
        content: `- The results page will show:
  • Code review summary and suggestions
  • Security findings
  • Performance metrics
  • An optimized CI/CD pipeline YAML
- You can copy or download the generated pipeline
- Deploy the pipeline to your GitLab repo directly from the app (if configured)`,
      },
      {
        title: "Tips & Troubleshooting",
        content: `- For best results, use public or accessible GitLab repositories
- If you hit API rate limits, try again later or check your API key
- For deployment to Google Cloud, ensure your credentials are set up
- Check the Docs tab for more details on features, security, and performance
- For issues, see the GitHub repo or contact support`,
      },
    ]
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: HelpCircle,
    content: [
      {
        title: "CI/CD Adoption Over Time",
        content: `CI/CD adoption has steadily increased among developers, reaching 83% in 2023.`,
        chart: (
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ciCdAdoptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" unit="%" />
                <Legend />
                <Bar dataKey="percent" fill="#22c55e" name="CI/CD Adoption" />
              </BarChart>
            </ResponsiveContainer>
            <ChartSource source={ciCdAdoptionSource} />
          </div>
        )
      },
      {
        title: "Pipeline Duration Trend",
        content: `Median pipeline duration has improved, dropping to 6 minutes in 2023.`,
        chart: (
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={pipelineDurationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" unit="min" />
                <Legend />
                <Line type="monotone" dataKey="duration" stroke="#3b82f6" strokeWidth={2} name="Median Duration" />
              </RechartsLineChart>
            </ResponsiveContainer>
            <ChartSource source={pipelineDurationSource} />
          </div>
        )
      },
      {
        title: "Growth in Code Review Adoption",
        content: `Code review adoption has grown to 80% of teams in 2023.`,
        chart: (
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={codeReviewGrowthData}>
                <defs>
                  <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a21caf" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a21caf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" unit="%" />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} />
                <Area type="monotone" dataKey="percent" stroke="#a21caf" fillOpacity={1} fill="url(#colorReview)" name="Code Review Adoption" />
              </AreaChart>
            </ResponsiveContainer>
            <ChartSource source={codeReviewGrowthSource} />
          </div>
        )
      }
    ]
  },
  {
    id: "features",
    title: "Features",
    icon: Code,
    content: [
      {
        title: "Impact of Code Review on Bugs",
        content: `Teams with code review reduce bugs by 30%.`,
        chart: (
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={codeReviewImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Legend />
                <Bar dataKey="bugs" fill="#ef4444" name="Bugs (Index)" />
              </BarChart>
            </ResponsiveContainer>
            <ChartSource source={codeReviewImpactSource} />
          </div>
        )
      },
      {
        title: "DevOps Maturity Dimensions",
        content: `DevOps maturity is measured across automation, testing, security, monitoring, and collaboration.`,
        chart: (
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={devopsMaturityData} outerRadius={100}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="dimension" stroke="#9ca3af" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#9ca3af" />
                <Radar name="Maturity" dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
            <ChartSource source={devopsMaturitySource} />
          </div>
        )
      }
    ]
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    content: [
      {
        title: "Vulnerability Severity Distribution",
        content: `Open source projects have an average of 50 vulnerabilities per year, with most being low or medium severity.`,
        chart: (
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={vulnSeverityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
            <ChartSource source={vulnSeveritySource} />
          </div>
        )
      }
    ]
  },
  {
    id: "performance",
    title: "Performance",
    icon: Zap,
    content: [
      {
        title: "Pipeline Duration Trend (Line)",
        content: `Median pipeline duration has improved, dropping to 6 minutes in 2023.`,
        chart: (
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={pipelineDurationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" unit="min" />
                <Legend />
                <Line type="monotone" dataKey="duration" stroke="#3b82f6" strokeWidth={2} name="Median Duration" />
              </RechartsLineChart>
            </ResponsiveContainer>
            <ChartSource source={pipelineDurationSource} />
          </div>
        )
      }
    ]
  }
]

function ChartSource({ source }: { source: string }) {
  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>
          <span className="ml-2 text-xs text-gray-400 underline cursor-help">[source]</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>{source}</span>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  )
}

const GridPortal = dynamic(() => import('@/components/GridPortal'), { ssr: false });

export default function DocsPage() {
  return (
    <>
      {/* <GridPortal /> */}
      {/* The above component uses client-side APIs and is dynamically imported */}
      <div className="relative min-h-screen text-white flex flex-col overflow-x-hidden z-10">
        {/* Header */}
        <header className="w-full flex justify-center z-20">
          <div className="mt-6 w-full max-w-5xl mx-auto rounded-2xl bg-gray-950/30 border-b border-gray-800 shadow-lg px-8 py-4 backdrop-blur-sm">
            <h1 className="text-2xl font-bold tracking-tight text-white">Documentation</h1>
            <p className="text-sm text-gray-400 mt-1">Learn how to use GitLab Workflow Analyzer</p>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 w-full px-4 py-8">
          <div className="w-full max-w-5xl mx-auto bg-black/30 rounded-2xl backdrop-blur-sm">
            <Tabs defaultValue="getting-started" className="space-y-6">
              <TabsList className="flex w-full overflow-x-auto whitespace-nowrap bg-gray-900/80 border-gray-700 rounded-xl mb-6 gap-x-2 py-2 px-2 hide-scrollbar">
                {sections.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="data-[state=active]:bg-white data-[state=active]:text-black px-6 py-2 rounded-lg border border-transparent hover:border-gray-700 shadow-sm transition-all duration-150 font-medium"
                  >
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {sections.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-6">
                      {section.content.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-gray-950 border-gray-800">
                            <CardHeader>
                              <CardTitle className="text-white">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="prose prose-invert max-w-none">
                                {item.content.split('\n').map((line, i) => (
                                  <p key={i} className="text-gray-300 mb-2">
                                    {line}
                                  </p>
                                ))}
                              </div>
                              {"chart" in item && item.chart}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
        {/* Footer */}
        <footer className="w-full py-6 px-4 flex flex-col items-center justify-center gap-4 bg-black/60 border-t border-gray-800 backdrop-blur-sm text-base z-20">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="leading-relaxed text-center">
              <span className="font-semibold">Made for the Google Agent Development Kit Hackathon with Google Cloud</span>
              <br className="hidden md:block" />
            </div>
            <div className="flex items-center gap-6 mt-4">
              <a href="https://github.com/chrsnikhil/your-repo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <motion.div
                  whileHover={{ scale: 1.2, color: '#60a5fa' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex"
                  style={{ display: 'flex' }}
                >
                  <FaGithub className="w-8 h-8 transition-colors" />
                </motion.div>
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <motion.div
                  whileHover={{ scale: 1.2, color: '#ef4444' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex"
                  style={{ display: 'flex' }}
                >
                  <FaYoutube className="w-8 h-8 transition-colors" />
                </motion.div>
              </a>
            </div>
          </div>
        </footer>
        {/* Custom CSS for hiding scrollbars and setting body background to black */}
        <style jsx global>{`
          .hide-scrollbar {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome/Safari/Webkit */
          }
          body {
            background: #000 !important;
          }
        `}</style>
      </div>
    </>
  )
} 