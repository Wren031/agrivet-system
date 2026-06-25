// import { Injectable, Logger } from '@nestjs/common';

// interface NominatimResponse {
//   display_name: string;
//   address: {
//     road?: string;
//     village?: string;
//     town?: string;
//     city?: string;
//     state?: string;
//     region?: string;
//     country?: string;
//     postcode?: string;
//     hamlet?: string;
//     municipality?: string;
//     province?: string;
//   };
// }

// @Injectable()
// export class GeocodingService {
//   private readonly logger = new Logger(GeocodingService.name);
//   private cache = new Map<string, { address: string; timestamp: number }>();
//   private readonly CACHE_TTL = 24 * 60 * 60 * 1000;
//   private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
//   private pendingRequests = 0;
//   private readonly MAX_RETRIES = 3;

//   async reverse(lat: number, lng: number): Promise<string | null> {
//     const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
//     const cached = this.cache.get(key);
//     if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
//       return cached.address;
//     }

//     const address = await this.fetchWithRetry(lat, lng, key);
//     return address;
//   }

//   private async fetchWithRetry(lat: number, lng: number, key: string, attempt = 1): Promise<string | null> {
//     try {
//       await this.rateLimit();

//       const url = `${this.NOMINATIM_URL}?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`;
//       const response = await fetch(url, {
//         headers: {
//           'User-Agent': 'AgrivetAdmin/1.0 (admin@agrivet.com)',
//           'Accept-Language': 'en',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Nominatim responded with ${response.status}`);
//       }

//       const data: NominatimResponse = await response.json();
//       const address = this.formatAddress(data);

//       if (address) {
//         this.cache.set(key, { address, timestamp: Date.now() });
//       }

//       return address;
//     } catch (error) {
//       this.logger.warn(`Geocoding attempt ${attempt}/${this.MAX_RETRIES} failed for (${lat}, ${lng}): ${(error as Error).message}`);
//       if (attempt < this.MAX_RETRIES) {
//         await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
//         return this.fetchWithRetry(lat, lng, key, attempt + 1);
//       }
//       return null;
//     }
//   }

//   private formatAddress(data: NominatimResponse): string {
//     if (!data?.address) return data?.display_name || null;

//     const { address } = data;
//     const parts: string[] = [];

//     const city = address.city || address.town || address.municipality || address.village || address.hamlet;
//     const state = address.state || address.province || address.region;
//     const country = address.country;

//     if (city) parts.push(city);
//     if (state) parts.push(state);
//     if (country) parts.push(country);

//     return parts.length > 0 ? parts.join(', ') : data.display_name;
//   }

//   private async rateLimit(): Promise<void> {
//     if (this.pendingRequests >= 1) {
//       await new Promise(resolve => setTimeout(resolve, 1100));
//     }
//     this.pendingRequests++;
//     await new Promise(resolve => setTimeout(resolve, 100));
//     this.pendingRequests--;
//   }

//   clearCache(): void {
//     this.cache.clear();
//   }
// }
