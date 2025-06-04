
export interface LovableError {
  id: string;
  message: string;
  code: string;
  stackTrace?: string;
  context: {
    component: string;
    file: string;
    line?: number;
    column?: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'typescript' | 'runtime' | 'build' | 'validation' | 'network';
  suggestedFixes: SuggestedFix[];
  timestamp: Date;
}

export interface SuggestedFix {
  description: string;
  action: 'replace' | 'add' | 'remove' | 'modify';
  target: string;
  code?: string;
  automated?: boolean;
  priority: number;
}

export interface ErrorPattern {
  pattern: RegExp;
  category: LovableError['category'];
  severity: LovableError['severity'];
  generateFixes: (error: string, context?: any) => SuggestedFix[];
}

export interface ErrorContext {
  userAgent?: string;
  route?: string;
  timestamp: Date;
  additionalData?: Record<string, any>;
}
