document.addEventListener('DOMContentLoaded', function() {

  const dogURL = 'http://localhost:3000/pups'
  const dogBar = document.querySelector('#dog-bar')
  const dogContainer = document.querySelector('#dog-summary-container')
  const dogInfo = document.querySelector('#dog-info')
  const dogForm = document.querySelector('#dog-form')
  const filter = document.querySelector('#good-dog-filter')
  let dogs = [];

  fetch(dogURL)
    .then(response => response.json())
    .then(data => {
      dogs = data
      createDogBar(dogs)
      dogBarClicks()
      toggleFilter()
      })

  function createDogBar(dogs) {
    dogs.forEach(dog => {
      const dogSpan = document.createElement('span');
      dogSpan.dataset.id = `${dog.id}`;
      dogSpan.textContent = `${dog.name}`;
      dogSpan.status = `${dog.status}`
      dogBar.appendChild(dogSpan)
      })
    }

  function dogBarClicks() {
    dogBar.addEventListener('click', (event) => {
      const clicked = parseInt(event.target.dataset.id)
      const found = dogs.find((dog) => dog.id === clicked)
      let dogStatus = found.isGoodDog === true ? "Good Dog!" : "Bad Dog!"
      console.log(dogStatus)
      dogInfo.innerHTML = `
                              <img src=${found.image}>
                              <h2>${found.name}</h2>
                              <button id="status" data-id="${found.id}">${dogStatus}</button>
      `
      let button = dogInfo.querySelector('#status')
      button.addEventListener('click', (event) => {
        if (button.innerHTML === "Good Dog!") {
          button.innerHTML = "Bad Dog!"
          found.isGoodDog = false
          console.log(found.isGoodDog)
        } else {
          button.innerHTML = "Good Dog!"
          found.isGoodDog = true
          console.log(found.isGoodDog)
        }
        fetch(`http://localhost:3000/pups/${event.target.dataset.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            isGoodDog: found.isGoodDog
          })
        })
      })
    })
  }

  function toggleFilter() {
    filter.addEventListener('click', (event) => {
      if (filter.innerHTML === "Filter good dogs: OFF") {
        filter.innerHTML = "Filter good dogs: ON"
        let goodDogs = dogs.filter(dog => dog.isGoodDog === true)
        dogBar.innerHTML = ''
        createDogBar(goodDogs)
      } else {
        filter.innerHTML = "Filter good dogs: OFF"
        dogBar.innerHTML = ''
        createDogBar(dogs)
      }
    })
  }

})
