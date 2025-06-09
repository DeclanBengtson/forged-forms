import { templateCategories } from '@/data/templates';

const TemplateSidebar = () => {
  return (
    <div className="sticky top-24">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
        <nav className="space-y-6">
          <div className="pb-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Categories
            </h3>
          </div>
          
          <div className="space-y-6">
            {Object.entries(templateCategories).map(([categoryName, templates]) => (
              <div key={categoryName} className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  {categoryName}
                </h4>
                <div className="space-y-1.5 ml-5 pl-3 border-l border-gray-100 dark:border-gray-800">
                  {templates.map((template, _index) => (
                    <a 
                      key={template.id}
                      href={`#${template.id}`} 
                      className="group flex items-center text-sm py-2 px-3 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <svg className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {template.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <a 
              href="/documentation" 
              className="group flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documentation
              <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default TemplateSidebar; 