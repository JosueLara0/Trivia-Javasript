
    // Bring elements from index.html
    let triviaForm = document.getElementById("trivia");
    let amount = document.getElementById("amount");
    let category = document.getElementById("category");
    let difficulty = document.getElementById("difficulty");
    let type = document.getElementById("type");
    let questionsContainer = document.getElementById("questionsContent");
    let answers = document.getElementsByClassName("answer");

    // Control variables
    let questions;
    let qIndex = 0;
    let correctIndexAnswer;
    let score = 0;

    // Function to bring the API with the given inputs after click on start button
    let getAPIData = (notRefresh) => {

        //Avoid the page refresh
        notRefresh.preventDefault();

        let url = `https://opentdb.com/api.php?amount=${amount.value}&category=${category.value}&difficulty=${difficulty.value}&type=${type.value}`;
        fetch(url)
            .then(response => {
                return response.json();
             })
            .then(data => {
                questions = data.results;
                startTrivia();
            });
    };

    // Function to hide the menu and start the trivia
    const startTrivia = () => {

        questionsContainer.style.display = "flex";
        triviaForm.style.display = "none";

        // Variable to control each question one by one
        let currentQuestion = questions[qIndex];
        document.getElementById("questionName").innerText = currentQuestion.question;

        // If the answer of the current question only could be true or false, show only two answers. Else, show all.
        if (currentQuestion.type === "boolean") {
            document.getElementById("1").innerText = "True";
            document.getElementById("2").innerText = "False";
            document.getElementById("3").style.display = "none";
            document.getElementById("4").style.display = "none";

            if (currentQuestion.correct_answer === "True") correctIndexAnswer = 1;
            else correctIndexAnswer = 2;

        } else {
            document.getElementById("1").style.display = "block";
            document.getElementById("2").style.display = "block";
            document.getElementById("3").style.display = "block";
            document.getElementById("4").style.display = "block";

            // Generate a random number (1,2,3,4) and put the correct answer in the button with that id number.
            correctIndexAnswer = Math.floor(Math.random() * 4) + 1;
            document.getElementById(correctIndexAnswer).innerText = currentQuestion.correct_answer;

            // Put the incorrect answers in the other buttons
            let j = 0;
            for (let i = 1; i <= 4; i++) {
                if (i === correctIndexAnswer) continue;
                document.getElementById(i).innerText = currentQuestion.incorrect_answers[j];
                j++;
            }
        }
    };

    // Function that run when the user select an answer
    const selectAnswer = id => {

        // Convert values from type string to number in order to avoid syntax errors
        let answerId = Number(id);
        let amountValue = Number(amount.value);

        if (answerId === correctIndexAnswer) {
            score = score + 1;
        }

        // If remain questions, continue the trivia. Else, finish it
        if (qIndex < amountValue - 1 ) {
            qIndex++;
            startTrivia();
        } else if (qIndex === amountValue - 1) {
            showScore();
        }
    };

    // Function to show score when the trivia ends
    const showScore = () => {

        questionsContainer.innerHTML = "";

        let scoreText = document.createElement("p");
        scoreText.innerText = `GAME OVER, YOUR SCORE IS:`;

        let scorePoints = document.createElement("h3");
        scorePoints.innerText = `" ${score} "`;

        let restartBtn = document.createElement("a");
        restartBtn.innerText = `New Game`;
        restartBtn.setAttribute("href", "./index.html");

        questionsContainer.appendChild(scoreText);
        questionsContainer.appendChild(scorePoints);
        questionsContainer.appendChild(restartBtn);
    };

    // For that launch the select answer function when an answer button is pressed
    for (let i =0; i < answers.length; i++) {
        const element = answers[i];
        element.addEventListener("click", () => selectAnswer(element.id))
    }


    // Start Trivia Listener
    triviaForm.addEventListener("submit", getAPIData);