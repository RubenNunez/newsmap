import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { ICountry } from "../interfaces/ICountry";
import { INews } from "../interfaces/INews";
import * as THREE from "three";

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
window.onresize = function(){ window.location.reload(); }

export function NewsGlobe(props: INewsGlobeProps) {

  // draw line from country to mouse in screenspace
  let drawCustomLine = (globeElement: any, pos : {x:number,y:number}, country?: ICountry) : any  => {
    if(!country) return;

     // draw custom line
     let scene = globeElement.current?.scene() as THREE.Scene;
     //let renderer = globeElement.current?.renderer() as THREE.WebGLRenderer;
     let camera = globeElement.current?.camera() as THREE.PerspectiveCamera;

     let countryThreeCoords = globeElement.current?.getCoords(country?.latlng?.[0], country?.latlng?.[1]) as THREE.Vector3;

     let mouseWorldPosition = new THREE.Vector3();
     mouseWorldPosition.set((pos.x / window.innerWidth) * 2 - 1, -(pos.y / window.innerHeight) * 2 + 1,0);
     mouseWorldPosition.unproject(camera);

     //create a blue LineBasicMaterial
     const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
     const points = [];
     points.push( countryThreeCoords );
     points.push( mouseWorldPosition );
     

     const geometry = new THREE.BufferGeometry().setFromPoints( points );
     const line = new THREE.Line( geometry, material );
     
     scene.add( line );
     return line;
  }


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

  let [hoveredCountry, setHoveredCountry] = useState(
    undefined as ICountry | undefined
  );

  let globeElement = useRef<any>(null);

  let getAttitude = useCallback(
    (country: ICountry) => {
      let size = getSize(
        groupedNews.find(
          (c) => c.key.toUpperCase() === country.cca2.toUpperCase()
        ) as INewsCountry
      );
      let min = 0.5;
      let max = 4;
      let attitude = (((size-1) / 10))  * (max- min) + min;
      return attitude;
    },
    [groupedNews]
  );

  useEffect(() => {
    if (props.hoveredNews) {

      let countryShortName = props.news.find(
        (nw: any) => nw._id === props.hoveredNews?._id
      )?.country;

      let country = props.countries.find(
        (c) => c.cca2.toUpperCase() === countryShortName?.toUpperCase()
      );

      if (country?.latlng) {
        globeElement.current?.pointOfView(
          {
            lat: country?.latlng[0],
            lng: country?.latlng[1],
            altitude: getAttitude(country),
          },
          1000
        );
        
        drawCustomLine(globeElement, {x:250,y:250}, country);

      }

    }

    let scene = globeElement.current?.scene() as THREE.Scene;
    let renderer = globeElement.current?.renderer() as THREE.WebGLRenderer;
    let camera = globeElement.current?.camera() as THREE.PerspectiveCamera;

    window.addEventListener('keydown',(event : KeyboardEvent) => {
      let geoCoords = globeElement.current?.toGeoCoords(camera.position);

      let offset = new THREE.Vector2(0,0);
      if (event.key === 'ArrowUp') {
        offset.y += 2;
      }
      if (event.key === 'ArrowDown') {
        offset.y -= 2;
      }
      if (event.key === 'ArrowLeft') {
        offset.x -= 2;
      } 
      if (event.key === 'ArrowRight') {
        offset.x += 2;
      }
      globeElement.current?.pointOfView(
        {
          lat: geoCoords.lat + offset.y,
          lng: geoCoords.lng + offset.x,
          altitude: geoCoords.altitude,
        },
        geoCoords.altitude > 70 ? 0 : 20
      );
      //console.log(geoCoords.altitude);
      //console.log(event.key);
    })

    //create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
    const points = [];
    points.push( new THREE.Vector3( - 200, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 200, 0 ) );
    points.push( new THREE.Vector3( 200, 0, 0 ) );
    points.push( new THREE.Vector3( - 200, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, material );
    
    scene.add( line );
    renderer.render( scene, camera );

  }, [props.hoveredNews, props.countries, props.news, getAttitude]);

  useEffect(() => {
    if (props.countryFilter?.latlng) {
      globeElement.current?.pointOfView(
        {
          lat: props.countryFilter.latlng[0],
          lng: props.countryFilter.latlng[1],
          altitude: getAttitude(props.countryFilter),
        },
        1000
      );
    }
  }, [props.countryFilter, getAttitude]);

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

  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    fetch('./data/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
    const controls = globeElement.current.controls();
    controls.maxDistance = 370;
    controls.minDistance = 140;
  }, []);

  // globe color
  const material = new THREE.MeshPhongMaterial({color: "#dbdbdb"});
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
        labelsData={groupedNews}
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