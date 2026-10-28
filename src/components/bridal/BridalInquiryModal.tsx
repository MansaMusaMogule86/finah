import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { finahStore } from '../../services/api';
import { BridalInquiry } from '../../types';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { X, Crown, Calendar, Users, Phone, Mail, CheckCircle, Sparkles } from 'lucide-react';

interface BridalInquiryModalProps {
  onClose: () => void;
}

export const BridalInquiryModal: React.FC<BridalInquiryModalProps> = ({ onClose }) => {
  const { t, isArabic, language } = useLanguage();

  const [brideName, setBrideName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'حمام العروس الملكي',
    'قناع العكر الفاسي والغاسول الأبيض'
  ]);
  const [notes, setNotes] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState<BridalInquiry | null>(null);

  const availableOptions = [
    { id: 'hammam', label: isArabic ? 'حمام العروس الملكي الخاص بالأركان والعنبر' : 'Private Royal Amber & Argan Hammam' },
    { id: 'facial', label: isArabic ? 'نضارة الوجه بماء الورد الدمشقي والتين الشوكي' : 'Damask Rose & Prickly Pear Facial Glow' },
    { id: 'body', label: isArabic ? 'قناع العكر الفاسي وتفتيح الجسم وتدليك الاسترخاء' : 'Aker Fassi Body Brightening & Restorative Massage' },
    { id: 'hair', label: isArabic ? 'جلسة الأركان وترميم وتصفيف شعر العروس' : 'Argan Hair Therapy & Bridal Styling' }
  ];

  const handleToggleOption = (label: string) => {
    if (selectedServices.includes(label)) {
      setSelectedServices(selectedServices.filter(s => s !== label));
    } else {
      setSelectedServices([...selectedServices, label]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName || !phone || !weddingDate) return;

    const inquiry = finahStore.submitBridalInquiry({
      brideName,
      phone,
      email: email || `${phone}@bridal.finahbeauty.com`,
      weddingDate,
      preferredAppointmentDate: preferredDate || weddingDate,
      guestCount,
      servicesOfInterest: selectedServices,
      languagePreference: language,
      notes
    });

    setSubmittedInquiry(inquiry);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FFF7EA] border border-[#DBC7A6] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#DBC7A6] flex items-center justify-between bg-[#F7E5C8]/40">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#075B60]" />
            <h3 className="font-serif text-lg font-medium text-[#173D3E]">
              {t('bridal.inquire_cta')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#173D3E]/70 hover:text-[#075B60] hover:bg-[#F7E5C8] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-right rtl:text-right ltr:text-left">
          {submittedInquiry ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#075B60] text-white flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono text-[#075B60] tracking-wider mb-1">
                {submittedInquiry.referenceCode}
              </span>
              <h4 className="font-serif text-2xl font-medium text-[#173D3E] mb-2">
                {isArabic ? 'تم استلام طلب استشارة العروس بنجاح' : 'Bridal Consultation Request Received'}
              </h4>
              <p className="text-xs sm:text-sm text-[#173D3E]/80 max-w-md mb-6 leading-relaxed">
                {isArabic
                  ? `ألف مبروك مقدماً يا ${submittedInquiry.brideName}! ستقوم مستشارة الأعراس في فنة بالتواصل معكِ هاتفياً لتنسيق الباقة وتوقيت الجلسة المثالي.`
                  : `Congratulations, ${submittedInquiry.brideName}! Our bridal sanctuary consultant will reach out via phone to curate your tailored schedule and package.`}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors cursor-pointer"
              >
                {t('btn.close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="p-3 bg-[#F7E5C8]/40 border border-[#DBC7A6] rounded-lg text-xs text-[#075B60] leading-relaxed">
                {isArabic
                  ? 'ملاحظة: هذا النموذج لطلب استشارة مخصصة، وليس تأكيد حجز نهائي. سيتم الاتفاق على المواعيد والأسعار بالتنسيق معك.'
                  : 'Note: This form registers a bespoke bridal inquiry, not a confirmed reservation. Specific schedules will be confirmed directly with you.'}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#173D3E] mb-1">
                  {isArabic ? 'اسم العروس الكريم *' : 'Bride Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isArabic ? 'مثال: فاطمة آل مكتوم' : 'e.g. Fatima Al Maktoum'}
                  value={brideName}
                  onChange={e => setBrideName(e.target.value)}
                  className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#173D3E] mb-1">
                    {isArabic ? 'رقم الهاتف (واتساب) *' : 'Phone (WhatsApp) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="+971 50 123 4567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#173D3E] mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    placeholder="bride@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#173D3E] mb-1">
                    {isArabic ? 'تاريخ حفل الزفاف *' : 'Wedding Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={e => setWeddingDate(e.target.value)}
                    className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#173D3E] mb-1">
                    {isArabic ? 'الموعد المفضل لجلسة فنة' : 'Preferred Ritual Date'}
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#173D3E] mb-1">
                  {isArabic ? 'عدد الضيفات (العروس والمرافقات):' : 'Number of Guests (Bride & Companions):'}
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGuestCount(n)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                        guestCount === n
                          ? 'bg-[#075B60] text-white border-[#075B60]'
                          : 'bg-[#FFF7EA] border-[#DBC7A6] text-[#173D3E] hover:bg-[#F7E5C8]'
                      }`}
                    >
                      {n === 1 ? (isArabic ? 'العروس وحدها' : 'Bride Only') : `${n} ${isArabic ? 'ضيفات' : 'Guests'}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#173D3E] mb-2">
                  {isArabic ? 'الطقوس والخدمات المرغوبة:' : 'Rituals of Interest:'}
                </label>
                <div className="flex flex-col gap-2">
                  {availableOptions.map(opt => {
                    const isChecked = selectedServices.includes(opt.label);
                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleToggleOption(opt.label)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-[#F7E5C8]/50 border-[#075B60] text-[#075B60] font-medium'
                            : 'bg-[#FFF7EA] border-[#DBC7A6] text-[#173D3E]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-[#075B60]"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#173D3E] mb-1">
                  {isArabic ? 'أي استفسار أو تفضيلات خاصة' : 'Special Notes or Questions'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isArabic ? 'اكتبي أي تفاصيل تودين إخبارنا بها...' : 'Any details for our bridal consultant...'}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#FFF7EA] border border-[#DBC7A6] rounded-lg text-sm text-[#173D3E] focus:outline-none focus:border-[#075B60]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-[#075B60] hover:bg-[#064a4e] rounded-md transition-colors cursor-pointer"
                >
                  {isArabic ? 'إرسال طلب استشارة العروس' : 'Send Bridal Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
