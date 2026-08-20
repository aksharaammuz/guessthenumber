/* =========================================
   SECRET BETWEEN US 💕
   Encoded Challenge Version
   No Firebase / No Backend
   ========================================= */


/* =========================================
   GAME STATE
   ========================================= */

const game = {
    secretNumber: null,
    maxLives: 10,
    remainingLives: 10,
    guesses: [],
    gameStarted: false
};


/* =========================================
   ELEMENTS
   ========================================= */

const screens = document.querySelectorAll(".screen");

const homeScreen = document.getElementById("homeScreen");
const createScreen = document.getElementById("createScreen");
const lockedScreen = document.getElementById("lockedScreen");
const guessScreen = document.getElementById("guessScreen");
const resultScreen = document.getElementById("resultScreen");

const createGameBtn = document.getElementById("createGameBtn");
const joinGameBtn = document.getElementById("joinGameBtn");

const secretNumberInput =
    document.getElementById("secretNumber");

const toggleSecretBtn =
    document.getElementById("toggleSecretBtn");

const lockSecretBtn =
    document.getElementById("lockSecretBtn");

const numberError =
    document.getElementById("numberError");

const lifeOptions =
    document.querySelectorAll(".life-option");

const challengeLives =
    document.getElementById("challengeLives");

const challengeLink =
    document.getElementById("challengeLink");

const copyLinkBtn =
    document.getElementById("copyLinkBtn");

const shareBtn =
    document.getElementById("shareBtn");

const newChallengeBtn =
    document.getElementById("newChallengeBtn");

const guessInput =
    document.getElementById("guessInput");

const guessBtn =
    document.getElementById("guessBtn");

const remainingLives =
    document.getElementById("remainingLives");

const feedback =
    document.getElementById("feedback");

const feedbackIcon =
    document.getElementById("feedbackIcon");

const feedbackTitle =
    document.getElementById("feedbackTitle");

const feedbackMessage =
    document.getElementById("feedbackMessage");

const guessHistory =
    document.getElementById("guessHistory");

const resultCharacter =
    document.getElementById("resultCharacter");

const resultSmallTitle =
    document.getElementById("resultSmallTitle");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const resultNumber =
    document.getElementById("resultNumber");

const usedChances =
    document.getElementById("usedChances");

const totalChances =
    document.getElementById("totalChances");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const homeBtn =
    document.getElementById("homeBtn");

const toast =
    document.getElementById("toast");


/* =========================================
   SCREEN NAVIGATION
   ========================================= */

function showScreen(screen) {

    screens.forEach(item => {
        item.classList.remove("active");
    });

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   RESET GAME
   ========================================= */

function resetGame() {

    game.secretNumber = null;
    game.maxLives = 10;
    game.remainingLives = 10;
    game.guesses = [];
    game.gameStarted = false;

    secretNumberInput.value = "";
    secretNumberInput.type = "password";

    toggleSecretBtn.textContent = "👁️";

    numberError.textContent = "";

    guessInput.value = "";

    guessHistory.innerHTML = "";

    feedback.classList.add("hidden");

    lifeOptions.forEach(option => {

        option.classList.remove("selected");

        if (option.dataset.lives === "10") {
            option.classList.add("selected");
        }

    });
}


/* =========================================
   HOME → CREATE
   ========================================= */

createGameBtn.addEventListener("click", () => {

    resetGame();

    showScreen(createScreen);

    setTimeout(() => {
        secretNumberInput.focus();
    }, 300);
});


/* =========================================
   JOIN BUTTON
   ========================================= */

joinGameBtn.addEventListener("click", () => {

    const challenge =
        getChallengeFromURL();

    if (!challenge) {

        showToast(
            "Open a valid challenge link 💌"
        );

        return;
    }

    loadChallenge(challenge);
});


/* =========================================
   BACK BUTTON
   ========================================= */

document.querySelectorAll(".back-btn").forEach(button => {

    button.addEventListener("click", () => {

        const target =
            document.getElementById(
                button.dataset.back
            );

        if (target) {
            showScreen(target);
        }

    });

});


/* =========================================
   SECRET INPUT
   ========================================= */

secretNumberInput.addEventListener("input", () => {

    secretNumberInput.value =
        secretNumberInput.value.replace(
            /[^0-9]/g,
            ""
        );

    numberError.textContent = "";
});


/* =========================================
   SHOW / HIDE SECRET
   ========================================= */

toggleSecretBtn.addEventListener("click", () => {

    if (secretNumberInput.type === "password") {

        secretNumberInput.type = "text";

        toggleSecretBtn.textContent = "🙈";

    } else {

        secretNumberInput.type = "password";

        toggleSecretBtn.textContent = "👁️";
    }

});


/* =========================================
   LIFE SELECTION
   ========================================= */

lifeOptions.forEach(option => {

    option.addEventListener("click", () => {

        lifeOptions.forEach(item => {
            item.classList.remove("selected");
        });

        option.classList.add("selected");

        game.maxLives =
            Number(option.dataset.lives);

    });

});


/* =========================================
   VALIDATE SECRET
   ========================================= */

function validateSecretNumber() {

    const value =
        secretNumberInput.value.trim();

    if (value.length !== 3) {

        numberError.textContent =
            "Please enter exactly 3 digits.";

        return false;
    }

    const number = Number(value);

    if (number < 100 || number > 999) {

        numberError.textContent =
            "Choose a number between 100 and 999.";

        return false;
    }

    return true;
}


/* =========================================
   ENCODING
   ========================================= */

/*
    We don't put:

    ?secret=583

    directly into the URL.

    Instead we create an encoded
    challenge object.

    IMPORTANT:
    This is obfuscation, NOT perfect
    cryptographic security.
*/

function encodeChallenge(secret, lives) {

    const challenge = {

        n: secret,

        l: lives,

        v: 1,

        t: Date.now()

    };

    const json =
        JSON.stringify(challenge);

    const encoded =
        btoa(
            encodeURIComponent(json)
        );

    /*
        Reverse some characters to make
        the URL less obvious.
    */

    return encoded
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}


/* =========================================
   DECODING
   ========================================= */

function decodeChallenge(encoded) {

    try {

        let value = encoded
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        /*
            Restore Base64 padding.
        */

        while (value.length % 4 !== 0) {
            value += "=";
        }

        const json =
            decodeURIComponent(
                atob(value)
            );

        const challenge =
            JSON.parse(json);

        if (
            !challenge.n ||
            !challenge.l
        ) {
            return null;
        }

        if (
            challenge.n < 100 ||
            challenge.n > 999
        ) {
            return null;
        }

        if (
            ![5, 10, 15].includes(
                challenge.l
            )
        ) {
            return null;
        }

        return challenge;

    } catch (error) {

        console.error(
            "Invalid challenge:",
            error
        );

        return null;
    }
}


/* =========================================
   CREATE CHALLENGE
   ========================================= */

lockSecretBtn.addEventListener("click", () => {

    if (!validateSecretNumber()) {
        return;
    }

    game.secretNumber =
        Number(secretNumberInput.value);

    game.remainingLives =
        game.maxLives;

    game.guesses = [];

    game.gameStarted = false;


    /*
        Create encoded challenge.
    */

    const encodedChallenge =
        encodeChallenge(
            game.secretNumber,
            game.maxLives
        );


    /*
        Create shareable URL.

        Example:

        https://username.github.io/game/
        ?challenge=ENCODED_DATA
    */

    const url =
        new URL(
            window.location.href
        );

    url.search = "";

    url.searchParams.set(
        "challenge",
        encodedChallenge
    );


    challengeLink.value =
        url.toString();


    challengeLives.textContent =
        game.maxLives;


    showScreen(lockedScreen);

});


/* =========================================
   READ CHALLENGE FROM URL
   ========================================= */

function getChallengeFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const encoded =
        params.get("challenge");

    if (!encoded) {
        return null;
    }

    return decodeChallenge(encoded);
}


/* =========================================
   LOAD SHARED CHALLENGE
   ========================================= */

function loadChallenge(challenge) {

    game.secretNumber =
        Number(challenge.n);

    game.maxLives =
        Number(challenge.l);

    game.remainingLives =
        game.maxLives;

    game.guesses = [];

    game.gameStarted = true;


    /*
        Reset guessing interface.
    */

    remainingLives.textContent =
        game.remainingLives;

    guessInput.value = "";

    guessHistory.innerHTML = "";

    feedback.classList.add("hidden");


    /*
        Show guessing screen.
    */

    showScreen(guessScreen);

    setTimeout(() => {

        guessInput.focus();

    }, 300);

}


/* =========================================
   COPY LINK
   ========================================= */

copyLinkBtn.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                challengeLink.value
            );

            showToast(
                "Challenge link copied! 💌"
            );

        } catch (error) {

            challengeLink.select();

            document.execCommand("copy");

            showToast(
                "Challenge link copied! 💌"
            );
        }

    }
);


/* =========================================
   SHARE
   ========================================= */

shareBtn.addEventListener(
    "click",
    async () => {

        const link =
            challengeLink.value;

        if (navigator.share) {

            try {

                await navigator.share({

                    title:
                        "Secret Between Us 💕",

                    text:
                        "I hid a secret number. Can you find it? 👀",

                    url: link

                });

            } catch (error) {

                /*
                    User cancelled share.
                */

            }

        } else {

            try {

                await navigator.clipboard.writeText(
                    link
                );

                showToast(
                    "Link copied! Send it to them 💌"
                );

            } catch (error) {

                showToast(
                    "Copy the link manually 💕"
                );
            }

        }

    }
);


/* =========================================
   NEW CHALLENGE
   ========================================= */

newChallengeBtn.addEventListener(
    "click",
    () => {

        resetGame();

        showScreen(createScreen);

        secretNumberInput.focus();

    }
);


/* =========================================
   GUESS INPUT
   ========================================= */

guessInput.addEventListener(
    "input",
    () => {

        guessInput.value =
            guessInput.value.replace(
                /[^0-9]/g,
                ""
            );

    }
);


/* =========================================
   ENTER TO GUESS
   ========================================= */

guessInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            makeGuess();

        }

    }
);


/* =========================================
   GUESS BUTTON
   ========================================= */

guessBtn.addEventListener(
    "click",
    makeGuess
);


/* =========================================
   MAKE GUESS
   ========================================= */

function makeGuess() {

    if (!game.gameStarted) {
        return;
    }

    const guess =
        Number(guessInput.value);


    /*
        Validate.
    */

    if (
        !guess ||
        guess < 100 ||
        guess > 999
    ) {

        showFeedback(
            "🤔",
            "Hmm...",
            "Enter a valid 3-digit number."
        );

        return;
    }


    /*
        Don't allow duplicate guesses.
    */

    if (game.guesses.includes(guess)) {

        showFeedback(
            "🔁",
            "Already Tried!",
            "Choose a different number."
        );

        guessInput.select();

        return;
    }


    /*
        Use one life.
    */

    game.remainingLives--;

    remainingLives.textContent =
        game.remainingLives;


    /*
        Store guess.
    */

    game.guesses.push(guess);


    /* =====================================
       CORRECT
       ===================================== */

    if (guess === game.secretNumber) {

        addGuessToHistory(
            guess,
            "💖 Correct!"
        );

        showWinScreen();

        return;
    }


    /* =====================================
       TOO LOW
       ===================================== */

    if (guess < game.secretNumber) {

        const difference =
            game.secretNumber - guess;

        if (difference <= 10) {

            showFeedback(
                "🔥",
                "SO CLOSE!",
                "Just a tiny bit higher!"
            );

        } else if (difference <= 50) {

            showFeedback(
                "🌤️",
                "Getting Warmer!",
                "Try going a little higher."
            );

        } else {

            showFeedback(
                "🥶",
                "Too Low!",
                "Go higher!"
            );
        }


        addGuessToHistory(
            guess,
            "⬆️ Higher"
        );

    }


    /* =====================================
       TOO HIGH
       ===================================== */

    else {

        const difference =
            guess - game.secretNumber;

        if (difference <= 10) {

            showFeedback(
                "🔥",
                "SO CLOSE!",
                "Just a tiny bit lower!"
            );

        } else if (difference <= 50) {

            showFeedback(
                "🌤️",
                "Getting Warmer!",
                "Try going a little lower."
            );

        } else {

            showFeedback(
                "🥶",
                "Too High!",
                "Go lower!"
            );
        }


        addGuessToHistory(
            guess,
            "⬇️ Lower"
        );

    }


    /* =====================================
       OUT OF LIVES
       ===================================== */

    if (game.remainingLives <= 0) {

        setTimeout(() => {

            showLoseScreen();

        }, 800);

        return;
    }


    /*
        Prepare for next guess.
    */

    guessInput.value = "";

    guessInput.focus();

}


/* =========================================
   FEEDBACK
   ========================================= */

function showFeedback(
    icon,
    title,
    message
) {

    feedbackIcon.textContent =
        icon;

    feedbackTitle.textContent =
        title;

    feedbackMessage.textContent =
        message;

    feedback.classList.remove(
        "hidden"
    );

}


/* =========================================
   GUESS HISTORY
   ========================================= */

function addGuessToHistory(
    guess,
    result
) {

    const item =
        document.createElement("div");

    item.className =
        "history-item";


    const number =
        document.createElement("span");

    number.className =
        "history-number";

    number.textContent =
        guess;


    const response =
        document.createElement("span");

    response.className =
        "history-result";

    response.textContent =
        result;


    item.appendChild(number);

    item.appendChild(response);

    guessHistory.prepend(item);

}


/* =========================================
   WIN SCREEN
   ========================================= */

function showWinScreen() {

    game.gameStarted = false;

    resultCharacter.textContent =
        "🎉";

    resultSmallTitle.textContent =
        "YOU FOUND IT!";

    resultTitle.textContent =
        "Amazing! 💕";

    resultMessage.textContent =
        "You cracked the secret number!";

    resultNumber.textContent =
        game.secretNumber;

    usedChances.textContent =
        game.guesses.length;

    totalChances.textContent =
        game.maxLives;


    setTimeout(() => {

        showScreen(resultScreen);

    }, 500);

}


/* =========================================
   LOSE SCREEN
   ========================================= */

function showLoseScreen() {

    game.gameStarted = false;

    resultCharacter.textContent =
        "🤭";

    resultSmallTitle.textContent =
        "SECRET PROTECTED!";

    resultTitle.textContent =
        "Out of chances!";

    resultMessage.textContent =
        "The secret stayed hidden...";

    resultNumber.textContent =
        game.secretNumber;

    usedChances.textContent =
        game.guesses.length;

    totalChances.textContent =
        game.maxLives;

    showScreen(resultScreen);

}


/* =========================================
   PLAY AGAIN
   ========================================= */

playAgainBtn.addEventListener(
    "click",
    () => {

        /*
            Same challenge,
            fresh lives.
        */

        game.remainingLives =
            game.maxLives;

        game.guesses = [];

        game.gameStarted = true;

        remainingLives.textContent =
            game.maxLives;

        guessInput.value = "";

        guessHistory.innerHTML = "";

        feedback.classList.add(
            "hidden"
        );

        showScreen(guessScreen);

        guessInput.focus();

    }
);


/* =========================================
   HOME
   ========================================= */

homeBtn.addEventListener(
    "click",
    () => {

        /*
            Remove challenge from URL.
        */

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

        resetGame();

        showScreen(homeScreen);

    }
);


/* =========================================
   TOAST
   ========================================= */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2500);

}


/* =========================================
   HANDLE URL CHALLENGE
   ========================================= */

function checkForChallenge() {

    const challenge =
        getChallengeFromURL();

    if (!challenge) {

        showScreen(homeScreen);

        return;
    }


    /*
        Valid challenge found.
    */

    loadChallenge(challenge);

}


/* =========================================
   INITIALIZE
   ========================================= */

checkForChallenge();