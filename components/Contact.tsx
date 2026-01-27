import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import { PROFILE } from '../constants';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-skin-card/30">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-3xl md:text-5xl font-bold text-skin-text mb-8">Contact</h2>
        <p className="text-skin-muted text-lg mb-12 leading-relaxed max-w-2xl mx-auto">
          制作依頼、技術相談、Vket出展に関するお問い合わせなど、お気軽にご連絡ください。<br />
          以下のメールアドレスまでお願いいたします。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
          {/* Email Card */}
          <a
            href={`mailto:${PROFILE.social.email}`}
            className="group flex flex-col items-center p-8 bg-skin-card shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            style={{
              borderRadius: 'var(--style-rounded)',
              border: 'var(--style-border)'
            }}
          >
            <div className="p-4 bg-skin-base rounded-full text-skin-accent mb-6 group-hover:scale-110 transition-transform">
              <Mail size={32} />
            </div>
            <h4 className="font-bold text-xl text-skin-card-text mb-2">Email</h4>
            <p className="text-skin-muted break-all group-hover:text-skin-accent transition-colors">
              {PROFILE.social.email}
            </p>
          </a>

          {/* Location Card */}
          <div
            className="flex flex-col items-center p-8 bg-skin-card shadow-lg"
            style={{
              borderRadius: 'var(--style-rounded)',
              border: 'var(--style-border)'
            }}
          >
            <div className="p-4 bg-skin-base rounded-full text-skin-accent mb-6">
              <MapPin size={32} />
            </div>
            <h4 className="font-bold text-xl text-skin-card-text mb-2">Location</h4>
            <p className="text-skin-muted">
              Sapporo, Hokkaido, Japan
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;