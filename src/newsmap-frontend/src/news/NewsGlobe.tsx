import { useMemo } from "react";
import Globe from "react-globe.gl";
import { ICountry } from "../interfaces/ICountry";
import { INews } from "../interfaces/INews";


import './NewsGlobe.css'

export interface INewsGlobeProps {
  news: INews[];
  countries: ICountry[];
  onCountryClick: (country: ICountry) => void;
  hoveredNews: INews | undefined;
}

interface INewsCountry{
  key: string;
  country: ICountry;
  news: INews[];
}

function groupBy<T>(array: T[], keySelector: (item: T) => string) {
  return array.reduce((result: { [key: string]: T[] }, currentValue) => {
    (result[keySelector(currentValue)] =
      result[keySelector(currentValue)] || ([] as T[])).push(currentValue);
    return result;
  }, {});
}
function getSize(newsCountry: INewsCountry) {
  let size = 4 * Math.log10(newsCountry.news.length);
  return size < 1 ? 1 : size;
}

export function NewsGlobe(props: INewsGlobeProps) {
  let groupedNews = useMemo(() => {
    let g = groupBy(props.news, (item) => item.country);
    return Object.keys(g).map((key) => ({ key: key, news: g[key], country: props.countries.find((c) => c.cca2.toUpperCase() === key.toUpperCase()) }));
  }, [props.news,props.countries]);

  let fiteredNews = useMemo(() => {
    return groupedNews;
  }, [groupedNews]);

  return !props.news ? (
    <div></div>
  ) : (
    <div className="globe-wrapper">
    <Globe
      backgroundColor={"#ffffff"}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      labelsData={fiteredNews}
      labelLat={(c: any) => {
        return c.country.latlng?.[0];
      }}
      labelLng={(n: any) => n.country.latlng?.[1]}
      labelText={(n: any) => n.country.name.common}
      labelSize={(n: any) =>  getSize(n)}
      labelDotRadius={(n: any) => getSize(n)}
      labelColor={() => "rgba(255, 165, 0, 0.75)"}
      onLabelClick={(n: any) => {
        props.onCountryClick(n.country);
      }}
      labelResolution={10}
    />
    </div>
  );
}
