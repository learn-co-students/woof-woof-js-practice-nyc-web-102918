document.addEventListener('DOMContentLoaded', () => {
console.log("sup");

const dogBar = document.querySelector('#dog-bar')
const dogInfo = document.querySelector('#dog-info')
const dogFilterBtn = document.querySelector('#good-dog-filter')
const dogSubmitNew = document.querySelector('#create-dog')

console.log(dogSubmitNew);

let dogAr = []

console.log(dogBar);
fetch('http://localhost:3000/pups')
.then(res => res.json())
.then((res) => {
  dogAr = res
  return addDogToPage(res)})

  function addDogToPage(array) {
    array.forEach(function (dog) {
      dogBar.innerHTML += `<span id="dog-${dog.id}">${dog.name}</span>`
    })
  }

  dogBar.addEventListener('click', function (event) {
    console.log(event.target.id);
    let dogElement = dogAr[event.target.id.split("-")[1] - 1]

      if (dogElement.isGoodDog === true) {
        answer = "Good Dog!"

      }else {answer = "Bad Dog!"}
    dogInfo.innerHTML = `<img src=${dogElement.image}> <h2>${dogElement.name}</h2> <button id="btn-${dogElement.id}">${answer}</button>`

  }) ///// END SPAN CLICK LISTENER, ADD DOG TO DIV BAR

  dogInfo.addEventListener('click',function (event) {

    if(event.target.tagName === "BUTTON"){
      console.log(event.target.id);

        let dogElAr = dogAr[event.target.id.split("-")[1] - 1]

      if(event.target.innerHTML === "Good Dog!"){
        event.target.innerHTML = "Bad Dog!"



        fetch(`http://localhost:3000/pups/${event.target.id.split("-")[1]}`,{
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            isGoodDog: false
          })
        })//end fetch
        dogElAr.isGoodDog = false
        console.log(dogElAr);
      }else{event.target.innerHTML = "Good Dog!"

      fetch(`http://localhost:3000/pups/${event.target.id.split("-")[1]}`,{
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isGoodDog: true
        })
      })//end fetch
      dogElAr.isGoodDog = true
      console.log(dogElAr);
    }


    }//// end second IF STAT

  })

  dogFilterBtn.addEventListener('click', function (event) {
      if (event.target.innerHTML === "Filter good dogs: OFF") {
        event.target.innerHTML = "Filter good dogs: ON"

        dogInfo.innerHTML=""
        dogBar.innerHTML=""

        dogAr.forEach(function (dog) {
          if(dog.isGoodDog){
          dogBar.innerHTML += `<span id="dog-${dog.id}">${dog.name}</span>`
          }
        })

      }else{event.target.innerHTML = "Filter good dogs: OFF"
      dogBar.innerHTML = ""
      dogInfo.innerHTML=""
      addDogToPage(dogAr)
    }

  })

  dogSubmitNew.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log(event.target.children[2].value);
    let newName = event.target.children[0].value
    let newImage = event.target.children[1].value
    let newTrF = event.target.children[2].value

    fetch('http://localhost:3000/pups', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        name: newName,
        image: newImage,
        isGoodDog: true
      })
    }).then(res => res.json()).then(res => console.log(res))

  })



}) ////// END DOM LISTENER
