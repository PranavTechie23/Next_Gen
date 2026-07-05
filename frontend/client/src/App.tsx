import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Footer from "./pages/Footer";


import StudentDashboard from "./pages/student/StudentDashboard";
import StudentSetting from "./pages/student/Setting";
import AboutUs from "./pages/AboutUs";
import CorporateNews from "./pages/student/CorporateNews";

import StudentFeedback from "./pages/student/feedbackForm";
import StudentInfo from "./pages/student/student_info";

import TPODashboard from "./pages/tpo/TPODashboard";
import TPOSetting from "./pages/tpo/Setting";
import TPOFeedback from "./pages/tpo/feedbackForm";
import TPOInfo from "./pages/tpo/college_info";

import DepartmentDashboard from "./pages/department/DepartmentDashboard";

import PrivacyPage from "./pages/PrivacyPage";
import SignupPage from "./pages/SignupPage";
import TermsAndCondition from "./pages/TermsAndCondition";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";

import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import CookiePolicy from "./pages/Cookie";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import Security from "./pages/Security";
import SuccessStories from "./pages/SuccessStories";
import ResumeBuilder from "./pages/ResumeBuilder";
import InterviewPrep from "./pages/InterviewPrep";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/careers">
        <DashboardTabRedirect dashboardPath="/student/dashboard" tab="careers" />
      </Route>
      <Route path="/about" component={AboutUs} />
      <Route path="/Footer" component={() => <Footer role="public" />} />

      <Route path="/corporate_news">
        <CorporateNews />
      </Route>

      <Route path="/contact" component={ContactUs} />



      <Route path="/webinars">
        <DashboardTabRedirect dashboardPath="/student/dashboard" tab="webinars" />
      </Route>

      <Route path="/privacy" component={PrivacyPage} />

      {/* TPO Routes (TPO) */}
      <Route path="/TPO/dashboard">
        <ProtectedRoute allowedRoles={["TPO_ADMIN"]}>
          <TPOLayout>
            <TPODashboard />
          </TPOLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/TPO/setting">
        <ProtectedRoute allowedRoles={["TPO_ADMIN"]}>
          <TPOSetting />
        </ProtectedRoute>
      </Route>
      <Route path="/TPO/feedbackForm">
        <ProtectedRoute allowedRoles={["TPO_ADMIN"]}>
          <TPOFeedback />
        </ProtectedRoute>
      </Route>
      <Route path="/TPO/college_info">
        <ProtectedRoute allowedRoles={["TPO_ADMIN"]}>
          <TPOInfo />
        </ProtectedRoute>
      </Route>

      {/* Student Routes */}
      <Route path="/student/dashboard">
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentLayout>
            <StudentDashboard />
          </StudentLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/student/setting">
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentSetting />
        </ProtectedRoute>
      </Route>
      <Route path="/student/feedbackForm">
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentFeedback />
        </ProtectedRoute>
      </Route>
      <Route path="/student/student_info">
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentInfo />
        </ProtectedRoute>
      </Route>

      {/* Department Routes (TPO Head) */}
      <Route path="/department/dashboard">
        <ProtectedRoute allowedRoles={["TPO_HEAD"]}>
          <DeptLayout>
            <DepartmentDashboard />
          </DeptLayout>
        </ProtectedRoute>
      </Route>

      {/* Additional Pages & Aliases */}
      <Route path="/security" component={Security} />
      <Route path="/security-guidelines" component={Security} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/terms" component={TermsAndCondition} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/cookie" component={CookiePolicy} />
      <Route path="/SuccessStories" component={SuccessStories} />
      <Route path="/ResumeBuilder" component={ResumeBuilder} />
      <Route path="/InterviewPrep" component={InterviewPrep} />

      {/* Backward/typed URL alias */}
      <Route path="/PrivacyPage" component={PrivacyPage} />
      <Route path="/SecurityGuidelines" component={Security} />
      <Route path="/Signup" component={SignupPage} />
      <Route path="/TermsAndCondition" component={TermsAndCondition} />
      <Route path="/HelpCenter" component={HelpCenter} />
      <Route path="/ContactUs" component={ContactUs} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/change-password" component={ChangePassword} />

      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}
import { BrandingProvider } from "./contexts/BrandingContext";
import { UserProvider } from "./contexts/UserContext";
import { QueryProvider } from "./providers/QueryProvider";
import { DashboardTabRedirect } from "./components/routing/DashboardTabRedirect";
import { TPOLayout, StudentLayout, DeptLayout } from "./components/layouts";
import { installGlobalAxiosRateLimitHandler } from "./lib/httpRateLimit";

installGlobalAxiosRateLimitHandler();

function App() {
  return (
    <ErrorBoundary>
      <BrandingProvider>
        <QueryProvider>
          <UserProvider>
            <ThemeProvider defaultTheme="light" switchable={true}>
              <TooltipProvider>
                <ScrollToTop />
                <Toaster />
                <div className="min-h-dvh w-full min-w-0 overflow-x-hidden">
                  <Router />
                </div>
              </TooltipProvider>
            </ThemeProvider>
          </UserProvider>
        </QueryProvider>
      </BrandingProvider>
    </ErrorBoundary>
  );
}

export default App;