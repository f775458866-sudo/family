# مركز أمان العائلة - Family Safety Hub

تطبيق شامل لحماية وتتبع أفراد العائلة مع ميزات أمنية متقدمة وإمكانيات التقاط الأدلة.

## المميزات الرئيسية

- 🔐 **نظام مصادقة آمن** مع التحقق من البريد الإلكتروني
- 📍 **تتبع الموقع الجغرافي** لأفراد العائلة  
- 📷 **التقاط الأدلة الأمنية** باستخدام الكاميرا الأمامية
- 🚨 **إنذارات الطوارئ** مع إجراءات فورية
- 🔒 **قفل الجهاز الآمن** مع حماية متقدمة
- 📧 **إرسال تقارير أمنية** عبر البريد الإلكتروني

## متطلبات التشغيل

**المتطلبات الأساسية:**
- Node.js (الإصدار 16 أو أحدث)
- npm أو yarn
- متصفح حديث يدعم WebRTC والكاميرا

## التثبيت والإعداد

### 1. تثبيت المشروع

```bash
# استنساخ المستودع
git clone https://github.com/f775458866-sudo/family.git
cd family

# تثبيت التبعيات
npm install

# تثبيت الحزم المطلوبة لميزة التقاط الأدلة
npm install @capacitor/camera @capacitor/core
```

### 2. إعداد Capacitor (للتطبيقات المحمولة)

```bash
# تثبيت Capacitor CLI
npm install -g @capacitor/cli

# تهيئة Capacitor
npx cap init

# إضافة منصات الهواتف المحمولة
npx cap add android
npx cap add ios

# مزامنة الملفات
npx cap sync
```

### 3. إعداد الأذونات المطلوبة

#### أذونات Android (`android/app/src/main/AndroidManifest.xml`):

```xml
<!-- أذونات الكاميرا -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- أذونات الموقع -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-feature android:name="android.hardware.location" android:required="true" />
<uses-feature android:name="android.hardware.location.gps" android:required="true" />

<!-- أذونات الإنترنت -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- أذونات Device Admin (للميزات المتقدمة) -->
<uses-permission android:name="android.permission.BIND_DEVICE_ADMIN" />
```

#### أذونات iOS (`ios/App/App/Info.plist`):

```xml
<key>NSCameraUsageDescription</key>
<string>يحتاج التطبيق للوصول للكاميرا لالتقاط الأدلة الأمنية</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>يحتاج التطبيق للوصول للموقع لتحديد مكان الأحداث الأمنية</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>يحتاج التطبيق للوصول لمكتبة الصور لحفظ الأدلة الأمنية</string>
```

### 4. تشغيل التطبيق

```bash
# تشغيل خادم التطوير
npm run dev

# بناء التطبيق للإنتاج
npm run build

# معاينة البناء
npm run preview
```

### 5. إعداد API الخارجي (اختياري)

لإرسال الأدلة الأمنية، قم بتحديث ملف `src/utils/evidence.ts`:

```typescript
// استبدل الرابط الوهمي برابط API حقيقي
const API_ENDPOINT = 'https://your-api.com/evidence/send';

// أضف مفتاح API الخاص بك
const API_KEY = 'your-api-key-here';
```

## ميزات Device Admin وقفل الأزرار

⚠️ **ملاحظة مهمة:** ميزات Device Admin وقفل الأزرار المادية تتطلب كود Native إضافي.

### الميزات المتقدمة التي تتطلب كود Native:

1. **قفل أزرار الطاقة والصوت**
2. **تشغيل البيانات قسراً**
3. **منع إلغاء تثبيت التطبيق**
4. **قفل الجهاز بالكامل**

لتنفيذ هذه الميزات، راجع دليل [إعداد Device Admin للأندرويد](android/device-admin-setup.md).

## استخدام مكون التقاط الأدلة

```typescript
import { CaptureEvidenceButton } from './src/components/CaptureEvidenceButton';

// استخدام بسيط
<CaptureEvidenceButton 
  recipientEmail="security@example.com"
  onCaptureComplete={(success) => {
    if (success) {
      console.log('تم التقاط الأدلة بنجاح');
    }
  }}
/>

// استخدام متقدم
<CaptureEvidenceButton 
  recipientEmail="admin@company.com"
  style={{ backgroundColor: '#e74c3c' }}
  onCaptureStart={() => console.log('بدء التقاط الأدلة')}
  onCaptureComplete={(success) => console.log('انتهاء التقاط الأدلة:', success)}
  onCaptureError={(error) => console.error('خطأ:', error)}
/>
```

## استخدام دالة التقاط الأدلة مباشرة

```typescript
import { captureEvidenceAndSendEmail } from './src/utils/evidence';

// التقاط وإرسال الأدلة
const handleEmergency = async () => {
  const success = await captureEvidenceAndSendEmail('security@example.com');
  if (success) {
    console.log('تم إرسال الأدلة بنجاح');
  }
};
```

## البناء للإنتاج

### بناء تطبيق الويب:
```bash
npm run build
```

### بناء تطبيق Android:
```bash
npx cap copy
npx cap sync android
npx cap open android
```

### بناء تطبيق iOS:
```bash
npx cap copy  
npx cap sync ios
npx cap open ios
```

## استكشاف الأخطاء

### مشاكل شائعة:

1. **الكاميرا لا تعمل:**
   - تأكد من منح أذونات الكاميرا
   - تحقق من دعم المتصفح للكاميرا
   - استخدم HTTPS في الإنتاج

2. **مشاكل الأذونات:**
   - راجع ملف AndroidManifest.xml
   - تأكد من طلب الأذونات في الكود
   - اختبر على جهاز حقيقي وليس محاكي

3. **مشاكل البناء:**
   - تأكد من إصدار Node.js المناسب
   - امسح node_modules وأعد التثبيت
   - تحقق من إعدادات TypeScript

## المساهمة

نرحب بالمساهمات! يرجى:
1. إنشاء fork للمستودع
2. إنشاء branch جديد للميزة
3. إضافة الاختبارات المناسبة
4. إرسال Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

للدعم والمساعدة:
- افتح issue في GitHub
- راجع [دليل Device Admin](android/device-admin-setup.md)
- تحقق من الوثائق في مجلد `docs/`
