import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RosetteEmblem } from '../common/RosetteEmblem';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { finahStore } from '../../services/api';

interface PolicyViewProps {
  type: 'privacy' | 'terms' | 'cancellation';
  onBack: () => void;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ type, onBack }) => {
  const { isArabic } = useLanguage();
  const config = finahStore.getConfig();

  return (
    <section className="py-16 bg-[#FFF7EA] min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right rtl:text-right ltr:text-left">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[#075B60] hover:underline mb-8 cursor-pointer"
        >
          {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isArabic ? 'العودة للصفحة السابقة' : 'Return to previous page'}</span>
        </button>

        <div className="p-8 sm:p-12 bg-[#F7E5C8]/30 border border-[#DBC7A6] rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <RosetteEmblem size={20} color="#075B60" />
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#173D3E]">
              {type === 'privacy' && (isArabic ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy')}
              {type === 'terms' && (isArabic ? 'الشروط والأحكام العامة' : 'General Terms of Service')}
              {type === 'cancellation' && (isArabic ? 'سياسة الإلغاء وإعادة الجدولة' : 'Cancellation & Rescheduling Policy')}
            </h1>
          </div>

          <div className="flex flex-col gap-5 text-xs sm:text-sm text-[#173D3E]/85 leading-relaxed pt-4 border-t border-[#DBC7A6]/60">
            {type === 'privacy' && (
              <>
                <p>
                  {isArabic
                    ? 'في مركز فنة للتجميل المغربي، نلتزم بحماية خصوصية زائراتنا الكرام. يتم استخدام أرقام الهواتف والأسماء المسجلة حصرياً لغايات تأكيد المواعيد، التنسيق عبر واتساب، وإرسال إشعارات التذكير بالزيارة.'
                    : 'At Finah Beauty Moroccan House, we are committed to safeguarding guest privacy. Contact numbers and guest names are utilized solely for scheduling verification, WhatsApp coordination, and visit reminders.'}
                </p>
                <p>
                  {isArabic
                    ? 'لا نقوم بمشاركة بيانات التواصل أو الملاحظات الصحية والتفضيلات الشخصية مع أي طرف ثالث تجاري.'
                    : 'We do not sell, rent, or share personal contact records, health sensitivities, or treatment notes with external marketing parties.'}
                </p>
              </>
            )}

            {type === 'terms' && (
              <>
                <p>
                  {isArabic
                    ? 'تم تصميم خدمات فنة خصيصاً لتوفير ملاذ أنثوي هادئ ومريح وفق التقاليد المغربية الأصيلة.'
                    : 'Finah Beauty services are crafted to deliver an intimate feminine sanctuary respecting traditional Moroccan heritage.'}
                </p>
                <p>
                  {isArabic
                    ? 'نرجو من ضيفاتنا الكرام الوصول قبل 15 دقيقة من الموعد لضمان الاستمتاع بكامل وقت الجلسة دون اقتطاع.'
                    : 'Guests are kindly advised to arrive 15 minutes before the scheduled time to enjoy their complete ritual duration without rush.'}
                </p>
              </>
            )}

            {type === 'cancellation' && (
              <>
                <p>
                  {isArabic
                    ? `تتيح فنة إمكانية إلغاء أو إعادة جدولة المواعيد ذاتياً وبشكل مجاني بالكامل قبل ${config.policies.cancellationWindowHours} ساعة على الأقل من وقت الموعد المحدد، وذلك عبر صفحة "حجوزاتي" باستخدام رقم الهاتف المسجل.`
                    : `Finah allows complimentary self-service rescheduling and cancellation up to ${config.policies.cancellationWindowHours} hours prior to your scheduled slot via the "My Bookings" page using your contact phone.`}
                </p>
                <p>
                  {isArabic
                    ? 'في حال الرغبة في التعديل خلال أقل من 24 ساعة، يُرجى التواصل مباشرة مع مكتب الاستقبال عبر الواتساب لتنسيق البدائل المتاحة.'
                    : 'For modifications requested under 24 hours prior, please contact our reception concierge directly via WhatsApp to discuss available alternatives.'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
