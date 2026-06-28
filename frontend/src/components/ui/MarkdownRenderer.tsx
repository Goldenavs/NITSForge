import ReactMarkdown from 'react-markdown';

export const markdownComponents = {
  p: ({node, ...props}: any) => <p className="leading-relaxed" {...props} />,
  strong: ({node, ...props}: any) => <strong className="font-bold text-primary" {...props} />,
  em: ({node, ...props}: any) => <em className="italic text-text-muted" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-disc pl-4 space-y-1" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal pl-4 space-y-1" {...props} />,
  li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
  code: ({node, className, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <code className="block bg-background p-3 rounded-lg font-mono text-xs overflow-x-auto border border-borderline/50 my-2" {...props} />
    ) : (
      <code className="bg-background px-1.5 py-0.5 rounded text-primary font-mono text-xs" {...props} />
    );
  }
};

export function MarkdownRenderer({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <div className="flex flex-col gap-2">
      <ReactMarkdown components={markdownComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
