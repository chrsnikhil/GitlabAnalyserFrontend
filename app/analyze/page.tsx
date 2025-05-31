"use client"
import { motion } from "framer-motion"
import { WorkflowForm } from "@/components/workflow-form"
import { WorkflowProgress } from "@/components/workflow-progress"
import { WorkflowResults } from "@/components/workflow-results"
import { useWorkflow } from "@/hooks/use-workflow"
import { Toaster } from "@/components/ui/sonner"
import { CheckCircle, Github, Home, HelpCircle, Settings, RefreshCw } from "lucide-react"
import { FloatingDockDemo } from "@/components/ui/floating-dock-demo"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FaGithub } from "react-icons/fa"
import { GitBranch } from "lucide-react"
import yaml from "js-yaml"

function parsePipelineYaml(yamlStr: string) {
  try {
    const doc = yaml.load(yamlStr) as any
    if (typeof doc !== "object" || !doc) return null
    const jobs = []
    for (const [key, value] of Object.entries(doc)) {
      if (typeof value === "object" && value && (value as any).script) {
        jobs.push({ name: key, ...value })
      }
    }
    return jobs
  } catch {
    return null
  }
}

// Enhanced comprehensive report modal
function AnalysisReportModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full bg-gray-950 border-gray-800 text-white animate-in fade-in zoom-in-95">
        <DialogTitle><span className="sr-only">Analysis Complete</span></DialogTitle>
        {/* Green fill animation */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0 z-0 bg-green-600/40 origin-bottom rounded-lg"
          style={{ pointerEvents: 'none' }}
        />
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-2 z-20 text-gray-400 hover:text-white p-1 rounded transition-colors" aria-label="Close">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div className="z-10 flex flex-col items-center justify-center py-8 px-4">
          <CheckCircle className="w-16 h-16 text-green-500 animate-pulse mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Analysis Complete</h2>
          <p className="text-gray-300 text-center">Your repository has been analyzed successfully!</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AnalyzePage() {
  const workflow = useWorkflow();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [background-position:center] [background-repeat:repeat]">
      {/* Modern Header */}
      <header className="w-full flex justify-center sticky top-0 z-20">
        <div className="mt-6 w-full max-w-2xl mx-auto rounded-2xl bg-gray-950 border border-gray-800 shadow-lg px-6 py-4 flex flex-row items-center justify-between relative gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center">
              <Github className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Repository Analysis</h1>
              <p className="text-sm text-gray-400">AI-Powered Code Analysis</p>
            </div>
          </div>
          {(workflow.isRunning || workflow.results.analysis) && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={workflow.resetWorkflow}
              className="px-4 py-2 text-sm border border-gray-700 rounded-lg bg-gray-900 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200"
            >
              New Analysis
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Content Area - Top-aligned, not centered */}
      <main className="flex-1 w-full px-2 md:px-8 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl flex flex-col gap-8 mx-auto">
          {/* Form, Progress, Results, Error */}
          {!workflow.isRunning && !workflow.results.analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <WorkflowForm workflow={workflow} />
            </motion.div>
          )}

          {workflow.isRunning && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <WorkflowProgress currentStep={workflow.currentStep} />
            </motion.div>
          )}

          {workflow.results.analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <WorkflowResults results={workflow.results} workflow={workflow} />
            </motion.div>
          )}

          {workflow.error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-red-950/50 border border-red-800 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
              <p className="text-red-300">{workflow.error}</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Dock */}
      <FloatingDockDemo resetWorkflow={workflow.resetWorkflow} />
      <AnalysisReportModal open={workflow.showReportModal} onClose={() => workflow.setShowReportModal(false)} />
      <Toaster />
    </div>
  )
}
