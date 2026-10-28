import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { Calendar, UserCheck, ShieldCheck, Coffee } from 'lucide-react';

export const BookingWalkthrough: React.FC = () => {
  const { t, isArabic } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: <Calendar className="w-5 h-5 text-[#075B60]" />,
      title: isArabic ? 'اختيار الطقس أو الباقة' : 'Select Your Ritual',
      desc: isArabic
        ? 'تصفحي قائمة الخدمات المعتمدة مع توضيح كامل للمدة والمكونات والسعر دون أي رسوم خفية.'
        : 'Explore verified treatments with full transparency on duration, ingredients, and pricing.'
    },
    {
      num: '02',
      icon: <UserCheck className="w-5 h-5 text-[#075B60]" />,
      title: isArabic ? 'تحديد الأخصائية والموعد' : 'Choose Specialist & Time',
      desc: isArabic
        ? 'اختاري موعدك المفضل بدقة بتوقيت دبي، مع إمكانية تحديد أخصائيتك المفضلة أو المتاح أولاً.'
        : 'Select your preferred Dubai time slot with your chosen therapist or first available.'
    },
    {
      num: '03',
      icon: <ShieldCheck className="w-5 h-5 text-[#075B60]" />,
      title: isArabic ? 'حفظ الموعد والتأكيد' : 'Slot Hold & Confirmation',
      desc: isArabic
        ? 'يتم حفظ الخانة تلقائياً لمدة 10 دقائق لضمان عدم تضارب المواعيد قبل إرسال التأكيد النهائي.'
        : 'Your slot is held securely for 10 minutes to prevent double-booking before final validation.'
    },
    {
      num: '04',
      icon: <Coffee className="w-5 h-5 text-[#075B60]" />,
      title: isArabic ? 'الاستقبال والشاي المغربي' : 'Welcome & Mint Tea',
      desc: isArabic
        ? 'استقبال دافئ، استراحة هادئة في الردهة، وشاي بالنعناع الطازج قبل بدء طقسك في جناحك الخاص.'
        : 'Warm hospitality, quiet lounge rest, and fresh Moroccan mint tea prior to your private suite ritual.'
    }
  ];

  return (
    <section className="py-20 bg-[#F7E5C8]/30 border-b border-[#DBC7A6]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <RosetteEmblem size={16} color="#075B60" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {isArabic ? 'خطوات الزيارة المريحة' : 'The Visit Journey'}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#173D3E] font-normal tracking-tight mb-3">
            {isArabic ? 'كيف تتم تجربة الحجز والاستقبال في فنة؟' : 'How Your Finah Experience Unfolds'}
          </h2>
          <p className="text-sm text-[#173D3E]/75">
            {isArabic
              ? 'رحلة واضحة وميسرة من أول اختيار حتى ختام زيارتك.'
              : 'A transparent and effortless journey from selection to sanctuary departure.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(s => (
            <div
              key={s.num}
              className="p-6 bg-[#FFF7EA] border border-[#DBC7A6] rounded-xl flex flex-col justify-between hover:border-[#075B60]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#F7E5C8] border border-[#DBC7A6] flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-serif text-lg font-bold text-[#075B60]">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-medium text-[#173D3E] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#173D3E]/75 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
