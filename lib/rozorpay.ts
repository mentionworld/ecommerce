
import Razorpay from 'razorpay'

// Lazy factory — reads env vars at call time, not at module load time
export function getRazorpay() {
    return new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
}