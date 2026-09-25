import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { STORE_SETTINGS } from '../../data/mockData';

interface FaqAccordionProps {
  customData?: {
    badge?: string;
    subtitle?: string;
    description?: string;
    faqs?: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
}

export const FaqAccordionSection: React.FC<FaqAccordionProps> = ({ customData }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const badge = customData?.badge || '❓ সাধারণ জিজ্ঞাসা';
  const title = customData?.subtitle || 'সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর';
  const description = customData?.description || 'আপনার যেকোনো প্রশ্নের দ্রুত সমাধান পেতে নিচে দেখুন';

  const faqs = customData?.faqs && customData.faqs.length > 0
    ? customData.faqs
    : [
        {
          id: 'q1',
          question: 'অর্ডার করার কতদিনের মধ্যে ডেলিভারি পাবো?',
          answer: 'ঢাকার সিটির ভেতরে ২৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি দেওয়া হয়। ঢাকা সিটির বাইরে সারাদেশে সুন্দরবন/স্টিডফাস্ট কুরিয়ারের মাধ্যমে ৪৮ থেকে ৭২ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়।'
        },
        {
          id: 'q2',
          question: 'পণ্য হাতে পেয়ে দেখে নেওয়ার সুযোগ আছে কি?',
          answer: 'হ্যাঁ, ১০০% সুযোগ রয়েছে! ডেলিভারিম্যানের সামনে পার্সেল খুলে চেক করে তারপর মূল্য পরিশোধ (Cash on Delivery) করতে পারবেন।'
        },
        {
          id: 'q3',
          question: 'কোনো ত্রুটি থাকলে পণ্য কীভাবে পরিবর্তন বা রিটার্ন করব?',
          answer: 'পণ্য পাওয়ার ৭ দিনের মধ্যে আমাদের হটলাইনে বা হোয়াটসঅ্যাপে যোগাযোগ করলেই কোনো বাড়তি চার্জ ছাড়াই ত্রুটিযুক্ত পণ্য পরিবর্তন করে দেওয়া হবে।'
        },
        {
          id: 'q4',
          question: 'ডেলিভারি চার্জ কত টাকা?',
          answer: 'ঢাকা সিটির ভেতরে মাত্র ৬০ টাকা এবং ঢাকা সিটির বাইরে সারাদেশে ১২০ টাকা।'
        }
      ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider inline-block mb-2">
          {badge}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id || idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-xs sm:text-sm hover:text-rose-600 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{faq.question}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-rose-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 mb-2">আরও কিছু জানতে চান?</p>
        <a
          href={`https://wa.me/880${STORE_SETTINGS.whatsapp.replace(/[^0-9]/g, '').slice(-10)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>সরাসরি হোয়াটসঅ্যাপে কথা বলুন</span>
        </a>
      </div>
    </section>
  );
};
