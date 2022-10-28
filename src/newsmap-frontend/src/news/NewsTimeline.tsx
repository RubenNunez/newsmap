import { News } from "../interfaces/news";
import './NewsTimline.css'

import newsdata from "./newsdata.json";

export function NewsTimeline(){

    let data : News[] = newsdata;

    let elements = data.map((news) => {
        return <div className="scroll-item">
            <p className="truncate">{news.title}</p>
            <p className="truncate">{news.title}</p>
        </div>;
    });

    return <div className='scroll-container'> {elements} </div>;
}