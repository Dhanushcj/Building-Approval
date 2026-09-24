import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import TrackingSection from '../components/TrackingSection';
import ServicesSection from '../components/ServicesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import StatusPreviewSection from '../components/StatusPreviewSection';
import TestimonialSection from '../components/TestimonialSection';
import CtaSection from '../components/CtaSection';

const Landing: React.FC = () => {
  // Add smooth scrolling behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <HeroSection />
      <TrackingSection />
      <ServicesSection />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <StatusPreviewSection />
      <TestimonialSection />
      <CtaSection />
    </div>
  );
};

export default Landing;
