document.addEventListener('DOMContentLoaded', () => {
  const pupsURL = `http://localhost:3000/pups/`
  const dogBar = document.getElementById('dog-bar')
  const dogInfo = document.getElementById('dog-info')
  const filterButton = document.getElementById('good-dog-filter')
  let filterOn = false
  let allPups = []
  let clickedDog

  const getPups = () => {
    fetch(pupsURL)
     .then(response => response.json())
     .then(data => {
       allPups = data
       showPups(allPups)
     })
  }

  const showPups = (pups) => {
    dogBar.innerHTML = ''
    pups.forEach((pup) => {
      dogBar.innerHTML += `
        <span data-id='${pup.id}'>${pup.name}</span>
      `
    })
  }

  const showOnePup = (pup) => {
    dogInfo.innerHTML = `
      <img src='${pup.image}'>
      <h2>${pup.name}</h2>
    `
    if (pup.isGoodDog) {
      dogInfo.innerHTML += `
        <button data-id='${pup.id}'>Good Dog!</button>
      `
    } else {
      dogInfo.innerHTML += `
        <button data-id='${pup.id}'>Bad Dog!</button>
      `
    }
  }

  const updatePup = (pup) => {
    let pupId = pup.id
    pup.isGoodDog = !pup.isGoodDog
    console.log(pup);
    fetch((pupsURL + pupId), {
      method: 'PATCH',
      headers: {
        'Content-Type' : 'application/json',
        'Accepts' : 'application/json'
      },
      body: JSON.stringify({
        isGoodDog: pup.isGoodDog
      })
    })
    .then(getPups)
  }

  dogBar.addEventListener('click', (event) => {
    if (event.target.tagName === 'SPAN') {
      clickedDog = allPups.find((pup) => {
        return pup.id == event.target.dataset.id
      })
    }
    showOnePup(clickedDog)
  })

  dogInfo.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      let foundDog = allPups.find((pup) => {
        return pup.id == event.target.dataset.id
      })
      if (foundDog.isGoodDog) {
        event.target.innerText = 'Bad Dog!'
      } else {
        event.target.innerText = 'Good Dog!'
      }
      updatePup(foundDog)
    }
  })

  filterButton.addEventListener('click', (event) => {
    if (filterOn) {
      filterOn = !filterOn
      event.target.innerText = 'Filter good dogs: OFF'
      showPups(allPups)
    } else {
      filterOn = !filterOn
      event.target.innerText = 'Filter good dogs: ON'
      let goodDogs = allPups.filter(pup => {
        return pup.isGoodDog
      })
      showPups(goodDogs)
    }
    console.log(filterOn);
  })


getPups()

})
