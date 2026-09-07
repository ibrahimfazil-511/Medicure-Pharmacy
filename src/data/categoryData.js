import { Pill, Heart, Baby, Dumbbell, Leaf, Stethoscope } from 'lucide-react';

export const CATEGORY_DATA = [
  { id: 'medicines', name: 'Medicines', label: 'Medicines', icon: Pill, subcategories: ['Pain Relief', 'Cold & Flu', 'Allergy Relief', 'Digestive Health', 'Vitamins & Supplements', 'Diabetes Care', 'Heart Care', 'Antibiotics'] },
  { id: 'personal-care', name: 'Personal Care', label: 'Personal Care', icon: Heart, subcategories: ['Skin Care', 'Hair Care', 'Oral Care', 'Feminine Care', 'Men Grooming', 'Face Wash', 'Hand & Foot Care', 'Body Care'] },
  { id: 'baby-care', name: 'Baby Care', label: 'Baby Care', icon: Baby, subcategories: ['Baby Food', 'Diapers', 'Baby Skin Care', 'Mother Care', 'Baby Bath', 'Baby Feeding', 'Baby Health', 'Baby Accessories'] },
  { id: 'lifestyle', name: 'Lifestyle & Fitness', label: 'Lifestyle & Fitness', icon: Dumbbell, subcategories: ['Nutrition', 'Weight Management', 'Sports Support', 'Wellness', 'Fitness Accessories', 'Protein & Energy', 'Sleep Support', 'Sexual Wellness'] },
  { id: 'organic', name: 'Organic', label: 'Organic', icon: Leaf, subcategories: ['Herbal Care', 'Natural Supplements', 'Organic Skin Care', 'Essential Oils', 'Herbal Teas', 'Ayurvedic Care', 'Natural Hair Care', 'Organic Foods'] },
  { id: 'devices', name: 'Healthcare Devices', label: 'Healthcare Devices', icon: Stethoscope, subcategories: ['Blood Pressure Monitors', 'Thermometers', 'Glucose Monitors', 'First Aid', 'Nebulizers', 'Pulse Oximeters', 'Medical Supports', 'Mobility Aids'] }
];

export function getCategoryData(categoryId) {
  return CATEGORY_DATA.find((category) => category.id === categoryId);
}
