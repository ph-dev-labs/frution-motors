export interface Car {
    id?: number;
    title: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    brand_name: string;
    model: string;
    year: string;
    fuel_type: string;
    color: string;
    seat?: number;
    type_of_gear?: string;
  }
  
  export interface StatCard {
    title: string;
    value: string | number;
    icon: any;
    color: string;
  }


 export const formatPrice = (price:any) => {
  if (!price) return 'N/A';
  
  // Convert string to number if needed
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return 'N/A';
  
  return numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};