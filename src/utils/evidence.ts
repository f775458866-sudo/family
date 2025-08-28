import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

/**
 * دالة التقاط الأدلة وإرسالها عبر البريد الإلكتروني
 * تلتقط صورة بالكاميرا الأمامية وترسلها إلى API خارجي
 * 
 * @param recipientEmail البريد الإلكتروني للمستلم
 * @returns Promise<boolean> نجح التقاط وإرسال الأدلة أم لا
 */
export const captureEvidenceAndSendEmail = async (recipientEmail: string): Promise<boolean> => {
    try {
        console.log(`ALERT: Intruder detected. Capturing evidence and sending to ${recipientEmail}...`);
        
        // 1. التحقق من صلاحيات الكاميرا
        console.log("[التقاط الأدلة] الخطوة 1: التحقق من صلاحيات الكاميرا...");
        
        // 2. التقاط صورة بالكاميرا الأمامية
        console.log("[التقاط الأدلة] الخطوة 2: التقاط صورة بالكاميرا الأمامية...");
        
        const image: Photo = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Camera,
            // محاولة استخدام الكاميرا الأمامية إذا كانت متاحة
            direction: 'front' as any, // استخدام any لأن TypeScript قد لا يتعرف على هذا الخيار
        });

        if (!image.dataUrl) {
            throw new Error('فشل في التقاط الصورة');
        }

        console.log("[التقاط الأدلة] الخطوة 3: تم التقاط الصورة بنجاح");

        // 3. إعداد بيانات الصورة للإرسال
        const evidenceData = {
            image: image.dataUrl,
            timestamp: new Date().toISOString(),
            location: await getCurrentLocation(),
            deviceInfo: await getDeviceInfo(),
            recipientEmail: recipientEmail
        };

        // 4. إرسال الأدلة إلى API خارجي
        console.log("[التقاط الأدلة] الخطوة 4: إرسال الأدلة إلى الخادم...");
        
        const success = await sendEvidenceToAPI(evidenceData);
        
        if (success) {
            console.log(`[التقاط الأدلة] تم إرسال الأدلة بنجاح إلى ${recipientEmail}`);
            return true;
        } else {
            throw new Error('فشل في إرسال الأدلة إلى الخادم');
        }

    } catch (error) {
        console.error('[التقاط الأدلة] خطأ:', error);
        
        // في حالة فشل الكاميرا، نحاول الحصول على معلومات أساسية على الأقل
        try {
            const basicEvidence = {
                timestamp: new Date().toISOString(),
                location: await getCurrentLocation(),
                deviceInfo: await getDeviceInfo(),
                recipientEmail: recipientEmail,
                error: 'فشل في التقاط الصورة - ' + (error as Error).message
            };
            
            await sendEvidenceToAPI(basicEvidence);
            console.log('[التقاط الأدلة] تم إرسال معلومات الطوارئ الأساسية');
            return true;
        } catch (fallbackError) {
            console.error('[التقاط الأدلة] فشل في إرسال معلومات الطوارئ:', fallbackError);
            return false;
        }
    }
};

/**
 * الحصول على الموقع الجغرافي الحالي
 */
async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
    try {
        if ('geolocation' in navigator) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.warn('فشل في الحصول على الموقع:', error);
                        resolve(null);
                    },
                    { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
                );
            });
        }
    } catch (error) {
        console.warn('فشل في الحصول على الموقع:', error);
    }
    return null;
}

/**
 * الحصول على معلومات الجهاز
 */
async function getDeviceInfo(): Promise<any> {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timestamp: new Date().toISOString()
    };
}

/**
 * إرسال الأدلة إلى API خارجي
 * يمكن تخصيص هذه الدالة لاستخدام خدمة معينة
 */
async function sendEvidenceToAPI(evidenceData: any): Promise<boolean> {
    try {
        // TODO: استبدل هذا الرابط الوهمي بـ API حقيقي
        const API_ENDPOINT = 'https://api.example.com/evidence/send';
        
        // محاكاة إرسال البيانات - يجب استبدالها بطلب HTTP حقيقي
        console.log('[API] جاري إرسال البيانات إلى:', API_ENDPOINT);
        console.log('[API] البيانات المرسلة:', {
            recipientEmail: evidenceData.recipientEmail,
            timestamp: evidenceData.timestamp,
            hasImage: !!evidenceData.image,
            location: evidenceData.location,
            deviceInfo: evidenceData.deviceInfo
        });

        // في التطبيق الحقيقي، استخدم fetch أو axios:
        /*
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY'
            },
            body: JSON.stringify(evidenceData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.success || false;
        */

        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // محاكاة نجح الإرسال
        console.log('[API] تم إرسال الأدلة بنجاح (محاكاة)');
        return true;

    } catch (error) {
        console.error('[API] فشل في إرسال الأدلة:', error);
        return false;
    }
}

/**
 * دالة مساعدة للتحقق من دعم الكاميرا
 */
export const isCameraSupported = (): boolean => {
    return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
};

/**
 * دالة مساعدة لطلب صلاحيات الكاميرا
 */
export const requestCameraPermissions = async (): Promise<boolean> => {
    try {
        if (isCameraSupported()) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            // إغلاق الدفق فوراً لأننا نريد فقط التحقق من الصلاحيات
            stream.getTracks().forEach(track => track.stop());
            return true;
        }
        return false;
    } catch (error) {
        console.error('فشل في طلب صلاحيات الكاميرا:', error);
        return false;
    }
};