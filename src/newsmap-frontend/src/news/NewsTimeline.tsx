import { INews } from "../interfaces/INews";
import './NewsTimline.css'

import { useRef } from "react";
import { ICountry } from "../interfaces/ICountry";

export interface INewsTimelineProps {
    news: INews[];
    countries: ICountry[];
    countryFilter: ICountry | undefined;
    onHover: (news: INews) => void;
  }

export function NewsTimeline(props: INewsTimelineProps){
    
    let scrollContainer = useRef<HTMLDivElement>(null);

    let elements = props.news.map((news) => {
        return <div key={news._id} className="scroll-item">
                <p className="headline">{news.title}</p>
        </div>;
    });
//<!-- <h1>Newsmap</h1> -->
    return <div className="timeline-wrapper" >
        <div ref={scrollContainer} 
    className='scroll-container'> {elements} </div>
    </div> 
}