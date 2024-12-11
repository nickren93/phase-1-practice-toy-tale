let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  //given code for hiding/seeking form:
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  //----------------------
  //my code:
  //get data from API and add to DOM:
  const toyCollection = document.querySelector("#toy-collection")
  fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(
    data =>{
      data.forEach(
        element => {
          const newCard = document.createElement("div")
          newCard.className = "card"
          const name = document.createElement("h2")
          const img = document.createElement("img")
          let likes = document.createElement("p")
          const button = document.createElement("button")
          button.addEventListener("click", updateLikes)
          img.className = "toy-avatar"
          button.className = "like-btn"
          name.textContent = element.name
          img.src = element.image
          likes.innerHTML = `<span id="span">${element.likes}</span> likes`
          button.id = element.id
          button.textContent = "like"
          newCard.appendChild(name)
          newCard.appendChild(img)
          newCard.appendChild(likes)
          newCard.appendChild(button)
          toyCollection.appendChild(newCard)
          
          function updateLikes(){
            element.likes = parseInt(element.likes) + 1
            likes.querySelector("span").textContent = element.likes
            updateServer(element)
          }
          
          function updateServer(data){
            fetch(`http://localhost:3000/toys/${data.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify(data)
            })
            .then(resp => resp.json())
            .then(data =>{
              console.log(data)
            })
          }
          
        }
      )
    }
  )


  //----------------------------------------------------
  //post function:
  const form = document.querySelector(".add-toy-form")
  const nameInput = document.querySelector('input[name="name"]')
  const URLInput = document.querySelector('input[name="image"]')
  
  form.addEventListener("submit", createNewToy)

  function createNewToy(eventObject){
    eventObject.preventDefault()
    const newToy = {
      name: nameInput.value,
      image: URLInput.value,
      likes: 0
    }

    addNewToyToServerAndDOM(newToy)
  }

  //------------------------------------------------------
  function addNewToyToServerAndDOM(newToy){

    const configurationObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: `${newToy.name}`,
        image: `${newToy.image}`,
        likes: `${newToy.likes}`,
      }),
    }
    //Post to Server:
    fetch("http://localhost:3000/toys", configurationObject)
    .then(resp => resp.json())
    //add to DOM:
    .then(
      data => {
        const newCard = document.createElement("div")
        newCard.className = "card"
        const name = document.createElement("h2")
        const img = document.createElement("img")
        let likes = document.createElement("p")
        const button = document.createElement("button")
        button.addEventListener("click", updateLikes)
        img.className = "toy-avatar"
        button.className = "like-btn"
        name.textContent = data.name
        img.src = data.image
        likes.innerHTML = `<span id="span">${data.likes}</span> likes`
        button.id = data.id
        button.textContent = "like"
        newCard.appendChild(name)
        newCard.appendChild(img)
        newCard.appendChild(likes)
        newCard.appendChild(button)
        toyCollection.appendChild(newCard)
        //add like button event
        function updateLikes(){
          data.likes = parseInt(data.likes) + 1
          likes.querySelector("span").textContent = data.likes
          updateServer(data)
        }
      }
    )
    
    function updateServer(data){
      fetch(`http://localhost:3000/toys/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({likes: data.likes})
      })
      .then(resp => resp.json())
      .then(data =>{
        console.log(data)
      })
    }
    
  }
});
