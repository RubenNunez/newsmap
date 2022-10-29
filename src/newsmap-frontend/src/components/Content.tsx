import { NewsGlobe } from "../news/NewsGlobe";
import { NewsTimeline } from "../news/NewsTimeline";


export function Content(){

    return(
        <div>
            <h1 style={{paddingLeft: '10%', paddingTop: '10%'}}>Newsmap</h1>
            <NewsTimeline/>
            <NewsGlobe/>
        </div>

    )

}