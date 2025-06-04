
import { LovableError, SuggestedFix, ErrorPattern } from '@/types/error';

export const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createLovableError = (params: Partial<LovableError>): LovableError => {
  // Validate required properties
  if (!params.message) {
    throw new Error('Error message is required');
  }
  if (!params.code) {
    throw new Error('Error code is required');
  }
  if (!params.context) {
    throw new Error('Error context is required');
  }

  return {
    id: generateErrorId(),
    message: params.message,
    code: params.code,
    stackTrace: params.stackTrace,
    context: params.context,
    severity: params.severity || 'medium',
    category: params.category || 'runtime',
    suggestedFixes: params.suggestedFixes || [],
    timestamp: new Date(),
  };
};

export const typeScriptErrorPatterns: ErrorPattern[] = [
  {
    pattern: /Type '.*' is not assignable to type '.*'/,
    category: 'typescript',
    severity: 'high',
    generateFixes: (error: string) => [
      {
        description: 'Verificar e corrigir os tipos das variáveis',
        action: 'modify',
        target: 'type-declaration',
        priority: 1,
        automated: false
      },
      {
        description: 'Adicionar type assertion se necessário',
        action: 'add',
        target: 'type-assertion',
        code: 'variable as TargetType',
        priority: 2,
        automated: true
      }
    ]
  },
  {
    pattern: /Property '.*' does not exist on type '.*'/,
    category: 'typescript',
    severity: 'high',
    generateFixes: (error: string) => [
      {
        description: 'Verificar se a propriedade existe no tipo',
        action: 'modify',
        target: 'interface-definition',
        priority: 1,
        automated: false
      },
      {
        description: 'Adicionar propriedade opcional ao tipo',
        action: 'add',
        target: 'interface-property',
        code: 'propertyName?: type;',
        priority: 2,
        automated: true
      }
    ]
  },
  {
    pattern: /Expected \d+ arguments, but got \d+/,
    category: 'typescript',
    severity: 'medium',
    generateFixes: (error: string) => [
      {
        description: 'Verificar assinatura da função e ajustar argumentos',
        action: 'modify',
        target: 'function-call',
        priority: 1,
        automated: false
      }
    ]
  }
];

export const analyzeTypeScriptError = (errorMessage: string, context: any): LovableError => {
  for (const pattern of typeScriptErrorPatterns) {
    if (pattern.pattern.test(errorMessage)) {
      return createLovableError({
        message: errorMessage,
        code: 'TS_ERROR',
        context: {
          component: context.component || 'Unknown',
          file: context.file || 'Unknown',
          line: context.line,
          column: context.column
        },
        category: pattern.category,
        severity: pattern.severity,
        suggestedFixes: pattern.generateFixes(errorMessage, context)
      });
    }
  }

  // Default TypeScript error
  return createLovableError({
    message: errorMessage,
    code: 'TS_UNKNOWN',
    context: {
      component: context.component || 'Unknown',
      file: context.file || 'Unknown'
    },
    category: 'typescript',
    severity: 'medium',
    suggestedFixes: [
      {
        description: 'Verificar documentação do TypeScript para este erro',
        action: 'modify',
        target: 'general',
        priority: 1,
        automated: false
      }
    ]
  });
};

export const validateErrorObject = (error: any): boolean => {
  return (
    error &&
    typeof error.message === 'string' &&
    error.message.trim().length > 0 &&
    typeof error.code === 'string' &&
    error.code.trim().length > 0 &&
    error.context &&
    typeof error.context.component === 'string' &&
    typeof error.context.file === 'string'
  );
};
