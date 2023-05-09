const getCardDiv = (trip) => {
    const card = document.createElement('div')
    card.classList.add('card');

    const cardText = document.createElement('div')
    cardText.classList.add('card-text');

    // Move expired trips to bottom/have their style change so it’s clear it’s expired.
    if((new Date() - new Date(trip.start))>0){
        const expired = document.createElement('h4');
        expired.classList.add('expired');
        expired.innerHTML = 'EXPIRED'
        cardText.appendChild(expired)
    }

    const h3 = document.createElement('h3');
    const timeToWait = trip.days > 0 ? ` (in ${trip.days} days)` : ''
    h3.innerHTML = `Trip to ${trip.location}${timeToWait}`
    cardText.appendChild(h3)

    const h4 = document.createElement('h4')
    // Add end date and display length of trip.
    h4.innerHTML = `${trip.start} - ${trip.end} (${Math.ceil((new Date(trip.end)-new Date(trip.start)) / (1000 * 60 * 60 * 24))+1} days)`
    cardText.appendChild(h4)

    if(trip.geo){
        const geo = document.createElement('p')
        geo.innerHTML = `lng ${trip.geo.lng} lat ${trip.geo.lat}`
        cardText.appendChild(geo)
    }

    if(trip.weather){
        const weather = document.createElement('p')
        weather.innerHTML = `${trip.weather.min_temp}°C - ${trip.weather.max_temp}°C`

        // Incorporate icons into forecast.
        const icon = document.createElement('img')
        icon.classList.add('icon');
        icon.setAttribute('src', `https://cdn.weatherbit.io/static/img/icons/${trip.weather.weather.icon}.png`)

        cardText.appendChild(weather)
        cardText.appendChild(icon)
    }

    if(trip.pictures && trip.pictures.hits.length>0){
        const img = document.createElement('img')
        img.setAttribute('src', trip.pictures.hits[0].webformatURL)
        card.appendChild(img)
    }

    card.appendChild(cardText)

    return card
}

const updateUi = async() => {
    const res = await fetch('http://localhost:3001/api/trip')

    // Automatically sort additional trips by countdown.
    const data = (await res.json()).sort((a,b) => new Date(b.start)-new Date(a.start));
    const trips = []
    for(const t of data){
        if(t.days>0) trips.unshift(t)
        else trips.push(t)
    }

    const container = document.getElementsByClassName('trip-container')[0]

    for(const trip of trips){
        const card = getCardDiv(trip);
        container.append(card)
    }
}

export { updateUi }