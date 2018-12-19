document.addEventListener('DOMContentLoaded',(event) => {
    const dogBarDiv = document.getElementById('dog-bar')
    const dogInfo = document.getElementById('dog-info')
    const filterDogButton = document.getElementById('good-dog-filter')



    // (Step 2) Populate the names of the dogs on the dog bar

    fetch('http://localhost:3000/pups')
    .then(r => r.json())
    .then(dogs => {
        const dogBarDiv = document.getElementById('dog-bar')
        for(let dog of dogs){
            dogBarDiv.innerHTML += `<span class= 'dog-name' data-id= ${dog.id}>${dog.name}</span>`
        }
    })

    //(Step 3) Add more info on the pups that were clicked 
    dogBarDiv.addEventListener('click', (event) => {
        if(event.target.className === 'dog-name'){
            const dog_id = event.target.dataset.id

            fetch(`http://localhost:3000/pups/${dog_id}`)
            .then(r => r.json())
            .then(dog => {
                let behavior = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'
                const dogInfo = document.getElementById('dog-info')
                dogInfo.innerHTML = `  <img src=${dog.image}>
                                        <h2>${dog.name}</h2>
                                        <button data-id = ${dog.id} class= 'dog-behavior'>${behavior}</button>`
            })
        }
    })

    // Change the button and the database for good/bad pup
    dogInfo.addEventListener('click', (event) => {
        if (event.target.className ==='dog-behavior'){
            const dog_id = event.target.dataset.id
            const goodBehavior = event.target.innerHTML === 'Bad Dog!'
            fetch(`http://localhost:3000/pups/${dog_id}`,{
                    method: "PATCH",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        isGoodDog: goodBehavior
                      })

            }).then(r => r.json())
            .then(dog => {
                let behavior = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'
                event.target.innerHTML = behavior
            })

        }
    })

    //### BONUS! STEP 5: FILTER GOOD DOGS 
    filterDogButton.addEventListener('click', (event) => {
        if (event.target.innerHTML === 'Filter good dogs: OFF'){
            fetch('http://localhost:3000/pups')
            .then(r => r.json())
            .then(dogs => {
                let dogBarDiv = document.getElementById('dog-bar')
                dogBarDiv.innerHTML = ''

                for(let dog of dogs){
                    if (dog.isGoodDog){
                        dogBarDiv.innerHTML +=`<span class= 'dog-name' data-id= ${dog.id}>${dog.name}</span>`
                    }
                }
                event.target.innerHTML = 'Filter good dogs: ON'
            })
        }else{

            fetch('http://localhost:3000/pups')
            .then(r => r.json())
            .then(dogs => {
                let dogBarDiv = document.getElementById('dog-bar')
                dogBarDiv.innerHTML = ''
                for(let dog of dogs){
                    dogBarDiv.innerHTML += `<span class= 'dog-name' data-id= ${dog.id}>${dog.name}</span>`
                }
            })

            event.target.innerHTML = 'Filter good dogs: OFF'
        }
    })

})
