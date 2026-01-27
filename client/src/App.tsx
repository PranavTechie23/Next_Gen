import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Footer from "./pages/footer"


import StudentDashboard from "./pages/student/StudentDashboard";
import StudentSetting from "./pages/student/Setting";
import Careers from "./pages/student/careers";
import AboutUs from "./pages/AboutUs";
import CorporateNews from "./pages/student/CorporateNews";
import StudentFeatures from "./pages/student/features";
import StudentBlog from "./pages/student/blog";
import CaseStudies from "./pages/student/caseStudies";
import RefundPolicy from "./pages/student/refundPolicy";
import Webinar from "./pages/student/webinars";
import Pricing from "./pages/student/pricing";
import Wellbeing from "./pages/student/wellBeing";
import StudentFeedback from "./pages/student/feedbackForm";

import CollegeDashboard from "./pages/college/CollegeDashboard";
import CollegeSetting from "./pages/college/Setting";
import CollegeFeedback from "./pages/college/feedbackForm";
import SecurityGuidelines from "./pages/college/securityGuidelines";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSetting from "./pages/admin/Setting";
import AdminFeedback from "./pages/admin/feedback";

import PrivacyPage from "./pages/PrivacyPage";
import SignupPage from "./pages/SignupPage";
import TermsAndCondition from "./pages/TermsAndCondition";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import CookiePolicy from "./pages/Cookie";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/careers" component={Careers} />
      <Route path="/about" component={AboutUs} />
      <Route path = "/Footer" component={() => <Footer role="public" />}/>

      <Route path="/corporate_news" component={CorporateNews} />
      <Route path="/case_studies" component={CaseStudies} />
      <Route path="/contact" component={ContactUs} />

      <Route path="/refund_policy" component={RefundPolicy} />
      <Route path="/blog" component={StudentBlog} />
      <Route path="/features" component={StudentFeatures} />
      <Route path="/webinars" component={Webinar} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/wellbeing" component={Wellbeing} />

      <Route path="/privacy" component={PrivacyPage} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/setting" component={AdminSetting} />
      <Route path="/admin/feedback" component={AdminFeedback} />

      {/* Student Routes */}
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/student/setting" component={StudentSetting} />
      <Route path="/student/feedbackForm" component={StudentFeedback} />

      {/* College Routes */}
      <Route path="/college/dashboard" component={CollegeDashboard} />
      <Route path="/college/setting" component={CollegeSetting} />
      <Route path="/college/feedbackForm" component={CollegeFeedback} />

      {/* Additional Pages & Aliases */}
      <Route path="/security-guidelines" component={SecurityGuidelines} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/terms" component={TermsAndCondition} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/cookie" component={CookiePolicy} />

      {/* Backward/typed URL alias */}
      <Route path="/PrivacyPage" component={PrivacyPage} />
      <Route path="/SecurityGuidelines" component={SecurityGuidelines} />
      <Route path="/Signup" component={SignupPage} />
      <Route path="/TermsAndCondition" component={TermsAndCondition} />
      <Route path="/HelpCenter" component={HelpCenter} />
      <Route path="/ContactUs" component={ContactUs} />

      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <TooltipProvider>
          <ScrollToTop />
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
