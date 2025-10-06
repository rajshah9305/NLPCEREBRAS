'use client';
import { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Copy, Sparkles, Code2, Play, AlertCircle, Github, Menu, X } from 'lucide-react';
import SandpackPreview from '@/components/SandpackPreview';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const examplePrompts = [
    'Create a beautiful todo list with animations and gradient design',
    'Build a weather dashboard with cards and smooth transitions',
    'Make an interactive pricing calculator with slider controls',
    'Design a sleek contact form with validation and success state',
    'Create a modern login page with animated background',
    'Build a product card with hover effects and image carousel',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your app');
      return;
    }

    setIsGenerating(true);
    setShowPreview(true);
    setGeneratedCode('');
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate code');
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedCode = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace('data: ', '').trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.stage === 'error') {
              throw new Error(parsed.error || 'Generation failed');
            }

            if (parsed.stage === 'code' && parsed.content) {
              accumulatedCode += parsed.content;
              setGeneratedCode(accumulatedCode);
            }
          } catch (parseError) {
            console.error('Error parsing chunk:', parseError);
          }
        }
      }

      if (accumulatedCode) {
        toast.success('App generated successfully!');
      } else {
        throw new Error('No code was generated');
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        const errorMessage = error.message || 'Failed to generate app';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Generation error:', error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      toast.success('Generation stopped');
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      toast.success('Code copied to clipboard!');
    }
  };

  const handleReset = () => {
    setShowPreview(false);
    setGeneratedCode('');
    setError(null);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl shadow-sm">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-1.5 sm:p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  RAJ AI APP BUILDER
                </h1>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Code2 className="w-4 h-4" />
                  <span>Powered by Cerebras AI</span>
                </div>
                <a
                  href="https://github.com/rajshah9305/NLPCEREBRAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Code2 className="w-4 h-4" />
                    <span>Powered by Cerebras AI</span>
                  </div>
                  <a
                    href="https://github.com/rajshah9305/NLPCEREBRAS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors w-fit"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-4 sm:py-8">
          {!showPreview ? (
            // Prompt Input View
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 sm:mb-8 space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Build React Apps with AI
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
                  Describe any React component or application, and watch as AI generates beautiful, production-ready code in real-time.
                </p>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-4 sm:mb-6">
                <div className="p-4 sm:p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Describe your app
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Create a modern todo list with drag and drop, animations, and a beautiful gradient design..."
                    className="w-full h-32 sm:h-40 lg:h-48 px-3 sm:px-4 py-3 text-sm sm:text-base text-gray-800 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all resize-none outline-none"
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        e.preventDefault(); // always prevent default
                        handleGenerate();
                      }
                    }}
                  />
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs sm:text-sm text-gray-500">Press ⌘/Ctrl + Enter to generate</p>
                    <p className="text-xs sm:text-sm text-gray-500">{prompt.length} characters</p>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full bg-gradient-to-r from-orange-600 to-pink-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                        <span className="sm:hidden">Generating</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                        Generate App
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Example Prompts */}
              <div className="space-y-3 sm:space-y-4">
                <p className="text-sm font-semibold text-gray-700">Try these examples:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {examplePrompts.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(example)}
                      className="text-left p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Play className="w-3 sm:w-4 h-3 sm:h-4 text-orange-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 leading-relaxed">{example}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Preview View
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Mobile: Prompt Card */}
              <div className="lg:hidden bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900">Your Prompt</h3>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    New App
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{prompt}</p>
              </div>

              {/* Left Column - Prompt & Code (Desktop) */}
              <div className="hidden lg:block space-y-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Prompt</h3>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      New App
                    </button>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">{prompt}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[calc(100vh-350px)]">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Generated Code</h3>
                    <div className="flex items-center gap-2">
                      {isGenerating && (
                        <button
                          onClick={handleStop}
                          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Stop
                        </button>
                      )}
                      <button
                        onClick={handleCopy}
                        disabled={!generatedCode}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="h-[calc(100%-60px)] overflow-auto bg-gray-900 p-4">
                    {error ? (
                      <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-400 font-medium">Generation Error</p>
                          <p className="text-red-300 text-sm mt-1">{error}</p>
                        </div>
                      </div>
                    ) : isGenerating && !generatedCode ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-4">
                          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
                          <p className="text-gray-400">Generating your app...</p>
                        </div>
                      </div>
                    ) : (
                      <pre className="text-gray-100 text-sm font-mono leading-relaxed">
                        <code>{generatedCode || '// Your generated code will appear here...'}</code>
                      </pre>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Live Preview */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[50vh] sm:h-[60vh] lg:h-[calc(100vh-180px)]">
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Live Preview</h3>
                    {isGenerating && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-orange-600">
                        <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                        <span className="hidden sm:inline">Generating...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-[calc(100%-48px)] sm:h-[calc(100%-60px)] overflow-auto">
                  {generatedCode ? (
                    <SandpackPreview code={generatedCode} />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-8">
                        <Loader2 className="w-12 sm:w-16 h-12 sm:h-16 text-orange-600 animate-spin mx-auto" />
                        <p className="text-gray-600 text-base sm:text-lg font-medium">
                          {error ? 'Generation failed' : 'Generating your app...'}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm max-w-sm">
                          {error ? 'Please try again with a different prompt' : 'This may take a few moments'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile: Code Section */}
              <div className="lg:hidden bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900">Generated Code</h3>
                  <div className="flex items-center gap-2">
                    {isGenerating && (
                      <button
                        onClick={handleStop}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        Stop
                      </button>
                    )}
                    <button
                      onClick={handleCopy}
                      disabled={!generatedCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white rounded-lg text-xs font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="h-64 sm:h-80 overflow-auto bg-gray-900 p-3 sm:p-4">
                  {error ? (
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                      <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium text-sm">Generation Error</p>
                        <p className="text-red-300 text-xs sm:text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  ) : isGenerating && !generatedCode ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-3">
                        <Loader2 className="w-8 sm:w-12 h-8 sm:h-12 text-orange-500 animate-spin mx-auto" />
                        <p className="text-gray-400 text-sm">Generating your app...</p>
                      </div>
                    </div>
                  ) : (
                    <pre className="text-gray-100 text-xs sm:text-sm font-mono leading-relaxed">
                      <code>{generatedCode || '// Your generated code will appear here...'}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
