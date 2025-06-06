import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
              Privacy
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Policy
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: June 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                ForgedForms (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our form handling service and website. Please read this policy carefully to understand our views and practices regarding your personal data.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information You Provide</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>• Account information (email address, name)</li>
                <li>• Form submissions and data sent through our service</li>
                <li>• Payment information (processed securely through third-party providers)</li>
                <li>• Support requests and communications</li>
                <li>• Feedback and survey responses</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Information Automatically Collected</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>• IP addresses and location data</li>
                <li>• Browser type and version</li>
                <li>• Operating system information</li>
                <li>• Pages visited and time spent on our service</li>
                <li>• Referral sources</li>
                <li>• API usage statistics and performance metrics</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cookies and Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie preferences through your browser settings.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">How We Use Your Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Service Provision</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Process and deliver form submissions</li>
                    <li>• Send email notifications as configured</li>
                    <li>• Provide access to submission data and analytics</li>
                    <li>• Maintain and improve service functionality</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Account Management</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Create and manage user accounts</li>
                    <li>• Process payments and billing</li>
                    <li>• Provide customer support</li>
                    <li>• Send important service updates</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Security and Compliance</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Detect and prevent fraud or abuse</li>
                    <li>• Monitor for security threats</li>
                    <li>• Comply with legal obligations</li>
                    <li>• Enforce our terms of service</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Information Sharing and Disclosure</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">We Do Not Sell Your Data</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We do not sell, rent, or trade your personal information to third parties for their commercial purposes.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Limited Sharing</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    We may share your information only in the following circumstances:
                  </p>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• With service providers who help operate our platform (hosting, payment processing, analytics)</li>
                    <li>• When required by law or to protect our rights</li>
                    <li>• In case of business transfer (merger, acquisition, etc.)</li>
                    <li>• With your explicit consent</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Data Security</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Security Measures</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• End-to-end encryption for all data transmission</li>
                    <li>• Secure data centers with physical access controls</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Employee access controls and training</li>
                    <li>• Automated monitoring for suspicious activity</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Retention</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We retain your personal information only as long as necessary to provide our services and comply with legal obligations. Form submission data is retained according to your plan limits, and you can delete it at any time through your dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Rights and Choices</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Access and Control</h3>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li>• Access and download your personal data</li>
                    <li>• Correct inaccurate information</li>
                    <li>• Delete your account and associated data</li>
                    <li>• Export form submission data</li>
                    <li>• Opt out of marketing communications</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">GDPR and CCPA Rights</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    If you&apos;re located in the EU or California, you have additional rights under GDPR and CCPA, including the right to portability, restriction of processing, and objection to processing. Contact us to exercise these rights.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">International Data Transfers</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our services are hosted in the United States. If you&apos;re accessing our services from outside the US, your information may be transferred to, stored, and processed in the US. We implement appropriate safeguards to protect your data during international transfers.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Children&apos;s Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Changes to This Policy</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <p className="text-blue-100 leading-relaxed mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-blue-100">
                <p>Email: privacy@forgedforms.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 