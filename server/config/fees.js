// Configurable Fee Rates for CampusID
// Uniform Flat Fee (₹100 for all processes)
export const feeConfig = {
  'New ID': 100,
  'Renewal': 100,
  'Replacement': 100,
  'Status Change ID': 100,
  processingFee: 0,
  currency: 'INR',
  currencySymbol: '₹',
};

export const calculateFee = (applicationType) => {
  const baseFee = feeConfig[applicationType] ?? 100;
  const processingFee = feeConfig.processingFee ?? 0;
  return {
    baseFee,
    processingFee,
    total: baseFee + processingFee,
    currency: feeConfig.currency,
    currencySymbol: feeConfig.currencySymbol,
  };
};

export const updateFeeConfig = (newConfig) => {
  Object.assign(feeConfig, newConfig);
  return feeConfig;
};
