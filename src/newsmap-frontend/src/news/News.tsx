import { useEffect, useState } from "react";
import { ICountry } from "../interfaces/ICountry";
import { INews } from "../interfaces/INews";
import { NewsGlobe } from "./NewsGlobe";
import { NewsTimeline } from "./NewsTimeline";

export function News() {
  const [countries, setCountries] = useState([] as ICountry[]);

  useEffect(() => {
    fetch('./data/countries.json').then(res => res.json())
      .then((c) => setCountries(c));
  }, []);


  const [news, setNews] = useState([] as INews[]);

  useEffect(() => {
    fetch('./data/newsdata.json').then(res => res.json())
      .then((n) => setNews(n));
  }, []);

  const [selectedCountry, setSelectedCountry] = useState(undefined as ICountry | undefined);
  const [hoveredNews, setHoveredNews] = useState(undefined as INews | undefined);


  return (
    <>
      <NewsTimeline countries={countries}
        news={news}
        countryFilter={selectedCountry}
        onSelectedCountry={setSelectedCountry}
        onHover={setHoveredNews} />
      <NewsGlobe countries={countries} news={news} countryFilter={selectedCountry} onCountryClick={setSelectedCountry} hoveredNews={hoveredNews} />
    </>
  );
}
