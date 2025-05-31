"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Globe, Shield, Zap, CheckCircle } from "lucide-react"

interface WorkflowFormProps {
  workflow: any
}

const focusAreaOptions = [
  { id: "security", label: "Security", icon: Shield, description: "Security vulnerabilities and best practices" },
  { id: "performance", label: "Performance", icon: Zap, description: "Performance optimizations and bottlenecks" },
  { id: "best-practices", label: "Best Practices", icon: CheckCircle, description: "Code quality and maintainability" },
]

export function WorkflowForm({ workflow }: WorkflowFormProps) {
  const [repositoryUrl, setRepositoryUrl] = useState("")
  const [branch, setBranch] = useState("main")
  const [focusAreas, setFocusAreas] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repositoryUrl.trim()) return

    setIsSubmitting(true)
    try {
      await workflow.startWorkflow({
        repositoryUrl: repositoryUrl.trim(),
        branch: branch.trim() || "main",
        focusAreas,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFocusArea = (areaId: string) => {
    setFocusAreas((prev) => (prev.includes(areaId) ? prev.filter((id) => id !== areaId) : [...prev, areaId]))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="w-5 h-5" />
            Repository Analysis
          </CardTitle>
          <CardDescription className="text-gray-400">
            Analyze your GitLab repository and generate optimized CI/CD pipelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="repository-url" className="text-white">
                GitLab Repository URL *
              </Label>
              <Input
                id="repository-url"
                type="url"
                placeholder="https://gitlab.com/username/repository"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Branch (optional)
              </Label>
              <Input
                id="branch"
                type="text"
                placeholder="main"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-white">Focus Areas (optional)</Label>
              <div className="grid gap-3">
                {focusAreaOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <motion.div key={option.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <label
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          focusAreas.includes(option.id)
                            ? "border-white bg-gray-900"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <Checkbox
                          checked={focusAreas.includes(option.id)}
                          onCheckedChange={() => toggleFocusArea(option.id)}
                          className="mt-0.5"
                        />
                        <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">{option.label}</div>
                          <div className="text-sm text-gray-400">{option.description}</div>
                        </div>
                      </label>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={!repositoryUrl.trim() || isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
              >
                {isSubmitting ? "Starting Analysis..." : "Start Workflow Analysis"}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
