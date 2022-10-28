import { INews } from "../interfaces/INews";
import './NewsTimline.css'

import newsdata from "./newsdata.json";

export function NewsTimeline(){

    let data : INews[] = newsdata;

    let elements = data.map((news) => {
        return <div key={news._id} className="scroll-item">
            <p className="truncate">{news.title}</p>
            <p className="truncate">{news.title}</p>
        </div>;
    });

    return <div className='scroll-container'> {elements} </div>;
}