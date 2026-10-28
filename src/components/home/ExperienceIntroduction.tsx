import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { ShieldCheck, Droplets, Sparkles, Feather } from 'lucide-react';

export const ExperienceIntroduction: React.FC = () => {
  const { t, isArabic } = useLanguage();

  const values = [
    {
      icon: <Droplets className="w-5 h-5 text-[#075B60]" />,
      title: isArabic ? 'مكونات أصيلة من التعاونيات' : 'Pure Cooperative Botanicals',
      desc: isArabic
        ? 'صابون أسود بزيت الزيتون المعصور، غاسول معدني من جبال الأطلس، وزيت الأركان البكر.'
        : 'Virgin olive black soap, mineral Atlas ghassoul clay, and certified cold-pressed argan oil.'
    },
    {
      icon: <Feather className="w-5 h-5 text-[#075B60]" />,
      title: isArabic ? 'سكينة وخصوصية تامة' : 'Quiet Sanctuary & Intimacy',
      desc: isArabic
        ? 'أجنحة خاصة مجهزة لضمان راحة وهدوء تام لكل سيدة، بعيداً عن صخب وتزاحم الصالونات التقليدية.'
        : 'Private individual suites configured to protect calm and complete privacy for every guest.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#075B60]" />,
      title: isArabic ? 'حرفية الطقوس المتوارثة' : 'Living Ceremonial Heritage',
      desc: isArabic
        ? 'أخصائيات خبيرات بحركات التقشير، والتدليك الانسيابي، وعلاجات الشعر المغربية العريقة.'
        : 'Seasoned Moroccan specialists practicing precise kessa exfoliation, restorative massage, and hair therapies.'
    }
  ];

  return (
    <section className="py-20 bg-[#FFF7EA] border-b border-[#DBC7A6]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <RosetteEmblem size={20} color="#075B60" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#075B60]">
              {t('experience.title')}
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#173D3E] font-normal tracking-tight mb-6">
            {t('experience.heading')}
          </h2>
          <div className="flex flex-col gap-4 text-base sm:text-lg text-[#173D3E]/80 leading-relaxed">
            <p>{t('experience.body1')}</p>
            <p>{t('experience.body2')}</p>
          </div>
        </div>

        {/* 3 Editorial Pillar Blocks with generous whitespace and subtle borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <div
              key={idx}
              className="p-8 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-xl flex flex-col items-center text-center hover:bg-[#F7E5C8]/70 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFF7EA] border border-[#DBC7A6] flex items-center justify-center mb-5 shadow-xs">
                {v.icon}
              </div>
              <h3 className="font-serif text-xl font-medium text-[#173D3E] mb-3">
                {v.title}
              </h3>
              <p className="text-sm text-[#173D3E]/75 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
