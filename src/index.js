document.addEventListener('DOMContentLoaded', (e) => {

  let allPups = []
  let foundPup = ''
  let goodPups = ''
  const dogBar = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')
  const dogFilterButton = document.querySelector('#good-dog-filter')

  function fetchPups() {
    fetch('http://localhost:3000/pups')
    .then((r) => r.json())
    .then((data) => {
      allPups = data
      showAllPups(data)
    })
  }

  fetchPups()

  function showAllPups(pups) {
    dogBar.innerHTML += pups.map(renderSinglePup).join(' ')
  }

  function renderSinglePup(pup) {
    return `
      <span>${pup.name}</span>
    `
  }

  dogBar.addEventListener('click', (e) => {
    foundPup = allPups.find((pup) => {
      return event.target.innerHTML == pup.name
    })

    let dogStatus = ' '

    if (foundPup.isGoodDog === true) {
      dogStatus = 'Good Dog!'
    }
    else if (foundPup.isGoodDog === false) {
      dogStatus = 'Bad Dog!'
    }

    console.log(dogStatus)

    const pupInfo = `
      <img src=${foundPup.image}>
      <h2>${foundPup.name}</h2>
      <button id='${foundPup.id}'>${dogStatus}</button>
    `
    dogInfo.innerHTML = pupInfo

    dogInfo.addEventListener('click', (e) => {
      console.log(foundPup.isGoodDog)
      if (e.target.tagName === 'BUTTON') {
        if (e.target.innerHTML === 'Good Dog!') {
          e.target.innerHTML = 'Bad Dog!'
          foundPup.isGoodDog = false
        }
        else {
          e.target.innerHTML = 'Good Dog!'
          foundPup.isGoodDog = true
        }
        fetch(`http://localhost:3000/pups/${foundPup.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json'
          },
          body: JSON.stringify({
            isGoodDog: foundPup.isGoodDog
          })
        })
      }
    })
  })

  dogFilterButton.addEventListener('click', (e) => {
    if (e.target.innerHTML === 'Filter good dogs: OFF') {
        e.target.innerHTML = 'Filter good dogs: ON'
        showAllGoodPups()

    }
    else {
      e.target.innerHTML = 'Filter good dogs: OFF'
      dogBar.innerHTML = ''
      showAllPups(allPups)
    }
  })

  function showAllGoodPups() {
    goodPups = allPups.filter((pup) => {
      return pup.isGoodDog === true
    })
    dogBar.innerHTML = ''
    showAllPups(goodPups)
  }

})
