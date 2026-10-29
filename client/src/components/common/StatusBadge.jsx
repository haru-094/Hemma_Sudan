import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Clock, 
  Search, 
  MessageSquare, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

const STATUS_CONFIGS = {
  submitted: {
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Clock,
  },
  under_review: {
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Search,
  },
  feedback_given: {
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: MessageSquare,
  },
  revision_requested: {
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: RotateCcw,
  },
  escalated: {
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: AlertCircle,
  },
  complete: {
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
};

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.submitted;
  const Icon = config.icon;

  const labelMap = {
    submitted: t.submissionStatus.submitted,
    under_review: t.submissionStatus.underReview,
    feedback_given: t.submissionStatus.feedbackGiven,
    revision_requested: t.submissionStatus.revisionRequested,
    escalated: t.submissionStatus.escalated,
    complete: t.submissionStatus.complete,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{labelMap[status] || status}</span>
    </span>
  );
}

