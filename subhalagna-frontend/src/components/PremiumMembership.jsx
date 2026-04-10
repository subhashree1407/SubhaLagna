import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    duration: 'Forever',
    description: 'Basic access to explore matches.',
    features: [
      { text: 'Create Profile', included: true },
      { text: 'Browse Matches', included: true },
      { text: 'Send Interests', included: true },
      { text: 'View Contact Info', included: false },
      { text: 'Direct Messaging', included: false },
      { text: 'Priority Placement', included: false },
      { text: 'View Private Photos', included: false },
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'outline',
  },
  {
    name: 'Gold',
    price: '₹999',
    duration: '/ 3 months',
    description: 'Perfect for serious searchers.',
    popular: true,
    features: [
      { text: 'Create Profile', included: true },
      { text: 'Browse Matches', included: true },
      { text: 'Send Interests', included: true },
      { text: 'View 30 Contact Info', included: true },
      { text: 'Direct Messaging', included: true },
      { text: 'Priority Placement', included: false },
      { text: 'View Private Photos', included: true },
    ],
    buttonText: 'Upgrade to Gold',
    buttonVariant: 'primary',
  },
  {
    name: 'Platinum',
    price: '₹1,999',
    duration: '/ 6 months',
    description: 'Our most comprehensive plan.',
    features: [
      { text: 'Create Profile', included: true },
      { text: 'Browse Matches', included: true },
      { text: 'Send Interests', included: true },
      { text: 'View UNLIMITED Contacts', included: true },
      { text: 'Direct Messaging', included: true },
      { text: 'Priority Placement', included: true },
      { text: 'View Private Photos', included: true },
    ],
    buttonText: 'Upgrade to Platinum',
    buttonVariant: 'secondary',
  },
];

const PremiumMembership = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
          Find Your Perfect Match <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
            Faster With Premium
          </span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Unlock exclusive features like direct messaging, contact details, and priority placement to accelerate your journey to finding a life partner.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl bg-white transition-all duration-300 ${
              plan.popular
                ? 'ring-2 ring-rose-500 shadow-2xl scale-105 z-10'
                : 'border border-gray-200 shadow-lg hover:shadow-xl'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              </div>
            )}

            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 font-medium">{plan.duration}</span>
              </div>

              <button
                className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 mb-8 ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5'
                    : plan.buttonVariant === 'secondary'
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-rose-50 text-rose-600 border border-rose-200 cursor-default'
                }`}
              >
                {plan.buttonText}
              </button>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    <span className={`text-sm font-medium ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ or Trust Section */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Safe & Secure Matrimony</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your privacy is our priority. Contact numbers and photos are strictly protected and only shared based on your preferences. Upgrading to premium gives you full control over who you connect with.
        </p>
      </div>
    </div>
  );
};

export default PremiumMembership;
