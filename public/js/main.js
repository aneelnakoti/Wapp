const geocodeAPIKEY = 'pk.eyJ1IjoiYW5pbG5ha290aSIsImEiOiJjazJ1ZWY5aTIxZ240M2lvNDhiZmhscXY0In0.v4MEEbYFsljCGDvMnYwEdw';
const foercastAPIKEY = 'dd164dd31b569aef1bb175c2e8c9edbe'

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

if (navigator.serviceWorker) {
    window.addEventListener('load', () => {
        navigator
            .serviceWorker
            .register('../../sw_cached_site.js')
            .then(req => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker Error: ${err}`)
            )
    })
}

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    messageOne.textContent = 'Loading...'
    messageTwo.textContent = ''

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${geocodeAPIKEY}`)
        .then(response => {
            response
                .json()
                .then(data => {
                    if (data.features.length === 0) {
                        messageOne.textContent = 'Unable to find location. Try another search.';
                    }
                    else {
                        let latitude = data.features[0].center[1];
                        let longitude = data.features[0].center[0];
                        let location = data.features[0].place_name;

                        fetch(`https://api.darksky.net/forecast/${foercastAPIKEY}/${latitude},${longitude}?units=si`)
                            .then(forecastResponse => {
                                forecastResponse
                                    .json()
                                    .then(forecastData => {
                                        messageOne.textContent = location;
                                        messageTwo.textContent = ` ${forecastData.daily.data[0].summary} It is currently ${forecastData.currently.temperature} degress out. This high today is ${forecastData.daily.data[0].temperatureHigh} with a low of ${forecastData.daily.data[0].temperatureLow}. There is a ${forecastData.currently.precipProbability}% chance of rain.`
                                    })
                                    .catch(() => {
                                        messageOne.textContent = 'Unable to connect to weather service!';
                                    })
                            })
                            .catch(() => {
                                messageOne.textContent = 'Unable to connect to weather service!';
                            })
                    }
                })
        })
        .catch(err => {
            messageOne.textContent = 'Unable to connect to location services!';
        })
})





