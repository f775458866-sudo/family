import React, { useState, useEffect, CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { captureEvidenceAndSendEmail as captureEvidenceAsync } from './src/utils/evidence';
import { CaptureEvidenceButton } from './src/components/CaptureEvidenceButton';

// --- إدارة الحالة والبيانات ---

// استخدام localStorage لمحاكاة قاعدة بيانات المستخدمين
const useStoredState = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error("Error parsing stored state:", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};


// --- دوال محاكاة الوظائف الأصلية ---

const sendVerificationEmail = (recipientEmail) => {
    console.log(`[محاكاة] جاري إرسال بريد إلكتروني للتحقق إلى ${recipientEmail}...`);
    // NATIVE IMPLEMENTATION NOTE:
    // في تطبيق حقيقي، هذا سيستدعي خدمة خلفية (مثل Firebase Functions)
    // لإرسال بريد إلكتروني فعلي باستخدام خدمة مثل SendGrid أو AWS SES.
    alert(`[محاكاة] تم إرسال رسالة تحقق إلى بريدك الإلكتروني (${recipientEmail}).\n\nالرجاء التحقق من صندوق الوارد الخاص بك لإكمال التسجيل.`);
};

const captureEvidenceAndSendEmail = async (recipientEmail) => {
    console.log(`ALERT: Intruder detected. Sending evidence to ${recipientEmail}...`);
    
    try {
        // استخدام الدالة الجديدة من utils/evidence.ts
        const success = await captureEvidenceAsync(recipientEmail);
        
        if (success) {
            alert(`✅ تم التقاط وإرسال الأدلة بنجاح إلى ${recipientEmail}`);
        } else {
            // Fallback: استخدام المحاكاة القديمة في حالة الفشل
            console.log("[محاكاة] الخطوة 1: التحقق من اتصال البيانات والموقع وتفعيلهما...");
            alert(`[محاكاة] تم اكتشاف محاولة دخول خاطئة!\nالخطوة 1: محاولة تشغيل بيانات الهاتف والموقع.`);

            // 2. التقاط صورة بالكاميرا الأمامية
            console.log("[محاكاة] الخطوة 2: التقاط صورة بالكاميرا الأمامية...");
            
            // 3. تسجيل فيديو قصير (10 ثوان) مع الصوت
            console.log("[محاكاة] الخطوة 3: بدء تسجيل فيديو لمدة 10 ثوانٍ...");
            
            // 4. تحديد الموقع الجغرافي
            console.log("[محاكاة] الخطوة 4: تحديد الموقع الجغرافي الحالي...");
            
            // 5. إرسال كل شيء عبر البريد الإلكتروني
            console.log(`[محاكاة] الخطوة 5: إرسال الصورة والفيديو والموقع إلى ${recipientEmail}...`);
            alert(`[محاكاة] الخطوات 2-5: \n- تم التقاط صورة. \n- تم تسجيل فيديو. \n- تم تحديد الموقع. \n- جاري إرسال الأدلة إلى ${recipientEmail}.`);
        }
    } catch (error) {
        console.error('خطأ في التقاط الأدلة:', error);
        alert(`❌ فشل في التقاط الأدلة: ${error.message || 'خطأ غير متوقع'}`);
    }
};

const disableHardwareButtons = () => {
    console.log("[محاكاة] تم قفل أزرار الطاقة والصوت.");
    alert("[محاكاة] تم تفعيل قفل أزرار الطاقة والصوت المادية.");
};

const enableHardwareButtons = () => {
    console.log("[محاكاة] تم إعادة تفعيل أزرار الطاقة والصوت.");
};

// --- شاشة القفل الآمنة (بديل شاشة قفل الجهاز) ---
const SecureLockScreen = ({ onUnlock, onUnlockFail, ownerEmail }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const correctPin = '1234'; // رمز PIN تجريبي

    const handlePinInput = (num) => {
        if (pin.length < 4) {
            setPin(pin + num);
        }
    };
    
    const handleDelete = () => setPin(pin.slice(0, -1));

    useEffect(() => {
        if (pin.length === 4) {
            if (pin === correctPin) {
                onUnlock();
            } else {
                setError(true);
                onUnlockFail(ownerEmail);
                setTimeout(() => {
                    setPin('');
                    setError(false);
                }, 1000);
            }
        }
    }, [pin]);
    
    // Fix: Explicitly type the styles object to prevent incorrect type inference for CSS properties.
    const styles: { [key: string]: CSSProperties } = {
        lockScreenContainer: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#1c1e21', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', },
        pinDots: { display: 'flex', gap: '20px', margin: '20px 0 40px 0' },
        dot: { width: '16px', height: '16px', borderRadius: '50%', border: '2px solid white', transition: 'background-color 0.2s' },
        keypad: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
        key: { width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer' },
    };

    return (
        <div style={styles.lockScreenContainer}>
            <h3>أدخل رمز PIN</h3>
            <div style={styles.pinDots}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{...styles.dot, backgroundColor: i < pin.length ? 'white' : 'transparent', border: error ? '2px solid #dc3545' : '2px solid white'}}></div>
                ))}
            </div>
            <div style={styles.keypad}>
                {[...Array(9).keys()].map(i => <button key={i+1} style={styles.key} onClick={() => handlePinInput(i+1)}>{i+1}</button>)}
                <div/>
                <button style={styles.key} onClick={() => handlePinInput(0)}>0</button>
                <button style={styles.key} onClick={handleDelete}><span className="material-icons">backspace</span></button>
            </div>
        </div>
    );
};


// --- واجهة تسجيل الدخول وإنشاء الحساب ---
const AuthScreen = ({ onLoginSuccess, users, setUsers }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(u => u.email === email);
        if (user && user.password === password) {
            setError('');
            onLoginSuccess(user);
        } else {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
            if (user) { // البريد موجود ولكن كلمة المرور خاطئة
                // هنا يتم الربط مع إعدادات الدخيل الخاصة بالتطبيق نفسه
                // captureEvidenceAndSendEmail(user.email);
            }
        }
    };
    
    const handleSignUp = (e) => {
        e.preventDefault();
        if (users.some(u => u.email === email)) {
            setError('هذا البريد الإلكتروني مسجل بالفعل.');
            return;
        }
        const newUser = { email, password, devices: initialFamilyMembers, settings: initialSecuritySettings };
        setUsers([...users, newUser]);
        
        // إرسال بريد التحقق (محاكاة)
        sendVerificationEmail(email);

        alert('تم إنشاء الحساب بنجاح! الرجاء التحقق من بريدك الإلكتروني.');
        setIsLoginView(true);
        setError('');
        setEmail('');
        setPassword('');
    };
    
    // Fix: Explicitly type the styles object and remove unnecessary type assertions for CSS properties.
    const styles: { [key: string]: CSSProperties } = {
        container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '20px', boxSizing: 'border-box', },
        box: { padding: '40px 24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '100%', maxWidth: '400px', textAlign: 'center', },
        title: { fontSize: '28px', fontWeight: 700, color: '#1c1e21', marginBottom: '10px', },
        subtitle: { fontSize: '16px', color: '#606770', marginBottom: '30px', },
        input: { width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px', fontSize: '16px', boxSizing: 'border-box', textAlign: 'right', },
        button: { width: '100%', padding: '14px', border: 'none', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', },
        error: { color: '#dc3545', marginTop: '10px', minHeight: '20px' },
        toggleLink: { background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginTop: '20px', fontSize: '14px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h1 style={styles.title}>{isLoginView ? 'مركز أمان العائلة' : 'إنشاء حساب جديد'}</h1>
                <p style={styles.subtitle}>{isLoginView ? 'الرجاء تسجيل الدخول للمتابعة' : 'املأ البيانات لإنشاء حسابك'}</p>
                <form onSubmit={isLoginView ? handleLogin : handleSignUp}>
                    <input type="email" placeholder="البريد الإلكتروني" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required aria-label="البريد الإلكتروني"/>
                    <input type="password" placeholder="كلمة المرور" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required aria-label="كلمة المرور"/>
                    <button type="submit" style={styles.button}>{isLoginView ? 'تسجيل الدخول' : 'إنشاء الحساب'}</button>
                    {error && <p style={styles.error}>{error}</p>}
                </form>
                <button onClick={() => { setIsLoginView(!isLoginView); setError('')}} style={styles.toggleLink}>
                    {isLoginView ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
                </button>
            </div>
        </div>
    );
};


// --- المكونات والبيانات الأولية ---
const initialFamilyMembers = [ { id: 1, name: 'الجهاز الرئيسي', location: 'في المنزل', battery: 85, avatar: '📱', status: 'safe' } ];
const initialSafeZones = [ { id: 1, name: 'المنزل', icon: 'home' }, { id: 2, name: 'المدرسة', icon: 'school' } ];
const initialAlerts = [ { id: 1, message: 'الجهاز الرئيسي وصل إلى المنزل.', time: '5:30 مساءً', icon: 'login' }, { id: 2, message: 'بطارية الجهاز منخفضة (18%).', time: '1:15 مساءً', icon: 'battery_alert', type: 'warning' } ];
const initialSecuritySettings = { secureLockScreen: false, stealthMode: false, lockPowerButton: true };

const commonStyles: { [key: string]: CSSProperties } = {
    card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '16px', },
    cardTitle: { fontSize: '18px', fontWeight: 600, color: '#1c1e21', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', },
    cardTitleIcon: { marginLeft: '8px', color: '#007bff', },
    list: { listStyle: 'none', padding: 0, margin: 0, },
};

// --- شاشات التبويبات ---
const HomeScreen = ({ familyMembers, onMarkAsLost, onAddDevice }) => ( /* ... نفس الكود السابق ... */ 
     <>
        <div style={commonStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h2 style={{...commonStyles.cardTitle, margin: 0}}>
                    <span className="material-icons" style={commonStyles.cardTitleIcon}>people</span>
                    الأجهزة المراقبة
                </h2>
                <button onClick={onAddDevice} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                     <span className="material-icons" style={{fontSize: '18px'}}>add</span> إضافة
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {familyMembers.map(member => (
                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <div style={{ fontSize: '24px', marginLeft: '12px', width: '40px', height: '40px', display: 'grid', placeItems: 'center', backgroundColor: '#e4e6eb', borderRadius: '50%' }}>{member.avatar}</div>
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ fontWeight: 500 }}>{member.name}</div>
                            <div style={{ fontSize: '14px', color: '#606770' }}>{member.location}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                             <button style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => onMarkAsLost(member)} aria-label={`الإبلاغ عن فقدان جهاز ${member.name}`}>
                                <span className="material-icons" style={{ fontSize: '18px' }}>report_problem</span>
                            </button>
                            <span className="material-icons" style={{ fontSize: '18px', marginLeft: '4px', color: member.battery > 20 ? '#28a745' : '#dc3545' }}>{member.battery > 95 ? 'battery_full' : member.battery > 20 ? 'battery_std' : 'battery_alert'}</span>
                            {member.battery}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div style={commonStyles.card}>
            <h2 style={commonStyles.cardTitle}><span className="material-icons" style={commonStyles.cardTitleIcon}>shield</span>المناطق الآمنة</h2>
            <ul style={commonStyles.list}>
                {initialSafeZones.map(zone => (<li key={zone.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}><span className="material-icons" style={{marginLeft: '12px', color: '#606770'}}>{zone.icon}</span><span>{zone.name}</span></li>))}
            </ul>
        </div>
    </>
);
const MapScreen = () => {  /* ... نفس الكود السابق ... */ 
    const [userLocation, setUserLocation] = useState('جاري تحديد الموقع...');
     useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => { setUserLocation(`خط العرض: ${position.coords.latitude.toFixed(4)}, خط الطول: ${position.coords.longitude.toFixed(4)}`); },
                () => { setUserLocation('تم رفض الإذن. يرجى تفعيل خدمات الموقع.'); },
                { enableHighAccuracy: true }
            );
        } else { setUserLocation('الموقع الجغرافي غير مدعوم في هذا المتصفح.'); }
    }, []);
    return (
        <div style={commonStyles.card}>
            {/* Fix: Removed unnecessary type assertion for flexDirection. */}
            <div style={{ height: 'calc(100vh - 220px)', backgroundColor: '#e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#606770', fontSize: '16px', flexDirection: 'column', textAlign: 'center', background: 'url(https://maps.googleapis.com/maps/api/staticmap?center=Mecca&zoom=13&size=600x300&maptype=roadmap&key=YOUR_API_KEY) center/cover' }} aria-label="خريطة تعرض مواقع أفراد العائلة">عرض الخريطة</div>
            <div style={{ fontSize: '12px', color: '#606770', marginTop: '8px', padding: '8px', backgroundColor: '#f0f2f5', borderRadius: '6px', textAlign: 'center' }}>موقعك الحالي: <strong>{userLocation}</strong><br/>مشاركة الموقع تتطلب موافقة جميع الأفراد.</div>
        </div>
    );
};
const AlertsScreen = () => ( /* ... نفس الكود السابق ... */ 
    <div style={commonStyles.card}>
        <ul style={commonStyles.list}>
            {initialAlerts.map(alert => (
               <li key={alert.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f2f5' }}>
                   <span className="material-icons" style={{ marginLeft: '16px', color: alert.type === 'warning' ? '#ffc107' : '#606770' }}>{alert.icon}</span>
                   <span style={{ flexGrow: 1 }}>{alert.message}</span>
                   <span style={{ fontSize: '12px', color: '#606770' }}>{alert.time}</span>
               </li>
            ))}
        </ul>
    </div>
);
const SettingsScreen = ({ settings, onSettingsChange }) => {
    
    const handleCaptureEvidence = async () => {
        try {
            console.log('🔄 بدء التقاط الأدلة الأمنية');
            const success = await captureEvidenceAsync('security@example.com');
            if (success) {
                console.log('✅ تم التقاط وإرسال الأدلة بنجاح');
                alert('✅ تم التقاط وإرسال الأدلة بنجاح');
            } else {
                console.log('❌ فشل في التقاط الأدلة');
                alert('❌ فشل في التقاط الأدلة');
            }
        } catch (error) {
            console.error('🚨 خطأ في التقاط الأدلة:', error);
            alert('🚨 خطأ في التقاط الأدلة: ' + error.message);
        }
    };

    return (
    <>
        <div style={commonStyles.card}>
            <h2 style={commonStyles.cardTitle}><span className="material-icons" style={commonStyles.cardTitleIcon}>security</span>إعدادات الحماية الأساسية</h2>
             <ul style={commonStyles.list}>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                    <div>
                        <div style={{fontWeight: 500}}>تفعيل شاشة القفل الآمنة</div>
                        <div style={{fontSize: '14px', color: '#606770'}}>استبدال شاشة قفل الجهاز بواحدة تلتقط الأدلة</div>
                    </div>
                    <label className="switch"><input type="checkbox" checked={settings.secureLockScreen} onChange={e => onSettingsChange('secureLockScreen', e.target.checked)} /><span className="slider round"></span></label>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                        <div style={{fontWeight: 500}}>قفل الأزرار المادية</div>
                        <div style={{fontSize: '14px', color: '#606770'}}>منع إطفاء الجهاز أو تغيير الصوت في وضع الطوارئ</div>
                    </div>
                    <label className="switch"><input type="checkbox" checked={settings.lockPowerButton} onChange={e => onSettingsChange('lockPowerButton', e.target.checked)} /><span className="slider round"></span></label>
                </li>
             </ul>
             {settings.secureLockScreen && (
                <div style={{marginTop: '16px', padding: '12px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', fontSize: '14px', color: '#8a6d3b'}}>
                   <strong>ملاحظة هامة:</strong> يتطلب هذا الإذن صلاحية "مسؤول الجهاز" (Device Administrator) في تطبيق أندرويد الحقيقي ليعمل بشكل صحيح.
                </div>
            )}
        </div>
        <div style={commonStyles.card}>
            <h2 style={commonStyles.cardTitle}><span className="material-icons" style={commonStyles.cardTitleIcon}>camera_alt</span>اختبار ميزة التقاط الأدلة</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ fontSize: '14px', color: '#606770', lineHeight: '1.5' }}>
                    <strong>ميزة جديدة:</strong> التقاط صورة أمنية بالكاميرا الأمامية وإرسالها عبر API خارجي.
                    <br/>
                    <em>ملاحظة: هذه الميزة تتطلب أذونات الكاميرا والموقع.</em>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            maxWidth: '300px'
                        }}
                        onClick={handleCaptureEvidence}
                    >
                        <span className="material-icons">security</span>
                        التقاط أدلة أمنية
                    </button>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '12px', color: '#495057' }}>
                    <strong>للمطورين:</strong> يمكن تخصيص API endpoint في ملف <code>src/utils/evidence.ts</code>
                    <br/>
                    لتفعيل الميزات المتقدمة، راجع دليل <a href="android/device-admin-setup.md" style={{ color: '#007bff' }}>إعداد Device Admin</a>
                </div>
            </div>
        </div>
        <div style={commonStyles.card}>
            <h2 style={commonStyles.cardTitle}><span className="material-icons" style={commonStyles.cardTitleIcon}>visibility_off</span>وضع التخفي</h2>
             <ul style={commonStyles.list}>
                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                        <div style={{fontWeight: 500}}>إخفاء أيقونة التطبيق</div>
                        <div style={{fontSize: '14px', color: '#606770'}}>سيتم إخفاء التطبيق من القائمة</div>
                    </div>
                    <label className="switch"><input type="checkbox" checked={settings.stealthMode} onChange={e => onSettingsChange('stealthMode', e.target.checked)} /><span className="slider round"></span></label>
                </li>
            </ul>
            {settings.stealthMode && (
                <div style={{marginTop: '16px', padding: '12px', backgroundColor: '#e9f5ff', border: '1px solid #b3d7ff', borderRadius: '8px', fontSize: '14px', color: '#004085'}}>
                    <strong>ملاحظة:</strong> لفتح التطبيق بعد إخفائه، افتح تطبيق الاتصال واطلب الرمز:
                    <div style={{textAlign: 'center', margin: '8px 0', fontWeight: 'bold', letterSpacing: '2px'}}>#*#*12345*#*#</div>
                </div>
            )}
        </div>
    </>
    );
};

const EmergencyModal = ({ device, onClose, onAction, settings }) => { /* ... نفس الكود السابق ... */ 
     useEffect(() => {
        if (settings.lockPowerButton) {
            disableHardwareButtons();
        }
        return () => {
            if (settings.lockPowerButton) {
                enableHardwareButtons();
            }
        };
    }, [settings.lockPowerButton]);

    return (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div style={{...commonStyles.card, width: '100%', maxWidth: '500px', marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                    <h2 style={{...commonStyles.cardTitle, margin: 0, color: '#d9363e'}}><span className="material-icons" style={{ marginLeft: '8px', color: '#d9363e' }}>warning</span>وضع الطوارئ: {device.name}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#606770' }} aria-label="إغلاق وضع الطوارئ">&times;</button>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                   <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', fontSize: '16px', justifyContent: 'center' }} onClick={() => onAction('photo')}>
                        <span className="material-icons">photo_camera</span> طلب صورة أمنية
                   </button>
                   <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', fontSize: '16px', justifyContent: 'center' }} onClick={() => onAction('sound')}>
                        <span className="material-icons">volume_up</span> تشغيل صوت إنذار
                   </button>
                   <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#ffc107', color: '#212529', fontSize: '16px', justifyContent: 'center' }} onClick={() => onAction('message')}>
                        <span className="material-icons">message</span> إظهار رسالة على الشاشة
                   </button>
                </div>
            </div>
        </div>
    );
};

// --- لوحة التحكم الرئيسية ---
const Dashboard = ({ user, onUserUpdate }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [lostDevice, setLostDevice] = useState(null);
    const { devices, settings } = user;
    const setDevices = (newDevices) => onUserUpdate({ ...user, devices: newDevices });
    const setSettings = (newSettings) => onUserUpdate({ ...user, settings: newSettings });
    
    const tabTitles = { home: 'الرئيسية', map: 'الخريطة', alerts: 'التنبيهات', settings: 'الإعدادات' };

    const handleAddDevice = () => {
        const name = prompt("أدخل اسم الجهاز الجديد:");
        if (name) {
            const newDevice = { id: Date.now(), name, location: 'غير معروف', battery: 100, avatar: '📱', status: 'safe' };
            setDevices([...devices, newDevice]);
        }
    };
    
    const handleSettingsChange = (key, value) => {
        setSettings({...settings, [key]: value});
    };
    
    const handleEmergencyAction = (action) => { /* ... نفس الكود السابق ... */ 
        switch(action) {
            case 'photo':
                alert(`إجراء الطوارئ: تم إرسال طلب لالتقاط صورة من جهاز "${lostDevice.name}".`);
                break;
            case 'sound':
                alert(`إجراء الطوارئ: تم إرسال أمر تشغيل صوت إنذار على جهاز "${lostDevice.name}".`);
                break;
            case 'message':
                 const msg = prompt("اكتب الرسالة التي تريد عرضها:", "هذا الجهاز مفقود. الرجاء الاتصال.");
                 if (msg) { alert(`إجراء الطوارئ: تم إرسال رسالة إلى جهاز "${lostDevice.name}".\nالرسالة: ${msg}`); }
                break;
            default: break;
        }
    };
    
    const styles: { [key: string]: CSSProperties } = {
        dashboard: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5', },
        header: { backgroundColor: '#ffffff', padding: '16px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10, },
        headerTitle: { fontSize: '22px', fontWeight: 600, color: '#1c1e21', margin: 0, textAlign: 'center', },
        content: { flexGrow: 1, padding: '16px', overflowY: 'auto', paddingBottom: '80px', },
        bottomNav: { position: 'fixed', bottom: 0, right: 0, left: 0, display: 'flex', justifyContent: 'space-around', backgroundColor: '#ffffff', boxShadow: '0 -2px 5px rgba(0,0,0,0.1)', padding: '8px 0', zIndex: 10, },
        navButton: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '4px 12px', borderRadius: '8px', transition: 'color 0.2s', },
    };

    return (
        <div style={styles.dashboard}>
             <style>{`
                .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
                input:checked + .slider { background-color: #2196F3; }
                input:checked + .slider:before { transform: translateX(22px); }
                .slider.round { border-radius: 34px; }
                .slider.round:before { border-radius: 50%; }
            `}</style>
            <header style={styles.header}> <h1 style={styles.headerTitle}>{tabTitles[activeTab]}</h1> </header>
            <main style={styles.content}>
                {activeTab === 'home' && <HomeScreen familyMembers={devices} onMarkAsLost={setLostDevice} onAddDevice={handleAddDevice} />}
                {activeTab === 'map' && <MapScreen />}
                {activeTab === 'alerts' && <AlertsScreen />}
                {activeTab === 'settings' && <SettingsScreen settings={settings} onSettingsChange={handleSettingsChange}/>}
            </main>
            {lostDevice && <EmergencyModal device={lostDevice} onClose={() => setLostDevice(null)} onAction={handleEmergencyAction} settings={settings} />}
            <nav style={styles.bottomNav}>
                <button style={{...styles.navButton, color: activeTab === 'home' ? '#007bff' : '#606770' }} onClick={() => setActiveTab('home')}> <span className="material-icons">home</span> الرئيسية </button>
                <button style={{...styles.navButton, color: activeTab === 'map' ? '#007bff' : '#606770' }} onClick={() => setActiveTab('map')}> <span className="material-icons">map</span> الخريطة </button>
                <button style={{...styles.navButton, color: activeTab === 'alerts' ? '#007bff' : '#606770' }} onClick={() => setActiveTab('alerts')}> <span className="material-icons">notifications</span> التنبيهات </button>
                <button style={{...styles.navButton, color: activeTab === 'settings' ? '#007bff' : '#606770' }} onClick={() => setActiveTab('settings')}> <span className="material-icons">settings</span> الإعدادات </button>
            </nav>
        </div>
    );
};

// --- المكون الرئيسي للتطبيق ---
const App = () => {
    const [users, setUsers] = useStoredState('family-app-users', []);
    const [currentUser, setCurrentUser] = useStoredState('family-app-currentUser', null);
    const [isDeviceLocked, setDeviceLocked] = useState(true);

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
    };

    const handleUserUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.email === updatedUser.email ? updatedUser : u));
    };

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW reg failed: ', err));
            });
        }
    }, []);

    // المنطق الرئيسي لعرض الواجهات
    if (currentUser && currentUser.settings.secureLockScreen && isDeviceLocked) {
        return <SecureLockScreen 
                    onUnlock={() => setDeviceLocked(false)} 
                    onUnlockFail={captureEvidenceAndSendEmail}
                    ownerEmail={currentUser.email}
                />;
    }

    if (currentUser) {
        return <Dashboard user={currentUser} onUserUpdate={handleUserUpdate} />;
    }
    
    return <AuthScreen onLoginSuccess={handleLoginSuccess} users={users} setUsers={setUsers} />;
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);