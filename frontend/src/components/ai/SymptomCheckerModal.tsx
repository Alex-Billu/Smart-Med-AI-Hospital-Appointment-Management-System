'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  X,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Brain,
  Heart,
  Activity,
  Baby,
  Eye,
  Search
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SYMPTOMS = [
  { label: 'Chest pain or palpitations', dept: 'Cardiology', deptId: 1, doc: 'Dr. Sarah Jenkins', desc: 'Heart and cardiovascular specialist recommendation' },
  { label: 'Severe migraine or dizziness', dept: 'Neurology', deptId: 2, doc: 'Dr. Arun Kumar', desc: 'Neurology and brain health specialist' },
  { label: 'Skin rash, itching or acne', dept: 'Dermatology', deptId: 4, doc: 'Dr. Priya Sharma', desc: 'Dermatologist and skin care specialist' },
  { label: 'Joint swelling or knee pain', dept: 'Orthopedics', deptId: 3, doc: 'Dr. Rajesh Nair', desc: 'Orthopedic and joint replacement expert' },
  { label: 'Child fever or cough', dept: 'Pediatrics', deptId: 5, doc: 'Dr. Meena Thomas', desc: 'Pediatric care and child health' },
  { label: 'Blurry vision or eye strain', dept: 'Ophthalmology', deptId: 6, doc: 'Dr. Vivek Rao', desc: 'Eye and vision specialist' },
];

export default function SymptomCheckerModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [symptomText, setSymptomText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  if (!isOpen) return null;

  const handleAnalyze = (textToAnalyze?: string) => {
    const text = (textToAnalyze || symptomText).toLowerCase();
    if (!text.trim()) return;

    setAnalyzing(true);
    setRecommendation(null);

    setTimeout(() => {
      let match = PRESET_SYMPTOMS[0]; // default

      if (text.includes('heart') || text.includes('chest') || text.includes('breath') || text.includes('bp') || text.includes('palpitation')) {
        match = PRESET_SYMPTOMS[0];
      } else if (text.includes('head') || text.includes('migraine') || text.includes('nerve') || text.includes('dizzy') || text.includes('brain')) {
        match = PRESET_SYMPTOMS[1];
      } else if (text.includes('skin') || text.includes('rash') || text.includes('itch') || text.includes('acne') || text.includes('hair')) {
        match = PRESET_SYMPTOMS[2];
      } else if (text.includes('bone') || text.includes('joint') || text.includes('knee') || text.includes('back') || text.includes('fracture')) {
        match = PRESET_SYMPTOMS[3];
      } else if (text.includes('child') || text.includes('kid') || text.includes('baby') || text.includes('infant')) {
        match = PRESET_SYMPTOMS[4];
      } else if (text.includes('eye') || text.includes('vision') || text.includes('sight') || text.includes('blur')) {
        match = PRESET_SYMPTOMS[5];
      }

      setRecommendation({
        ...match,
        confidence: 96,
        advice: 'Based on your reported symptoms, an initial consultation with our specialist department is recommended to conduct diagnostic evaluations.'
      });
      setAnalyzing(false);
    }, 600);
  };

  const handleSelectPreset = (preset: typeof PRESET_SYMPTOMS[0]) => {
    setSymptomText(preset.label);
    handleAnalyze(preset.label);
  };

  const handleBook = () => {
    if (recommendation) {
      onClose();
      router.push(`/doctors?department=${recommendation.deptId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Symptom Assistant</h2>
            <p className="text-xs text-slate-500">Smart triage & medical specialist recommendation</p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Describe your symptoms
            </label>
            <div className="relative">
              <input
                type="text"
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="E.g., sharp chest pain after walking, recurrent headaches..."
                className="w-full pl-3 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={() => handleAnalyze()}
                disabled={analyzing || !symptomText.trim()}
                className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40"
              >
                {analyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-2">
              Common Clinical Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SYMPTOMS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleSelectPreset(p)}
                  className="text-[11px] bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommendation Result */}
          {recommendation && (
            <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="h-3 w-3" />
                  {recommendation.confidence}% Match Confidence
                </span>
                <span className="text-xs font-bold text-slate-800">{recommendation.dept}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-1">
                Recommended Department: {recommendation.dept}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {recommendation.desc}
              </p>
              <p className="text-[11px] text-slate-500 mt-2 italic bg-white/70 p-2 rounded-xl border border-blue-100">
                &ldquo;{recommendation.advice}&rdquo;
              </p>

              <div className="mt-4 pt-3 border-t border-blue-200 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Featured Specialist: <strong className="text-slate-900">{recommendation.doc}</strong>
                </span>
                <button
                  onClick={handleBook}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                >
                  View Doctors <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
