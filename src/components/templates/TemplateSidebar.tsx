import { templateCategories } from '@/data/templates';

const TemplateSidebar = () => {
  return (
    <div className="sticky top-24">
      <nav className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Categories
        </h3>
        
        <div className="space-y-4">
          {Object.entries(templateCategories).map(([categoryName, templates]) => (
            <div key={categoryName}>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                {categoryName}
              </h4>
              <div className="space-y-1 ml-3">
                {templates.map((template, index) => (
                  <a 
                    key={template.id}
                    href={`#${template.id}`} 
                    className={`block text-sm py-1 transition-colors ${
                      index === 0 
                        ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {template.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <a 
          href="/documentation" 
          className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-1 transition-colors border-t border-gray-200 dark:border-gray-700 pt-3 mt-4"
        >
          Documentation
        </a>
      </nav>
    </div>
  );
};

export default TemplateSidebar; 