import { apiFetch } from './api';

export type ProfileUpdate = {
  firstName: string;
  lastName: string;
  profileImage: string | null;
};

export function updateMyProfile(data: ProfileUpdate) {
  return apiFetch('/users/me', { method: 'PATCH', body: JSON.stringify(data) });
}

export function requestPhoneChange(phone: string) {
  return apiFetch<{ sent: boolean; alreadyVerified?: boolean }>('/users/me/phone-verification/request', { method: 'POST', body: JSON.stringify({ phone }) });
}

export function confirmPhoneChange(code: string) {
  return apiFetch('/users/me/phone-verification/confirm', { method: 'POST', body: JSON.stringify({ code }) });
}

export function sendSupportRequest(subject: string, message: string) {
  return apiFetch('/users/support', { method: 'POST', body: JSON.stringify({ subject, message }) });
}
