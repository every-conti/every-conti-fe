import {Suspense} from "react";

import SongSearchComponent from "src/app/song/search/SongSearchComponent";


export default function Page() {
    return (<Suspense><SongSearchComponent/></Suspense>)
}