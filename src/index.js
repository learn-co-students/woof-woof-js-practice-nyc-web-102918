document.addEventListener('DOMContentLoaded', () => {

  let allDoges = []
  const doges = document.querySelector('#dog-bar')
  const dogeInfo = document.querySelector('#dog-info')
  // console.log(doges)
  fetch('http://localhost:3000/pups')
  .then(res => res.json())
  .then(data => {
    allDoges = data
    data.forEach((dog) => {
      doges.innerHTML += `
      <span data-id='${dog.id}'>${dog.name}</span>`
    })
  })
  doges.addEventListener('click', (e) => {
    const clickedDogeId = parseInt(e.target.dataset.id)
    const foundDoge = allDoges.find((dog) => dog.id === clickedDogeId)
    const isGoodDogString = foundDoge.isGoodDog ? 'Good Dog!': 'Bad Dog!'
    dogeInfo.innerHTML = `
    <img src=${foundDoge.image}>
    <h2>${foundDoge.name}</h2>
    <button data-id=${foundDoge.id} data-action='good-dog'>${isGoodDogString}</button>`
  })
  dogeInfo.addEventListener('click', (e) => {
    e.preventDefault()
    if(e.target.dataset.action === 'good-dog') {
      // console.log(e.target)
      const foundDoge = allDoges.find((dog) => {
        return dog.id === parseInt(e.target.dataset.id)
      })
      // console.log(foundDoge)

      if(e.target.innerText === 'Good Dog!'){
         e.target.innerText = 'Bad Dog!'
         foundDoge.isGoodDog = false
      }
      else if (e.target.innerText === 'Bad Dog!'){
         e.target.innerText = 'Good Dog!'
         foundDoge.isGoodDog = true
      }
      const isGoodDogString = foundDoge.isGoodDog
      const headers = {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        "Accept": "application/json"
        },
        body: JSON.stringify({
          'isGoodDog': isGoodDogString
        })
      }
      fetch(`http://localhost:3000/pups/${foundDoge.id}`, headers)
      .then(res => res.json())
      .then(data => {
        allDoges[(foundDoge.id - 1)] = data
      })
    }
  })
})
