const appState = {
  count : 0,
  username : "",
  current_api_endpoint : "",
  question_type : "",
  current_question_number : "",
  current_correct_answer : "",
  number_of_questions_answered : 0,
  number_of_questions_correct : 0,
  number_of_questions_incorrect : 0,
  selected_answer : "",
  explanation : "",
  totalSeconds : 0,
  myClock : ""
}



document.addEventListener('DOMContentLoaded',function(){
  document.querySelector("#timer_view").style.display = 'none';
  document.querySelector("#quiz_selection_form").onsubmit = () =>{
    let quiz_selected = document.querySelector("#QuizField").value
    appState.username = document.querySelector("#name").value
    if (quiz_selected == "HTML Quiz"){
      console.log("html selected");
      appState.current_api_endpoint = 'https://my-json-server.typicode.com/mmacatula/project_4_quiz_data/HTMLQuiz'
      get_api_data('https://my-json-server.typicode.com/mmacatula/project_4_quiz_data/HTMLQuiz');
    }
    else if (quiz_selected == "JavaScript Quiz"){
      console.log("JS selected");
      appState.current_api_endpoint = 'https://my-json-server.typicode.com/mmacatula/project_4_JavaScript_quiz_data/JavaScriptQuiz'
      get_api_data('https://my-json-server.typicode.com/mmacatula/project_4_JavaScript_quiz_data/JavaScriptQuiz');
    }
    //Stop the default handling of the on submit button
    return false;
  }


})


function get_api_data(api_endpoint){
  const request  = new XMLHttpRequest();
  // Configure the request, set the method (GET) and the end-point.
  request.open('GET', api_endpoint);
  // Configure the call-back .
  request.onload = function () {
    data = JSON.parse(request.responseText);
    console.log(data);
    generate_quiz(data, api_endpoint)
  }
  // Invoke the network request.
  request.send();
}

function generate_quiz(data, api_endpoint){
  var i = appState.count
  generate_question(data[i])
  show_only_quiz()
  if (i == 0){
    document.querySelector("#scoreboard_view").style.display = 'none';
    appState.myClock = setInterval(setTime, 1000);
  }
  document.querySelector("#quiz_view").innerHTML = quiz_question;
  document.querySelector("#quiz_view").onsubmit = () =>{
    appState.selected_answer = document.forms["quiz_answer_form"]["answer"].value;
    console.log(appState.selected_answer)
    check_answer(appState.current_correct_answer, appState.selected_answer)
    update_scoreboard()
    console.log(response)
    proper_feedback(response, data[i].explanation)
    // console.log(encouragement_text)
    // console.log(feedback_text)
    if (response == 'Correct'){
      show_only_encouragement()
      document.querySelector("#encouragement_view").innerHTML = encouragement_text;
      if(appState.count < 19){
        appState.count ++;
        setTimeout(get_api_data, 1000, api_endpoint);
        console.log("NextQuestionPlease")
      }
      else if (appState.count >= 19){
        console.log("quiz over")
        clearInterval(appState.myClock);
        show_only_quiz_complete()
        quiz_complete()
      }
    }
    else if (response == 'Incorrect'){
      show_only_feedback()
      document.querySelector("#feedback_view").innerHTML = feedback_text;
      document.querySelector("#feedback_view").onsubmit = () =>{
        if(appState.count < 19){
          appState.count ++;
          console.log("NextQuestionPlease")
          get_api_data(api_endpoint)
        }
        else if (appState.count >= 19){
          console.log("quiz over")
          clearInterval(appState.myClock);
          show_only_quiz_complete()
          quiz_complete()
        }
        return false;
      }
    }
    return false;
  }
}



function generate_question(data){
  appState.current_correct_answer = data.correct_answer;
  if (data.question_type == "MC"){
    quiz_question =
    `<div class="card">
    <div class="card bg-light text-dark">
    <div class="card-header"><h3>${data.id}) ${data.question}</h3></div>
    <div class="card-body">
    <form id="quiz_answer_form">
    <input id="A" type="radio" value = "A" name = "answer"}>
    <label for="A"> ${data.options.optiona}</label><br>
    <input id="B" type="radio" value = "B" name = "answer">
    <label for="B">${data.options.optionb}</label><br>
    <input id="C" type="radio" value = "C" name = "answer">
    <label for="C"> ${data.options.optionc}</label><br>
    <input id="D" type="radio" value = "D" name= "answer">
    <label for="D">${data.options.optiond}</label><br>
    <input class="btn btn-success" type="submit" value="Submit">
    </form>
    </div>
    </div>
    </div>`
  }
  else if (data.question_type == "TF"){
    quiz_question =
    `<div class="card">
    <div class="card bg-light text-dark">
    <div class="card-header"><h3>${data.id}) ${data.question}</h3></div>
    <div class="card-body">
    <form id="quiz_answer_form">
    <input id="A" type="radio" value = "A" name = "answer"}>
    <label for="A"> ${data.options.optiona}</label><br>
    <input id="B" type="radio" value = "B" name = "answer">
    <label for="B">${data.options.optionb}</label><br>
    <input class="btn btn-success" type="submit" value="Submit">
    </form>
    </div>
    </div>
    </div>`
  }
  else if (data.question_type == "Fill In") {
    quiz_question =
    `<div class="card">
    <div class="card bg-light text-dark">
    <div class="card-header"><h3>${data.id}) ${data.question}</h3></div>
    <div class="card-body">
    <form id="quiz_answer_form">
    <input type="text" name = "answer">
    <input class="btn btn-success" type="submit" value="Submit">
    </form>
    </div>
    </div>
    </div>`
  }
  

  return quiz_question
}

function check_answer(current_correct_answer, selected_answer){
  if (current_correct_answer == selected_answer){
    appState.number_of_questions_answered ++;
    appState.number_of_questions_correct ++;
    response = "Correct"
  }
  else if (current_correct_answer != selected_answer){
    appState.number_of_questions_answered ++;
    appState.number_of_questions_incorrect ++;
    response = "Incorrect"
  }
  return response
}

function proper_feedback(response, explanation) {
  if (response == "Correct"){
    possible_encouragments = ["You Know Your Stuff!", "Looks Like you Studied!!", "Keep it up!!", "Great Job!", "Good Work!"]
    random_encourgment = possible_encouragments[Math.floor(Math.random()*possible_encouragments.length)];
    encouragement_text = `
    <div class="card">
    <div class="card bg-success text-white">
    <div class="card-body">${random_encourgment}</div>
    </div>
    </div>`
    return encouragement_text
  }
  else if (response == "Incorrect"){
    feedback_text = `
    <div class="card">
    <div class="card bg-warning text-white">
    <div class="card-body"><h3>${explanation}</h3></div>
    <div class="card-footer"><form><input class="btn btn-danger" type="submit" value="OK"></form></div>
    </div>
    </div>`
    return feedback_text
  }
}

function update_scoreboard(){
    document.querySelector("#scoreboard_view").innerHTML = `
    <table class="table">
    <tbody>
      <tr class="table-success">
        <td>Correct</td>
        <td>${appState.number_of_questions_correct}</td>
      </tr>
      <tr class="table-danger">
        <td>Incorrect</td>
        <td>${appState.number_of_questions_incorrect}</td>
      </tr>
    </tbody>
  </table>`

}

function quiz_complete(){
  score = ((appState.number_of_questions_correct)/(appState.number_of_questions_answered))*100
  console.log(appState.number_of_questions_correct)
  console.log(appState.number_of_questions_answered)
  console.log(score)
  if (score >= 80){
    document.querySelector("#quiz_complete_view").innerHTML = `
    
    <h2>You PASSED! ${appState.username}, you scored above an 80% </h2>
    <h3>Your grade for the quiz is: ${score}%!</h3>
    <h4> You are a Master Coder!
    <button class="btn btn-primary" onclick="homePage()">HomePage</button>
    
    `
  }
  else if (score < 80){
    document.querySelector("#quiz_complete_view").innerHTML = `
    
    <h2>You FAILED ${appState.username}, you need to study more if you want to be a Master Coder<h2>
    <h3>Your grade for the quiz is: ${score}%!</h3>
    <button class="btn btn-warning" id="retake_quiz" onclick="retakeQuiz()">Retake Quiz</button>
   
    `
  }
}

function homePage(){
   location.reload()
}

function retakeQuiz(){
  appState.count = 0;
  appState.number_of_questions_answered = 0;
  appState.number_of_questions_correct = 0;
  appState.number_of_questions_incorrect = 0;
  appState.totalSeconds = 0;
  document.querySelector("#scoreboard_view").style.display = 'none';
  clearInterval(appState.myClock);
  get_api_data(appState.current_api_endpoint)
}

function setTime() {
  var minutesLabel = document.getElementById("minutes");
  var secondsLabel = document.getElementById("seconds");
  appState.totalSeconds++;
  secondsLabel.innerHTML = pad(appState.totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(appState.totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function show_only_quiz(){
  document.querySelector("#login_view").style.display = 'none';
  document.querySelector("#quiz_view").style.display = 'block';
  document.querySelector("#encouragement_view").style.display = 'none';
  document.querySelector("#feedback_view").style.display = 'none';
  document.querySelector("#scoreboard_view").style.display = 'block';
  document.querySelector("#timer_view").style.display = 'block';
  document.querySelector("#quiz_complete_view").style.display = 'none';
}
function show_only_encouragement(){
  document.querySelector("#login_view").style.display = 'none';
  document.querySelector("#quiz_view").style.display = 'none';
  document.querySelector("#encouragement_view").style.display = 'block';
  document.querySelector("#feedback_view").style.display = 'none';
  document.querySelector("#scoreboard_view").style.display = 'block';
  document.querySelector("#timer_view").style.display = 'block';
  document.querySelector("#quiz_complete_view").style.display = 'none';
}
function show_only_feedback(){
  document.querySelector("#login_view").style.display = 'none';
  document.querySelector("#quiz_view").style.display = 'none';
  document.querySelector("#encouragement_view").style.display = 'none';
  document.querySelector("#feedback_view").style.display = 'block';
  document.querySelector("#scoreboard_view").style.display = 'block';
  document.querySelector("#timer_view").style.display = 'block';
  document.querySelector("#quiz_complete_view").style.display = 'none';
}
function show_only_quiz_complete(){
  document.querySelector("#login_view").style.display = 'none';
  document.querySelector("#quiz_view").style.display = 'none';
  document.querySelector("#encouragement_view").style.display = 'none';
  document.querySelector("#feedback_view").style.display = 'none';
  document.querySelector("#scoreboard_view").style.display = 'block';
  document.querySelector("#timer_view").style.display = 'block';
  document.querySelector("#quiz_complete_view").style.display = 'block';

}
