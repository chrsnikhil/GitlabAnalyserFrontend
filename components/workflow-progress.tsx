"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, GitBranch, FileText, Shield, Search } from "lucide-react"

interface WorkflowProgressProps {
  currentStep: string
}

const steps = [
  {
    id: "analysis",
    label: "Repository Analysis",
    icon: Search,
    description: "Analyzing repository structure and dependencies",
  },
  { id: "pipeline", label: "Pipeline Generation", icon: GitBranch, description: "Generating optimized CI/CD pipeline" },
  {
    id: "validation",
    label: "Pipeline Validation",
    icon: FileText,
    description: "Validating generated pipeline configuration",
  },
  { id: "review", label: "Code Review", icon: Shield, description: "Performing comprehensive code review" },
]

export function WorkflowProgress({ currentStep }: WorkflowProgressProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Workflow Progress</CardTitle>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index < currentStepIndex
              const isCurrent = index === currentStepIndex
              const isPending = index > currentStepIndex

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    isCompleted
                      ? "border-green-800 bg-green-950/30"
                      : isCurrent
                        ? "border-blue-800 bg-blue-950/30"
                        : "border-gray-700 bg-gray-900/30"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-900 text-green-400"
                        : isCurrent
                          ? "bg-blue-900 text-blue-400"
                          : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Clock className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        isCompleted ? "text-green-400" : isCurrent ? "text-blue-400" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {isCurrent && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      className="text-blue-400 text-sm font-medium"
                    >
                      Processing...
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
