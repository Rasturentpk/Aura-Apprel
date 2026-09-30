import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { X, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { storeSettings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !storeSettings?.announcementBar?.enabled) {
    return null;
  }

  return (
    <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 border-b border-neutral-800 tracking-wider">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-medium truncate flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate">{storeSettings.announcementBar.text}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
