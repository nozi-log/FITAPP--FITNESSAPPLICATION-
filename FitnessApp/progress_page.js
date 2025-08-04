document.addEventListener('DOMContentLoaded', () => {
    // Define the workouts, default goals, and image URLs for each category
    const workouts = {
        arms: ['Bicep Curls', 'Tricep Dips'],
        shoulder: ['Shoulder Press', 'Lateral Raises'],
        chest: ['Push-Ups', 'Bench Press'],
        back: ['Pull-Ups', 'Deadlifts'],
        legs: ['Squats', 'Lunges'],
        core: ['Plank', 'Sit-Ups']
    };

    const images = {
        arms: 'images/bicep.png',       // Replace with actual image paths
        shoulder: 'images/shoulder.png',
        chest: 'images/chest.png',
        back: 'images/back.png',
        legs: 'images/leg.png',
        core: 'images/core.png'
    };

    // Load goals from localStorage or set default values
    let workoutGoals = JSON.parse(localStorage.getItem('workoutGoals')) || {
        arms: 4,
        shoulder: 4,
        chest: 4,
        back: 4,
        legs: 4,
        core: 4
    };

    // Retrieve completed workouts from localStorage
    const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts')) || [];
    const completedWorkoutsCount = completedWorkouts.reduce((count, workout) => {
        count[workout.workout] = (count[workout.workout] || 0) + 1;
        return count;
    }, {});

    // Populate the progress bars
    const progressBarsContainer = document.getElementById('progress-bars');
    Object.keys(workouts).forEach(category => {
        const total = workoutGoals[category];
        const completed = workouts[category].reduce((count, workout) => count + (completedWorkoutsCount[workout] || 0), 0);
        const percentage = (completed / total) * 100;

        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');

        const img = document.createElement('img');
        img.src = images[category]; // Set image source

        const label = document.createElement('div');
        label.classList.add('progress-bar-label');
        label.innerText = `${category.charAt(0).toUpperCase() + category.slice(1)}: ${completed}/${total} completed`;

        const container = document.createElement('div');
        container.classList.add('progress-bar-container');

        const fill = document.createElement('div');
        fill.classList.add('progress-bar-fill');
        fill.style.width = `${percentage}%`;

        container.appendChild(fill);
        progressBar.appendChild(img);
        progressBar.appendChild(label);
        progressBar.appendChild(container);
        progressBarsContainer.appendChild(progressBar);
    });

    // Create pie chart data
    const categoryCounts = Object.keys(workouts).map(category => {
        return {
            category: category.charAt(0).toUpperCase() + category.slice(1),
            count: workouts[category].reduce((count, workout) => count + (completedWorkoutsCount[workout] || 0), 0)
        };
    });

    // Draw the pie chart using Chart.js
    const ctx = document.getElementById('workout-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoryCounts.map(c => c.category),
            datasets: [{
                data: categoryCounts.map(c => c.count),
                backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Show the edit form when the "Edit Goals" button is clicked
    document.getElementById('edit-goals-button').addEventListener('click', () => {
        document.getElementById('edit-goals-form').classList.toggle('hidden');
        populateGoalsForm();
    });

    // Populate the goals form with the current goals
    function populateGoalsForm() {
        const goalsForm = document.getElementById('goals-form');
        goalsForm.innerHTML = ''; // Clear the form
        Object.keys(workouts).forEach(category => {
            const label = document.createElement('label');
            label.innerText = `${category.charAt(0).toUpperCase() + category.slice(1)}: `;
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.value = workoutGoals[category];
            input.id = `goal-${category}`;
            goalsForm.appendChild(label);
            goalsForm.appendChild(input);
            goalsForm.appendChild(document.createElement('br'));
        });
    }

    // Save the new goals when the "Save Goals" button is clicked
    document.getElementById('save-goals-button').addEventListener('click', () => {
        Object.keys(workouts).forEach(category => {
            const input = document.getElementById(`goal-${category}`);
            workoutGoals[category] = parseInt(input.value) || 0;
        });
        localStorage.setItem('workoutGoals', JSON.stringify(workoutGoals));
        location.reload(); // Refresh the page to apply changes
    });

    // Add the "Reset" button functionality
    document.getElementById('reset-button').addEventListener('click', () => {
        // Clear localStorage for completed workouts and goals
        localStorage.removeItem('completedWorkouts');
        localStorage.removeItem('workoutGoals');
        location.reload(); // Refresh the page to reset the data
    });

    // Navigate back to the Workouts page
    document.getElementById('workouts-button').addEventListener('click', () => {
        window.location.href = 'workouts.html';
    });
});



