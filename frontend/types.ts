export type Language = 'en' | 'fr' | 'ar';

export interface Voice {
  id: string;
  name: string;
  previewUrl?: string; // ✅ تمت إضافتها لتسمح بعرض وسماع المعاينة الصوتية
}

export type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};
