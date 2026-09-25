import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import ProcessSection from '../components/ProcessSection';
import TrackingSection from '../components/TrackingSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
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
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <TrackingSection />
      <WhyChooseUsSection />
      <CtaSection />
    </div>
  );
};

export default Landing;
