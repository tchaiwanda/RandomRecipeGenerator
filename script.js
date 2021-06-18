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
    let list = document.createElement("ul")
    for (let i=0; i< favoritesArray.length; i++){
      let listItem = document.createElement("li")
      listItem.setAttribute("value", favoritesArray[i].id)
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

// Creating column + rows using inner HTML
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

    let favorites = localStorage.getItem("favorites")
    favorites = JSON.parse(favorites)
    if (!favorites){
      favorites = []
    }

const newFavorite = {
  id: meal.idMeal, title: meal.strMeal
}
favorites.push(newFavorite)

localStorage.setItem("favorites", JSON.stringify(favorites))
  })
  mealContainer.prepend(saveButton)
}
