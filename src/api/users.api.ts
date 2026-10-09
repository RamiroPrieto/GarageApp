import { apiFetch } from './api';

export type ProfileUpdate = {
  firstName: string;
  lastName: string;
  phone: string | null;
  profileImage: string | null;
};

export function updateMyProfile(data: ProfileUpdate) {
  return apiFetch('/users/me', { method: 'PATCH', body: JSON.stringify(data) });
}

export function sendSupportRequest(subject: string, message: string) {
  return apiFetch('/users/support', { method: 'POST', body: JSON.stringify({ subject, message }) });
}
