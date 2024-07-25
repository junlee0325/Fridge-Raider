//
//querySelectors
const inputForm = document.querySelector("#inputForm");
const inputBar = document.querySelector("#inputBar");
const suggestionBox = document.querySelector("#suggestionBox");
const addBttn = document.querySelector("#addBttn");
const ingredientList = document.querySelector("#ingredientList");
const searchBttn = document.querySelector("#searchBttn");
const clearBttn = document.querySelector("#clearBttn");
const recipes = document.querySelector("#recipes");
const resultsContainer = document.querySelector("#resultsContainer");
const apiKey1 = "bf33b7c16fa74741bedf0f7361a3d435";
const apiKey2 = "7dd52ca6c6ce4367b8b935170f8666c0";

//
//Clears searchbar on refresh
inputBar.value = "";

fetch(`https://api.spoonacular.com/food/trivia/random?apiKey=${apiKey1}`)
  .then((trRes) => trRes.json())
  .then((trData) => {
    console.log(trData.text)

    document.querySelector("#trivia").textContent = `${trData.text}`;
  });

//
//Add word to "My Ingredient" list
inputForm.addEventListener("submit", addIngredient);

let ingredientArray = [];

function addIngredient(event) {
  event.preventDefault();

  let inputValue = document.querySelector("#inputBar").value;

  //Checks through recipes to see if input is will return anything
  fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${inputValue.toLowerCase()}&number=1&apiKey=${apiKey1}`
  )
    .then((respo) => respo.json())
    .then((dataaa) => {
      if (dataaa.length !== 0) {
        let listedIngredient = document.createElement("li");

        listedIngredient.className = "listItems";

        listedIngredient.textContent = `- ${inputValue.toUpperCase()} -`;

        ingredientList.appendChild(listedIngredient);

        ingredientArray.push(inputValue);

        console.log(ingredientArray);

        clearBar();
      } else {
        alert("Ingredient Not Found");

        clearBar();
      }
    });
}

//Clears bar upon adding word to "My Ingredient" list
function clearBar() {
  document.querySelector("#inputBar").value = "";
}

//
//Clears "My Ingredient" list
clearBttn.addEventListener("click", clearList);

function clearList() {
  ingredientArray = [];
  ingredientList.innerHTML = "";
}

//
//Search and display results
searchBttn.addEventListener("click", searchRecipe);

function searchRecipe() {
  resultsContainer.innerHTML = "";

  let joinedArray = ingredientArray.join(",+");

  console.log(joinedArray);

  fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${joinedArray}&ranking=1&number=5&apiKey=${apiKey1}`
  )
    .then((res) => res.json())
    .then((data) => {
      /*function sortLikes(a, b) {
       return b.likes - a.likes;
      }
      let sortedData = data.sort(sortLikes)

      console.log(sortedData)*/

      data.forEach((x) => {
        fetch(
          `https://api.spoonacular.com/recipes/informationBulk?ids=${x.id}&apiKey=${apiKey1}`
        )
          .then((resp) => resp.json())
          .then((dataa) => {
            console.log(dataa);

            let resultBox = document.createElement("div");
            resultBox.className = "resultBox";
            resultsContainer.appendChild(resultBox);

            let foodName = document.createElement("h4");
            foodName.className = "foodName";
            foodName.textContent = `${dataa[0].title}`;
            resultBox.appendChild(foodName);

            let foodImage = document.createElement("img");
            foodImage.className = "foodImage";
            foodImage.src = `${dataa[0].image}`;
            foodImage.alt = "IMAGE NOT SHOWN";
            resultBox.appendChild(foodImage);

            let recipeIngredientContainer = document.createElement("ul");
            recipeIngredientContainer.className = "recipeIngredientContainer";
            resultBox.appendChild(recipeIngredientContainer);

            dataa[0].extendedIngredients.forEach((y) => {
              let recipeIngredients = document.createElement("li");
              recipeIngredients.className = "recipeIngredients";
              recipeIngredients.textContent = `${y.original}`;
              recipeIngredientContainer.appendChild(recipeIngredients);
            });

            let instructions = document.createElement("p");
            instructions.className = "instructions";
            instructions.innerHTML = `<p>${dataa[0].instructions}</p>`;
            resultBox.appendChild(instructions);
          });
      });
    });
}
