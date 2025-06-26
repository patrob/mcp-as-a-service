import { Lock, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
  feature: 'auth' | 'dashboard';
  className?: string;
}

export function ComingSoon({ feature, className = '' }: ComingSoonProps) {
  const content = {
    auth: {
      title: 'Authentication Coming Soon',
      description: 'User authentication and account management features are currently being prepared for launch.',
      icon: Lock,
    },
    dashboard: {
      title: 'Dashboard Coming Soon',
      description: 'The server management dashboard is currently being prepared for launch.',
      icon: Zap,
    },
  };

  const { title, description, icon: Icon } = content[feature];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 ${className}`}>
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="h-10 w-10 text-blue-600" />
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-xl text-slate-600 mb-8 leading-relaxed">
          {description}
        </p>

        {/* CTA */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-2">Stay Updated</h3>
            <p className="text-sm text-slate-600 mb-4">
              We'll notify you as soon as this feature becomes available.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled
              />
              <button 
                className="bg-slate-200 text-slate-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                disabled
              >
                Notify Me
              </button>
            </div>
          </div>

          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

interface FeatureNotAvailableProps {
  feature: string;
  children?: React.ReactNode;
}

/**
 * Inline component for features that are disabled
 * Used for smaller UI elements that should be hidden/replaced
 */
export function FeatureNotAvailable({ feature, children }: FeatureNotAvailableProps) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <div className="bg-slate-100 rounded-lg p-3 text-center">
      <Lock className="h-5 w-5 text-slate-400 mx-auto mb-2" />
      <p className="text-sm text-slate-500">
        {feature} is coming soon
      </p>
    </div>
  );
}