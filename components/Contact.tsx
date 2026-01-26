import React, { useState } from 'react';
import { Send, Mail, MapPin } from 'lucide-react';
import { PROFILE } from '../constants';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '' // Spam protection
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check: if filled, it's a bot
    if (formData.honeypot) {
      return;
    }

    setStatus('submitting');

    // Simulate API call
    try {
      // In a real application, you would make a POST request to your backend here
      // For this static version, we simulate a delay and then open mailto
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('success');
      
      // Fallback/Actual mechanism for static site: mailto
      const subject = encodeURIComponent(`Contact from ${formData.name}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
      window.location.href = `mailto:${PROFILE.social.email}?subject=${subject}&body=${body}`;
      
      setFormData({ name: '', email: '', message: '', honeypot: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 bg-skin-card/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-skin-text mb-8">Contact</h2>
          <p className="text-skin-muted text-lg mb-12 leading-relaxed">
            制作依頼、技術相談、Vket出展に関するお問い合わせなど、お気軽にご連絡ください。<br/>
            24時間以内に返信いたします。
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-skin-card rounded-full text-skin-accent shadow-sm">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-skin-card-text">Email</h4>
                <p className="text-skin-muted">{PROFILE.social.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-skin-card rounded-full text-skin-accent shadow-sm">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-skin-card-text">Location</h4>
                <p className="text-skin-muted">Sapporo, Hokkaido, Japan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-skin-card p-8 shadow-lg flex flex-col gap-6"
          style={{ 
            borderRadius: 'var(--style-rounded)', 
            border: 'var(--style-border)' 
          }}
        >
          {/* Honeypot Field (Hidden) */}
          <input 
            type="text" 
            name="honeypot" 
            value={formData.honeypot}
            onChange={handleChange}
            style={{ display: 'none' }} 
            tabIndex={-1} 
            autoComplete="off"
          />

          <div>
            <label htmlFor="name" className="block text-sm font-bold text-skin-card-text mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-skin-base border border-skin-muted/20 text-skin-text rounded focus:outline-none focus:ring-2 focus:ring-skin-accent transition-all"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-skin-card-text mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-skin-base border border-skin-muted/20 text-skin-text rounded focus:outline-none focus:ring-2 focus:ring-skin-accent transition-all"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-skin-card-text mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-skin-base border border-skin-muted/20 text-skin-text rounded focus:outline-none focus:ring-2 focus:ring-skin-accent transition-all resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className={`
              flex items-center justify-center gap-2 py-4 px-6 rounded font-bold text-white transition-all transform hover:-translate-y-1
              ${status === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-skin-accent hover:shadow-lg'}
            `}
          >
            {status === 'submitting' ? (
              'Sending...'
            ) : status === 'success' ? (
              'Message Sent!'
            ) : (
              <>
                Send Message <Send size={18} />
              </>
            )}
          </button>
        </form>

      </div>
    </section>
  );
};

export default Contact;