import { orderRepository } from '../repositories/orderRepository.js';
import { sendOrderOwnerEmail } from '../email.js';

export async function autoVerifyPendingOrders() {
  const now = new Date();
  try {
    const pending = await orderRepository.getPendingAutoVerify(now);
    for (const item of pending) {
      const order = await orderRepository.verify(item.ref, 'auto_verified_30m');
      console.log(`[Order Automation] ⏰ Order #${item.ref} auto-verified after 30 minutes!`);
      try {
        await sendOrderOwnerEmail(order, 'auto_verified');
      } catch (err) {
        console.error('[Automation Email Error]:', err.message);
      }
    }
  } catch (err) {
    console.warn('[Automation check failed]:', err.message);
  }
}

export function startOrderAutomation(intervalMs = 60 * 1000) {
  const timer = setInterval(autoVerifyPendingOrders, intervalMs);
  if (timer.unref) {
    timer.unref();
  }
  return timer;
}

export default startOrderAutomation;
