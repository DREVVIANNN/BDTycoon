    let bitdrevv = 0;
        let upgradeCost = 10;
        let miningPower = 1;
        let user = null;
        let currentEXP = 0; 
        let userLevel = 1; 

        document.getElementById("mine-btn").addEventListener("click", () => {
            bitdrevv += 1 * miningPower;
            updateUI();
            saveUserData();
        });

        document.getElementById("upgrade-btn").addEventListener("click", () => {
            if (bitdrevv >= upgradeCost) {
                bitdrevv -= upgradeCost;
                miningPower++;
                upgradeCost = Math.ceil(upgradeCost * 5);
                updateUI();
                saveUserData();
            }
        });

        function updateUI() {
            document.getElementById("bitdrevv").textContent = bitdrevv;
            document.getElementById("upgrade-cost").textContent = upgradeCost;
        }

        function saveUserData() {
            if (auth.currentUser) {
                const userRef = db.collection("users").doc(user.uid);
                user && user.uid && db.collection("users").doc(user.uid).set({
                    bitdrevv: bitdrevv,
                    upgradeCost: upgradeCost,
                    miningPower: miningPower
                });
            }
        }

        function loadUserData() {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        let data = doc.data();
                        bitdrevv = data.bitdrevv || 0;
                        coins = data.coins || 0;
                        upgradeCost = data.upgradeCost || 10;
                        miningPower = data.miningPower || 1;
                        updateUI();
        
                        // Show Blue Verified Badge for Developer
                        if (user.email === "fazrelmsyamil@gmail.com") {
                            document.getElementById("verified-badge").style.display = "inline";
                        }
                        // Show Blue Verified Badge for Developer
                        if (user.email === "sigmaboys968573@gmail.com") {
                            document.getElementById("verified-badge").style.display = "inline";
                        }
                    }
                });
            }
        }
        

        document.getElementById("login-google").addEventListener("click", () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then((result) => {
                user = result.user;
                document.getElementById("user-photo").src = user.photoURL;
                document.getElementById("user-photo").style.display = "block";
                document.getElementById("user-info").style.display = "flex";
                document.getElementById("username").textContent = user.displayName;
                document.getElementById("login-google").style.display = "none";
                document.getElementById("logout-btn").style.display = "block";
        
                const userRef = db.collection("users").doc(user.uid);
                
                // Check if the user already has data in Firestore
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        // Load existing Firebase data
                        console.log("User found in database, loading progress...");
                         // Check if the user is the developer
            const isDeveloper = (user.email === "fazrelmsyamil@gmail.com");
            const isVerifiedUser = (user.email === "sigmaboys968573@gmail.com");

            // Store user data in Firestore
            const userRef = db.collection("users").doc(user.uid);
            userRef.set({
                email: user.email,
                username: user.displayName,
                verified: isDeveloper, // Save verified status
            }, { merge: true }) // Prevent overwriting existing data

                        loadUserData();
                    } else {
                        // 🚀 Transfer guest progress to Firestore if available
                        bitdrevv = parseInt(localStorage.getItem("bitdrevv")) || 10; // New users get 10 BTD
                        upgradeCost = parseInt(localStorage.getItem("upgradeCost")) || 10;
                        miningPower = parseInt(localStorage.getItem("miningPower")) || 1;
        
                        // Save transferred progress to Firestore
                        saveUserData();
                    }
                });
            });
        });
        

        document.getElementById("logout-btn").addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                user = null;
                bitdrevv = 0;
                upgradeCost = 10;
                miningPower = 1;
                updateUI();
                document.getElementById("user-info").style.display = "none";
                document.getElementById("login-google").style.display = "block";
            });
        });

        function loadUserData() {
            if (auth.currentUser) {
                const userRef = db.collection("users").doc(auth.currentUser.uid);
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        let data = doc.data();
                        bitdrevv = data.bitdrevv || 0;
                        coins = data.coins || 0;
                        upgradeCost = data.upgradeCost || 10;
                        miningPower = data.miningPower || 1;
        
                        // **Check Verified Badge**
                        if (data.verified === true) {
                            document.getElementById("verified-badge").style.display = "inline-block";
                        } else {
                            document.getElementById("verified-badge").style.display = "none";
                        }
        
                        updateUI();
                    }
                });
            }
        }
        
        
        function googleLogin() {
            const provider = new firebase.auth.GoogleAuthProvider();
        
            firebase.auth().signInWithPopup(provider)
                .then(result => {
                    const user = result.user;
                    if (user) {
                        document.getElementById("username").textContent = user.displayName;
                        document.getElementById("login-google").style.display = "none";
                        document.getElementById("logout-btn").style.display = "block";
                        document.getElementById("user-info").style.display = "flex";
                        document.getElementById("user-photo").src = user.photoURL;
                        document.getElementById("user-photo").style.display = "block";
        
                        const userRef = db.collection("leaderboard").doc(user.uid);
        
                        userRef.get().then((doc) => {
                            if (!doc.exists) {
                                userRef.set({
                                    username: user.displayName || "Anonymous",
                                    btd: 0,  
                                    verified: false  // Default: Not verified
                                });
                            }
                        });
                    }
                })
                .catch(error => console.error("Login error:", error));
        }
        
        
        
        
        function saveUserData() {
            if (user) {
                console.log("📤 Saving progress for user:", user.uid);
        
                db.collection("users").doc(user.uid).set({
                    bitdrevv: bitdrevv,
                    upgradeCost: upgradeCost,
                    miningPower: miningPower,
                }).then(() => {
                    console.log("✅ Progress saved successfully.");
                }).catch(error => {
                    console.error("❌ Error saving progress:", error);
                });
            } else {
                console.log("🟡 No logged-in user. Saving progress to local storage...");
                localStorage.setItem("bitdrevv", bitdrevv);
                localStorage.setItem("upgradeCost", upgradeCost);
                localStorage.setItem("miningPower", miningPower);
            }
        }
        



const firebaseConfig = {
    apiKey: "AIzaSyBtmafoTlFm8EARO3i8kKVPOJjVph3On3M",
    authDomain: "login-77493.firebaseapp.com",
    projectId: "login-77493",
    storageBucket: "login-77493.firebasestorage.app",
    messagingSenderId: "851224192233",
    appId: "1:851224192233:web:eb95330e8ec6ae326bfc78"
  };
  firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => console.log("✅ Firebase Auth Persistence Enabled"))
    .catch(error => console.error("❌ Auth Persistence Error:", error));


    firebase.auth().onAuthStateChanged((loggedUser) => {
        if (loggedUser) {
            user = loggedUser;
            console.log("✅ User logged in:", user.displayName);
    
            // Update UI with user info
            document.getElementById("user-photo").src = user.photoURL;
            document.getElementById("user-photo").style.display = "block";
            document.getElementById("user-info").style.display = "flex";
            document.getElementById("username").textContent = user.displayName;
            document.getElementById("login-google").style.display = "none";
            document.getElementById("logout-btn").style.display = "inline";

            // **Check if the user is the developer, show blue checkmark**
        if (user.email === "fazrelmsyamil@gmail.com") {
            document.getElementById("verified-badge").style.display = "inline-block";
        } else {
            document.getElementById("verified-badge").style.display = "none";
        }
            // **Check if the user is the developer, show blue checkmark**
        if (user.email === "sigmaboys968573@gmail.com") {
            document.getElementById("verified-badge").style.display = "inline-block";
        } else {
            document.getElementById("verified-badge").style.display = "none";
        }
    
            // ✅ Call `loadUserData()` to retrieve progress from Firestore
            loadUserData();
        } else {
            console.log("🟡 No user logged in. Loading guest progress...");
    
            // Load progress from Local Storage for guests
            bitdrevv = parseInt(localStorage.getItem("bitdrevv")) || 0;
            upgradeCost = parseInt(localStorage.getItem("upgradeCost")) || 10;
            miningPower = parseInt(localStorage.getItem("miningPower")) || 1;
    
            updateUI();
        }
    });

    function mineBitdrevv() {
        let bitdrevv = parseInt(localStorage.getItem("bitdrevv") || "0");
        bitdrevv += 10; 
        localStorage.setItem("bitdrevv", bitdrevv);
        document.getElementById("bitdrevv").textContent = bitdrevv;
    
        const user = firebase.auth().currentUser;
        if (user) {
            const userRef = db.collection("leaderboard").doc(user.uid);
    
            userRef.get().then(doc => {
                if (doc.exists) {
                    let data = doc.data();
                    userRef.set({
                        username: user.displayName || "Anonymous",
                        btd: bitdrevv,
                        verified: data.verified || false // Keep the verified status
                    }, { merge: true });
                }
            }).catch(error => console.error("Firestore update error:", error));
        }
    }
    
    
    

    function displayLeaderboard() {
        const leaderboardRef = db.collection("leaderboard").orderBy("btd", "desc");
    
        leaderboardRef.onSnapshot((snapshot) => {
            const leaderboardList = document.getElementById("leaderboard-list");
            leaderboardList.innerHTML = ""; // Clear old data
    
            snapshot.forEach((doc) => {
                const data = doc.data();
                const listItem = document.createElement("li");
    
                // Check if user is verified
                const verifiedBadge = data.verified ? '<span id="verified-badge"><i class="ri-verified-badge-fill"></i></span>' : "";
    
                listItem.innerHTML = `<strong>${data.username}</strong> ${verifiedBadge} - ${data.btd} BTD`;
                leaderboardList.appendChild(listItem);
            });
        }, (error) => {
            console.error("Error fetching leaderboard:", error);
        });
    }
    
    // Load leaderboard when page opens
    document.addEventListener("DOMContentLoaded", displayLeaderboard);
    
    
    
    const emailRef = db.collection("emails");

// Check if logged-in user is the developer
firebase.auth().onAuthStateChanged((user) => {
    if (user && user.email === "fazrelmsyamil@gmail.com") {
        document.getElementById("send-email-container").style.display = "block";
    }
});

// Function to send email (only for the developer)
function sendEmail() {
    const message = document.getElementById("email-message").value;
    if (!message) return;

    const user = firebase.auth().currentUser;

    emailRef.add({
         username: user.displayName,
        photoURL: user.photoURL,
        verified: true, // Developer is verified
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: message,
        loves: 0,
        lovedBy: {}
    }).then(() => {
        document.getElementById("email-message").value = "";
        alert("Email sent to all players!");
    }).catch((error) => {
        console.error("Error sending email:", error);
    });
}

function loveMessage(emailId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You need to log in to love messages!");
        return;
    }

    const emailRef = db.collection("emails").doc(emailId);

    db.runTransaction(async (transaction) => {
        const doc = await transaction.get(emailRef);
        if (!doc.exists) {
            throw "Document does not exist!";
        }

        let data = doc.data();
        let lovesByUsers = data.lovedBy || {}; // Track loves
        let currentLoves = data.loves || 0;

        if (lovesByUsers[user.uid]) {
            // User already loved it, so remove
            delete lovesByUsers[user.uid];
            currentLoves--;
        } else {
            // User hasn't loved it, so add
            lovesByUsers[user.uid] = true;
            currentLoves++;
        }

        // Update Firestore
        transaction.update(emailRef, { loves: currentLoves, lovedBy: lovesByUsers });
    }).catch((error) => {
        console.error("Error updating love:", error);
    });
}




function loadEmails() {
    db.collection("emails").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        const emailList = document.getElementById("email-list");
        emailList.innerHTML = ""; // Clear previous messages

        snapshot.forEach((doc) => {
            const data = doc.data();
            let loveCount = data.lovedBy ? Object.keys(data.lovedBy).length : 0;

            const listItem = document.createElement("li");

            const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : "Just now";
            let usernameHTML = `<strong>${data.username}</strong>`;
            if (data.verified) {
                usernameHTML += ' <span id="verified-badge"><i class="ri-verified-badge-fill"></i></span>';
            }

            listItem.innerHTML = `
                <div class="email-header">
                    <img class="user-photo" src="${data.photoURL || 'default-avatar.png'}" alt="Profile">
                    <div>
                        <span>${usernameHTML}</span>
                        <small>${date}</small>
                    </div>
                </div>
                <p class="email-message">${data.message}</p>
                <a class="love-btn" onclick="loveMessage('${doc.id}')">
                    <i class="ri-heart-fill"></i> <span id="love-count-${doc.id}">${loveCount}</span>
                </a>
            `;

            emailList.appendChild(listItem);
        });
    });
}






// Load emails on page load
document.addEventListener("DOMContentLoaded", loadEmails);

const maintenanceRef = firebase.firestore().collection("serverStatus").doc("status");

// Function to check maintenance status
function checkMaintenance() {
    db.collection("settings").doc("server").onSnapshot((doc) => {
        if (doc.exists && doc.data().maintenance) {
            // Hide the game and show maintenance message
            document.body.innerHTML = `
                <h2>🚧 Server Under Maintenance 🚧</h2>
                <p>The game is currently undergoing maintenance. Please refresh the website again later.</p>
                <p>~ BitDTycoon Team.<i class="ri-verified-badge-fill"></i></p>
            `;
        } else {
            // Reload the normal game UI
            location.reload();
        }
    });
}

// Run this function when the page loads
checkMaintenance();



// Function to start maintenance (Called when Firestore updates)
function startMaintenance() {
    document.body.innerHTML = `
        <div style="text-align:center; font-size:15px; margin-top:50px;">
            <h2>🚧 Server Under Maintenance 🚧</h2>
            <p>The server is currently undergoing maintenance. Please refresh the website again later.</p>
            <p>~ BDTycoon Team.<i class="ri-verified-badge-fill"></i></p>
        </div>
    `;

    // Stop all game interactions
    clearInterval(miningInterval); 
    firebase.auth().signOut(); // Log out users
}

// Function to play song (user interaction required)
function playMaintenanceSong() {
    let audio = new Audio("Growtopia Update Song.mp3"); // Replace with your actual file URL
    audio.play().catch(error => console.error("Autoplay failed:", error));
}


// Function to toggle maintenance mode (Only for Developer)
function toggleMaintenance(status) {
    maintenanceRef.set({ maintenance: status }).then(() => {
        alert(`Server maintenance ${status ? "started" : "ended"}`);
    }).catch((error) => {
        console.error("Error updating maintenance status:", error);
    });
}

// Listen for Firestore changes in real-time
maintenanceRef.onSnapshot((doc) => {
    if (doc.exists && doc.data().maintenance === true) {
        startMaintenance();
    }
});

// Check maintenance status when page loads
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        checkMaintenance();
    }
});


function toggleMaintenance(state) {
    const settingsRef = db.collection("settings").doc("server");

    settingsRef.set({ maintenance: state }, { merge: true })
    .then(() => {
        console.log("Maintenance mode updated:", state);
        alert(state ? "Server is now under maintenance!" : "Server is now active!");
    })
    .catch((error) => {
        console.error("Error updating maintenance status:", error);
    });
}


// Load messages in real-time
function loadMessages() {
    db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
        const chatBox = document.getElementById("chat-box");
        chatBox.innerHTML = ""; // Clear previous messages

        snapshot.forEach(doc => {
            const data = doc.data();
            const messageElement = document.createElement("div");
            messageElement.classList.add("chat-message");
        
            // Check if the user is verified
            const verifiedBadge = data.verified ? '<span id="verified-badge"><i class="ri-verified-badge-fill"></i></span>' : '';
        
            // Display user profile at the top and message below
            messageElement.innerHTML = `
                <div class="user-info">
                    <img src="${data.photoURL}" class="chat-avatar">
                    <strong>${data.username}${verifiedBadge}</strong>
                    ${firebase.auth().currentUser && firebase.auth().currentUser.uid === data.uid ? 
                        `<a onclick="deleteMessage('${doc.id}')" class="delete-btn"><i class="ri-delete-bin-line"></i></a>` : ""}
                </div>
                <div class="message-content">
                    <p>${data.message}</p>
                </div>
            `;
        
            chatBox.appendChild(messageElement);
        });
        
        

        // Auto-scroll to latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Send message to Firestore
function sendMessage() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You need to log in to chat!");
        return;
    }

    const messageText = document.getElementById("message-input").value;
    if (!messageText.trim()) return;

    db.collection("messages").add({
        uid: user.uid,
        username: user.displayName,
        photoURL: user.photoURL,
        message: messageText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById("message-input").value = ""; // Clear input
    }).catch(error => console.error("Error sending message:", error));
}

// Delete own message
function deleteMessage(messageId) {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const messageRef = db.collection("messages").doc(messageId);

    messageRef.get().then(doc => {
        if (doc.exists && doc.data().uid === user.uid) {
            messageRef.delete().catch(error => console.error("Error deleting message:", error));
        }
    });
}

// Enable chat when user logs in
firebase.auth().onAuthStateChanged(user => {
    const inputField = document.getElementById("message-input");
    const sendButton = document.querySelector("#chat-container button");

    if (user) {
        inputField.disabled = false;
        sendButton.disabled = false;
        loadMessages(); // Start loading chat messages
    } else {
        inputField.disabled = true;
        sendButton.disabled = true;
    }
});

// List of verified users
const verifiedUsers = ["fazrelmsyamil@gmail.com", "sigmaboys968573@gmail.com"];

// Function to create a chat message
function createMessage(email, username, message) {
    const chatContainer = document.querySelector(".chat-container");

    // Check if user is verified
    let verifiedBadge = "";
    if (verifiedUsers.includes(email)) {
        verifiedBadge = `<span class="verified-badge">🔹</span>`;
    }

    // Message HTML
    const messageHTML = `
        <div class="message">
            <div class="profile">
                <img src="default-avatar.png" class="chat-avatar">
                <span class="username">${username} ${verifiedBadge}</span>
            </div>
            <div class="message-content">${message}</div>
        </div>
    `;

    // Append message
    chatContainer.innerHTML += messageHTML;
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to bottom
}


// Check if user is logged in
function checkAuthState(user) {
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const loginMessage = document.getElementById("login-message");

    if (user) {
        // User is logged in, enable chat input
        messageInput.disabled = false;
        sendButton.disabled = false;
        loginMessage.style.display = "none";
    } else {
        // Guest mode: Show messages but disable input
        messageInput.disabled = true;
        sendButton.disabled = true;
        loginMessage.style.display = "block"; // Show login required message
    }
}

// Simulate Firebase Authentication state change
firebase.auth().onAuthStateChanged((user) => {
    checkAuthState(user);
});

auth.onAuthStateChanged(user => {
    if (user) {
        setupQuests(user.uid);
        updateUserProfile(user.uid);
    } else {
        // If no user is logged in, show quests but disable tracking
        loadQuests("guest");
    }
});

// Define quests
const quests = [
    { id: "quest1", title: "Mine 5000 BitDrevv", target: 5000, rewardExp: 500, bitdrevv: 1000 },
    { id: "quest2", title: "Mine 10,000 BitDrevv", target: 10000, rewardExp: 1000, bitdrevv: 1500 },
    { id: "quest3", title: "Mine 50,000 BitDrevv", target: 50000, rewardExp: 2500, bitdrevv: 5000 }
];

// Set up quests for logged-in users
function setupQuests(userId) {
    const userQuestsRef = db.collection("users").doc(userId).collection("quests");

    userQuestsRef.get().then(snapshot => {
        if (snapshot.empty) {
            quests.forEach(quest => {
                userQuestsRef.doc(quest.id).set({
                    title: quest.title,
                    progress: 0,
                    target: quest.target,
                    rewardExp: quest.rewardExp,
                    bitdrevv: quest.bitdrevv
                });
            });
        }
        loadQuests(userId);
    });
}

// Load and display quests
function loadQuests(userId) {
    const questContainer = document.getElementById("quest-container");
    questContainer.innerHTML = "";

    let userQuestsRef = userId === "guest"
        ? db.collection("globalQuests") // Guest users see static quests
        : db.collection("users").doc(userId).collection("quests");

    userQuestsRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            let quest = doc.data();
            let questId = doc.id;

            let questDiv = document.createElement("div");
            questDiv.classList.add("quest-item");

            let questTitle = document.createElement("h3");
            questTitle.textContent = quest.title;

            let questProgress = document.createElement("p");
            questProgress.textContent = `Progress: ${quest.progress || 0} / ${quest.target}`;

            let claimButton = document.createElement("button");
            claimButton.textContent = "Claim Reward";
            claimButton.classList.add("claim-button");

            if (userId === "guest") {
                claimButton.disabled = true;
                claimButton.style.backgroundColor = "gray";
                claimButton.textContent = "Login to Claim";
            } else {
                if (quest.progress >= quest.target) {
                    claimButton.disabled = false;
                    claimButton.style.backgroundColor = "green";
                } else {
                    claimButton.disabled = true;
                    claimButton.style.backgroundColor = "gray";
                }

                claimButton.addEventListener("click", () => claimReward(userId, questId, quest));
            }

            questDiv.appendChild(questTitle);
            questDiv.appendChild(questProgress);
            questDiv.appendChild(claimButton);
            questContainer.appendChild(questDiv);
        });
    });
}

// Function to claim quest rewards
function claimReward(userId, questId, quest) {
    if (quest.progress < quest.target) return;

    const userRef = db.collection("users").doc(userId);

    userRef.get().then(userDoc => {
        if (userDoc.exists) {
            let userData = userDoc.data();
            let newEXP = (userData.exp || 0) + quest.rewardExp;
            let bitdrevv = (userData.bitdrevv || 0) + quest.bitdrevv;

            userRef.update({
                exp: newEXP,
                bitdrevv: bitdrevv
            }).then(() => {
                userRef.collection("quests").doc(questId).delete().then(() => {
                    loadQuests(userId);
                    updateUserProfile(userId);
                });
            });
        }
    });
}

// Function to update user profile (for EXP bar)
function updateUserProfile(userId) {
    const userRef = db.collection("users").doc(userId);

    userRef.get().then(doc => {
        if (doc.exists) {
            let userData = doc.data();
            document.getElementById("user-exp").textContent = `EXP: ${userData.exp || 0} / 1000`;

            // Update progress bar
            let expBar = document.getElementById("exp-bar");
            expBar.style.width = ((userData.exp || 0) / 1000) * 100 + "%";
        }
    });
}

// Function to update mining progress
function updateMiningProgress(userId, bitdrevv) {
    if (!userId || userId === "guest") return; // Prevent guests from updating progress

    const userQuestsRef = db.collection("users").doc(userId).collection("quests");

    userQuestsRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            let quest = doc.data();
            let newProgress = Math.min((quest.progress || 0) + bitdrevv, quest.target);

            userQuestsRef.doc(doc.id).update({ progress: newProgress }).then(() => {
                loadQuests(userId);
            });
        });
    });
}

function loadQuests(userId) {
    const questContainer = document.getElementById("quest-container");
    questContainer.innerHTML = "";

    let userQuestsRef = userId === "guest"
        ? db.collection("globalQuests") // Load public quests for guests
        : db.collection("users").doc(userId).collection("quests"); // Load quests for logged-in users

    userQuestsRef.get().then(snapshot => {
        if (snapshot.empty) {
            console.log("No quests available.");
            return;
        }

        snapshot.forEach(doc => {
            let quest = doc.data();
            let questId = doc.id;

            let questDiv = document.createElement("div");
            questDiv.classList.add("quest-item");

            let questTitle = document.createElement("h3");
            questTitle.textContent = quest.title;

            let questProgress = document.createElement("p");
            questProgress.textContent = `Progress: ${quest.progress || 0} / ${quest.target}`;

            let claimButton = document.createElement("button");
            claimButton.textContent = "Claim Reward";
            claimButton.classList.add("claim-button");

            if (userId === "guest") {
                claimButton.disabled = true;
                claimButton.style.backgroundColor = "gray";
                claimButton.textContent = "Login to Claim";
            } else {
                if (quest.progress >= quest.target) {
                    claimButton.disabled = false;
                    claimButton.style.backgroundColor = "green";
                } else {
                    claimButton.disabled = true;
                    claimButton.style.backgroundColor = "gray";
                }

                claimButton.addEventListener("click", () => claimReward(userId, questId, quest));
            }

            questDiv.appendChild(questTitle);
            questDiv.appendChild(questProgress);
            questDiv.appendChild(claimButton);
            questContainer.appendChild(questDiv);
        });
    });
}
