import { Toaster, toast } from 'react-hot-toast';

export function notifySuccess(message) {
  toast.success(message);
}

export function notifyError(message) {
  toast.error(message);
}

export function notifyInfo(message) {
  toast(message, { icon: 'i' });
}

export default function ToastPortal() {
  return <Toaster position="top-right" />;
}
