    import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
    import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
    import { getFirestore, collection, addDoc, setDoc, doc  } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

    const firebaseConfig = {
      apiKey: "AIzaSyCQcwvZ1dDIWqn5T7aU7KIGlg9GMslvDmI",
      authDomain: "bott-60537.firebaseapp.com",
      projectId: "bott-60537",
      storageBucket: "bott-60537.appspot.com",
      messagingSenderId: "155707196801",
      appId: "1:155707196801:web:1b2c1d287b77bc9662d480",
      measurementId: "G-B0SQBQLD0E"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const adminEmails = ["abdulrehmanshoaib136@gmail.com"];

    const googleSigninBtn = document.getElementById("google-signin-btn");
    const signOutBtn = document.getElementById("sign-out-btn");

    googleSigninBtn.addEventListener("click", () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider).catch(error => console.error(error.message));
    });

    signOutBtn.addEventListener("click", () => {
      signOut(auth).then(() => location.reload()).catch(error => console.error(error.message));
    });

    auth.onAuthStateChanged(user => {
        const authContainer = document.getElementById("auth-container");
        const logo = document.getElementById("logo");
        const signOutBtn = document.getElementById("sign-out-btn");
        const adminPanel = document.getElementById("admin-panel");
        const recommendIntents = document.getElementById("recommend-intents");
        const userInfo = document.getElementById("user-info");
        const userName = document.getElementById("user-name");
        const userPfp = document.getElementById("user-pfp");
        const signInBtn = document.getElementById("google-signin-btn");

        if (user) {
            authContainer.style.display = "flex";
            logo.style.display = "flex";
            signOutBtn.style.display = "inline-block";

            // Show admin panel or recommend panel
            if (adminEmails.includes(user.email)) {
            adminPanel.style.display = "block";
            } else {
            recommendIntents.style.display = "block";
            }

            // Show user info (name + profile picture)
            userInfo.style.display = "flex";
            userInfo.style.alignItems = "center";
            userInfo.style.gap = "10px";
            signInBtn.style.display = "none";
            userName.textContent = user.displayName || user.email;
            userPfp.src = user.photoURL || "default-pfp.png"; // fallback if no photo

        } else {
            signInBtn.style.display = "flex";
            authContainer.style.display = "flex";
            userInfo.style.display = "none"; // hide user info when signed out
        }
        });

    document.getElementById("add-intent-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const prompt = document.getElementById("intent-prompt").value.split(";");
        const keywords = document.getElementById("intent-keywords").value.split(";");
        const answer = document.getElementById("intent-answer").value.split(";");
        const context = document.getElementById("intent-context").value.split(";");
        const contextAnswers = document.getElementById("intent-context-answers").value.split(";");
        const priority = parseInt(document.getElementById("intent-priority").value);
        const name = document.getElementById("intent-name").value.trim();

        if (!name) {
            alert("Please enter a name for the intent.");
            return;
        }

        try {
            await setDoc(doc(db, "intents", name), {
            prompts: prompt,
            keywords: keywords,
            answers: answer,
            context: context,
            contextAnswers: contextAnswers,
            priority: priority,
            intent_name: name
            });
            alert("Intent added successfully!");
            e.target.reset();
        } catch (error) {
            console.error("Error adding intent:", error.message);
        }
    });


    document.getElementById("add-mapdata-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const docId = prompt("Please enter the document ID for this map data:");
        if (!docId) {
            alert("Document ID is required. Please enter a valid ID.");
            return;
        }

        const search = document.getElementById("map-search").value.trim();
        const prompts = document.getElementById("map-prompts").value.split(";");
        const answers = document.getElementById("map-answers").value.split(";");
        const priority = parseInt(document.getElementById("map-priority").value);

        try {
            // Create the document with the manually provided `docId`
            await setDoc(doc(db, "mapdata", docId), {
            search: search,
            prompts: prompts,
            answers: answers,
            priority: priority
            });
            // Show an alert with the docId provided by the admin
            alert(`Map data added successfully with docId: "${docId}"`);
            e.target.reset();
        } catch (error) {
            console.error("Error adding map data:", error.message);
        }
    });


    document.getElementById("recommend-intent-form").addEventListener("submit", e => {
      e.preventDefault();
      const prompt = document.getElementById("recommend-prompt").value.split(";");
      const keywords = document.getElementById("recommend-keywords").value.split(";");
      const answer = document.getElementById("recommend-answer").value.split(";");
      const context = document.getElementById("recommend-context").value.split(";");
      const contextAnswers = document.getElementById("recommend-context-answers").value.split(";");

      addDoc(collection(db, "recommended_intents"), {
        prompts: prompt,
        keywords: keywords,
        answers: answer,
        context: context,
        contextAnswers: contextAnswers
      }).then(() => {
        alert("Intent recommended successfully!");
        e.target.reset();
      }).catch(error => console.error(error.message));
    });
