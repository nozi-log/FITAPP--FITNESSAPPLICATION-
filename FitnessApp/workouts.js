function selectWorkout(bodyPart) {
    window.location.href = `workout-menu.html?bodyPart=${bodyPart}`;
}
// Add event listener to the "Go to Progress" button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('progress-button').addEventListener('click', () => {
        window.location.href = 'progress_page.html';
    });
});