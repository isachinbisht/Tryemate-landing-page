import React from 'react';

interface RazorpayCheckoutProps {
  amount: number;
  planTier: string;
  className?: string;
  children?: React.ReactNode;
}

export default function RazorpayCheckout({
  amount,
  planTier,
  className,
  children,
}: RazorpayCheckoutProps) {
  const handleCheckout = () => {
    console.log(`Checkout initiated for ${planTier} plan with amount ${amount}`);
  };

  return (
    <button onClick={handleCheckout} className={className}>
      {children}
    </button>
  );
}
