export interface CargoData {
  // Units
  lengthUnit?: string;
  weightUnit?: string;
  volumeUnit?: string;
  temperatureUnit?: string;

  // Dimensions
  packageCount?: number;
  length?: string;
  width?: string;
  height?: string;
  grossWeight?: string;
  grossVolume?: string;
  netWeight?: string;
  commodityType?: string;
  description?: string;
  hsCode?: string;
  subheading?: string;

  // Rating
  mawbRateClass?: string;
  tactRate?: string;
  mawbTotalCharge?: string;
  mawbDescription?: string;

  hawbRateClass?: string;
  hawbRate?: string;
  hawbTotalCharge?: string;

  // Other
  slac?: string;
  commodityItemNo?: string;
  itemNo?: string;
  subItemNo?: string;

  // Sea Specific
  declaredValue?: string;
  pcinNumber?: string;
  mcinNumber?: string;
  csnNumber?: string;

  // Legacy/Other
  chargeableWeight?: string;
  volume?: string;
  packageType?: string;
  currency?: string;
  marksAndNumbers?: string;
}
