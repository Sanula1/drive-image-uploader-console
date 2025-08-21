
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const TranslationWidget = () => {
  const { currentLanguage, isTranslating, translatePage, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (languageCode: string) => {
    translatePage(languageCode);
    setIsOpen(false);
  };

  const getCurrentLanguageName = () => {
    const language = availableLanguages.find(lang => lang.code === currentLanguage);
    return language?.name || 'English';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled={isTranslating}
          aria-label="Translate page"
        >
          {isTranslating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Languages className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        <div className="p-2 text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
          Current: {getCurrentLanguageName()}
        </div>
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
              currentLanguage === language.code ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full mr-2" style={{
                backgroundColor: currentLanguage === language.code ? '#10b981' : 'transparent'
              }} />
              {language.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TranslationWidget;
