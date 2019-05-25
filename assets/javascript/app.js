//jQuery DOM Variables
var $answerCard = $("#answer-card");
var $answers = $("#answers");
var $cardBody = $(".card-body");
var $cardFooter = $(".card-footer");
var $cardHeader = $(".card-header");
var $header = $("#pageHeader");
var $imgBook = $("#imgBook");
var $jumbotron = $(".jumbotron");
var $questionText = $("#questionText");
var $timer = $("#timer");

//Global Variables
var arrAnswers = [];
var arrQuestions = [];
var arrTriviaGame = [];
var clockRunning = false;
var correctAnswer = "";
var iCorrect = 0;
var iIncorrect = 0;
var image = "";
var intervalId;
var iTimeBonus = 0;
var time = 20;

//Set Variables
$timer.html("00:00")

//Populate Trivia Question Array 
arrTriviaGame.push(new question("Mr. and Mrs. Dursley, of number four, Privit Drive, were proud to say they were perfectly normal, thank you very much.", "hp.jpg", "Harry Potter and the Sorcerer's Stone", "Twilight", "The Lightning Theif", "The Hunger Games"))
arrTriviaGame.push(new question("All happy families are alike; each unhappy family is unhappy in its own way.", "anna.jpg", "Anna Karenina", "Little Women", "War and Peace", "Crime and Punishment"))
arrTriviaGame.push(new question('"Who is John Galt?"', "atlas.jpg", "Atlas Shrugged", "Angels & Demons", "Pride and Prejudice", "Tom Sawyer"))
arrTriviaGame.push(new question("In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the Army.", "holmes.jpg", "A Study in Scarlet", "Strange Case of Dr Jekell and Mr Hyde", "Doctor Zhivago", "One Flew Over the Cuckoo's Nest "))
arrTriviaGame.push(new question("&quot;Where's Papa going with that ax?&quot;", "charlotte.jpg", "Charlotte's Web", "A Day No Pigs Would Die", "The Adventures of Huckleberry Finn", "Little Women"))
arrTriviaGame.push(new question("It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair [...].", "twocities.jpg", "A Tale of Two Cities", "Les Miserables", "The Count of Monte Cristo", "The Jungle"))
arrTriviaGame.push(new question("Renowned curator Jacques Saunière staggered through the vaulted archway of the museum's Grand Gallery.", "davinci.jpg", "The Da Vinci Code", "Angels & Demons", "A Clockwork Orange", "Murder on the Orient Express"))
arrTriviaGame.push(new question("It was a bright cold day in April, and the clocks were striking thirteen.", "1984.jpg", "1984", "Atlas Shrugged", "A Brave New World", "Fahrenheit 451"))
arrTriviaGame.push(new question("When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow.", "mockingbird.jpg", "To Kill a Mockingbird", "The Catcher in the Rye", "Lord of the Flies", "Tom Sawyer"))
arrTriviaGame.push(new question("Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small, unregarded yellow sun.", "hitchhiker.jpg", "The Hitchhiker's Guide to the Galaxy", "Slaughterhouse-Five", "Brave New World", "The Martian"))

//Start Game
resetGame()

//Get Next Trivia Question
function getNextQuestion() {

    //Clear picture from prior question
    $imgBook.attr("src", "");

    //If there are still questions in the array, serve up a random one
    if (arrQuestions.length > 0) {

        //Get Random Question
        let randomQuestion = Math.floor(Math.random() * arrQuestions.length);

        //Display question/quote
        $questionText.html("<span class='fa fa-quote-left mr-3 text-muted'></span>" + arrQuestions[randomQuestion].questionText + "<span class= 'fa fa-quote-right ml-3 text-muted'></span>");

        //Set Answer image for later use
        image = "assets/images/books/" + arrQuestions[randomQuestion].image;

        //This bool ensures that only the FIRST index===0 will be marked as the correct answer.
        let isCorrectAnswerAssigned = false;

        //Make a copy of the Answers array for splicing
        arrAnswers = arrQuestions[randomQuestion].answers.slice(0);

        //Place Answers in random order
        while (arrAnswers.length > 0) {

            let randomAnswer = Math.floor(Math.random() * arrAnswers.length);

            //Create List Item for each answer
            let newLi = $("<li>")
            newLi.addClass("list-group-item list-group-item-info js_answer")
            newLi.text(arrAnswers[randomAnswer]);

            //Mark 0 position as correct answer
            if (randomAnswer === 0) {
                if (isCorrectAnswerAssigned === false) {
                    newLi.val(1);
                    correctAnswer = arrAnswers[randomAnswer]
                    isCorrectAnswerAssigned = true;
                } else {
                    newLi.val(0);
                }
            } else {
                newLi.val(0);
            }

            //Append Answer to UL
            newLi.appendTo($answers);

            //Remove answer from array           
            arrAnswers.splice(randomAnswer, 1)
        }

        //Attach listeners for UL answers
        $(".js_answer").on("click", function () {

            if (this.value === 1) {
                iCorrect++;
                iTimeBonus += time;
                $cardFooter.addClass("border-info");
                $cardFooter.html("You are CORRECT!");
            } else {
                iIncorrect++;
                $cardFooter.addClass("border-warning");
                $cardFooter.html("Incorrect!");
            }

            revealAnswer();

        })

        //Remove Question from array
        arrQuestions.splice(randomQuestion, 1);

        //Start timer for question
        startTimer(20);

    }else{
        //No more questions/quotes available

        //Clear question text
        $questionText.text("");

        //Clear Answer Card/Timer
        $answerCard.addClass("invisible");

        let message = "";

        if (iCorrect >= 9 && iTimeBonus >= 150) {
            message = "You are well-read, and FAST!";
        } else if (iCorrect > 6) {
            message = "You have read a lot of books!";
        } else if (iCorrect > 4) {
            message = "Time to catch up on your reading list!";
        } else {
            message = "You have been BOOKED and SENTENCED to read more!";
        }

        //Create Scoreboard div        
        let newDiv = $("<div>");
        let newHeader = $("<h1>");
        let newWins = $("<p>");
        let newBonus = $("<p>");
        let newTotal = $("<p>");
        let newLosses = $("<p>");
        let newButton = $("<button>");

        newDiv.attr("id", "scoreBoard");
        newHeader.addClass("mb-5");
        newHeader.text(message);
        newWins.text("Correct Answers: " + iCorrect);
        newBonus.text("Speed Bonus: " + iTimeBonus);
        newTotal.text("Total Score: " + (iCorrect += iTimeBonus));
        newLosses.attr("id", "losses");
        newLosses.addClass("text-muted");
        newLosses.text("Total Incorrect: " + iIncorrect + "; Total Unanswered (timed-out): " + iUnanswered);
        newButton.attr("id", "btnStart");
        newButton.addClass("btn btn-info btn-lg");
        newButton.text("PLAY AGAIN");

        //Append elements to new div
        newHeader.appendTo(newDiv);
        newWins.appendTo(newDiv);
        newBonus.appendTo(newDiv);
        newTotal.appendTo(newDiv);
        newLosses.appendTo(newDiv);
        newButton.appendTo(newDiv);

        //Append scoreboard to jumbotron
        newDiv.appendTo($jumbotron);

        //Attatch listener to start button to restart game
        $("#btnStart").on("click", function () {
            $("#scoreBoard").remove();
            resetGame();
        })
    }
}
//Question prototype
function question(questionText, image, answer1, answer2, answer3, answer4) {
    this.questionText = questionText;
    this.image = image;
    this.answers = [answer1, answer2, answer3, answer4];
}
function resetGame() {

    //Reset scores
    iCorrect = 0;
    iIncorrect = 0;
    iTimeBonus = 0;
    iUnanswered = 0;

    //Hide Answerd Card/Timer
    $answerCard.addClass("invisible");

    //Take a copy of the Questions array
    arrQuestions = arrTriviaGame.slice(0);

    //Create Welcome Div
    let newDiv = $("<div>");
    let newH1 = $("<h1>");
    let newP = $("<p>");
    let newButton = $("<button>");

    newDiv.attr("id", "welcome");
    newH1.addClass("display-4");
    newH1.text("Welcome to Sentenced!");
    newP.addClass("lead");
    newP.html("A novel game in which you GUESS the NOVEL from its <strong>First Sentence</strong>!");
    newButton.attr("id", "btnStart");
    newButton.addClass("btn btn-info btn-lg");
    newButton.text("START");

    //Append components to Welcome DIV
    newH1.appendTo(newDiv);
    $("<hr>").appendTo(newDiv);
    newP.appendTo(newDiv);
    newButton.appendTo(newDiv);

    //Append Welcome Div to jumbotron
    newDiv.appendTo($jumbotron);

    //Attach listener to button to start game
    $("#btnStart").on("click", function () {
        $answerCard.removeClass("invisible");
        $("#welcome").remove();
        getNextQuestion();
    })
}

function revealAnswer() {

    //Display Image and answer result
    $answers.empty();
    $timer.html("")
    $imgBook.attr("src", image)
    $cardHeader.html(correctAnswer)

    clearInterval(intervalId);
    setTimeout(getNextQuestion, 4 * 1000);

}
//////////Timer Functions Follow//////////
function count() {

    time--;
    var convertedTime = timeConverter(time);

    if (time >= 0) {
        $timer.html(convertedTime);
    } else {
        iUnanswered++;
        $cardFooter.addClass("border-warning");
        $cardFooter.html("No Answer Selected");
        revealAnswer();
    }
}
function startTimer(duration) {

    //Set Bootstrap Card to display countdown
    $cardFooter.removeClass("border-warning border-info");
    $cardHeader.addClass("bg-dark");
    $cardBody.addClass("bg-dark text-light");
    $cardFooter.text("");
    $cardHeader.text("");

    if (clockRunning) {
        clearInterval(intervalId);
        time = duration;
        intervalId = setInterval(count, 1000);
    } else {
        intervalId = setInterval(count, 1000);
        clockRunning = true;
    }
}
function timeConverter(t) {

    //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
    var minutes = Math.floor(t / 60);
    var seconds = t - (minutes * 60);

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if (minutes === 0) {
        minutes = "00";
    }

    else if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
}

