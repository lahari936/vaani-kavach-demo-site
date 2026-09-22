"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Upload, StopCircle, Loader2, AlertCircle, FileKey, Terminal } from "lucide-react";
import { analyzeAudio, InferenceResult } from "@/services/modelApiClient";

export default function TryModelPage() {
  const [activeTab, setActiveTab] = useState<"model" | "api" | "receipt">("model");
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    setResult(null);
  };

  const handleUploadClick = () => {
    document.getElementById("audio-upload")?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);
    setResult(null);
    
    const audioData = file || new Blob();
    
    try {
      const res = await analyzeAudio(audioData);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="page-shell container mx-auto px-5 max-w-5xl min-h-[calc(100vh-4rem)] space-y-12">
      <div className="text-center space-y-4">
        <h1 className="page-heading text-4xl sm:text-5xl font-semibold text-foreground">Technical Validation Lab</h1>
        <p className="text-lg text-muted-foreground font-normal">
          Evaluate voice-analysis components and review secure API exchanges.
        </p>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-4 mx-auto max-w-2xl">
        <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-medium text-amber-800 text-sm">Secure API integration is under implementation</h3>
          <p className="text-amber-800 text-xs font-normal leading-relaxed">
            The real Vaani Kavach model is pending backend connection. This workbench will not fake successful cryptographic validation or generate simulated JSON responses.
          </p>
        </div>
      </div>

      <div className="workbench-tabs flex border-b border-border mb-8 max-w-3xl mx-auto">
        <button 
          onClick={() => setActiveTab("model")} 
          aria-pressed={activeTab === "model"}
          data-active={activeTab === "model"}
          className={`flex-1 pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "model" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          A. Real Voice Model
        </button>
        <button 
          onClick={() => setActiveTab("api")} 
          aria-pressed={activeTab === "api"}
          data-active={activeTab === "api"}
          className={`flex-1 pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "api" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          B. API Exchange
        </button>
        <button 
          onClick={() => setActiveTab("receipt")} 
          aria-pressed={activeTab === "receipt"}
          data-active={activeTab === "receipt"}
          className={`flex-1 pb-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "receipt" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground/80"}`}
        >
          C. Receipt Security
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* TAB A: REAL VOICE MODEL */}
          {activeTab === "model" && (
            <motion.div key="model" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-medium tracking-tight">Audio Input</h2>
                  <p className="text-sm text-muted-foreground font-normal">Record or upload an audio clip for real inference.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-xl bg-card">
                    {isRecording ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                          <Mic className="w-5 h-5 text-red-700" />
                        </div>
                        <span className="text-red-700 text-sm font-medium">Recording...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Mic className="w-8 h-8 opacity-50" />
                        <span className="text-sm font-normal">Use your microphone to record</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant={isRecording ? "destructive" : "outline"} 
                      className={`gap-2 ${!isRecording && 'border-border hover:bg-card bg-transparent'}`}
                      onClick={toggleRecording}
                    >
                      {isRecording ? (
                        <><StopCircle className="w-4 h-4" /> Stop</>
                      ) : (
                        <><Mic className="w-4 h-4" /> Record</>
                      )}
                    </Button>
                    <Button variant="outline" className="gap-2 border-border hover:bg-card bg-transparent" onClick={handleUploadClick}>
                      <Upload className="w-4 h-4" /> 
                      {file ? "Change File" : "Upload"}
                    </Button>
                    <input 
                      type="file" 
                      id="audio-upload" 
                      className="hidden" 
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {(file || isRecording) && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Button className="w-full mt-2" disabled={isRecording || isProcessing} onClick={handleAnalyze}>
                          {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : "Send to Inference Engine"}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-medium tracking-tight">Backend Output</h2>
                </div>
                <div aria-live="polite" className="workbench-output h-[288px] border border-border rounded-xl flex flex-col p-6 overflow-hidden relative">
                  {result ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                        <AlertCircle className="w-8 h-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-normal">{result.error}</p>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">API Disconnected</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                      <Terminal className="w-8 h-8 mb-3 opacity-50" />
                      <p className="text-sm font-normal">Awaiting submission</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB B: API EXCHANGE */}
          {activeTab === "api" && (
            <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-card border border-dashed border-border rounded-xl">
                <Terminal className="w-12 h-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">API Logs Unavailable</h3>
                <p className="text-muted-foreground font-normal max-w-md">
                  Once the backend is connected, this panel will display the live JSON payloads sent between the banking interface and the Action Protection API.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB C: RECEIPT SECURITY */}
          {activeTab === "receipt" && (
            <motion.div key="receipt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-card border border-dashed border-border rounded-xl">
                <FileKey className="w-12 h-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">Cryptographic Playground Unavailable</h3>
                <p className="text-muted-foreground font-normal max-w-md">
                  When the signing mechanism is deployed, you will be able to alter transaction amounts or payees here and watch the HMAC-SHA256 verification fail in real-time.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
