import { INews } from "../interfaces/INews";
import './NewsTimline.css'

import { useEffect, useMemo, useRef } from "react";
import { ICountry } from "../interfaces/ICountry";

export interface INewsTimelineProps {
    news: INews[];
    countries: ICountry[];
    countryFilter: ICountry | undefined;
    onSelectedCountry: (country: ICountry | undefined) => void;
    onHover: (news: INews | undefined) => void;

}

export function NewsTimeline(props: INewsTimelineProps) {

    let scrollContainer = useRef<HTMLDivElement>(null);

    let filteredNews = useMemo(() => props.news.filter((n) => props.countryFilter ? n.country === props.countryFilter.cca2 : true), [props.countryFilter, props.news]);

    let onCountryFilterClear = () => {
        props.onSelectedCountry(undefined);
    };

    const openInNewTab = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    useEffect(() => {
        if (!props.countryFilter) {
            scrollContainer.current?.scrollTo(0, 0);
        }
    }, [props.countryFilter]);

    let elements = filteredNews.map((news) => {
        return <div key={news._id}
            className="scroll-item"
            onMouseOver={() => props.onHover(news)}
            onMouseLeave={() => props.onHover(undefined)}
            onClick={ ()=> openInNewTab(news.link) }>
            <p className="headline">{news.title}</p>
            <hr className="line" />
            <p className="subline">{news.country + " - " + news.rights + " - " + new Date(news.published_date).toLocaleString('de-CH', {
                month: 'long', // "June"
                day: '2-digit', // "01"
                year: 'numeric' // "2019"
            })}
            </p>
        </div>
    });

    return <div className="timeline-wrapper" >
        <div ref={scrollContainer}
            className='scroll-container' >
            <h1 className="title">Newsmap</h1>
            <div className="chips-container">
                {
                    props.countryFilter ? <div className="chips" onClick={() => onCountryFilterClear()}>{props.countryFilter.name.common} 🗑</div> : <></>
                }
            </div>
            {elements}
        </div>
    </div>
}