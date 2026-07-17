import {
  regions,
  getProvincesByRegion,
  getCitiesByProvince,
  getBarangaysByCity,
} from "../data/philippineAddress";

export interface AddressItem {
  code: string;
  name: string;
}

const resolveDelayed = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), 50));

export const addressApi = {
  async getRegions(): Promise<AddressItem[]> {
    return resolveDelayed(
      regions.map((r) => ({ code: r.code, name: r.name }))
    );
  },

  async getProvinces(regionCode: string): Promise<AddressItem[]> {
    const list = getProvincesByRegion(regionCode);
    return resolveDelayed(list.map((p) => ({ code: p.code, name: p.name })));
  },

  async getCities(_regionCode: string): Promise<AddressItem[]> {
    return [];
  },

  async getMunicipalities(provinceCode: string): Promise<AddressItem[]> {
    const list = getCitiesByProvince(provinceCode);
    return resolveDelayed(
      list.map((c) => ({ code: c.code, name: c.name }))
    );
  },

  async getComponentCities(_provinceCode: string): Promise<AddressItem[]> {
    return [];
  },

  async getBarangays(cityCode: string): Promise<AddressItem[]> {
    const list = getBarangaysByCity(cityCode);
    return resolveDelayed(
      list.map((b) => ({ code: b.code, name: b.name }))
    );
  },
};
