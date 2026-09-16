import { useState } from 'react';

export interface CurrencyConfig {
  currency: 'USD' | 'INR';
  symbol: string;
}

const TIER_PRICES: Record<string, Record<'USD' | 'INR', string>> = {
  free: { USD: '$0', INR: '₹0' },
  growth: { USD: '$9', INR: '₹699' },
  scale: { USD: '$29', INR: '₹2,099' },
  enterprise: { USD: 'Custom', INR: 'Custom' },
};

export function useGeoCurrency() {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'USD' ? 'INR' : 'USD'));
  };

  const formatTierPrice = (tier: string) => {
    const prices = TIER_PRICES[tier.toLowerCase()] || { USD: '$0', INR: '₹0' };
    return prices[currency];
  };

  return {
    currency: { currency, symbol: currency === 'USD' ? '$' : '₹' },
    toggleCurrency,
    formatTierPrice,
  };
}
