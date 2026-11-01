export interface CarImage {
  id: number | string;
  car_id: string;
  image_url: string;
  is_main: boolean;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model?: string;
  year: number;
  category: string;
  price_per_day: number;
  transmission: string;
  fuel_type: string;
  seats: number;
  features?: string[];
  available: boolean;
  // Yeni eklenen alan:
  car_images?: CarImage[]; 
}