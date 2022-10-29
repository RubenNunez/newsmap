import { INews } from "../interfaces/INews";
import './NewsTimline.css'

import newsdata from "./newsdata.json";
import { useRef } from "react";



export function NewsTimeline(){

    let data : INews[] = newsdata;
    
    let pos = useRef({top: 0, left: 0, x: 0, y: 0, beenDragged: false});
    let scrollContainer = useRef<HTMLDivElement>(null);


    let mouseDownHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        pos.current = {
            left: scrollContainer.current!.scrollLeft,
            top: scrollContainer.current!.scrollTop,
            x: e.clientX,
            y: e.clientY,
            beenDragged: true
        };
    }

    let mouseUpHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        pos.current = {
            left: scrollContainer.current!.scrollLeft,
            top: scrollContainer.current!.scrollTop,
            x: e.clientX,
            y: e.clientY,
            beenDragged: false,
        };
        
        console.log("done X: " + scrollContainer.current!.scrollLeft);

        
    }

    let mouseMoveHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(!pos.current.beenDragged) return;
        
        let dx = e.clientX - pos.current.x;
        //let dy = e.clientY - pos.current.y;
        
        scrollContainer.current!.scrollLeft = scrollContainer.current!.scrollLeft - dx;
            
        //scrollContainer.current!.scrollTop = pos.current.top - dy;
        console.log("draggingX: " + dx);
        /*pos.current = {
            left:  scrollContainer.current!.scrollLeft,
            top:  scrollContainer.current!.scrollTop,
            x: e.clientX,
            y: e.clientY,
            beenDragged: pos.current.beenDragged,
        };*/
    }

    

    let elements = data.map((news) => {
        return <div key={news._id} className="scroll-item">
                <p className="headline">{news.title}</p>
        </div>;
    });

    return <div ref={scrollContainer} 
                className='scroll-container'
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={mouseMoveHandler}> {elements} </div>;
}