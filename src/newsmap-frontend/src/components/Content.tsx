import { NewsGlobe } from "../news/NewsGlobe";
import { NewsTimeline } from "../news/NewsTimeline";

export function Content(){

    return(
        <div>
            <h1>Newsmap</h1>
            <NewsGlobe/>
            <NewsTimeline/>
        </div>

    )

}