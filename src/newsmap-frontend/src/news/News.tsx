import { useEffect, useState } from "react";
import { ICountry } from "../interfaces/ICountry";
import { INews } from "../interfaces/INews";
import { NewsGlobe } from "./NewsGlobe";
import { NewsTimeline } from "./NewsTimeline";

import "./News.css";

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

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <NewsTimeline countries={countries}
        news={news}
        countryFilter={selectedCountry}
        onSelectedCountry={setSelectedCountry}
        onHover={setHoveredNews} />
      <NewsGlobe countries={countries} news={news} countryFilter={selectedCountry} onCountryClick={setSelectedCountry} hoveredNews={hoveredNews} />
      <div className="stairs-wrapper" onClick={()=> openInNewTab("https://github.com/RubenNunez/newsmap") }>
        <img src="./rolltreppe.gif" alt="stairs" className="stairs-logo" ></img>
        <p className="stairs-text">ROLLSTAIR</p>
      </div>

    </>
  );
}
