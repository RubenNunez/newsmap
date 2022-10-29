import { INews } from "../interfaces/INews";
import './NewsTimline.css'

import { useMemo, useRef } from "react";
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
        return <div key={news._id} className="scroll-item" onMouseOver={() => props.onHover(news)} onMouseLeave={() => props.onHover(undefined)}>              <p className="headline">{news.title}</p>
                <hr className="line"/>
                <p className="subline">{news.country + " - " + news.rights + " - " + new Date(news.published_date).toLocaleString('de-CH', {
  month: 'long', // "June"
  day: '2-digit', // "01"
  year: 'numeric' // "2019"
})}</p>
        </div>;
    });

    return <div className="timeline-wrapper" >
        <div ref={scrollContainer} 
             className='scroll-container'> 
             <h1 className="title">Newsmap</h1> 
                {elements}
            <div className="chips-container">
    <p>TEST</p>
            </div>
        </div>
    </div> 
}