//Press start to start the game
//var $question = $("#question")
var $questionText = $("#questionText");
var $answers = $("#answers")
var $timer = $("#timer")
var $imgBook = $("#imgBook")
var clockRunning = false;

var arrTriviaGame = []
var arrQuestions = []
var intervalId;
var time=20;
var iCorrect = 0;
var iIncorrect = 0;
var iUnanswered = 0;
var image = "";
var iTimeBonus = 0;

$timer.html("00:00")

arrTriviaGame.push(new question("Mr. and Mrs. Dursley, of number four, Privit Drive, were proud to say they were perfectly normal, thank you very much.","hp.jpg","Harry Potter and the Sorcerer's Stone","Twilight","The Lightning Theif","The Hunger Games"))
arrTriviaGame.push(new question("All happy families are alike; each unhappy family is unhappy in its own way.","anna.jpg","Anna Karenina","Little Women","War and Peace","Crime and Punishment"))
arrTriviaGame.push(new question('"Who is John Galt?"',"atlas.jpg","Atlas Shrugged","Angels and Demons","Pride and Prejudice","Tom Sawyer"))
arrTriviaGame.push(new question("In the year 1878 I took my degree of Doctor of Medicine of the University of London, and proceeded to Netley to go through the course prescribed for surgeons in the Army.","holmes.jpg","A Study in Scarlet","Strange Case of Dr Jekell and Mr Hyde","Doctor Zhivago","One Flew Over the Cuckoo's Nest "))

//Question prototype
function question(questionText,image,answer1,answer2,answer3,answer4){
    this.questionText = questionText;
    this.image = image;
    this.answers =  [answer1,answer2,answer3,answer4];
}

arrQuestions = arrTriviaGame.slice(0);

getNextQuestion()

function startTimer(duration){
        
    if(clockRunning=false){
        intervalId=setInterval(count,1000)
        clockRunning=true;
    }else{
        clearInterval(intervalId);
        time = duration
        intervalId=setInterval(count,1000)

    }
   
}
function count(){

    
    time--;
    var convertedTime = timeConverter(time);

    if(time >= 0 ){
        $timer.html(convertedTime);
    }else{
        revealAnswer();
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
  

//Get Next Trivia Question
function getNextQuestion(){

    $imgBook.attr("src","");

    if($answers[0]){
        $questionText.empty();
     //   $answers.empty();
    }

    if (arrQuestions.length > 0){

        //Get Random Question
        let randomQuestion = Math.floor(Math.random() * arrQuestions.length);
        $questionText.html("<span class='fa fa-quote-left mr-3 text-muted'></span>" + arrQuestions[randomQuestion].questionText + "<span class= 'fa fa-quote-right ml-3 text-muted'></span>");

        //This bool ensures that only the FIRST index===0 will be marked as the correct answer.
        let isCorrectAnswerAssigned = false;

        //Place Answers in random order
        while(arrQuestions[randomQuestion].answers.length>0){
            
            let randomAnswer = Math.floor(Math.random() * arrQuestions[randomQuestion].answers.length);
            let newLi = $("<li>")
            newLi.addClass("list-group-item list-group-item-info js_answer")
            newLi.text(arrQuestions[randomQuestion].answers[randomAnswer]);
            if(randomAnswer===0){
                if(isCorrectAnswerAssigned===false){
                    newLi.val(1);
                    isCorrectAnswerAssigned =true;                
                }else{
                    newLi.val(0);                    
                }                
            }else{
                newLi.val(0);
            }
            newLi.appendTo($answers);

           image = "assets/images/books/" + arrQuestions[randomQuestion].image;

            //Remove answer from array
            arrQuestions[randomQuestion].answers.splice(randomAnswer,1)

        }

        $(".js_answer").on("click",function(){

            if (this.value === 1){

                iCorrect++      
                
                iTimeBonus += time
                
            }else{

                iIncorrect++                

            }

            revealAnswer();
            console.log(this.value)
        })

        arrQuestions.splice(randomQuestion,1)

        //Start timer for question
        startTimer(20);

    }

}

function revealAnswer(){
    console.log("time: " + time)
    console.log("bonus: " + iTimeBonus)
    console.log("correct " + iCorrect)

        $answers.empty();
        $imgBook.attr("src", image)

        $timer.html("")
        
        clearInterval(intervalId);
        setTimeout(getNextQuestion,8 * 1000)

        
}


//If user selection is correct:
//      Reveal answer
//      Add incorrect answer point
//      Move to next question with no user input
//ELSE IF user selection is incorrect
//Else no answer (question timeout))
//      Reveal answer
//      Add unanswered question point
//      Move to next question with no user input
//CLICK start to reset qame.