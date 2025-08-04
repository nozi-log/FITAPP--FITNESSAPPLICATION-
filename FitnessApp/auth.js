// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCD8wuUiQNmvrDRVwboAMjqa21MCr-QLpA",
    authDomain: "fitness-app-2b0cc.firebaseapp.com",
    projectId: "fitness-app-2b0cc",
    storageBucket: "fitness-app-2b0cc.appspot.com",
    messagingSenderId: "7078058985",
    appId: "1:7078058985:web:400fb97314019a7b7ac978",
    measurementId: "G-BT63PVMTYK",
    databaseURL: "https://fitness-app-2b0cc-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }

    const profilePicInput = document.getElementById('profile-pic');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', displayProfilePicture);
    }

    const cameraButton = document.getElementById('camera-button');
    if (cameraButton) {
        cameraButton.addEventListener('click', accessCamera);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }
});

// Function to handle user registration
function registerUser(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const birthday = document.getElementById('birthday').value;
    const profilePic = document.getElementById('profile-pic').files[0];

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Firebase authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            const user = userCredential.user; // Get the signed-in user
            console.log("User registered:", user.uid);

            // Upload profile picture if it exists
            if (profilePic) {
                const storageRef = storage.ref('profile_pictures/' + user.uid + '/' + profilePic.name);
                storageRef.put(profilePic).then(function(snapshot) {
                    console.log('Uploaded a profile picture!');
                    return storageRef.getDownloadURL();
                }).then(function(url) {
                    storeUserInfo(user.uid, name, username, email, phone, address, birthday, url);
                }).catch(handleUploadError);
            } else {
                storeUserInfo(user.uid, name, username, email, phone, address, birthday, null);
            }
        })
        .catch(function(error) {
            alert(error.message);
        });
}

function storeUserInfo(userId, name, username, email, phone, address, birthday, profilePicURL) {
    database.ref('users/' + userId).set({
        name: name,
        username: username,
        email: email,
        phone: phone,
        address: address,
        birthday: birthday,
        profilePicture: profilePicURL // Store the profile picture URL
    })
    .then(() => {
        console.log('User info saved successfully!');
        alert('User registered successfully');
        window.location.href = 'login.html'; // Redirect to login page
    })
    .catch(handleDatabaseError);
}


// Function to display profile picture
function displayProfilePicture(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const profilePictureElement = document.getElementById('profile-picture');
        profilePictureElement.src = e.target.result;
        profilePictureElement.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Function to access the camera
function accessCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const video = document.getElementById('camera-stream');
            video.srcObject = stream;
            video.play();
        })
        .catch(function(error) {
            console.error('Error accessing the camera:', error);
        });
}

// Function to capture a photo from the video stream
function capturePhoto() {
    const canvas = document.createElement('canvas');
    const video = document.getElementById('camera-stream');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    document.getElementById('profile-picture').src = dataUrl;
    document.getElementById('profile-picture').style.display = 'block';

    // Convert data URL to file and assign to input
    const file = dataURLtoFile(dataUrl, 'profile-picture.png');
    document.getElementById('profile-pic').files = createFileList(file);
}

// Convert data URL to a file
function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// Create a file list for the file input
function createFileList(file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
}

// Function to handle user login
function loginUser(e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const password = passwordInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            const user = userCredential.user; // Get the signed-in user
            console.log("User logged in:", user.uid);
            
            // Fetch user data from the database and redirect to index.html
            return fetchUserData(user.uid);
        })
        .then(userData => {
            if (userData) {
                console.log('User data retrieved:', userData);
                // You can process userData here if needed
            }
            window.location.href = 'index.html'; // Redirect to index page
        })
        .catch(function(error) {
            alert(error.message);
        });
}

// Function to fetch user data from the database
function fetchUserData(userId) {
    return database.ref('users/' + userId).once('value').then(function(snapshot) {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log('User data retrieved:', userData);
            // You can process userData if needed here
            return userData; // Return userData for further use
        } else {
            console.log('No user data found for this user.');
            return null; // Return null if no data found
        }
    }).catch(function(error) {
        console.error('Error fetching user data:', error);
    });
}


// Function to display user data on the page
function displayUserData(userData) {
    const userDataDiv = document.getElementById('user-data');
    userDataDiv.innerHTML = `
        <h2>User Information</h2>
        <p><strong>Name:</strong> ${userData.name}</p>
        <p><strong>Username:</strong> ${userData.username}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Phone:</strong> ${userData.phone}</p>
        <p><strong>Address:</strong> ${userData.address}</p>
        <p><strong>Birthday:</strong> ${userData.birthday}</p>
        ${userData.profilePicture ? `<img src="${userData.profilePicture}" alt="Profile Picture" />` : ''}
    `;
}

// Error handling functions
function handleUploadError(error) {
    console.error('Error uploading profile picture: ', error);
    alert('Error uploading profile picture. Please try again.');
}

function handleDatabaseError(error) {
    console.error('Error saving user info:', error);
    alert('Error saving user information. Please try again.');
}
