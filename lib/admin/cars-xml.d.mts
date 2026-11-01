export interface XmlCar {
  id: string; available: boolean; name: string; brand: string; model: string;
  year: number; category: string; price_per_day: number;
  transmission: string; fuel_type: string; seats: number;
  car_images?: { image_url: string; is_main: boolean }[]
}
export declare function escapeXml(value: unknown): string
export declare function serializeCars(cars: XmlCar[], siteUrl?: string): string