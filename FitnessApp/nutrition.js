const searchBar = document.getElementById('search-bar');
const foodList = document.getElementById('food-list');

const apiId = '2409fa4d';  // Your actual App ID
const apiKey = '';  // Your actual API Key

function searchFood() {
    const query = searchBar.value.trim();
    if (query === '') {
        foodList.innerHTML = '';
        return;
    }

    const apiUrl = `https://api.edamam.com/api/food-database/v2/parser?ingr=${query}&app_id=${apiId}&app_key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Log the response data
            const foods = data.hints || [];
            foodList.innerHTML = '';

            foods.forEach(item => {
                const food = item.food;
                const listItem = document.createElement('li');
                const foodName = document.createElement('h2');
                foodName.innerText = food.label;
                const foodDetails = document.createElement('p');
                foodDetails.innerHTML = `
                    Calories: ${food.nutrients.ENERC_KCAL || 'N/A'}<br>
                    Protein: ${food.nutrients.PROCNT || 'N/A'}g<br>
                    Carbs: ${food.nutrients.CHOCDF || 'N/A'}g<br>
                    Fat: ${food.nutrients.FAT || 'N/A'}g
                `;

                listItem.appendChild(foodName);
                listItem.appendChild(foodDetails);
                foodList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}


