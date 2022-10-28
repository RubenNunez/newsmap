import Globe from "react-globe.gl";
import contriesData from "../data/countries.json";
import { Country } from "../interfaces/Country";

const countries: Country[] = contriesData;

export function NewsGlobe() {
  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;

  const gData = countries
    .map((c) =>
      c.latlng
        ? {
            lat: c.capitalInfo?.latlng?.[0],
            lng: c.capitalInfo?.latlng?.[1],
            size: 7 + Math.random() * 30,
            color: ["red", "white", "blue", "green"][
              Math.round(Math.random() * 3)
            ],
            country: c,
          }
        : {}
    )
    .filter((c) => c.lat);

  return (
    <Globe
      htmlElement={(d: any) => {
        const el = document.createElement("div");
        el.innerHTML = markerSvg;
        el.style.color = d.color;
        el.style.width = `${d.size}px`;

        el.style.pointerEvents = "auto";
        el.style.cursor = "pointer";
        el.onclick = () => console.info(d);
        return el;
      }}
      htmlElementsData={gData}
      backgroundColor={"#ffffff"}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
    />
  );
}