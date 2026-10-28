import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { Service } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { X, Sparkles, Send, Bot, User, ArrowRight, ArrowLeft, Calendar, HelpCircle } from 'lucide-react';

interface AskFinahConciergeProps {
  onClose: () => void;
  onBookService: (service: Service) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAction?: {
    type: 'book' | 'inquire';
    service: Service;
  };
}

export const AskFinahConcierge: React.FC<AskFinahConciergeProps> = ({ onClose, onBookService }) => {
  const { t, isArabic } = useLanguage();
  const allServices = finahStore.getServices();
  const config = finahStore.getConfig();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: isArabic
        ? 'مرحباً بكِ في فنة. أنا مستشارتكِ الافتراضية، يسعدني إرشادكِ حول طقوس الحمام المغربي، المكونات الطبيعية، مدة الجلسات، أو كيفية حجز موعدك.'
        : 'Welcome to Finah. I am your sanctuary assistant. How may I guide you regarding our Moroccan hammam rituals, botanical ingredients, or visit reservations?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Quick prompt buttons
  const quickQuestions = [
    {
      label: isArabic ? 'ما الفرق بين الحمام التقليدي والملكي؟' : 'Difference between Traditional & Royal Hammam?',
      text: isArabic ? 'ما الفرق بين الحمام المغربي التقليدي وحمام فنة الملكي؟' : 'What is the difference between the Traditional and Royal Hammam?'
    },
    {
      label: isArabic ? 'هل الصابون والغاسول طبيعيان؟' : 'Are black soap and ghassoul organic?',
      text: isArabic ? 'ما هي المكونات المستخدمة في الحمام المغربي؟' : 'What ingredients are used in the Moroccan hammam?'
    },
    {
      label: isArabic ? 'ما هي مدة الجلسات والأسعار؟' : 'Session durations and pricing?',
      text: isArabic ? 'كم مدة جلسات الحمام المغربي وما هي أسعارها المعتمدة؟' : 'What are the durations and verified prices for hammam sessions?'
    }
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Answer resolution using verified catalog data
    setTimeout(() => {
      const q = userText.toLowerCase();
      let reply = '';
      let action: { type: 'book' | 'inquire'; service: Service } | undefined;

      if (q.includes('فرق') || q.includes('difference') || q.includes('royal') || q.includes('ملكي')) {
        reply = isArabic
          ? 'الحمام التقليدي (60 دقيقة - 380 درهم) يركز على بخار الأوكالبتوس، صابون زيت الزيتون، وتقشير الكيس المغربي الدقيق. أما حمام فنة الملكي (90 دقيقة - 580 درهم) فيضيف إليه قناع غاسول الأطلس المعطر بالورد وسبعة أعشاب، مع مساج مهدئ لفروة الرأس والشعر، يليه شاي النعناع في ردهة الاسترخاء.'
          : 'The Traditional Hammam (60 mins · 380 AED) focuses on warm steam, olive black soap, and kessa glove exfoliation. The Royal Hammam (90 mins · 580 AED) expands this with an Atlas mountain mineral ghassoul wrap scented with Damask rose and 7 herbs, plus a botanical scalp massage and mint tea lounge service.';
        action = { type: 'book', service: allServices[1] };
      } else if (q.includes('مكونات') || q.includes('ingredients') || q.includes('organic') || q.includes('طبيعي') || q.includes('أركان')) {
        reply = isArabic
          ? 'جميع مكوناتنا مستوردة مباشرة من تعاونيات نسائية مغربية معتمدة: صابون بلدي طبيعي من زيت الزيتون المعصور على البارد، غاسول أصيل من جبال الأطلس، ماء ورد مقطر يدوياً من قلعة مكونة، وزيت أركان عضوي بكر خالص 100% دون أي ملونات أو إضافات كيميائية.'
          : 'All botanicals are sourced directly from certified Moroccan women\'s cooperatives: cold-pressed virgin olive black soap, Atlas mountain ghassoul clay, handcrafted Kelaat M\'gouna rosewater, and 100% pure organic argan oil without artificial fragrances.';
      } else if (q.includes('عروس') || q.includes('bridal') || q.includes('wedding')) {
        reply = isArabic
          ? 'نوفر طقوس العروس الملكية المتكاملة (180 دقيقة - 1,450 درهم)، وتشمل حماماً ملكياً خاصاً، قناع العكر الفاسي للتفتيح والتوريد، وتدليكاً استرخائياً شاملاً، وعناية بنضارة الوجه والشعر. نظراً لخصوصية التجربة، تتطلب حجوزات العروس استشارة وجدولة مسبقة.'
          : 'Our Finah Royal Bridal Signature Journey (180 mins · 1,450 AED) includes a private royal hammam, Aker Fassi brightening body mask, tension-release massage, and botanical facial glow. Due to its bespoke nature, bridal reservations require advance consultation.';
        action = { type: 'inquire', service: allServices[2] };
      } else if (q.includes('سعر') || q.includes('price') || q.includes('تكلفة') || q.includes('cost')) {
        reply = isArabic
          ? `الأسعار المعتمدة حالياً في فنة: الحمام التقليدي: 380 درهم، الحمام الملكي بالعنبر والورد: 580 درهم، علاج الأركان للشعر: 420 درهم، جلسة نضارة الوجه: 450 درهم، وتدليك زهر البرتقال: 420 درهم. لا توجد أي رسوم إضافية خفية.`
          : `Current verified pricing at Finah: Traditional Hammam: 380 AED, Royal Amber & Rose Hammam: 580 AED, Argan Restorative Hair: 420 AED, Damask Rose Facial: 450 AED, and Neroli Massage: 420 AED. No hidden fees.`;
      } else {
        reply = isArabic
          ? `شكراً لاستفسارك. يمكنكِ حجز أي من جلساتنا عبر زر "احجزي زيارتك" أو اختيار "صممي زيارتك" لدمج عدة خدمات. كما يسعد فريق الاستقبال في فنة الإجابة المباشرة على أي سؤال عبر واتساب (${config.whatsapp.display}).`
          : `Thank you for your question. You may book any ritual directly via "Book a Visit" or use "Design My Visit" to combine treatments. Our front desk team is also available directly via WhatsApp (${config.whatsapp.display}).`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          suggestedAction: action
        }
      ]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl shadow-xl flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#DBC7A6] flex items-center justify-between bg-[#F7E5C8]/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#075B60] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-medium text-[#173D3E]">
                {t('concierge.title')}
              </h3>
              <p className="text-[11px] text-[#075B60]">
                {isArabic ? 'مستشارة طقوس الجمال المغربي' : 'Moroccan Rituals Guide'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#173D3E]/70 hover:text-[#075B60] hover:bg-[#F7E5C8] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3 text-right rtl:text-right ltr:text-left">
          {messages.map(m => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#075B60] text-white rounded-br-xs'
                      : 'bg-[#F7E5C8]/60 text-[#173D3E] border border-[#DBC7A6] rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                </div>

                {m.suggestedAction && (
                  <button
                    onClick={() => {
                      onClose();
                      onBookService(m.suggestedAction!.service);
                    }}
                    className="mt-2 text-xs font-semibold text-[#075B60] bg-[#FFF7EA] hover:bg-[#F7E5C8] border border-[#DBC7A6] px-3 py-1.5 rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {isArabic
                        ? `حجز موعد: ${m.suggestedAction.service.name.ar}`
                        : `Schedule: ${m.suggestedAction.service.name.en}`}
                    </span>
                  </button>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-xl self-start text-xs text-[#075B60]">
              <span className="animate-pulse">·</span>
              <span className="animate-pulse">·</span>
              <span className="animate-pulse">·</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#FFF7EA] border-t border-[#DBC7A6]/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q.text)}
              className="text-[11px] text-[#075B60] bg-[#F7E5C8]/50 hover:bg-[#F7E5C8] border border-[#DBC7A6] px-2.5 py-1 rounded whitespace-nowrap cursor-pointer shrink-0"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 bg-[#F7E5C8]/30 border-t border-[#DBC7A6] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={t('concierge.placeholder')}
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 p-2 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-xs text-[#173D3E] focus:outline-none focus:border-[#075B60]"
          />
          <button
            type="submit"
            className="p-2 bg-[#075B60] text-white rounded-lg hover:bg-[#064a4e] transition-colors cursor-pointer"
            aria-label="Send message"
          >
            {isArabic ? <Send className="w-4 h-4 transform rotate-180" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {/* Disclaimer */}
        <div className="px-3 py-1 bg-[#FFF7EA] text-[10px] text-[#173D3E]/60 text-center border-t border-[#DBC7A6]/30">
          {t('concierge.disclaimer')}
        </div>
      </div>
    </div>
  );
};
