"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

interface WorkflowData {
  repositoryUrl: string
  branch: string
  focusAreas: string[]
}

interface WorkflowResults {
  analysis?: any
  pipeline?: any
  validation?: any
  review?: any
}

export function useWorkflow() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState("")
  const [results, setResults] = useState<WorkflowResults>({})
  const [error, setError] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [lastRepoUrl, setLastRepoUrl] = useState<string>("")
  const [lastBranch, setLastBranch] = useState<string>("main")

  const pollStatus = async (operationId: string): Promise<any> => {
    const maxAttempts = 60 // 5 minutes with 5-second intervals
    let attempts = 0
    let retryDelay = 1000 // Start with 1 second delay

    // Add initial delay before starting to poll
    await new Promise(resolve => setTimeout(resolve, 5000))

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/status/${operationId}`)
        
        // Handle 404 responses with retry
        if (response.status === 404) {
          console.log(`Operation ${operationId} not found, retrying in ${retryDelay}ms...`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          retryDelay = Math.min(retryDelay * 1.5, 5000) // Increase delay up to 5 seconds
          continue
        }

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.statusText}`)
        }

        const status = await response.json()

        console.log(`Status for ${operationId}:`, status)

        if (status.status === "success" || status.status === "completed") {
          console.log(`Operation ${operationId} succeeded or completed. Returning result.`)
          // Handle cases where result is under 'result' or 'data', or is the status object itself (for review)
          if (status.status === "completed" && status.review_id !== undefined) {
            return status; // Return the whole status object for completed reviews
          }
          return status.result !== undefined ? status.result : status.data
        } else if (status.status === "error") {
          console.error(`Operation ${operationId} failed with error: ${status.error}`)
          throw new Error(status.error || "Operation failed")
        }

        // Still processing, wait and try again
        console.log(`Operation ${operationId} still processing. Waiting before next poll.`)
        await new Promise((resolve) => setTimeout(resolve, 5000))
        attempts++
      } catch (err) {
        throw new Error(`Polling failed: ${err instanceof Error ? err.message : "Unknown error"}`)
      }
    }

    throw new Error("Operation timed out")
  }

  const startWorkflow = useCallback(async (data: WorkflowData) => {
    console.log("startWorkflow called with:", data, data.repositoryUrl, data.branch, data.focusAreas);
    setLastRepoUrl(data.repositoryUrl)
    setLastBranch(data.branch || "main")
    setIsRunning(true)
    setError(null)
    setResults({})

    toast.success("Workflow started successfully!")

    try {
      // Step 1: Analysis
      setCurrentStep("analysis")
      toast.loading("Starting repository analysis...", { id: "analysis" })

      const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_url: data.repositoryUrl,
          branch: data.branch,
        }),
      })

      if (!analysisResponse.ok) {
        throw new Error(`Analysis failed: ${analysisResponse.statusText}`)
      }

      const analysisData = await analysisResponse.json()
      const analysisResult = await pollStatus(analysisData.operation_id)

      setResults((prev) => ({ ...prev, analysis: analysisResult }))
      toast.success("Repository analysis completed!", { id: "analysis" })

      // Step 2: Pipeline Generation
      setCurrentStep("pipeline")
      toast.loading("Generating CI/CD pipeline...", { id: "pipeline" })

      const pipelineResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-pipeline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_url: data.repositoryUrl,
          branch: data.branch
        }),
      })

      if (!pipelineResponse.ok) {
        throw new Error(`Pipeline generation failed: ${pipelineResponse.statusText}`)
      }

      const pipelineData = await pipelineResponse.json()
      const pipelineResult = await pollStatus(pipelineData.operation_id)

      console.log("Pipeline Generation Result:", pipelineResult)

      setResults((prev) => ({ ...prev, pipeline: pipelineResult }))
      toast.success("Pipeline generated successfully!", { id: "pipeline" })

      // Step 3: Validation
      setCurrentStep("validation")
      toast.loading("Validating pipeline configuration...", { id: "validation" })

      const validationResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipeline_yaml: pipelineResult.pipeline_yaml,
          repo_url: data.repositoryUrl,
        }),
      })

      if (!validationResponse.ok) {
        throw new Error(`Validation failed: ${validationResponse.statusText}`)
      }

      const validationData = await validationResponse.json()
      const validationResult = await pollStatus(validationData.operation_id)

      setResults((prev) => ({ ...prev, validation: validationResult }))
      toast.success("Pipeline validation completed!", { id: "validation" })

      // Step 4: Code Review
      setCurrentStep("review")
      toast.loading("Performing code review...", { id: "review" })

      const reviewResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/code-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_url: data.repositoryUrl,
          branch: data.branch,
          focus_areas: data.focusAreas,
        }),
      })

      if (!reviewResponse.ok) {
        throw new Error(`Code review failed: ${reviewResponse.statusText}`)
      }

      const reviewData = await reviewResponse.json()
      const reviewResult = await pollStatus(reviewData.review_id)

      console.log("Code Review Result:", reviewResult)

      setResults((prev) => ({ ...prev, review: reviewResult }))
      toast.success("Code review completed! All analysis finished.", { id: "review" })

      // Show a warning if the review is a mock/fallback due to OpenAI failure
      if (
        reviewResult?.message?.toLowerCase().includes("mock") ||
        reviewResult?.summary?.toLowerCase().includes("mock") ||
        reviewResult?.summary?.toLowerCase().includes("openai review failed")
      ) {
        toast.error(
          "AI code review could not be performed due to API limits. Showing a mock review instead."
        )
      }

      // Show the report modal after all steps are complete
      setShowReportModal(true)

      console.log("Workflow successful. Preparing to finalize state.")

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast.error(`Workflow failed: ${errorMessage}`)
    } finally {
      console.log("Finally block reached. Setting isRunning to false and currentStep to empty.")
      setIsRunning(false)
      setCurrentStep("")
    }
  }, [])

  const resetWorkflow = useCallback(() => {
    setIsRunning(false)
    setCurrentStep("")
    setResults({})
    setError(null)
    toast.info("Workflow reset. Ready for new analysis.")
  }, [])

  // AI-powered pipeline generation
  const generatePipelineWithAI = useCallback(async () => {
    if (!lastRepoUrl || !/^https?:\/\//.test(lastRepoUrl)) {
      toast.error("Repository URL is missing or invalid. Please start the workflow analysis first.")
      console.error("Invalid repo_url for AI pipeline generation:", lastRepoUrl)
      return
    }
    toast.warning("This will use your OpenAI credits. Proceeding with AI pipeline generation...")
    setIsRunning(true)
    setError(null)
    setResults((prev) => ({ ...prev, pipeline: undefined }))
    setCurrentStep("pipeline")
    toast.loading("Generating CI/CD pipeline with OpenAI...", { id: "pipeline-ai" })
    try {
      console.log("Calling AI pipeline generation with:", lastRepoUrl, lastBranch)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-pipeline-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_url: lastRepoUrl,
          branch: lastBranch
        }),
      })
      if (!response.ok) {
        throw new Error(`AI pipeline generation failed: ${response.statusText}`)
      }
      const respData = await response.json()
      const pipelineResult = await pollStatus(respData.operation_id)
      setResults((prev) => ({ ...prev, pipeline: pipelineResult }))
      toast.success("Pipeline generated with OpenAI!", { id: "pipeline-ai" })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast.error(`AI pipeline generation failed: ${errorMessage}`)
    } finally {
      setIsRunning(false)
      setCurrentStep("")
    }
  }, [lastRepoUrl, lastBranch])

  // AI-powered pipeline validation
  const validatePipelineWithAI = useCallback(async (pipelineYaml: string) => {
    toast.warning("This will use your OpenAI credits. Proceeding with AI pipeline validation...")
    setIsRunning(true)
    setError(null)
    setCurrentStep("validation")
    toast.loading("Validating pipeline with OpenAI...", { id: "validation-ai" })
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/validate-pipeline-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipeline_yaml: pipelineYaml,
          repo_url: lastRepoUrl,
        }),
      })
      if (!response.ok) {
        throw new Error(`AI pipeline validation failed: ${response.statusText}`)
      }
      const respData = await response.json()
      const validationResult = await pollStatus(respData.operation_id)
      setResults((prev) => ({ ...prev, validation: validationResult }))
      toast.success("Pipeline validated with OpenAI!", { id: "validation-ai" })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast.error(`AI pipeline validation failed: ${errorMessage}`)
    } finally {
      setIsRunning(false)
      setCurrentStep("")
    }
  }, [lastRepoUrl])

  return {
    isRunning,
    currentStep,
    results,
    error,
    startWorkflow,
    resetWorkflow,
    showReportModal,
    setShowReportModal,
    generatePipelineWithAI,
    validatePipelineWithAI,
  }
}
