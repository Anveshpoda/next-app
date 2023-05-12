import React from 'react'

export const test = () => {


    // useEffect(() => {
    //     const unsplash = createApi({
    //         accessKey: '7T7knzWXN5zzrRSL5XV0TGxaExT9keH-5rxyhtdSY4w',
    //         // `fetch` options to be sent with every request
    //         // headers: { 'X-Custom-Header': 'foo' },
    //     });

    //     const intervalId = setInterval(() => {
    //         // uwzK1c6P03jOwNxFaynmjcNOg54jZ6R8coN83OxYkaM
    //         try{
    //             unsplash.photos.getRandom({ query: "nature", width: screen?.width || 1920, height: screen?.height || 1080 }).then(result => {
    //             switch (result.type) {
    //                 case 'error':
    //                     console.log('error occurred: ', result.errors[0]);
    //                 case 'success':
    //                     const photo = result.response;
    //                     setBackground(photo.urls.full)
    //                     console.log(photo);
    //             }
    //         });
    //     } catch(e) { console.log('e >> ',e)}
    //     },1000 * 15)
    //     return () => clearInterval(intervalId)

    // }, [])

    
    return (
        <div>test</div>
    )
}
