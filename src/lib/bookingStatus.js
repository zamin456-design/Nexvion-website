export const BOOKING_STATUSES = [
  { value: 'pending', label: 'New' },
  { value: 'reviewing', label: 'In discussion' },
  { value: 'in_development', label: 'In progress' },
  { value: 'testing', label: 'Testing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_ALIASES = {
  new: 'pending',
  in_discussion: 'reviewing',
  in_progress: 'in_development',
};

export function getBookingStatusValue(status) {
  const normalized = String(status || '').toLowerCase().replace(/\s+/g, '_');
  return STATUS_ALIASES[normalized] || normalized;
}

export function getBookingStatusLabel(status) {
  const value = getBookingStatusValue(status);
  return BOOKING_STATUSES.find((item) => item.value === value)?.label || status;
}

export function getBookingStatusStep(status) {
  const value = getBookingStatusValue(status);
  if (value === 'cancelled') return -1;
  return BOOKING_STATUSES.findIndex((item) => item.value === value);
}
