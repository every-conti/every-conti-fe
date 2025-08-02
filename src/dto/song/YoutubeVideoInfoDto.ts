export type YoutubeVideoInfoDto = {
    "kind": string,
    "etag": string,
    "items": [
        {
            "kind": string,
            "etag": string,
            "id": string,
            "snippet": {
                "publishedAt": string,
                // "channelId": string,
                "title": string,
                // "description": string,
                // "thumbnails": {
                //     "default": {
                //         "url": "https://i.ytimg.com/vi/TtH4qHWdTto/default.jpg",
                //         "width": 120,
                //         "height": 90
                //     },
                //     "medium": {
                //         "url": "https://i.ytimg.com/vi/TtH4qHWdTto/mqdefault.jpg",
                //         "width": 320,
                //         "height": 180
                //     },
                //     "high": {
                //         "url": "https://i.ytimg.com/vi/TtH4qHWdTto/hqdefault.jpg",
                //         "width": 480,
                //         "height": 360
                //     },
                //     "standard": {
                //         "url": "https://i.ytimg.com/vi/TtH4qHWdTto/sddefault.jpg",
                //         "width": 640,
                //         "height": 480
                //     },
                //     "maxres": {
                //         "url": "https://i.ytimg.com/vi/TtH4qHWdTto/maxresdefault.jpg",
                //         "width": 1280,
                //         "height": 720
                //     }
                // },
                // "channelTitle": string,
                // "tags": string[],
                // "categoryId": string,
                // "liveBroadcastContent": string,
                // "localized": {
                //     "title": string,
                //     "description": string
                // },
                // "defaultAudioLanguage": string
            },
            "contentDetails": {
                "duration": string,
                // "dimension": string,
                // "definition": string,
                // "caption": string,
                // "licensedContent": true,
                // "contentRating": {},
                // "projection": string
            }
        }
    ],
    // "pageInfo": {
    //     "totalResults": number,
    //     "resultsPerPage": number
    // }
}