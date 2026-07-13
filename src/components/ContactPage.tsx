import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: 'Batch Registration',
    message: ''
  });
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How can I enroll in Suraj Sir’s offline batches?',
      a: 'You can directly visit our head office near the IIT campus daily between 9:00 AM to 7:00 PM, or submit an inquiry using the Student Portal. Our admissions team will contact you with batch availability.'
    },
    {
      q: 'Are the mock test series free to attempt?',
      a: 'Yes, all mock tests in our portal are completely free and synchronized with current JEE & NEET examination patterns, providing complete step-by-step solutions immediately.'
    },
    {
      q: 'How do I download lecture notes PDFs?',
      a: 'Notes are linked directly with their respective lectures in the Video Batches playlist, and additional quick formula revision sheets are available under the Books tab.'
    },
    {
      q: 'Can I submit direct physics or calculus doubts to Suraj Sir?',
      a: 'Absolutely! Go to the Student Portal, open the Doubts Thread block, and submit your question. Suraj Sir and senior verified tutors answer within 24 hours.'
    }
  ];

  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate query submission ticket
    const ticketId = `SRJ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(ticketId);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      subject: 'Batch Registration',
      message: ''
    });
  };

  return (
    <div className="space-y-12" id="contact-page-view">
      
      {/* Top Banner section */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Get in Touch with Suraj Sir Academy</h2>
        <p className="text-sm text-slate-500">Contact our academic counsellors or visit our center for admission procedures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Contact info details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-lg">Academy Contact Info</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">OFFICE ADDRESS</h4>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">3rd Floor, Toppers Tower, Near Metro Station, Sector 4, New Delhi - 110001</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CALL HELPLINE</h4>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">+91 98765 43210 / +91 98765 43211</p>
                  <p className="text-[10px] text-slate-400">Timing: 9:00 AM - 7:00 PM (Mon to Sun)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">EMAIL SUPPORT</h4>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">admissions@surajsirportal.com</p>
                  <p className="text-[10px] text-slate-400">Response guaranteed in 12 Hours</p>
                </div>
              </div>
            </div>

            {/* Social handles links */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Official Channels:</span>
              <div className="flex gap-2">
                <a href="#telegram" className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 transition-all">
                  Telegram Group <ExternalLink className="h-3 w-3" />
                </a>
                <a href="#youtube" className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-100 transition-all">
                  YouTube Batch <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Map Mockup container */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CAMPUS LOCATION MAP</h4>
            <div className="h-44 bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200">
              {/* Custom SVG mockup map */}
              <svg className="absolute inset-0 h-full w-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,40 L300,60 M50,0 L70,300 M120,0 L180,300 M0,200 L300,180" stroke="#cbd5e1" strokeWidth="3" />
                <path d="M10,120 C80,110 180,130 290,120" stroke="#94a3b8" strokeWidth="5" fill="none" />
              </svg>
              <div className="relative text-center p-4 space-y-1.5 z-10">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto animate-bounce" />
                <span className="font-bold text-slate-800 text-xs block">Suraj Sir Academy Head Office</span>
                <span className="text-[10px] text-slate-500">Near Metro Gate 2, Toppers Row</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form inquiry or Ticket display */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-lg">Send Admission Inquiry</h3>

          <AnimatePresence mode="wait">
            {!submittedTicket ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Student Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Amit Kumar"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., amit@gmail.com"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="e.g., +91 9876543210"
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Subject of Interest</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="Batch Registration">IIT-JEE Batch Registration</option>
                      <option value="NEET Batch Registration">NEET Biology Batch Registration</option>
                      <option value="Scholarship Test">Admission Scholarship Test</option>
                      <option value="Other Query">General Counseling Doubt</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your marks, past score targets, and any specific queries..."
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="h-4 w-4" /> Send Academic Request
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-4"
              >
                <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-bounce" />
                <div>
                  <h4 className="font-extrabold text-emerald-800 text-base">Inquiry Submitted Successfully!</h4>
                  <p className="text-xs text-emerald-600 mt-1">Counselor Ticket Assigned: <strong>{submittedTicket}</strong></p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-normal">
                  Thank you! Our batch administrators will verify your details and phone number to complete the orientation call within 12 hours.
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Accordion FAQ row */}
      <div className="pt-8 border-t border-slate-100 space-y-6" id="faq-section">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500 font-medium">Quick answers regarding portal operations and batch plans</p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-slate-100">
          {faqs.map((faq, index) => {
            const isOpened = activeFaqIdx === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setActiveFaqIdx(isOpened ? null : index)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-800 text-sm sm:text-base py-2 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-slate-400 font-bold ml-4">{isOpened ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {isOpened && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-2 pl-6">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
