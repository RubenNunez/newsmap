export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      vie?: {
        official: string;
        common: string;
      };
    };
  };
  latlng?: number[];
  capitalInfo: {
    latlng?: number[];
  };
  cca2: string;
}
