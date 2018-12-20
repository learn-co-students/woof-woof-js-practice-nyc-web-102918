document.addEventListener('DOMContentLoaded', () => {
    const navBar = document.querySelector('#dog-bar')
    const showDogDiv = document.querySelector("#dog-info")
    const dogForm = document.querySelector("#dog-form")
    const dogNameInput = document.querySelector("#dog-name-input")
    const dogImgInput = document.querySelector("#dog-img-input")
    const goodDogInput = document.querySelector("#good-dog-input")

    let dogData = []
    //filter.dataset.on = false

    fetch('http://localhost:3000/pups', { method: 'get'})
        .then(res => res.json())
        .then(dogs => {
            dogData = dogs
            console.log(dogs)

    //con += estoy appending, luego utilizo my dog bar que es donde quiero colocar los perritos,
    //span porque lo dice el enunciado y debo darle un id para luego poder ubicarlo
          dogs.forEach((dog) =>{
            navBar.innerHTML +=`<span data-id="${dog.id}">${dog.name}</span>`
          })
        })

    // necesito crear un evento a cada perrito, porque cuando le click debe aparecer su info
    navBar.addEventListener('click', (e)=> {
      // con esto estoy guardando el id del perro seleccionado, para poder saber a que le voy
      // a desplegar la info, utilizo dataset porque con eso lo agarro y como data set es siempre
      // un string utilizo parseint para que sea solo entero
      const clickedDogId = parseInt(e.target.dataset.id)
      // ahora tengo el id y con esto puedo encontrar el perro en mi data
      const foundDog = dogData.find( dog => dog.id === clickedDogId)
      // isGoodDog es un atributo en mi array por eso puedo preguntar por el valor de ese atributo
      const isGoodDogString = foundDog.isGoodDog ? 'Good Dog' : 'Bad Dog'
      showDogDiv.innerHTML = `<img src="${foundDog.image}">
                              <h2>${foundDog.name}</h2>
                              <button>${isGoodDogString}</button>
                              <button class="edit" data-id="${foundDog.id}" data-action="edit">Edit this Dog!</button>
                              `

    })//fin del evento

    //debo crear un evento para cuando clickque el edit button y ademas esto me va a prellenar la info
    // en la form de editar con la misma info del dog seleccionado
    showDogDiv.addEventListener('click', (e) => {
      //pregunto para saber si el click es sobre edit eso es lo que hago con este if
          if (e.target.className === 'edit' || e.target.dataset.action === 'edit') {
            console.log("estamos 2")
            console.log(e.target) // me imprime el button button edit linea 35
            const clickedDogId = parseInt(e.target.dataset.id)
            //basicamente repito el codigo
            const foundDog = dogData.find(dog => dog.id === clickedDogId)
            // reasigo mis entradas con los valores de este perro paraque la forma se llene automaticamente
            dogNameInput.value = foundDog.name
            dogImgInput.value = foundDog.image
            // checked es una propiedad de html que permite saber si fue chequeado o no la cajita (checkbox)
            goodDogInput.checked = foundDog.isGoodDog
            dogForm.dataset.id = foundDog.id
          }
        })

        // agrego un evento al boton para cuando editen que estoy actualizando
        dogForm.addEventListener('submit', (e) => {
             e.preventDefault()
             const updateDogId = e.target.dataset.id
             fetch(`http://localhost:3000/pups/${updateDogId}`, {
               method: 'PATCH',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                 name: dogNameInput.value,
                 image: dogImgInput.value,
                 isGoodDog: goodDogInput.checked
               })
             })
             .then((r) => r.json())
             .then((updatedDog) => {
               const dogDataIdx = dogData.findIndex((dog) => dog.id === updatedDog.id)
               dogData[dogDataIdx] = updatedDog
               const isGoodDogString = updatedDog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'
               showDogDiv.innerHTML = `<img src="${updatedDog.image}" >
                                   <h2>${updatedDog.name}</h2>
                                   <button>${isGoodDogString}</button>
                                   <button class="edit" data-id="${updatedDog.id}" data-action="edit">Edit this Dog!</button>
                                   `
             })
           })






})
