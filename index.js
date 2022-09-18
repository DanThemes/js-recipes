// const addFavorite = () => {

// }

const searchFormEl = document.querySelector('#searchForm');
searchFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = document.querySelector('#search').value;
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
    fetchRecipes(url);
})

const toggleRecipeDetails = (favorite) => {
    const recipeDetailsTitleId = document.querySelector('.recipeDetails')?.id;

    console.log(favorite, recipeDetailsTitleId, 'i')
    if (recipeDetailsTitleId) {
        console.log('22')
        if (recipeDetailsTitleId === favorite.idMeal) {
            console.log('33')
            hideRecipeDetails();
            return;
        }
    }
    showRecipeDetails(favorite);
}

const hideRecipeDetails = (favoriteId = null) => {
    const recipeDetailsEl = document.querySelector('.recipeDetails');
    console.log(favoriteId);

    if (favoriteId === null) {
        recipeDetailsEl.id = '';
        recipeDetailsEl.innerHTML = '';
    } else if (
        recipeDetailsEl.id &&
        recipeDetailsEl.id === favoriteId
    ) {
        recipeDetailsEl.id = '';
        recipeDetailsEl.innerHTML = '';
    }
}

const showRecipeDetails = (favorite) => {
    hideRecipeDetails();
    const recipeDetailsEl = document.querySelector('.recipeDetails');
    const recipeDetailsLeft = document.createElement('ul');
    const recipeDetailsRight = document.createElement('div');

    const recipeDetailsTitle = document.createElement('h1');
    const recipeDetailsText = document.createElement('p');
    const recipeDetailsImage = document.createElement('img');

    recipeDetailsEl.id = favorite.idMeal;
    recipeDetailsTitle.textContent = favorite.strMeal;
    recipeDetailsText.textContent = favorite.strInstructions;
    recipeDetailsImage.src = favorite.strMealThumb;

    console.log(favorite);

    // Loop through all existing ingredients and measures
    for (let i = 1; i <= 20; i++) {
        if (favorite[`strIngredient${i}`].trim().length > 0) {
            const row = document.createElement('li');

            const ingredient = document.createElement('span');
            ingredient.textContent = favorite[`strIngredient${i}`].trim();

            const measure = document.createElement('span');
            measure.textContent = favorite[`strMeasure${i}`].trim();

            row.append(measure, ingredient);
            recipeDetailsLeft.append(row);
        } else {
            break;
        }
    }

    recipeDetailsEl.append(recipeDetailsLeft);
    recipeDetailsEl.append(recipeDetailsRight);
    recipeDetailsRight.append(recipeDetailsTitle, recipeDetailsText, recipeDetailsImage);
}

const refreshFavorites = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const favoritesWrapperEl = document.querySelector('.favoritesWrapper');
    document.querySelector('.favoritesWrapper').innerHTML = '';

    for (let i = 0; i < favorites.length; i++) {
        if (document.querySelector(`#favorite-${favorites[i].idMeal}`)) {
            continue;
        }
        const favoriteEl = document.createElement('div');
        const favoriteImg = document.createElement('img');
        const favoriteButton = document.createElement('button');
        
        favoriteEl.id = `favorite-${favorites[i].idMeal}`;
        favoriteImg.src = favorites[i].strMealThumb;
        favoriteImg.alt = favorites[i].strMeal;
        favoriteButton.innerHTML = '&times;';

        favoritesWrapperEl.appendChild(favoriteEl);
        favoriteEl.appendChild(favoriteImg);
        favoriteEl.appendChild(favoriteButton);

        favoriteImg.addEventListener('click', () => {
            toggleRecipeDetails(favorites[i]);
        });

        favoriteButton.addEventListener('click', () => {
            removeFavorite(favorites[i].idMeal);
        });
    }
}

const getFavorite = (favoriteId) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    return favorites.find(item => item.idMeal === favoriteId);
}

const addFavorite = (favorite) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favorites.push(favorite)

    const newFavorites = JSON.stringify(favorites);

    // console.log(newFavorites);
    localStorage.setItem('favorites', newFavorites);
    refreshFavorites(favorites);
    // console.log(favorites);
}

const removeFavorite = (favoriteId) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const newFavorites = favorites.filter(item => item.idMeal !== favoriteId)
                
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    hideRecipeDetails(favoriteId);
    refreshFavorites(favorites);
    toggleHeart(favoriteId);
}

const toggleHeart = (favoriteId) => {
    const recipeVisible = document.querySelector(`#recipe-${favoriteId} i`);
    const recipe = getFavorite(favoriteId) && recipeVisible;

    // const recipeDetails = document.querySelector('.recipeDetails');
    // if (recipeDetails.id === favoriteId) {
    //     recipeDetails.id = '';
    //     recipeDetails.innerHTML = '';
    // }
    hideRecipeDetails(favoriteId);
    // toggleRecipeDetails(getFavorite(favoriteId));

    if (recipe) {
        recipeVisible.className = 'bi bi-heart-fill';
    } else if (recipeVisible) {
        recipeVisible.className = 'bi bi-heart';
    }
}

const fetchRecipes = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    
    refreshFavorites();
    console.log(data);

    const recipesEl = document.querySelector('.recipes');
    recipesEl.innerHTML = '';

    for (const recipe of data.meals) {
        const recipeEl = document.createElement('div');
        recipeEl.id = `recipe-${recipe.idMeal}`;
        recipeEl.style.backgroundImage = `url(${recipe.strMealThumb})`;
        const recipeElTitle = document.createElement('h4');
        recipeElTitle.innerText = recipe.strMeal;

        const recipeElButton = document.createElement('i');
        if (getFavorite(recipe.idMeal)) {
            recipeElButton.className = 'bi bi-heart-fill';
        } else {
            recipeElButton.className = 'bi bi-heart';
        }

        recipeElButton.addEventListener('click', (e) => {
            // console.log(favorites)

            let favorite = recipe;

            // id: recipe.idMeal,
            // name: recipe.strMeal,
            // thumb: recipe.strMealThumb,
            // instructions: recipe.strInstructions,
            
            // Remove favorite
            if (getFavorite(favorite.idMeal)) {
                removeFavorite(favorite.idMeal);
            }
            
            // Add favorite
            else {
                addFavorite(favorite);
            }

            // Toggle heart icon class
            toggleHeart(favorite.idMeal);
        })


        recipesEl.appendChild(recipeEl);
        recipeEl.appendChild(recipeElTitle);
        recipeEl.appendChild(recipeElButton);
    }
    
}


fetchRecipes('https://www.themealdb.com/api/json/v1/1/random.php');