import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface ShopifySidekickViewProps {
  conversationType: 'payments' | 'collection' | 'google';
}

interface ChatMessage {
  id: string;
  sender: 'sidekick' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
}

export const ShopifySidekickView: React.FC<ShopifySidekickViewProps> = ({ conversationType }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (conversationType === 'payments') {
      return [
        {
          id: '1',
          sender: 'user',
          text: 'How can I set product-specific payment methods, like requiring bKash advance payment for expensive smart watches and laptops?',
          timestamp: '10:45 AM'
        },
        {
          id: '2',
          sender: 'sidekick',
          text: `Great question! In Shopify and GPE Bangladesh, you can configure conditional payment rules:

1. Go to **Settings > Payments**.
2. Under **Payment Customizations**, enable 'Advance Payment Rule for High-Ticket Items'.
3. For products over ৳3,000 (such as Ultra 9 Smart Watches or Laptop Stands), you can require a minimum advance of ৳200 or 100% bKash payment to minimize fake orders and return courier charges.

Would you like me to apply this rule automatically to your Smart Watch category?`,
          timestamp: '10:46 AM',
          actionButton: {
            label: 'Apply Rule to Smart Watches',
            action: () => alert('Payment customization applied to high-ticket items!')
          }
        }
      ];
    } else if (conversationType === 'collection') {
      return [
        {
          id: '1',
          sender: 'user',
          text: 'Can you help me create a new collection for laptop and computer accessories?',
          timestamp: '11:15 AM'
        },
        {
          id: '2',
          sender: 'sidekick',
          text: `I can set that up right away!

Here is the suggested configuration for your new collection:
- **Title**: Computer & Laptop Accessories
- **Bangla Title**: কম্পিউটার ও ল্যাপটপ এক্সেসরিজ
- **Collection Type**: Automated (Rules-based)
- **Condition**: Product tag equals 'laptop stand', 'charger', or 'dock'
- **SEO Description**: "Explore premium laptop stands, aluminum risers, and ergonomic workstation accessories in Bangladesh with fast express delivery."

I found 4 products in your catalog that match this automatically.`,
          timestamp: '11:16 AM',
          actionButton: {
            label: 'Create Automated Collection',
            action: () => alert('Collection "Computer & Laptop Accessories" created!')
          }
        }
      ];
    } else {
      return [
        {
          id: '1',
          sender: 'user',
          text: 'How do I get my products listed on Google Shopping in Bangladesh?',
          timestamp: '09:30 AM'
        },
        {
          id: '2',
          sender: 'sidekick',
          text: `Here is the step-by-step roadmap to get your GPE Bangladesh products appearing on Google Search & Shopping tabs:

1. **Google Merchant Center Sync**: We generate an automated XML Product Feed for your store.
2. **Category Metafields**: Ensure all items have 'Google: Age Group', 'Gender', and 'Condition: New' filled out (which are already integrated in our Shopify Product Editor!).
3. **Free Listings in Bangladesh**: Google now offers 100% Free Product Listings on the Google Shopping tab for verified Bangladeshi merchants.

All your products currently pass 100% of Google's structured data standards!`,
          timestamp: '09:31 AM',
          actionButton: {
            label: 'Generate Google Feed XML',
            action: () => alert('Google Merchant Center XML Feed generated successfully!')
          }
        }
      ];
    }
  });

  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'sidekick',
        text: `Got it! I am analyzing your store data for "${currentInput}". I've updated the recommendation in your dashboard.`,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 800);
  };

  const getTitle = () => {
    if (conversationType === 'payments') return 'Product-specific payment methods';
    if (conversationType === 'collection') return 'Creating a new collection for accessories';
    return 'Get your products on Google';
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">{getTitle()}</h2>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200">
                Sidekick AI
              </span>
            </div>
            <p className="text-[11px] text-gray-500">Shopify AI Commerce Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-xs p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'sidekick' && (
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-xl p-3.5 space-y-2 ${
                m.sender === 'user'
                  ? 'bg-gray-900 text-white rounded-tr-none'
                  : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

              {m.actionButton && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={m.actionButton.action}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>{m.actionButton.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span
                className={`text-[10px] block text-right ${
                  m.sender === 'user' ? 'text-gray-400' : 'text-gray-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                A
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Sidekick anything about your store, products, or orders..."
          className="flex-1 px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:border-purple-600 shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
