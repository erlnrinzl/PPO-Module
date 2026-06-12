import { Check, Clock } from 'lucide-react';

export interface Step {
  id: number;
  label: string;
  actor: string;
  desc?: string;
}

interface WorkflowStepperProps {
  steps: Step[];
  currentStep: number; // 1-based, 0 = not started
  className?: string;
}

export function WorkflowStepper({ steps, currentStep, className = '' }: WorkflowStepperProps) {
  return (
    <div className={`flex items-start gap-0 overflow-x-auto pb-1 ${className}`}>
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        const pending = stepNum > currentStep;

        return (
          <div key={step.id} className="flex items-center shrink-0">
            {/* Step node */}
            <div className="flex flex-col items-center" style={{ minWidth: 110 }}>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? 'border-emerald-500 bg-emerald-500'
                    : active
                    ? 'border-blue-600 bg-blue-600 shadow-lg shadow-blue-200'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {done ? (
                  <Check size={16} className="text-white" />
                ) : active ? (
                  <Clock size={14} className="text-white animate-pulse" />
                ) : (
                  <span className="text-gray-400 text-xs font-bold">{stepNum}</span>
                )}
              </div>
              <div className="mt-2 text-center px-1">
                <p
                  className={`text-[10px] font-semibold leading-tight ${
                    done ? 'text-emerald-600' : active ? 'text-blue-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{step.actor}</p>
              </div>
            </div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className="h-0.5 w-8 shrink-0 mt-[-28px]"
                style={{ background: stepNum < currentStep ? '#10B981' : '#E5E7EB' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
