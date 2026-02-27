import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Footer from "./pages/Footer";


import StudentDashboard from "./pages/student/StudentDashboard";
import StudentSetting from "./pages/student/Setting";
import Careers from "./pages/student/careers";
import AboutUs from "./pages/AboutUs";
import CorporateNews from "./pages/student/CorporateNews";



import Webinar from "./pages/student/webinars";


import StudentFeedback from "./pages/student/feedbackForm";
import StudentInfo from "./pages/student/student_info";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSetting from "./pages/admin/Setting";
import AdminFeedback from "./pages/admin/feedbackForm";
import AdminInfo from "./pages/admin/college_info";

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
      <Route path="/careers" component={Careers} />
      <Route path="/about" component={AboutUs} />
      <Route path="/Footer" component={() => <Footer role="public" />} />

      <Route path="/corporate_news" component={CorporateNews} />

      <Route path="/contact" component={ContactUs} />



      <Route path="/webinars" component={Webinar} />


      <Route path="/privacy" component={PrivacyPage} />

      {/* Admin Routes (TPO Admin) */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/setting" component={AdminSetting} />
      <Route path="/admin/feedbackForm" component={AdminFeedback} />
      <Route path="/admin/college_info" component={AdminInfo} />

      {/* Student Routes */}
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/student/setting" component={StudentSetting} />
      <Route path="/student/feedbackForm" component={StudentFeedback} />
      <Route path="/student/student_info" component={StudentInfo} />

      {/* Department Routes (TPO Head) */}
      <Route path="/department/dashboard" component={DepartmentDashboard} />

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
