import { supabase } from '../database/supabase.js';

export const Subscription = {
    plans: {
        BASIC: { id: 'basic', price: 299, name: 'Basic' },
        STANDARD: { id: 'standard', price: 999, name: 'Standard' },
        ENTERPRISE: { id: 'enterprise', price: 4999, name: 'Enterprise' }
    },

    // 1. Check Trial & Subscription Status
    async checkStatus(userId) {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !data) return { status: 'no_account' };

        const now = new Date();
        const trialExpiry = new Date(data.trial_started_at);
        trialExpiry.setDate(trialExpiry.getDate() + 7); // 7 Days Trial

        // Check if Trial is active
        if (now < trialExpiry && data.plan_type === 'free') {
            const daysLeft = Math.ceil((trialExpiry - now) / (1000 * 60 * 60 * 24));
            return { type: 'trial', active: true, daysLeft };
        }

        // Check if Paid Subscription is active
        if (data.status === 'active' && new Date(data.expiry_date) > now) {
            return { type: data.plan_type, active: true };
        }

        return { active: false, reason: 'expired' };
    },

    // 2. Cashfree Integration Placeholder
    async initiatePayment(planId, userDetails) {
        console.log(`Initiating Cashfree Payment for ${planId}...`);
        
        // Yahan Cashfree SDK call hoga (Credentials baad mein add honge)
        // Abhi ke liye hum sirf simulate kar rahe hain
        const paymentData = {
            orderAmount: this.plans[planId.toUpperCase()].price,
            orderCurrency: "INR",
            customerDetails: userDetails
        };

        return { message: "Redirecting to Cashfree...", data: paymentData };
    }
};
