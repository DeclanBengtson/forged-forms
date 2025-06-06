import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                ForgedForms
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              We&apos;re on a mission to simplify form handling for developers everywhere, making it effortless to collect and manage user submissions without the complexity of backend infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  ForgedForms was born from a simple frustration: why should every developer need to build custom backend infrastructure just to handle form submissions? We found ourselves repeatedly building the same form handling logic across projects, dealing with spam protection, email notifications, and data management.
                </p>
                <p>
                  In 2025, we decided to solve this once and for all. We built ForgedForms to be the form handling service we wished existed—simple, reliable, and powerful enough for any project, from personal websites to enterprise applications.
                </p>
                <p>
                  Today, thousands of developers trust ForgedForms to handle millions of form submissions, letting them focus on what they do best: creating amazing user experiences.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-200">
                    <Image src="/ForgedForms.png" alt="ForgedForms Logo" width={32} height={32} className="rounded-lg" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Founded in 2025
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Built by developers, for developers, with a focus on simplicity and reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 lg:py-24 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission & Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We believe in making web development more accessible and enjoyable for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Simplicity First",
                description: "Complex problems deserve simple solutions. We strip away unnecessary complexity to deliver tools that just work.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "🔒",
                title: "Security by Design",
                description: "Your data and your users' data deserve the highest level of protection. Security isn't an afterthought—it's built in.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: "⚡",
                title: "Performance Matters",
                description: "Every millisecond counts. We optimize for speed and reliability so your forms never become a bottleneck.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: "🌍",
                title: "Global Accessibility",
                description: "Great tools should be available to developers everywhere. We build for a global, diverse community.",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: "💡",
                title: "Developer Experience",
                description: "We&apos;re developers too. Every feature is designed with the developer experience in mind, from API design to documentation.",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: "🤝",
                title: "Community Driven",
                description: "The best products are built with their community. We listen, learn, and evolve based on your feedback.",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  <span className="text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 lg:p-16 text-center text-white">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Want to Get in Touch?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                We&apos;d love to hear from you! Whether you have questions, feedback, or just want to say hello.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
                <Link
                  href="/signup"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Start Building
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 