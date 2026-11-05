/**
 * GoDuet Fast2SMS Gateway Architecture
 * Status: Prepared for Phase 1. Paid services are DISABLED by default.
 * Activation requires explicit administrative approval and FAST2SMS_API_KEY.
 */

export interface SMSDispatchResult {
  success: boolean;
  messageId?: string;
  isSimulated: boolean;
  statusText: string;
}

const FAST2SMS_ENDPOINT = 'https://www.fast2sms.com/dev/bulkV2';

/**
 * Normalizes Indian mobile numbers to 10 digits
 */
export function normalizeIndianPhoneNumber(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return digits;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    const national = digits.slice(2);
    if (/^[6-9]\d{9}$/.test(national)) return national;
  }
  return null;
}

/**
 * Dispatches transactional OTP to an Indian mobile number
 * Respects feature flag: ENABLE_LIVE_SMS_BILLING
 */
export async function sendOtpViaFast2SMS(
  phone: string,
  otpCode: string
): Promise<SMSDispatchResult> {
  const normalizedPhone = normalizeIndianPhoneNumber(phone);
  if (!normalizedPhone) {
    return {
      success: false,
      isSimulated: false,
      statusText: 'Invalid Indian mobile number format. Expected 10 digits starting with 6-9.',
    };
  }

  const isLiveBillingEnabled = process.env.ENABLE_LIVE_SMS_BILLING === 'true';
  const apiKey = process.env.FAST2SMS_API_KEY;

  // SAFETY GUARD: Do not execute live HTTP requests or trigger billable SMS without approval
  if (!isLiveBillingEnabled || !apiKey || apiKey.includes('placeholder')) {
    console.log(
      `[FAST2SMS ARCHITECTURE: SIMULATION MODE] OTP for ${normalizedPhone}: ${otpCode} (Billing disabled)`
    );
    return {
      success: true,
      messageId: `SIM-F2S-${Date.now()}`,
      isSimulated: true,
      statusText: 'OTP simulated successfully in sandbox mode. Zero SMS balance consumed.',
    };
  }

  // Live Gateway Execution (Activated ONLY upon explicit approval)
  try {
    const response = await fetch(FAST2SMS_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otpCode,
        numbers: normalizedPhone,
      }),
    });

    const data = await response.json();
    if (data.return === true) {
      return {
        success: true,
        messageId: data.request_id || `F2S-${Date.now()}`,
        isSimulated: false,
        statusText: 'OTP dispatched via Fast2SMS telecom route.',
      };
    } else {
      return {
        success: false,
        isSimulated: false,
        statusText: data.message?.[0] || 'Fast2SMS gateway returned dispatch error.',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      isSimulated: false,
      statusText: `Network error connecting to Fast2SMS: ${error?.message}`,
    };
  }
}
