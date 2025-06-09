import TemplateCard from './TemplateCard';
import TemplateSidebar from './TemplateSidebar';
import { allTemplates } from '@/data/templates';

const TemplateGrid = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <TemplateSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-2 min-w-0">
            <div className="space-y-12 lg:space-y-16">
              {allTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplateGrid; 