import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adSlot: string;           // هذا الرقم ستضعه عند الاستخدام
  adFormat?: string;
  adClient?: string;
}

const AdBanner = ({
  adSlot,
  adFormat = 'auto',
  adClient = 'ca-pub-7579351935748180'   // ضع رقم الناشر الصحيح هنا مرة واحدة
}: AdBannerProps) => {
  const adRef = useRef<HTMLInsElement>(null);

  useEffect(() => {
    if (window.adsbygoogle && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <ins
    ref={adRef}
    className="adsbygoogle"
    style={{ display: 'block' }}
    data-ad-client={adClient}      // هذه تستخدم الرقم الذي وضعته أعلاه
    data-ad-slot={adSlot}          // هذه ستستقبل الرقم منك عند الاستخدام
    data-ad-format={adFormat}
    data-full-width-responsive="true"
    />
  );
};

export default AdBanner;
