import { INews } from "../interfaces/INews";
import './NewsTimline.css'

import { useRef, useMemo } from "react";
import { ICountry } from "../interfaces/ICountry";

export interface INewsTimelineProps {
    news: INews[];
    countries: ICountry[];
    countryFilter: ICountry | undefined;
    onHover: (news: INews | undefined) => void;
  }

export function NewsTimeline(props: INewsTimelineProps){
    
    let scrollContainer = useRef<HTMLDivElement>(null);

    let filteredNews = useMemo(() => props.news.filter((n) => props.countryFilter ? n.country === props.countryFilter.cca2 : true),[props.countryFilter,props.news]);

    let elements = filteredNews.map((news) => {
        return <div key={news._id} className="scroll-item" onMouseOver={() => props.onHover(news)} onMouseLeave={() => props.onHover(undefined)}>
                <p className="headline">{news.title}</p>
        </div>;
    });
//<!-- <h1>Newsmap</h1> -->
    return <div className="timeline-wrapper" >
        <div ref={scrollContainer} 
    className='scroll-container'> {elements} </div>
    </div> 
}