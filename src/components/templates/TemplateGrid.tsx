import TemplateCard from './TemplateCard';
import TemplateSidebar from './TemplateSidebar';
import { allTemplates } from '@/data/templates';

const TemplateGrid = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <TemplateSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-16">
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