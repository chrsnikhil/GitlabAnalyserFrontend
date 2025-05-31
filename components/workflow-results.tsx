"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, GitBranch, FileText, Shield, AlertTriangle, CheckCircle, XCircle, Info, Star, Folder as FolderIcon, Package as PackageIcon } from "lucide-react"
import { useWorkflow } from "@/hooks/use-workflow"
import { Button } from "@/components/ui/button"

interface WorkflowResultsProps {
  results: {
    analysis?: any
    pipeline?: any
    validation?: any
    review?: any
  }
}

export function WorkflowResults({ results }: WorkflowResultsProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-700">
            <TabsTrigger value="analysis" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Search className="w-4 h-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <GitBranch className="w-4 h-4 mr-2" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="validation" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <FileText className="w-4 h-4 mr-2" />
              Validation
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Shield className="w-4 h-4 mr-2" />
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">{results.analysis && <AnalysisResults data={results.analysis} />}</TabsContent>

          <TabsContent value="pipeline">{results.pipeline && <PipelineResults data={results.pipeline} />}</TabsContent>

          <TabsContent value="validation">
            {results.validation && <ValidationResults data={results.validation} />}
          </TabsContent>

          <TabsContent value="review">{results.review && <ReviewResults data={results.review} />}</TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

function AnalysisResults({ data }: { data: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Structure Card */}
        <Card className="bg-gray-950 border-gray-800 flex flex-col h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
              <Search className="w-5 h-5" />
              Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 flex-1 justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FileText className="w-4 h-4 text-gray-500" />
              <span>Files:</span>
              <Badge variant="outline" className="ml-1 text-white border-gray-700 bg-gray-900">{data.structure?.files?.length ?? "N/A"}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FolderIcon className="w-4 h-4 text-gray-500" />
              <span>Directories:</span>
              <Badge variant="outline" className="ml-1 text-white border-gray-700 bg-gray-900">{data.structure?.directories?.length ?? "N/A"}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <GitBranch className="w-4 h-4 text-gray-500" />
              <span>Language:</span>
              <Badge variant="outline" className="ml-1 text-white border-gray-700 bg-gray-900">{data.analysis?.language ?? "N/A"}</Badge>
            </div>
          </CardContent>
        </Card>
        {/* Dependencies Card */}
        <Card className="bg-gray-950 border-gray-800 flex flex-col h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
              <PackageIcon className="w-5 h-5" />
              Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 flex-1 justify-center">
            {data.dependencies && Object.keys(data.dependencies).length > 0 ? (
              <div className="flex flex-col gap-2">
                {Object.entries(data.dependencies).map(([lang, content], index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                    <Badge variant="outline" className="text-white border-gray-700 bg-gray-900">{lang}</Badge>
                    <span>Found dependency file</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-400">No dependencies found</span>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Add more cards/sections here if needed, e.g., detected frameworks, special files, etc. */}
    </motion.div>
  )
}

function PipelineResults({ data }: { data: any }) {
  const { generatePipelineWithAI, isRunning, results } = useWorkflow()
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Generated CI/CD Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-4 mb-4">
            <Button
              variant="outline"
              className="bg-yellow-900 text-yellow-300 border-yellow-700 hover:bg-yellow-800"
              disabled={isRunning}
              onClick={() => generatePipelineWithAI({
                repositoryUrl: results.analysis?.repo_url || "",
                branch: results.analysis?.branch || "main",
                focusAreas: [],
              })}
            >
              Generate Pipeline with AI (uses OpenAI credits)
            </Button>
          </div>
          <ScrollArea className="h-96 w-full rounded-md border border-gray-700 bg-gray-900 p-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {data.pipeline_yaml || "No pipeline generated"}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ValidationResults({ data }: { data: any }) {
  const { validatePipelineWithAI, isRunning, results } = useWorkflow()
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Pipeline Validation Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row gap-4 mb-4">
            <Button
              variant="outline"
              className="bg-yellow-900 text-yellow-300 border-yellow-700 hover:bg-yellow-800"
              disabled={isRunning || !results.pipeline?.pipeline_yaml}
              onClick={() => validatePipelineWithAI(results.pipeline?.pipeline_yaml || "", results.analysis?.repo_url || "")}
            >
              Validate Pipeline with AI (uses OpenAI credits)
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {data.valid ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-medium ${data.valid ? "text-green-400" : "text-red-400"}`}>
              {data.valid ? "Pipeline is valid" : "Pipeline has issues"}
            </span>
          </div>

          {data.errors?.length > 0 && (
            <div>
              <h4 className="font-medium text-red-400 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Errors
              </h4>
              <div className="space-y-2">
                {data.errors.map((error: string, index: number) => (
                  <div key={index} className="text-sm text-red-300 bg-red-950/30 p-2 rounded">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.warnings?.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Warnings
              </h4>
              <div className="space-y-2">
                {data.warnings.map((warning: string, index: number) => (
                  <div key={index} className="text-sm text-yellow-300 bg-yellow-950/30 p-2 rounded">
                    {warning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.suggestions?.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Suggestions
              </h4>
              <div className="space-y-2">
                {data.suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="text-sm text-blue-300 bg-blue-950/30 p-2 rounded">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ReviewResults({ data }: { data: any }) {
  console.log("Review Results Data:", data);
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "text-red-400 bg-red-950/30 border-red-800"
      case "medium":
        return "text-yellow-400 bg-yellow-950/30 border-yellow-800"
      case "low":
        return "text-blue-400 bg-blue-950/30 border-blue-800"
      default:
        return "text-gray-400 bg-gray-950/30 border-gray-800"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Code Review Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Score: {typeof data.score === 'number' ? (data.score.toFixed(1)) : "N/A"}/10</span>
            </div>
            <Badge variant="outline" className="text-white border-gray-600">
              {data.findings?.length || 0} findings
            </Badge>
          </div>

          {data.summary && (
            <div className="p-4 bg-gray-900 rounded-lg">
              <h4 className="font-medium text-white mb-2">Summary</h4>
              <div className="text-gray-300 text-sm whitespace-pre-line">{data.summary}</div>
            </div>
          )}

          {data.findings?.length > 0 && (
            <div>
              <h4 className="font-medium text-white mb-4">Findings</h4>
              <div className="space-y-3">
                {data.findings.map((finding: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getSeverityColor(finding.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium">{finding.type}</h5>
                      <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                        {finding.severity}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{finding.description}</p>
                    {finding.location && <p className="text-xs text-gray-500 mb-2">Location: {finding.location}</p>}
                    {finding.recommendation && (
                      <p className="text-xs text-gray-400">Recommendation: {finding.recommendation}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
