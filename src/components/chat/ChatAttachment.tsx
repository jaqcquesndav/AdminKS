```tsx
import React from 'react';
import { FileText, Image, Paperclip } from 'lucide-react';

interface ChatAttachmentProps {
  file: {
    url: string;
    type: string;
    name: string;
  };
}

export function ChatAttachment({ file }: ChatAttachmentProps) {
  const isImage = file.type.startsWith('image/');

  return (
    <div className="mt-2">
      {isImage ? (
        <img
          src={file.url}
          alt={file.name}
          className="max-w-[200px] rounded-lg"
        />
      ) : (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {file.name}
          </span>
        </a>
      )}
    </div>
  );
}
```