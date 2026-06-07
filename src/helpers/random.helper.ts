export function randomString(prefix = 'auto'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function randomPrice(min = 1, max = 1000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDate(daysFromNow = 1, maxDaysRange = 30): string {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * maxDaysRange) + daysFromNow;
  const date = new Date(today.setDate(today.getDate() + randomDays));
  return date.toISOString().split('T')[0];
}

export function randomBookingDates(): { checkin: string; checkout: string } {
  const today = new Date();
  
  // Generate random checkin date: 1-30 days from now
  const checkinDays = Math.floor(Math.random() * 30) + 1;
  const checkinDate = new Date(today);
  checkinDate.setDate(checkinDate.getDate() + checkinDays);
  
  // Generate checkout date: checkin date + 1 to 14 days (ensuring checkout > checkin)
  const checkoutDays = Math.floor(Math.random() * 14) + 1;
  const checkoutDate = new Date(checkinDate);
  checkoutDate.setDate(checkoutDate.getDate() + checkoutDays);
  
  return {
    checkin: checkinDate.toISOString().split('T')[0],
    checkout: checkoutDate.toISOString().split('T')[0],
  };
}

export function randomAdditionalNeeds(): string {
  const needs = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Airport Transfer',
    'Pet Friendly',
    'Late Checkout',
    'Extra Bed',
    'High Floor',
    'Smoking Room',
    'Non-Smoking Room',
  ];
  return needs[Math.floor(Math.random() * needs.length)];
}
