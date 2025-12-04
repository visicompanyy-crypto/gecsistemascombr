import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAssistantMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export function AIAssistantMessage({ role, content, isLoading }: AIAssistantMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn(
      'flex gap-3 p-3 rounded-lg',
      isUser ? 'bg-primary/10 ml-8' : 'bg-muted mr-8'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-green-600 text-white'
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {isUser ? 'Você' : 'Assistente Saldar'}
        </p>
        <div className="text-sm text-foreground whitespace-pre-wrap break-words">
          {content}
          {isLoading && !content && (
            <span className="inline-flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
