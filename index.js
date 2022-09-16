// const addFavorite = () => {

// }

const fetchRecipe = async () => {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    
    console.log(data);

    const recipesEl = document.querySelector('.recipes');

    for (const recipe of data.meals) {
        const recipeEl = document.createElement('div');
        recipeEl.style.backgroundImage = `url(${recipe.strMealThumb})`;
        const recipeElTitle = document.createElement('h4');
        recipeElTitle.innerText = recipe.strMeal;

        const recipeElButton = document.createElement('i');
        recipeElButton.className = 'bi bi-heart';

        recipeElButton.addEventListener('click', () => {
            let favorites = JSON.parse(localStorage.getItem('favorites'));

            if (!favorites || favorites.length === 0) {
                localStorage.setItem('favorites', JSON.stringify([recipe.idMeal]))
            } else {
                favorites = favorites.find(item => item != recipe.idMeal)
                console.log(favorites)
                localStorage.setItem('favorites', JSON.stringify(favorites || []))
            }

            console.log(localStorage)
        })


        recipesEl.appendChild(recipeEl);
        recipeEl.appendChild(recipeElTitle);
        recipeEl.appendChild(recipeElButton);
    }
    
}

fetchRecipe();