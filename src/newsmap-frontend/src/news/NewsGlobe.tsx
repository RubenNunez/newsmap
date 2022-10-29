import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { ICountry } from "../interfaces/ICountry";
import { INews } from "../interfaces/INews";
import * as THREE from 'three';

import "./NewsGlobe.css";

export interface INewsGlobeProps {
  news: INews[];
  countries: ICountry[];
  onCountryClick: (country: ICountry) => void;
  hoveredNews: INews | undefined;
  countryFilter: ICountry | undefined;
}

interface INewsCountry {
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

function getLabelSize(newsCountry: INewsCountry) {
  let size = 4 * Math.log10(newsCountry.news.length);
  return size < 2 ? 2 : size;
}

export function NewsGlobe(props: INewsGlobeProps) {
  let groupedNews = useMemo(() => {
    let g = groupBy(props.news, (item) => item.country);
    return Object.keys(g).map((key) => ({
      key: key,
      news: g[key],
      country: props.countries.find(
        (c) => c.cca2.toUpperCase() === key.toUpperCase()
      ),
    }));
  }, [props.news, props.countries]);

  let fiteredNews = useMemo(() => {
    return groupedNews;
  }, [groupedNews]);

  let [hoveredCountry, setHoveredCountry] = useState(
    undefined as ICountry | undefined
  );

  let globeElement = useRef<any>(null);

  useEffect(() => {
    if (props.hoveredNews) {
      let country = props.news.find(
        (nw: any) => nw._id === props.hoveredNews?._id
      )?.country;
      let coords = props.countries.find(
        (c) => c.cca2.toUpperCase() === country?.toUpperCase()
      )?.latlng;
      if (coords) {
        globeElement.current?.pointOfView(
          { lat: coords[0], lng: coords[1], altitude: 2 },
          1000
        );
      }
    }

  }, [props.hoveredNews, props.countries, props.news]);

  useEffect(() => {
    if (props.countryFilter?.latlng) {
        globeElement.current?.pointOfView(
          { lat: props.countryFilter.latlng[0], lng: props.countryFilter.latlng[1], altitude: 2 },
          1000
        );
      
    }
  }, [props.countryFilter]);

  let getLabelColor = (n: INewsCountry) => {
    let size = getSize(n);
    let opacity = size > 2 ?  0.80 : 1;
    if (
      props.hoveredNews &&
      n.news.find((nw: any) => nw._id === props.hoveredNews?._id)
    ) {
      // hover over news item highlight country in map
      return "rgba(200, 0, 0, " + opacity + ")";
    } else if (hoveredCountry && hoveredCountry.cca2 === n.country?.cca2) {
      // hover over globe highlight country in map
      return "rgba(200, 0, 0, " + opacity + ")";
    } else if (props.countryFilter && props.countryFilter.cca2 === n.country?.cca2) {
      // filter highlight country in map
      return "rgba(200, 0, 0, " + opacity + ")";
    } else {
      // default
      return "rgba(28, 28, 28, " + opacity + ")";
    }
  };

  const [countries, setCountries] = useState({ features: []});

  useEffect(() => {
    fetch('./data/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
  }, []);

  const material = new THREE.MeshPhongMaterial({color: "#b0b0b0"});
  material.opacity = 0.9;
  material.transparent = true;

  return !props.news ? (
    <div></div>
  ) : (
    <div className="globe-wrapper">
      <Globe
        ref={globeElement}
        // background color of globe
        backgroundColor={"#ffffff"}

        globeMaterial={material}

        labelsData={fiteredNews}
        labelLat={(c: any) => {
          return c.country.latlng?.[0];
        }}
        labelLng={(n: any) => n.country.latlng?.[1]}
        labelText={(n: any) => n.country.name.common}
        labelSize={(n: any) => getLabelSize(n)}
        labelDotRadius={(n: any) => getSize(n)}
        labelColor={(n: any) => getLabelColor(n)}
        onLabelClick={(n: any) => {
          props.onCountryClick(n.country);
        }}
        onLabelHover={(n: any) => {
          setHoveredCountry(n?.country);
        }}
        labelResolution={10}
        labelAltitude={0.02}


        hexAltitude={(n: any) => 0}
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        // color of hexagons
        hexPolygonColor={() => `#706f6f`}
      />
    </div>
  );
}
