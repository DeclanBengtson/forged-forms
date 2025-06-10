export interface Template {
  id: string;
  title: string;
  description: string;
  code: string;
  category: string;
  implementations?: {
    react?: string;
  };
}

export interface TemplateCategory {
  name: string;
  templates: Template[];
}

export type TemplateCategories = {
  [key: string]: Template[];
}; 