import type { CountryInfo, RestCountryApiResponse } from "../types/interfaces.ts";

export const getCountryInfo = async (
  countryName: string
): Promise<CountryInfo | null> => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    if (!response.ok) {
      throw new Error(`Country not found: ${countryName}`);
    }

    const data = (await response.json()) as RestCountryApiResponse[];

    const country = data[0];

    if (!country) {
      return null;
    }

    const currencyObject = country.currencies
      ? Object.values(country.currencies)[0]
      : undefined;

    const currencyName = currencyObject?.name ?? "N/A";
    const currencySymbol = currencyObject?.symbol ?? "";

    return {
      name: country.name.common,
      capital: country.capital?.[0] ?? "N/A",
      currency:
        currencySymbol !== ""
          ? `${currencyName} (${currencySymbol})`
          : currencyName,
      flag: country.flags?.png ?? "",
      region: country.region,
      population: country.population,
      languages: country.languages
        ? Object.values(country.languages)
        : [],
    };
  } catch (error) {
    console.error("Error fetching country:", error);
    return null;
  }
};
