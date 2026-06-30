const PSGC_BASE = "https://psgc.gitlab.io/api";

interface PsgcItem {
  code: string;
  name: string;
}

interface Region extends PsgcItem {
  regionName: string;
}

interface Province extends PsgcItem {}
interface City extends PsgcItem {}
interface Barangay extends PsgcItem {}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export const addressApi = {
  async getRegions(): Promise<Region[]> {
    const data = await fetchJson<any[]>(`${PSGC_BASE}/regions/`);
    return data.map((r) => ({
      code: r.code,
      name: r.regionName,
      regionName: r.regionName,
    }));
  },

  async getProvinces(regionCode: string): Promise<Province[]> {
    const data = await fetchJson<any[]>(
      `${PSGC_BASE}/regions/${regionCode}/provinces/`
    );
    return data.map((p) => ({ code: p.code, name: p.name }));
  },

  async getCities(regionCode: string): Promise<City[]> {
    const data = await fetchJson<any[]>(
      `${PSGC_BASE}/regions/${regionCode}/cities/`
    );
    return data.map((c) => ({ code: c.code, name: c.name }));
  },

  async getMunicipalities(provinceCode: string): Promise<City[]> {
    const data = await fetchJson<any[]>(
      `${PSGC_BASE}/provinces/${provinceCode}/municipalities/`
    );
    return data.map((m) => ({ code: m.code, name: m.name }));
  },

  async getComponentCities(provinceCode: string): Promise<City[]> {
    const data = await fetchJson<any[]>(
      `${PSGC_BASE}/provinces/${provinceCode}/cities/`
    );
    return data.map((c) => ({ code: c.code, name: c.name }));
  },

  async getBarangays(cityCode: string): Promise<Barangay[]> {
    const data = await fetchJson<any[]>(
      `${PSGC_BASE}/cities-municipalities/${cityCode}/barangays/`
    );
    return data.map((b) => ({ code: b.code, name: b.name }));
  },
};
