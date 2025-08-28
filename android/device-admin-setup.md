# دليل إعداد Device Admin للأندرويد

هذا الدليل يوضح كيفية دمج ميزات Device Admin في تطبيق الأندرويد لتمكين الوظائف الأمنية المتقدمة.

## نظرة عامة

Device Admin API يسمح للتطبيقات بالحصول على صلاحيات إدارية على الجهاز، مما يمكنها من:
- قفل الجهاز
- تطبيق سياسات كلمة المرور
- مسح بيانات الجهاز
- قفل الأزرار المادية
- منع إلغاء تثبيت التطبيق

## الخطوات المطلوبة

### 1. إنشاء Device Admin Receiver

إنشاء ملف `DeviceAdminReceiver.java` في `android/app/src/main/java/your/package/name/`:

```java
package your.package.name;

import android.app.admin.DeviceAdminReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

/**
 * مستقبل أحداث Device Admin
 * يدير الأحداث المتعلقة بتفعيل وإلغاء تفعيل صلاحيات الإدارة
 */
public class FamilySafetyDeviceAdminReceiver extends DeviceAdminReceiver {

    /**
     * يتم استدعاؤها عند تفعيل Device Admin
     */
    @Override
    public void onEnabled(Context context, Intent intent) {
        super.onEnabled(context, intent);
        Toast.makeText(context, "تم تفعيل ميزات الحماية المتقدمة", Toast.LENGTH_SHORT).show();
    }

    /**
     * يتم استدعاؤها عند إلغاء تفعيل Device Admin
     */
    @Override
    public void onDisabled(Context context, Intent intent) {
        super.onDisabled(context, intent);
        Toast.makeText(context, "تم إلغاء تفعيل ميزات الحماية المتقدمة", Toast.LENGTH_SHORT).show();
    }

    /**
     * يتم استدعاؤها عند محاولة إلغاء تفعيل Device Admin
     */
    @Override
    public CharSequence onDisableRequested(Context context, Intent intent) {
        return "إلغاء تفعيل ميزات الحماية سيقلل من أمان التطبيق. هل أنت متأكد؟";
    }

    /**
     * يتم استدعاؤها عند تغيير كلمة مرور الجهاز
     */
    @Override
    public void onPasswordChanged(Context context, Intent intent) {
        super.onPasswordChanged(context, intent);
        // يمكن إضافة منطق إضافي هنا
    }

    /**
     * يتم استدعاؤها عند فشل محاولات كلمة المرور
     */
    @Override
    public void onPasswordFailed(Context context, Intent intent) {
        super.onPasswordFailed(context, intent);
        // يمكن تشغيل إجراءات أمنية هنا
        // مثل التقاط صورة أو إرسال تنبيه
    }

    /**
     * يتم استدعاؤها عند نجاح كلمة المرور
     */
    @Override
    public void onPasswordSucceeded(Context context, Intent intent) {
        super.onPasswordSucceeded(context, intent);
        // إعادة تعيين عداد المحاولات الفاشلة
    }
}
```

### 2. إنشاء ملف XML للسياسات

إنشاء ملف `device_admin_policies.xml` في `android/app/src/main/res/xml/`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<device-admin xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-policies>
        <!-- سياسة قفل الجهاز -->
        <force-lock />
        
        <!-- سياسة مسح البيانات -->
        <wipe-data />
        
        <!-- سياسة تحديد حد أدنى لطول كلمة المرور -->
        <limit-password />
        
        <!-- سياسة مراقبة محاولات كلمة المرور الفاشلة -->
        <watch-login />
        
        <!-- سياسة إعادة تعيين كلمة المرور -->
        <reset-password />
        
        <!-- سياسة انتهاء صلاحية كلمة المرور -->
        <expire-password />
        
        <!-- سياسة تشفير التخزين -->
        <encrypted-storage />
        
        <!-- سياسة تعطيل الكاميرا -->
        <disable-camera />
    </uses-policies>
</device-admin>
```

### 3. تحديث AndroidManifest.xml

إضافة التعريفات التالية إلى `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="your.package.name">

    <!-- أذونات Device Admin -->
    <uses-permission android:name="android.permission.BIND_DEVICE_ADMIN" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    
    <!-- أذونات قفل الأزرار (تتطلب صلاحيات النظام) -->
    <uses-permission android:name="android.permission.PREVENT_POWER_KEY" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

    <application android:label="Family Safety Hub">
        
        <!-- تعريف Device Admin Receiver -->
        <receiver android:name=".FamilySafetyDeviceAdminReceiver"
            android:permission="android.permission.BIND_DEVICE_ADMIN"
            android:exported="true">
            <meta-data android:name="android.app.device_admin"
                android:resource="@xml/device_admin_policies" />
            <intent-filter>
                <action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
                <action android:name="android.app.action.DEVICE_ADMIN_DISABLED" />
                <action android:name="android.app.action.DEVICE_ADMIN_DISABLE_REQUESTED" />
            </intent-filter>
        </receiver>

        <!-- باقي تعريفات التطبيق -->
        <activity android:name=".MainActivity" android:exported="true">
            <!-- ... -->
        </activity>
    </application>
</manifest>
```

### 4. إنشاء Device Admin Manager

إنشاء فئة Java لإدارة وظائف Device Admin في `DeviceAdminManager.java`:

```java
package your.package.name;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

/**
 * مدير وظائف Device Admin
 * يوفر واجهة سهلة للتحكم في ميزات الحماية المتقدمة
 */
public class DeviceAdminManager {
    
    private Context context;
    private DevicePolicyManager devicePolicyManager;
    private ComponentName adminComponent;
    
    public DeviceAdminManager(Context context) {
        this.context = context;
        this.devicePolicyManager = (DevicePolicyManager) context.getSystemService(Context.DEVICE_POLICY_SERVICE);
        this.adminComponent = new ComponentName(context, FamilySafetyDeviceAdminReceiver.class);
    }
    
    /**
     * طلب تفعيل Device Admin
     */
    public void requestAdminPermission() {
        if (!isAdminActive()) {
            Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComponent);
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, 
                "يحتاج التطبيق لصلاحيات الإدارة لتوفير ميزات الحماية المتقدمة");
            context.startActivity(intent);
        }
    }
    
    /**
     * التحقق من تفعيل Device Admin
     */
    public boolean isAdminActive() {
        return devicePolicyManager.isAdminActive(adminComponent);
    }
    
    /**
     * قفل الجهاز فوراً
     */
    public void lockDevice() {
        if (isAdminActive()) {
            devicePolicyManager.lockNow();
        }
    }
    
    /**
     * مسح بيانات الجهاز
     */
    public void wipeDevice() {
        if (isAdminActive()) {
            devicePolicyManager.wipeData(DevicePolicyManager.WIPE_EXTERNAL_STORAGE);
        }
    }
    
    /**
     * تعيين حد أدنى لطول كلمة المرور
     */
    public void setPasswordMinLength(int length) {
        if (isAdminActive()) {
            devicePolicyManager.setPasswordMinimumLength(adminComponent, length);
        }
    }
    
    /**
     * تعيين عدد محاولات كلمة المرور الفاشلة المسموح بها
     */
    public void setMaxFailedPasswordAttempts(int attempts) {
        if (isAdminActive()) {
            devicePolicyManager.setMaximumFailedPasswordsForWipe(adminComponent, attempts);
        }
    }
    
    /**
     * تعطيل الكاميرا
     */
    public void disableCamera(boolean disabled) {
        if (isAdminActive()) {
            devicePolicyManager.setCameraDisabled(adminComponent, disabled);
        }
    }
    
    /**
     * إجبار تشفير التخزين
     */
    public void enableStorageEncryption() {
        if (isAdminActive() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            devicePolicyManager.setStorageEncryption(adminComponent, true);
        }
    }
}
```

### 5. دمج Device Admin مع Capacitor

إنشاء Plugin Capacitor للوصول لوظائف Device Admin من JavaScript:

```java
// FamilySafetyPlugin.java
package your.package.name;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "FamilySafety")
public class FamilySafetyPlugin extends Plugin {
    
    private DeviceAdminManager deviceAdminManager;
    
    @Override
    public void load() {
        deviceAdminManager = new DeviceAdminManager(getContext());
    }
    
    @PluginMethod
    public void requestAdminPermission(PluginCall call) {
        deviceAdminManager.requestAdminPermission();
        call.resolve();
    }
    
    @PluginMethod
    public void isAdminActive(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("isActive", deviceAdminManager.isAdminActive());
        call.resolve(ret);
    }
    
    @PluginMethod
    public void lockDevice(PluginCall call) {
        if (deviceAdminManager.isAdminActive()) {
            deviceAdminManager.lockDevice();
            call.resolve();
        } else {
            call.reject("Device Admin not active");
        }
    }
    
    @PluginMethod
    public void disableHardwareButtons(PluginCall call) {
        // تنفيذ قفل الأزرار المادية
        // ملاحظة: يتطلب صلاحيات النظام أو root
        try {
            // كود قفل الأزرار
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to disable hardware buttons: " + e.getMessage());
        }
    }
}
```

### 6. استخدام Device Admin من JavaScript

```typescript
// في ملف TypeScript الخاص بك
import { Capacitor } from '@capacitor/core';

declare module '@capacitor/core' {
  interface PluginRegistry {
    FamilySafety: FamilySafetyPlugin;
  }
}

interface FamilySafetyPlugin {
  requestAdminPermission(): Promise<void>;
  isAdminActive(): Promise<{ isActive: boolean }>;
  lockDevice(): Promise<void>;
  disableHardwareButtons(): Promise<void>;
}

// استخدام الوظائف
const requestDeviceAdminPermission = async () => {
  try {
    await Capacitor.Plugins.FamilySafety.requestAdminPermission();
    console.log('تم طلب صلاحيات Device Admin');
  } catch (error) {
    console.error('خطأ في طلب صلاحيات Device Admin:', error);
  }
};

const lockDevice = async () => {
  try {
    const { isActive } = await Capacitor.Plugins.FamilySafety.isAdminActive();
    if (isActive) {
      await Capacitor.Plugins.FamilySafety.lockDevice();
      console.log('تم قفل الجهاز');
    } else {
      console.log('صلاحيات Device Admin غير مفعلة');
    }
  } catch (error) {
    console.error('خطأ في قفل الجهاز:', error);
  }
};
```

## ملاحظات مهمة

### قيود Device Admin:
1. **Android 10+**: تم تقييد بعض وظائف Device Admin
2. **أذونات النظام**: بعض الوظائف تتطلب صلاحيات النظام
3. **موافقة المستخدم**: يجب على المستخدم الموافقة على تفعيل Device Admin

### قفل الأزرار المادية:
- يتطلب صلاحيات النظام أو root
- قد لا يعمل على جميع الأجهزة
- ينصح باختبار البديل باستخدام Overlay

### اختبار الوظائف:
1. اختبر على أجهزة حقيقية وليس محاكيات
2. اختبر على إصدارات مختلفة من Android
3. تأكد من وجود معالجة للأخطاء

## أمثلة للاستخدام

### مثال شامل:

```java
// MainActivity.java - إضافة في الـ MainActivity
public class MainActivity extends BridgeActivity {
    
    private DeviceAdminManager deviceAdminManager;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        deviceAdminManager = new DeviceAdminManager(this);
        
        // طلب صلاحيات Device Admin عند بدء التطبيق
        if (!deviceAdminManager.isAdminActive()) {
            deviceAdminManager.requestAdminPermission();
        }
    }
    
    // معالجة نتيجة طلب صلاحيات Device Admin
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == 1) { // Device Admin request
            if (resultCode == RESULT_OK) {
                // تم منح الصلاحيات
                Toast.makeText(this, "تم تفعيل ميزات الحماية المتقدمة", Toast.LENGTH_SHORT).show();
            } else {
                // تم رفض الصلاحيات
                Toast.makeText(this, "تم رفض صلاحيات الحماية المتقدمة", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
```

## استكشاف الأخطاء

### مشاكل شائعة:
1. **عدم ظهور طلب الصلاحيات**: تأكد من إضافة Receiver في AndroidManifest.xml
2. **فشل قفل الجهاز**: تحقق من تفعيل Device Admin
3. **عدم عمل قفل الأزرار**: يتطلب صلاحيات إضافية أو حلول alternative

### نصائح للتطوير:
- استخدم `adb logcat` لمراقبة الأخطاء
- اختبر الوظائف تدريجياً
- احتفظ بنسخة احتياطية قبل الاختبار