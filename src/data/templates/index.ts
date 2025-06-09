import { Template, TemplateCategories } from '@/types/Template';
import { businessTemplates } from './business';
import { marketingTemplates } from './marketing';
import { researchTemplates } from './research';
import { eventsTemplates } from './events';

export const allTemplates: Template[] = [
  ...businessTemplates,
  ...marketingTemplates,
  ...researchTemplates,
  ...eventsTemplates,
];

export const templateCategories: TemplateCategories = {
  'Business': businessTemplates,
  'Marketing': marketingTemplates,
  'Research': researchTemplates,
  'Events': eventsTemplates,
};

export const getTemplateById = (id: string): Template | undefined => {
  return allTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return templateCategories[category] || [];
};

export { businessTemplates, marketingTemplates, researchTemplates, eventsTemplates }; 