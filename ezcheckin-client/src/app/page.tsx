import AboutSection from "@/components/home-client/AboutSection";
import BlogSection from "@/components/home-client/BlogSection";
import CTASection from "@/components/home-client/CTASection";
import CurriculumSection from "@/components/home-client/CurriculumSection";
import DashboardPreview from "@/components/home-client/DashboardPreview";
import FAQSection from "@/components/home-client/FAQSection";
import HeroSection from "@/components/home-client/HeroSection";
import FooterSection from "@/components/layout/Footer/FooterSection";
import Navbar from "@/components/layout/Navbar/Navbar";
import PricingSection from "@/components/home-client/PricingSection";
import ProgramsSection from "@/components/home-client/ProgramsSection";
import SkillsSection from "@/components/home-client/SkillsSection";
import TestimonialsSection from "@/components/home-client/TestimonialsSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection/>
      <AboutSection />
      <SkillsSection />
      <ProgramsSection />
      <CurriculumSection />
      <PricingSection />
      <DashboardPreview />
      <TestimonialsSection />
      <BlogSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
      {/* <LeadCaptureModal open={modalOpen} onClose={() => setModalOpen(false)} /> */}

      {/* <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 glow-button rounded-full px-5 py-3 text-sm font-bold md:hidden"
      >
        Free Kit 🎁
      </button> */}
    </div>
  );
};

export default Home;
