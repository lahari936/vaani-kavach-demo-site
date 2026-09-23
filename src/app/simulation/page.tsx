"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, PhoneCall, ShieldCheck, ShieldAlert, Fingerprint, Lock, Activity, Mic, MicOff, Grid3x3, Volume2, VolumeX, ArrowRight, Play, RefreshCw, FileKey } from "lucide-react";
import { scenarioConfig } from "@/config/scenario";
import Link from "next/link";
import { PhoneFrame } from "@/components/phone-frame";
import { Badge } from "@/components/ui/badge";

const STAGES = ["INCOMING", "ACTIVE CALL", "VERIFICATION", "PAYMENT", "PROTECTION"];

export default function SimulationPage() {
  const [stageIndex, setStageIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  // Verification Sequence State
  const [verificationStep, setVerificationStep] = useState(0);
  
  // Payment Sequence State
  const [paymentStep, setPaymentStep] = useState(0);

  // Voice Announcements State
  const [announcementsMuted, setAnnouncementsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const currentStage = STAGES[stageIndex];
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  
  const nextStage = () => {
    setStageIndex(s => Math.min(s + 1, STAGES.length - 1));
    setShowAlert(false);
    setVerificationStep(0);
    setPaymentStep(0);
  };
  
  const restart = () => {
    setStageIndex(0);
    setCurrentTime(0);
    setShowAlert(false);
    setVerificationStep(0);
    setPaymentStep(0);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const skipToAlert = () => {
    setCurrentTime(25);
    setShowAlert(true);
  };

  const replayConversation = () => {
    setCurrentTime(0);
    setShowAlert(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startVerificationSequence = () => {
    setVerificationStep(1);
    setTimeout(() => setVerificationStep(2), 2000); // Generate digits & wait for response
    setTimeout(() => setVerificationStep(3), 3500); // Show response outcome
  };

  const startPaymentSequence = () => {
    setPaymentStep(1);
    setTimeout(() => setPaymentStep(2), 1500); // Step 1: Call Risk
    setTimeout(() => setPaymentStep(3), 3000); // Step 2: Risk Receipt
    setTimeout(() => setPaymentStep(4), 4500); // Step 3: Action Protection
    setTimeout(() => nextStage(), 7000);       // Move to final stage
  };

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (announcementsMuted) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    } else {
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }
    
    utterance.rate = 0.95; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [announcementsMuted]);

  // Voice Announcement 1: Joining
  useEffect(() => {
    if (currentStage === "ACTIVE CALL" && !showAlert && currentTime === 0) {
      speak("Vaani Kavach has joined your call as a security monitor.");
    }
  }, [currentStage, speak, showAlert, currentTime]);

  // Voice Announcement 2: Security Alert
  useEffect(() => {
    if (currentStage === "ACTIVE CALL" && showAlert) {
      speak(`Suspected bank fraud. Flagged ${scenarioConfig.callerRisk.verifiedFlagCount} times, verified. Risk score ${scenarioConfig.callerRisk.score} out of 100.`);
    }
  }, [showAlert, currentStage, speak]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Simulate audio playback timing in active call
  useEffect(() => {
    if (currentStage === "ACTIVE CALL" && !showAlert) {
      const interval = setInterval(() => {
        setCurrentTime(t => {
          const nextTime = t + 1;
          if (nextTime === 25) {
            setShowAlert(true);
          }
          return Math.min(nextTime, 60);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStage, showAlert]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [currentTime]);

  const toggleMuteAnnouncements = () => {
    setAnnouncementsMuted(!announcementsMuted);
    if (!announcementsMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const renderProgress = () => (
    <div className="simulation-progress w-full max-w-2xl mx-auto mb-10">
      <div className="flex justify-between items-center relative isolate px-0 sm:px-2">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-secondary -z-10" />
        <motion.div 
          className="absolute top-1/2 left-0 h-[1px] w-full bg-primary/50 -z-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: stageIndex / (STAGES.length - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {STAGES.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2 bg-background px-1 sm:px-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${stageIndex >= i ? "bg-foreground" : "bg-primary/15"}`} />
            <span className={`text-[8px] sm:text-[9px] tracking-wide sm:tracking-widest uppercase font-medium ${stageIndex >= i ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="simulation-page flex flex-col min-h-screen font-sans text-foreground pb-12 selection:bg-secondary relative">
      
      {/* Voice Announcements Toggle */}
      <div className="absolute top-6 right-4 sm:right-8 z-10">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-border bg-transparent hover:bg-card text-muted-foreground gap-2 h-8 text-xs"
          aria-label={announcementsMuted ? "Enable voice announcements" : "Mute voice announcements"}
          aria-pressed={announcementsMuted}
          onClick={toggleMuteAnnouncements}
        >
          {announcementsMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{announcementsMuted ? "Voice Muted" : "Voice On"}</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 max-w-5xl flex-1 flex flex-col">
        {renderProgress()}

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait">

            {/* STAGE 1: INCOMING CALL */}
            {currentStage === "INCOMING" && (
              <motion.div key="incoming" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2 mb-4">
                  <Badge variant="outline" className="border-red-500/20 text-red-700 bg-red-500/5 uppercase tracking-widest text-[10px]">Citizen Perspective</Badge>
                  <p className="text-muted-foreground text-sm font-normal">A caller claiming to represent your bank&apos;s fraud desk is contacting you.</p>
                  <Link
                    href="/architecture"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-primary underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    title="Continue to System Overview"
                  >
                    Skip demonstration <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>

                <PhoneFrame className="phone-incoming">
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6 pt-12">
                    <div className="caller-avatar w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center">
                      <Phone className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                      <h2 className="text-2xl font-medium tracking-tight text-foreground/90">Bank fraud Desk</h2>
                      <p className="text-sm text-muted-foreground">Incoming Call...</p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-2">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="pb-16 px-12 flex justify-between items-center w-full">
                    <button aria-label="Decline call" className="w-16 h-16 rounded-full bg-destructive text-white flex items-center justify-center border border-red-300/30 hover:bg-red-700 transition-colors">
                      <PhoneOff className="w-6 h-6 fill-current" />
                    </button>
                    <button aria-label="Answer call" onClick={nextStage} className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg group">
                      <PhoneCall className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                </PhoneFrame>
              </motion.div>
            )}

            {/* STAGE 2: ACTIVE CALL */}
            {currentStage === "ACTIVE CALL" && (
              <motion.div key="active-call" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto space-y-4">
                
                <div className="flex justify-between items-center px-2">
                  <span className="text-xs text-muted-foreground font-normal">Citizen Safety Demonstration</span>
                  {!showAlert && (
                     <Button variant="ghost" size="sm" onClick={skipToAlert} className="h-8 text-xs text-muted-foreground hover:text-foreground">
                       Skip to Security Alert <Play className="w-3 h-3 ml-1.5" />
                     </Button>
                  )}
                </div>

                <PhoneFrame className="phone-light">
                  
                  {/* Top Bar */}
                  <div inert={showAlert} className="pt-8 pb-4 flex flex-col items-center border-b border-border bg-card">
                    <div className="caller-avatar w-16 h-16 rounded-full border flex items-center justify-center mb-3">
                      <Phone className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground/90">Bank fraud Desk <span className="text-xs text-amber-800">(Unverified)</span></h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Vaani Kavach Status Bar */}
                  <div inert={showAlert} className="px-4 py-3 bg-card border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`w-4 h-4 ${currentTime > 10 ? 'text-amber-800' : 'text-emerald-700'}`} />
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSpeaking && (
                        <div className="flex items-center gap-1 mr-2">
                          <motion.div className="w-1 h-1 rounded-full bg-blue-500" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                          <motion.div className="w-1 h-1 rounded-full bg-blue-500" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                          <motion.div className="w-1 h-1 rounded-full bg-blue-500" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                        </div>
                      )}
                      <span className={`text-xs font-mono ${currentTime > 10 ? 'text-amber-800' : 'text-emerald-700'}`}>
                        {currentTime > 10 ? 'Analyzing Risk...' : 'Secure'}
                      </span>
                    </div>
                  </div>

                  {/* Scrolling Transcript */}
                  <div inert={showAlert} tabIndex={0} role="region" aria-label="Simulated call transcript" className="call-transcript flex-1 p-4 overflow-y-auto space-y-4 bg-background">
                    <div className="text-center mb-4">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest bg-card px-2 py-1 rounded">Simulated Transcript</span>
                    </div>
                    {scenarioConfig.captions.map((cap, i) => (
                      currentTime >= cap.start && (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-col ${cap.speaker === 'bank' ? 'items-start' : 'items-end'}`}
                        >
                          <span className="text-[10px] text-muted-foreground mb-1 ml-1">{cap.speaker === 'bank' ? 'Caller' : 'You'}</span>
                          <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                            cap.speaker === 'bank' 
                              ? 'bg-secondary text-foreground/90 rounded-tl-sm'
                              : 'bg-blue-600 text-white rounded-tr-sm'
                          }`}>
                            {cap.text}
                          </div>
                        </motion.div>
                      )
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>

                  {/* Call Controls */}
                  <div inert={showAlert} className="call-controls p-6 bg-card border-t border-border flex justify-around items-center">
                    <button aria-label={isMuted ? "Unmute microphone" : "Mute microphone"} aria-pressed={isMuted} onClick={() => setIsMuted(!isMuted)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-primary/15' : 'bg-secondary hover:bg-secondary'}`}>
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button aria-label="Keypad" className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary flex items-center justify-center transition-colors">
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button aria-label="Speaker" className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary flex items-center justify-center transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button aria-label="End call" className="w-12 h-12 rounded-full bg-red-500/20 text-red-700 flex items-center justify-center border border-red-500/20 hover:bg-red-500/30">
                      <PhoneOff className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  {/* SECURITY ALERT OVERLAY */}
                  <AnimatePresence>
                    {showAlert && (
                      <motion.div 
                        initial={{ opacity: 0, y: "100%" }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: "100%" }}
                        className="security-alert absolute inset-0 flex flex-col z-20 overflow-y-auto"
                      >
                        <div className="flex flex-col items-center text-center space-y-4 mb-8">
                          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <ShieldAlert className="w-8 h-8 text-amber-800" />
                          </div>
                          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Suspected bank fraud</h2>
                        </div>

                        <dl className="w-full bg-card border border-border rounded-xl p-4 space-y-4 mb-8">
                          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
                            <dt className="text-sm text-muted-foreground">Flagged (verified)</dt>
                            <dd className="text-sm font-semibold text-foreground tabular-nums">{scenarioConfig.callerRisk.verifiedFlagCount} times</dd>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <dt className="text-sm text-muted-foreground">Risk score</dt>
                            <dd className="text-sm font-semibold text-amber-800 tabular-nums">{scenarioConfig.callerRisk.score}/100</dd>
                          </div>
                        </dl>

                        <div className="mt-auto space-y-4">
                          <Button onClick={nextStage} className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black rounded-xl text-base font-medium shadow-sm">
                            Verify Caller
                          </Button>
                          <Button variant="ghost" onClick={replayConversation} className="w-full h-12 text-muted-foreground hover:text-foreground">
                            <RefreshCw className="w-4 h-4 mr-2" /> Replay Conversation
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </PhoneFrame>
              </motion.div>
            )}

            {/* STAGE 3: VERIFICATION */}
            {currentStage === "VERIFICATION" && (
              <motion.div key="verification" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md mx-auto space-y-8">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl font-semibold tracking-tight">Caller Verification</h2>
                  <p className="text-muted-foreground font-normal text-sm">The caller must repeat a random code to prove they are responding live.</p>
                </div>

                <div className="surface-card p-6 rounded-2xl space-y-8 relative overflow-hidden">
                  
                  {/* Sequence 1: Request Button */}
                  {verificationStep === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                      <Fingerprint className="w-12 h-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Send a random Voice CAPTCHA that was not part of the caller&apos;s prepared script.
                      </p>
                      <Button onClick={startVerificationSequence} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                        Request Voice Challenge
                      </Button>
                    </div>
                  )}

                  {/* Sequence 2: Digits generated */}
                  {verificationStep >= 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-border pb-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <Fingerprint className="w-5 h-5 text-foreground/70" />
                        </div>
                        <span className="font-medium text-sm">Challenge Dispatched</span>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Please read aloud:</p>
                        <div className="text-4xl font-mono tracking-[0.4em] text-foreground/90">7294</div>
                      </div>
                    </motion.div>
                  )}

                  {/* Sequence 3: Caller Response */}
                  {verificationStep >= 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Simulated Caller Response</p>
                      <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border w-full">
                        <Activity className="w-4 h-4 text-amber-800" />
                        <span className="text-sm text-amber-800 font-normal italic">&quot;Seven... two... I cannot hear the rest.&quot;</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Sequence 4: Outcome */}
                  {verificationStep >= 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 space-y-4">
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-red-700">Liveness Failed</p>
                          <p className="text-xs text-red-700 leading-relaxed">
                            The caller did not repeat the complete random code 7294.
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center">Combined with the transfer request, synthetic voice evidence and unverified number, this raises the session to high risk.</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={nextStage} 
                    disabled={verificationStep < 3} 
                    className="w-full h-12"
                  >
                    Attempt Transfer <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: PAYMENT */}
            {currentStage === "PAYMENT" && (
              <motion.div key="payment" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full max-w-sm mx-auto space-y-6">
                <div className="text-center space-y-2 mb-2">
                  <Badge variant="outline" className="border-border text-muted-foreground bg-secondary uppercase tracking-widest text-[10px]">Secure Banking Service</Badge>
                </div>

                <PhoneFrame className="phone-light">
                  
                  {paymentStep === 0 ? (
                    <>
                      <div className="h-16 border-b border-border flex items-center justify-center px-4 bg-card">
                        <span className="font-semibold text-foreground/90 tracking-tight text-sm">Secure Banking Transfer</span>
                      </div>

                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border border-border mb-2">
                            <Lock className="w-6 h-6 text-muted-foreground" />
                          </div>
                          
                          <div className="text-center space-y-2 w-full">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Amount to Transfer</p>
                            <p className="text-5xl font-normal tracking-tight text-foreground">₹25,000</p>
                          </div>

                          <div className="w-full p-4 rounded-xl bg-card border border-border space-y-4">
                            <div className="flex justify-between items-center border-b border-border pb-3">
                              <span className="text-xs text-muted-foreground">To</span>
                              <span className="text-sm font-medium">Demo Recipient A</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">From</span>
                              <span className="text-sm font-medium">Checking Account</span>
                            </div>
                          </div>
                        </div>

                        <Button onClick={startPaymentSequence} className="w-full h-14 rounded-xl text-base font-medium mt-4 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                          Confirm Transfer
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 text-center bg-background">
                      <h3 className="text-xl font-medium mb-4">Processing Transfer</h3>
                      
                      <div className="w-full space-y-6 text-left">
                        {paymentStep >= 1 && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                            <Activity className="w-5 h-5 text-amber-800 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Call Risk Check</p>
                              <p className="text-xs text-muted-foreground">High-risk call: transfer request, uncertain voice and failed caller verification.</p>
                            </div>
                          </motion.div>
                        )}
                        
                        {paymentStep >= 2 && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                            <FileKey className="w-5 h-5 text-blue-700 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Risk Receipt</p>
                              <p className="text-xs text-muted-foreground">Assessment linked to ₹25,000 for Demo Recipient A.</p>
                            </div>
                          </motion.div>
                        )}

                        {paymentStep >= 3 && (
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Action Protection API</p>
                              <p className="text-xs text-muted-foreground">The simulated banking app checks the receipt and applies its configured security policy.</p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}

                </PhoneFrame>
              </motion.div>
            )}

            {/* STAGE 5: PROTECTION */}
            {currentStage === "PROTECTION" && (
              <motion.div key="protection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-3xl mx-auto space-y-12 py-8">
                <div className="text-center space-y-6">
                  <Badge variant="outline" className="border-border text-muted-foreground bg-secondary uppercase tracking-widest text-[10px] mb-4">Citizen Protection Demonstration</Badge>
                  
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
                    <Lock className="w-6 h-6 text-red-700" />
                  </div>
                  <h2 className="text-4xl font-semibold tracking-tight text-foreground">Transaction Safeguarded</h2>
                  <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed max-w-xl mx-auto">
                    The ₹25,000 transfer to Demo Recipient A is held for independent bank verification.
                  </p>
                </div>

                <div className="p-8 border border-border rounded-2xl bg-card flex flex-col md:flex-row items-center justify-between gap-8 max-w-2xl mx-auto">
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <p className="text-sm font-medium text-foreground">Protection Chain Successful</p>
                    <p className="text-xs text-muted-foreground font-normal flex items-center justify-center md:justify-start gap-2">
                      CALL <ArrowRight className="w-3 h-3" /> RISK RECEIPT <ArrowRight className="w-3 h-3" /> BANKING ACTION
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-red-500/30 text-red-700 bg-red-500/5 px-3 py-1">API: BLOCK</Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-12 border-t border-border">
                  <Link href="/architecture">
                    <Button variant="outline" className="w-full sm:w-auto border-border hover:bg-card h-12">
                      Understand How It Works
                    </Button>
                  </Link>
                  <Link href="/try-model">
                    <Button className="w-full sm:w-auto h-12">
                      Test the Technology
                    </Button>
                  </Link>
                </div>
                
                <div className="text-center pt-6">
                  <button onClick={restart} className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-medium">
                    Restart Experience
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
