/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { Stripe, loadStripe } from '@stripe/stripe-js';

const getStripe = async (stripeAccount?: string): Promise<Stripe | null> => {
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', { stripeAccount });
};

export default getStripe;
