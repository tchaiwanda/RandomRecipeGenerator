const getMealBtn = document.getElementById("get_meal");
const mealContainer = document.getElementById("meal");
const getFavorites = document.getElementById("get_favorites")
const favorites = document.getElementById("favorites")

// fetch API
getMealBtn.addEventListener("click", () => {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((res) => {
      createMeal(res.meals[0]);
    });
});
// click event for favorites list
getFavorites.addEventListener("click", () => {
  let favoritesArray = JSON.parse(localStorage.getItem("favorites"))
  if (favoritesArray){
    // Puts favorites into a unordered list format
    let list = document.createElement("ul")
    // loops over favorites
    for (let i=0; i< favoritesArray.length; i++){
      // creates element list of favorites
      let listItem = document.createElement("li")
      // sets value of of list item to favorites index
      listItem.setAttribute("value", favoritesArray[i].id)
      // listening for click event on item inside the favorites list to open that saved recipe
      listItem.addEventListener("click",() =>{
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favoritesArray[i].id}`)
    .then((res) => res.json())
    .then((res) => {
      createMeal(res.meals[0]);
    });
      })
      listItem.innerText = favoritesArray[i].title
      list.append(listItem)
    }
  favorites.append(list)
  }
});

// creating meal function
function createMeal(meal) {
const ingredients =[];
// loops over all possible ingredients (20) ingredients found will push
for(i=1; i<=20; i++) {
    if(meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}  -
${meal[`strMeasure${i}`]}`
        )
    } else {
      break;
    }
}
// Shows ingredients in the console
console.log(ingredients);

// Using inner HTML to create List of ingredients, Recipe instructions and adding video.
  mealContainer.innerHTML = `
    <div class="row">
    <div class="columns five">
    <img src="${meal.strMealThumb}" alt="Meal Img" />
    
        <p><strong>Category:</strong> 
${meal.strCategory}</p>
        <p><strong>Area:</strong> 
${meal.strArea}</p>
        <p><strong>Tags:</strong> 
${meal.strTags.split(',').join(', ')}</p>

    <h5>Ingredients:</h5>
    <ul>
${ingredients.map(ingredient => `
          <li>${ingredient}</li>
        `).join('')}
    </ul>
  </div>
  <div class="columns seven">
  <h4>${meal.strMeal}</h4>
  <p>${meal.strInstructions}</p>
  </div>
  </div>
          <div class="row">
          <h5>Video Recipe:</h5>
          <div class="videoWrapper">
          <iframe 
src="https://youtube.com/embed/${meal.strYoutube.slice(-11)}" />
        </div>
`;
// creating add to favorites button with click event
let saveButton = document.createElement("button")
  saveButton.innerText = "Add To Favorites"

  saveButton.addEventListener("click",() =>{
// Stores clicked item to favorites
    let favorites = localStorage.getItem("favorites")
    favorites = JSON.parse(favorites)
    if (!favorites){
      favorites = []
    }
// stores favorite by id and name
const newFavorite = {
  id: meal.idMeal, title: meal.strMeal
}
favorites.push(newFavorite)

localStorage.setItem("favorites", JSON.stringify(favorites))
  })
  // shows it on the screen
  mealContainer.prepend(saveButton)
}
