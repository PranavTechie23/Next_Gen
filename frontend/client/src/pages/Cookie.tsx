import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Cookie, Shield, Eye, Settings, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function CookiePolicy() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
    preferences: true,
  });

  const handleBack = () => {
    window.history.back();
  };

  const handleSavePreferences = () => {
    // Save cookie preferences logic here
    alert('Cookie preferences saved successfully!');
  };

  const handleAcceptAll = () => {
    setCookieSettings({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const handleRejectAll = () => {
    setCookieSettings({
      essential: true, // Can't be disabled
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl border-b border-slate-200 dark:border-white/5 transition-all duration-500">
        <div className="max-w-[1700px] mx-auto px-6 sm:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-black text-sm tracking-tight hover:shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-0">
                <img src="/NG/NextGen_light.png" alt="NextGen Logo" className="h-12 w-12 object-contain flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                <div className="hidden xs:flex flex-col">
                  <span className="font-black text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-none">NextGen</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Cookie Policy</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle className="!h-12 !w-12 bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-orange-500/30 !rounded-xl transition-all flex items-center justify-center shadow-lg hover:scale-110 text-slate-600 dark:text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Cookie className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Cookie Policy</h1>
                <p className="text-muted-foreground">Last Updated: January 23, 2026</p>
              </div>
            </div>
            <p className="text-foreground text-lg">
              This Cookie Policy explains how NextGen ("we", "us", or "our") uses cookies and similar technologies when you visit our platform.
            </p>
          </div>

          {/* Cookie Preferences Card */}
          <Card className="mb-8 border-border shadow-lg sticky top-20 z-40 bg-card/90 backdrop-blur-md">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2"></div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                <Settings className="w-5 h-5 text-orange-600" />
                Manage Cookie Preferences
              </CardTitle>
              <CardDescription>Control which cookies we can use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <label className="flex items-center justify-between p-4 border-2 border-border rounded-xl bg-muted/50 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <span className="text-sm font-medium text-foreground block">Essential Cookies</span>
                      <span className="text-xs text-muted-foreground">Required for basic site functionality</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-semibold">Always Active</span>
                    <input
                      type="checkbox"
                      checked={cookieSettings.essential}
                      disabled
                      className="w-5 h-5 text-green-600 border-border rounded focus:ring-green-500"
                    />
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border-2 border-border rounded-xl cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                    <div>
                      <span className="text-sm font-medium text-foreground block">Analytics Cookies</span>
                      <span className="text-xs text-muted-foreground">Help us understand how visitors use our site</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.analytics}
                    onChange={() => setCookieSettings({ ...cookieSettings, analytics: !cookieSettings.analytics })}
                    className="w-5 h-5 text-orange-600 border-border rounded focus:ring-orange-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border-2 border-border rounded-xl cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                    <div>
                      <span className="text-sm font-medium text-foreground block">Marketing Cookies</span>
                      <span className="text-xs text-muted-foreground">Used to show you relevant advertisements</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.marketing}
                    onChange={() => setCookieSettings({ ...cookieSettings, marketing: !cookieSettings.marketing })}
                    className="w-5 h-5 text-orange-600 border-border rounded focus:ring-orange-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border-2 border-border rounded-xl cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                    <div>
                      <span className="text-sm font-medium text-foreground block">Preference Cookies</span>
                      <span className="text-xs text-muted-foreground">Remember your settings and preferences</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={cookieSettings.preferences}
                    onChange={() => setCookieSettings({ ...cookieSettings, preferences: !cookieSettings.preferences })}
                    className="w-5 h-5 text-orange-600 border-border rounded focus:ring-orange-500"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="flex-1 border-green-500/30 text-green-600 hover:bg-green-500/10"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="flex-1 border-red-500/30 text-red-600 hover:bg-red-500/10"
                >
                  Reject All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="space-y-6">
            {/* What Are Cookies */}
            <Card className="border-border shadow-lg glass-card">
              <CardHeader>
                <CardTitle className="text-xl">1. What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Cookies can be "session" cookies (deleted when you close your browser) or "persistent" cookies (remain on your device until deleted or expired).
                </p>
              </CardContent>
            </Card>

            {/* How We Use Cookies */}
            <Card className="border-border shadow-lg glass-card">
              <CardHeader>
                <CardTitle className="text-xl">2. How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/5 border border-green-200/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                        <p className="text-sm text-muted-foreground mb-2">These cookies are necessary for the website to function properly. They enable core functionality such as:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• User authentication and security</li>
                          <li>• Load balancing and server routing</li>
                          <li>• Form submission and data validation</li>
                          <li>• Session management</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/5 border border-blue-200/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                        <p className="text-sm text-muted-foreground mb-2">These cookies help us understand how visitors interact with our website:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Number of visitors and page views</li>
                          <li>• How users navigate through the site</li>
                          <li>• Which features are most popular</li>
                          <li>• Error tracking and performance monitoring</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">We use Google Analytics and similar services.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-500/5 border border-purple-200/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Marketing Cookies</h3>
                        <p className="text-sm text-muted-foreground mb-2">These cookies track your online activity to help us deliver more relevant advertising:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Display personalized advertisements</li>
                          <li>• Measure advertising campaign effectiveness</li>
                          <li>• Prevent showing the same ad repeatedly</li>
                          <li>• Third-party advertising services</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-500/5 border border-orange-200/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Settings className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Preference Cookies</h3>
                        <p className="text-sm text-muted-foreground mb-2">These cookies remember your choices and preferences:</p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>• Language preferences</li>
                          <li>• Display settings and themes</li>
                          <li>• Location and regional settings</li>
                          <li>• Previously entered form data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies */}
            <Card className="border-border shadow-lg glass-card">
              <CardHeader>
                <CardTitle className="text-xl">3. Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  We may use third-party services that set cookies on our website, including:
                </p>
                <ul className="text-muted-foreground space-y-2 mt-4">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Social Media Platforms:</strong> To enable social sharing features (LinkedIn, Twitter, Facebook)</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing</li>
                  <li><strong>Content Delivery Networks (CDN):</strong> To improve website loading speed</li>
                  <li><strong>Customer Support Tools:</strong> For live chat and support services</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  These third parties have their own privacy policies, and we have no control over their cookies.
                </p>
              </CardContent>
            </Card>

            {/* Managing Cookies */}
            <Card className="border-border shadow-lg glass-card">
              <CardHeader>
                <CardTitle className="text-xl">4. Managing Your Cookie Preferences</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed">
                  You can control and manage cookies in several ways:
                </p>

                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">On This Website</h3>
                    <p className="text-sm text-slate-700">Use the cookie preference manager at the top of this page to control which cookies we can use.</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Browser Settings</h3>
                    <p className="text-sm text-slate-700 mb-2">Most browsers allow you to:</p>
                    <ul className="text-sm text-slate-700 space-y-1 ml-4">
                      <li>• View and delete cookies</li>
                      <li>• Block third-party cookies</li>
                      <li>• Block all cookies</li>
                      <li>• Clear cookies when you close the browser</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Opt-Out Links</h3>
                    <p className="text-sm text-slate-700 mb-2">You can opt out of certain cookies through these services:</p>
                    <ul className="text-sm text-slate-700 space-y-1 ml-4">
                      <li>• Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Google Analytics Opt-out</a></li>
                      <li>• Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" className="text-blue-600 hover:underline">NAI Opt-out</a></li>
                      <li>• Digital Advertising Alliance: <a href="https://optout.aboutads.info/" className="text-blue-600 hover:underline">DAA Opt-out</a></li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-slate-700">
                    <strong>Note:</strong> Disabling certain cookies may impact your experience on our website and limit the features you can use.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookie List */}
            <Card className="border-border shadow-lg glass-card">
              <CardHeader>
                <CardTitle className="text-xl">5. Specific Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">Cookie Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">Purpose</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">Duration</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-foreground">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm font-mono text-foreground">session_id</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">User authentication</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">Session</td>
                        <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full font-semibold">Essential</span></td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm font-mono text-foreground">csrf_token</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">Security protection</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">Session</td>
                        <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full font-semibold">Essential</span></td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm font-mono text-foreground">_ga</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">Google Analytics tracking</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">2 years</td>
                        <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full font-semibold">Analytics</span></td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm font-mono text-foreground">user_preferences</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">Store user settings</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">1 year</td>
                        <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-orange-500/10 text-orange-600 rounded-full font-semibold">Preference</span></td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm font-mono text-foreground">ad_consent</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">Marketing consent status</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">6 months</td>
                        <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-600 rounded-full font-semibold">Marketing</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card className="border-border shadow-lg glass-card">
              <CardHeader>
                <CardTitle className="text-xl">6. Changes to This Cookie Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in technology, legislation, our operations, or for other operational, legal, or regulatory reasons.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We encourage you to review this page periodically to stay informed about our use of cookies. The "Last Updated" date at the top of this page indicates when this policy was last revised.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-border shadow-lg glass-card">
              <CardHeader>
                <CardTitle className="text-xl">7. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground"><strong>Email:</strong> privacy@campuscareer.com</p>
                  <p className="text-sm text-foreground mt-2"><strong>Address:</strong> NextGen HQ, Mumbai, Maharashtra, India</p>
                  <p className="text-sm text-foreground mt-2"><strong>Phone:</strong> +91 98765 43210</p>
                </div>
              </CardContent>
            </Card>

            {/* Related Policies */}
            <Card className="border-border shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Related Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <a href="/privacy" className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all">
                    <Shield className="w-5 h-5 text-primary mb-2" />
                    <h3 className="font-semibold text-foreground">Privacy Policy</h3>
                    <p className="text-sm text-muted-foreground mt-1">Learn how we protect your personal data</p>
                  </a>
                  <a href="/TermsAndCondition" className="p-4 bg-card border border-border rounded-lg hover:shadow-md transition-all">
                    <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                    <h3 className="font-semibold text-foreground">Terms of Service</h3>
                    <p className="text-sm text-muted-foreground mt-1">View our terms and conditions</p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
