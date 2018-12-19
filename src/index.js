let allDoggos = []

const dogBar = document.querySelector("#dog-bar")
const dogInfo = document.querySelector("#dog-info")
const filter = document.querySelector("#good-dog-filter")

fetch("http://localhost:3000/pups")
  .then( result => result.json() )
  .then( parsedResult => allDoggos = parsedResult )
  .then( showDoggosInDogBar )


function showDoggosInDogBar(doggos) {
  doggos.forEach( (doggo) => {
    dogBar.innerHTML += `
      <span data-id=${doggo.id}> ${doggo.name} </span>
    `
  })
}

dogBar.addEventListener("click", event => {
  let clickedDoggoId = event.target.dataset.id
  let clickedDoggo = allDoggos.find( doggo => doggo.id == clickedDoggoId )
  let goodStatus

  if (clickedDoggo.isGoodDog) {
    goodStatus = "Good Doggo"
  }
  else {
    goodStatus = "Bad Doggo"
  }

  dogInfo.innerHTML = `
    <img src=${clickedDoggo.image}>
    <h2> ${clickedDoggo.name} </h2>
    <button data-id="${clickedDoggoId}" id="good-bad-button"> ${goodStatus} </button>
  `
})

dogInfo.addEventListener("click", event => {
  if (event.target.id === "good-bad-button") {
    let clickedDoggoId = event.target.dataset.id
    let clickedDoggo = allDoggos.find( doggo => doggo.id == clickedDoggoId )

    clickedDoggo.isGoodDog = !clickedDoggo.isGoodDog

    fetch(`http://localhost:3000/pups/${clickedDoggoId}`, {
      method: "PATCH",
      headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
      },
      body: JSON.stringify({
            name: clickedDoggo.name,
            isGoodDog: clickedDoggo.isGoodDog,
            image: clickedDoggo.image
      })
    })
    .then( result => result.json())
    .then( parsedResult => {
      if (clickedDoggo.isGoodDog) {
        goodStatus = "Good Doggo"
      }
      else {
        goodStatus = "Bad Doggo"
      }

      document.querySelector("#good-bad-button").innerHTML = `${goodStatus}`
    })
  }
})

let clicked = false

filter.addEventListener("click", event => {
  clicked = !clicked
  if (clicked) {
    filter.innerHTML = "Filter good dogs: ON"
    filteredDoggos = allDoggos.filter( doggo => doggo.isGoodDog === true )
    dogBar.innerHTML = ""
    showDoggosInDogBar(filteredDoggos)
  }
  else {
    filter.innerHTML = "Filter good dogs: OFF"
    dogBar.innerHTML = ""
    showDoggosInDogBar(allDoggos)
  }
})
