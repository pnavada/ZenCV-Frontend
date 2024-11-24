"use client";

import React, { useState } from 'react';
import { Upload, Download, FileText, Loader2, ChevronDown, Cpu } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ZenCVLayout = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [customizedResume, setCustomizedResume] = useState(null);
  const [selectedModel, setSelectedModel] = useState('aws-bedrock');
  const [error, setError] = useState(null);

  const aiModels = [
    { id: 'aws-bedrock', name: 'AWS Bedrock', description: 'Claude v3 Sonnet' },
    { id: 'llama', name: 'Llama 2', description: '70B Chat' },
    { id: 'google-ai', name: 'Google AI Studio', description: 'Gemini Pro' },
    { id: 'openai', name: 'OpenAI', description: 'GPT-4' },
    { id: 'anthropic', name: 'Anthropic', description: 'Claude v3 Opus' },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }

    setUploadedFile(file);
    setError(null);
  };

  const handleCustomize = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!uploadedFile || !jobDescription.trim()) {
        setError('Please provide both resume and job description');
        return;
      }

      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('jobDescription', jobDescription);
      formData.append('model', selectedModel);

      // Replace with your API endpoint
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCustomizedResume(data.result);

    } catch (err) {
      console.error('Error during customization:', err);
      setError(err.message || 'Failed to customize resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // The entire JSX remains exactly the same as your original file
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              ZenCV
            </h1>
            <p className="text-gray-400 font-light tracking-wide">
              AI-Powered Resume Optimization
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Model Selection */}
        <div className="mb-8">
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Cpu className="h-5 w-5 text-purple-400" />
                Select AI Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {aiModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-4 rounded-lg border transition-all duration-200 
                              flex flex-col items-center justify-center text-center gap-2
                              ${selectedModel === model.id 
                                ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20' 
                                : 'bg-black/30 border-gray-800 hover:border-purple-500/50'}`}
                  >
                    <span className={`font-medium ${selectedModel === model.id ? 'text-purple-300' : 'text-gray-300'}`}>
                      {model.name}
                    </span>
                    <span className={`text-sm ${selectedModel === model.id ? 'text-purple-400' : 'text-gray-500'}`}>
                      {model.description}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Job Description */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <FileText className="h-5 w-5 text-purple-400" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-96 p-4 bg-black/30 border border-gray-800 rounded-lg 
                          resize-none text-gray-100 placeholder-gray-500
                          focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                          font-light tracking-wide"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Right Column - Upload and Results */}
          <div className="space-y-6">
            {/* Upload Section */}
            <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  <Upload className="h-5 w-5 text-purple-400" />
                  Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center
                              hover:border-purple-500 transition-colors duration-200">
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer block"
                  >
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-gray-500" />
                      <div className="text-gray-300 font-medium">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-sm text-gray-500 font-light">
                        PDF, DOC, DOCX (Max 5MB)
                      </div>
                    </div>
                  </label>
                  {uploadedFile && (
                    <Alert className="mt-4 bg-purple-500/10 border-purple-500/20 text-purple-200">
                      <AlertDescription>
                        Uploaded: {uploadedFile.name}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customize Button */}
            <button
              onClick={handleCustomize}
              disabled={isLoading || !uploadedFile || !jobDescription}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 
                        text-white rounded-lg font-medium 
                        hover:from-purple-700 hover:to-pink-700
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        flex items-center justify-center gap-2
                        shadow-lg shadow-purple-500/20
                        transition-all duration-200 ease-in-out
                        hover:shadow-xl hover:shadow-purple-500/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Customizing...
                </>
              ) : (
                `Customize Resume with ${aiModels.find(m => m.id === selectedModel)?.name}`
              )}
            </button>

            {/* Download Section */}
            {customizedResume && (
              <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-100">
                    <Download className="h-5 w-5 text-purple-400" />
                    Download Customized Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={() => {
                      // Handle download here
                      const blob = new Blob([customizedResume], { type: 'application/pdf' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'customized-resume.pdf';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600
                              text-white rounded-lg font-medium 
                              hover:from-emerald-700 hover:to-teal-700
                              flex items-center justify-center gap-2
                              shadow-lg shadow-emerald-500/20
                              transition-all duration-200 ease-in-out
                              hover:shadow-xl hover:shadow-emerald-500/30"
                  >
                    <Download className="h-5 w-5" />
                    Download Resume
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ZenCVLayout;