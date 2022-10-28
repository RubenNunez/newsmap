import { useState } from "react";
import { News } from "../interfaces/news";

import newsdata from "./newsdata.json";

export function NewsTimeline(){

    let data : News[] = newsdata;

    let elements = data.map((news) => {
        return <p>{news.title}</p>;
    });

    return <> {elements} </>;
}