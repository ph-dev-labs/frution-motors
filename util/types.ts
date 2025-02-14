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