import React, { useState } from 'react';
import { captureEvidenceAndSendEmail, isCameraSupported, requestCameraPermissions } from '../utils/evidence';

interface CaptureEvidenceButtonProps {
    recipientEmail?: string;
    onCaptureStart?: () => void;
    onCaptureComplete?: (success: boolean) => void;
    onCaptureError?: (error: string) => void;
    style?: React.CSSProperties;
    disabled?: boolean;
    className?: string;
}

/**
 * مكون زر التقاط الأدلة
 * يوفر واجهة سهلة لالتقاط وإرسال الأدلة الأمنية
 */
export const CaptureEvidenceButton: React.FC<CaptureEvidenceButtonProps> = ({
    recipientEmail = 'security@example.com',
    onCaptureStart,
    onCaptureComplete,
    onCaptureError,
    style,
    disabled = false,
    className = ''
}) => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);

    // التحقق من دعم الكاميرا عند تحميل المكون
    React.useEffect(() => {
        const checkSupport = async () => {
            if (isCameraSupported()) {
                try {
                    const granted = await requestCameraPermissions();
                    setPermissionsGranted(granted);
                } catch (error) {
                    setPermissionsGranted(false);
                    console.warn('تعذر التحقق من صلاحيات الكاميرا:', error);
                }
            } else {
                setPermissionsGranted(false);
            }
        };

        checkSupport();
    }, []);

    const handleCaptureEvidence = async () => {
        if (isCapturing || disabled) return;

        try {
            setIsCapturing(true);
            onCaptureStart?.();

            // التحقق من الصلاحيات مرة أخرى قبل التقاط الصورة
            if (permissionsGranted === false) {
                const granted = await requestCameraPermissions();
                if (!granted) {
                    throw new Error('لم يتم منح صلاحيات الكاميرا. يرجى السماح بالوصول للكاميرا في إعدادات المتصفح.');
                }
                setPermissionsGranted(true);
            }

            const success = await captureEvidenceAndSendEmail(recipientEmail);
            onCaptureComplete?.(success);

            if (success) {
                alert(`✅ تم التقاط وإرسال الأدلة بنجاح إلى ${recipientEmail}`);
            } else {
                throw new Error('فشل في إرسال الأدلة');
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
            console.error('خطأ في التقاط الأدلة:', error);
            onCaptureError?.(errorMessage);
            alert(`❌ فشل في التقاط الأدلة: ${errorMessage}`);
        } finally {
            setIsCapturing(false);
        }
    };

    const getButtonText = () => {
        if (isCapturing) return 'جاري التقاط الأدلة...';
        if (permissionsGranted === false) return 'الكاميرا غير متاحة';
        return 'التقاط أدلة أمنية';
    };

    const getButtonStyle = (): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: disabled || isCapturing || permissionsGranted === false ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            minWidth: '200px',
            ...style
        };

        if (disabled || permissionsGranted === false) {
            return {
                ...baseStyle,
                backgroundColor: '#6c757d',
                color: 'white',
                opacity: 0.6
            };
        }

        if (isCapturing) {
            return {
                ...baseStyle,
                backgroundColor: '#ffc107',
                color: '#000',
                opacity: 0.8
            };
        }

        return {
            ...baseStyle,
            backgroundColor: '#dc3545',
            color: 'white',
            '&:hover': {
                backgroundColor: '#c82333'
            }
        };
    };

    return (
        <button
            onClick={handleCaptureEvidence}
            disabled={disabled || isCapturing || permissionsGranted === false}
            className={className}
            style={getButtonStyle()}
            title={
                permissionsGranted === false 
                    ? 'الكاميرا غير متاحة أو لم يتم منح الصلاحيات'
                    : `التقاط صورة أمنية وإرسالها إلى ${recipientEmail}`
            }
        >
            <span className="material-icons">
                {isCapturing ? 'hourglass_empty' : permissionsGranted === false ? 'camera_alt_off' : 'security'}
            </span>
            {getButtonText()}
        </button>
    );
};

/**
 * مكون مبسط لالتقاط الأدلة مع إعدادات افتراضية
 */
export const QuickCaptureButton: React.FC<{ recipientEmail: string }> = ({ recipientEmail }) => {
    return (
        <CaptureEvidenceButton
            recipientEmail={recipientEmail}
            style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: '2px solid #c0392b',
                boxShadow: '0 4px 8px rgba(231, 76, 60, 0.3)'
            }}
            onCaptureComplete={(success) => {
                if (success) {
                    console.log('✅ تم التقاط الأدلة بنجاح');
                } else {
                    console.error('❌ فشل في التقاط الأدلة');
                }
            }}
            onCaptureError={(error) => {
                console.error('خطأ في التقاط الأدلة:', error);
            }}
        />
    );
};

export default CaptureEvidenceButton;