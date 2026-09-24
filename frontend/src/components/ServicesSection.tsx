import React from 'react';
import { FileEdit, Shield, Building, Map, HeadphonesIcon } from 'lucide-react';

const services = [
  {
    icon: <FileEdit size={32} />,
    title: 'Plan Approval',
    description: 'Support for preparing and processing building plan approval requirements.'
  },
  {
    icon: <Shield size={32} />,
    title: 'Building Permission',
    description: 'Assistance with required permissions and application documentation.'
  },
  {
    icon: <Building size={32} />,
    title: 'Occupancy Certificate',
    description: 'Guidance for completing the approval process and required documentation.'
  },
  {
    icon: <Map size={32} />,
    title: 'Local Body Approvals',
    description: 'Application support for relevant local authority approval requirements.'
  },
  {
    icon: <HeadphonesIcon size={32} />,
    title: 'Expert Support',
    description: 'Get assistance throughout the application process from our team.'
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
          <div style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Our Services
          </div>
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>
            Complete Support for Your Approval Needs
          </h2>
          <p className="text-lead">
            Professional assistance throughout your building approval journey.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {services.map((service, index) => (
            <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--primary-blue)', 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--dark-navy)' }}>
                {service.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
                {service.description}
              </p>
              <div>
                <a href="#" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  Learn More &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
