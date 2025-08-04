document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bodyPart = urlParams.get('bodyPart');

    const bodyPartTitle = document.getElementById('body-part-title');
    bodyPartTitle.innerText = `${bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)} Workouts`;

    const workoutList = document.getElementById('workout-list');

    const workouts = {
        arms: ['Bicep Curls', 'Tricep Dips'],
        shoulder: ['Shoulder Press', 'Lateral Raises'],
        chest: ['Push-Ups', 'Bench Press'],
        back: ['Pull-Ups', 'Deadlifts'],
        legs: ['Squats', 'Lunges'],
        core: ['Plank', 'Sit-Ups']
    };

    const selectedWorkouts = workouts[bodyPart] || [];

    selectedWorkouts.forEach(workout => {
        const listItem = document.createElement('li');
        const workoutLabel = document.createElement('span');
        workoutLabel.innerText = workout;
        const completeButton = document.createElement('button');
        completeButton.innerText = 'Complete';
        completeButton.onclick = () => completeWorkout(workout);

        listItem.appendChild(workoutLabel);
        listItem.appendChild(completeButton);
        workoutList.appendChild(listItem);
    });
});

function completeWorkout(workout) {
    console.log(`${workout} completed`);
    
    // Get existing completed workouts from localStorage or initialize if not present
    const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts')) || [];
    
    // Add the new completed workout
    const completedWorkout = {
        workout: workout,
        date: new Date().toISOString().split('T')[0] // Store the completion date
    };
    completedWorkouts.push(completedWorkout);

    // Save updated completed workouts back to localStorage
    localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
    
    // Optionally, you can visually indicate that the workout is complete
    alert(`${workout} marked as completed`);
}
// Add event listener to the "Go to Progress" button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('progress-button').addEventListener('click', () => {
        window.location.href = 'progress_page.html';
    });
});