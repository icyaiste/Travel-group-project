// Trip model and country information interfaces

export interface Trip {
  id: string;
  destination: string;
  startDate: Date;
  activities: [];
}

export interface CountryInfo {
  name: string;
  capital: string;
  currency: string;
  flag: string;
  region: string;
  population: number;
  languages: string[];
}


export interface GetDestinationInfo {
  name: {
    common: string;
  };
  capital?: string[];
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  flags?: {
    png: string;
  };
  region: string;
  population: number;
  languages?: {
    [key: string]: string;
  };
}
