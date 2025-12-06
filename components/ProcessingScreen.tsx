import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { ProcessingStep } from '../types';

interface ProcessingScreenProps {
  onComplete: () => void;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 1, label: 'Scanning Document Structure...', status: 'waiting' },
    { id: 2, label: 'Extracting Content Layers...', status: 'waiting' },
    { id: 3, label: 'Optimizing for Vector Space...', status: 'waiting' },
    { id: 4, label: 'Initializing Simulax Agent...', status: 'waiting' },
  ]);

  useEffect(() => {
    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total roughly

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Orchestrate step status changes
    const runSteps = async () => {
      const updateStep = (index: number, status: ProcessingStep['status']) => {
        setSteps(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
      };

      // Step 1
      updateStep(0, 'active');
      await new Promise(r => setTimeout(r, 1000));
      updateStep(0, 'completed');
      
      // Step 2
      updateStep(1, 'active');
      await new Promise(r => setTimeout(r, 1500));
      updateStep(1, 'completed');

      // Step 3
      updateStep(2, 'active');
      await new Promise(r => setTimeout(r, 1200));
      updateStep(2, 'completed');

      // Step 4
      updateStep(3, 'active');
      await new Promise(r => setTimeout(r, 1000));
      updateStep(3, 'completed');
      
      // Delay before finishing
      await new Promise(r => setTimeout(r, 500));
      onComplete();
    };

    runSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2">Analyzing SOP</h2>
        <p className="text-slate-400 text-center mb-10">Our AI is reading your document...</p>

        {/* Progress Bar */}
        <div className="flex justify-between text-xs font-mono text-primary mb-2 uppercase tracking-widest">
          <span>System Processing</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-12">
          <div 
            className="h-full bg-gradient-to-r from-teal-600 to-primary transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Checklist Box */}
        <div className="bg-surface/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : step.status === 'active' ? (
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600" />
                  )}
                </div>
                <span className={`text-lg transition-colors duration-300 ${
                  step.status === 'completed' || step.status === 'active' 
                    ? 'text-slate-200' 
                    : 'text-slate-600'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;