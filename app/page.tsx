"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  GitBranch,
  Shield,
  Zap,
  CheckCircle,
  Code,
  Users,
  Mail,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge variant="outline" className="text-white border-gray-600 mb-4">
                AI-Powered CI/CD Analysis
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              GitLab Workflow
              <br />
              <span className="text-white">Analyzer</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Automatically analyze your GitLab repositories, generate optimized CI/CD pipelines, and get comprehensive
              code reviews powered by AI.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/analyze">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 group">
                  Start Analysis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-white hover:bg-gray-900 text-lg px-8 py-6"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Powerful Features for Modern Development</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Streamline your development workflow with AI-powered analysis and optimization tools.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Code,
                  title: "Repository Analysis",
                  description: "Deep analysis of your codebase structure, dependencies, and architecture patterns.",
                  color: "text-blue-400",
                },
                {
                  icon: GitBranch,
                  title: "Pipeline Generation",
                  description: "Automatically generate optimized CI/CD pipelines tailored to your project needs.",
                  color: "text-green-400",
                },
                {
                  icon: Shield,
                  title: "Security Review",
                  description: "Comprehensive security analysis to identify vulnerabilities and best practices.",
                  color: "text-red-400",
                },
                {
                  icon: Zap,
                  title: "Performance Optimization",
                  description: "Identify performance bottlenecks and get recommendations for improvements.",
                  color: "text-yellow-400",
                },
                {
                  icon: CheckCircle,
                  title: "Quality Assurance",
                  description: "Ensure code quality with automated reviews and best practice recommendations.",
                  color: "text-purple-400",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Share analysis results and collaborate on improvements with your team.",
                  color: "text-pink-400",
                },
              ].map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="bg-gray-950 border-gray-800 h-full hover:border-gray-600 transition-all duration-300 group">
                    <CardHeader>
                      <feature.icon
                        className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                      />
                      <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-400 text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gray-950/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Get started in minutes with our streamlined workflow analysis process.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Connect Repository",
                  description: "Provide your GitLab repository URL and select analysis focus areas.",
                },
                {
                  step: "02",
                  title: "AI Analysis",
                  description: "Our AI analyzes your codebase structure, dependencies, and patterns.",
                },
                {
                  step: "03",
                  title: "Generate Pipeline",
                  description: "Automatically create optimized CI/CD pipelines based on your project.",
                },
                {
                  step: "04",
                  title: "Review & Deploy",
                  description: "Get comprehensive reports and deploy your optimized workflow.",
                },
              ].map((step, index) => (
                <motion.div key={index} variants={fadeInUp} className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    {index < 3 && <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-700" />}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">About the Project</h2>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-950 border-gray-800">
                <CardContent className="p-8">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                      GitLab Workflow Analyzer is an advanced AI-powered platform designed to revolutionize how
                      development teams approach CI/CD pipeline optimization and code quality assurance.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Key Technologies</h3>
                        <ul className="space-y-2 text-gray-400">
                          <li>• Next.js & React for modern frontend</li>
                          <li>• AI-powered code analysis</li>
                          <li>• GitLab API integration</li>
                          <li>• Real-time workflow monitoring</li>
                          <li>• Automated pipeline generation</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Benefits</h3>
                        <ul className="space-y-2 text-gray-400">
                          <li>• Reduce deployment time by 60%</li>
                          <li>• Improve code quality scores</li>
                          <li>• Automated security scanning</li>
                          <li>• Performance optimization</li>
                          <li>• Team collaboration tools</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-32 bg-gray-950/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Have questions or need support? We'd love to hear from you.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-950 border-gray-800">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                      <p className="text-gray-400">support@gitlabanalyzer.com</p>
                    </div>

                    <div className="text-center">
                      <Github className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">GitHub</h3>
                      <p className="text-gray-400">github.com/gitlab-analyzer</p>
                    </div>

                    <div className="text-center">
                      <Twitter className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Twitter</h3>
                      <p className="text-gray-400">@gitlabanalyzer</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-800">
                    <Link href="/analyze">
                      <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                        Start Your Analysis Today
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">© 2024 GitLab Workflow Analyzer. All rights reserved.</div>
            <div className="flex space-x-6">
              <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
