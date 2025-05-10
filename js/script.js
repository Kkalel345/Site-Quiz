let questions = [];
let currentQuestion = 0;
let score = 0;
let userAnswers; 

let allResultItemsHTML = [];
let currentResultsPage = 1;
const resultsPerPage = 5;

function loadQuestion() {
    const quizContainer = document.getElementById('quiz');
    if (questions.length === 0) {
        quizContainer.innerHTML = "<p>Carregando questões...</p>";
        return;
    }
    const questionObj = questions[currentQuestion];
    
    let questionHTML = `<div class="question">${currentQuestion + 1}. ${questionObj.question}</div><div class="answers">`;
    
    for (const letter in questionObj.answers) {
        questionHTML += `
            <label>
                <input type="radio" name="answer" value="${letter}">
                ${letter.toUpperCase()}) ${questionObj.answers[letter]}
            </label>
        `;
    }
    
    questionHTML += '</div>';
    quizContainer.innerHTML = questionHTML;
    
    if (userAnswers && userAnswers[currentQuestion] !== undefined) {
        document.querySelector(`input[value="${userAnswers[currentQuestion]}"]`).checked = true;
    }
    
    document.getElementById('previous').disabled = currentQuestion === 0;
    document.getElementById('next').disabled = currentQuestion === questions.length - 1;
}

function saveAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        if (userAnswers) {
            userAnswers[currentQuestion] = selectedOption.value;
        }
    }
}

function showResults() {
    saveAnswer();
    
    score = 0;
    if (userAnswers && userAnswers.length === questions.length) {
        for (let i = 0; i < questions.length; i++) {
            if (userAnswers[i] === questions[i].correctAnswer) {
                score++;
            }
        }
    }
    
    document.getElementById('quiz').innerHTML = '';

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<h2>Você acertou ${score} de ${questions.length} questões!</h2>`;
    
    allResultItemsHTML = []; 
    questions.forEach((question, index) => {
        const userAnswer = userAnswers ? userAnswers[index] : undefined;
        const correctAnswer = question.correctAnswer;
        const userAnswerText = userAnswer ? question.answers[userAnswer] : "Não respondida";
        const correctAnswerText = question.answers[correctAnswer];
        
        let itemHTML = `<div class="result-item">`;
        itemHTML += `<p class="question-text">${index + 1}. ${question.question}</p>`;
        
        if (userAnswer === correctAnswer) {
            itemHTML += `<p class="user-answer correct-answer">Sua resposta: ${userAnswer ? userAnswer.toUpperCase() : 'N/A'} (${userAnswerText})</p>`;
        } else {
            itemHTML += `<p class="user-answer incorrect-answer">Sua resposta: ${userAnswer ? userAnswer.toUpperCase() : 'N/A'} (${userAnswerText})</p>`;
            itemHTML += `<p class="correct-answer-text">Resposta correta: ${correctAnswer.toUpperCase()} (${correctAnswerText})</p>`;
        }
        itemHTML += `</div>`;
        allResultItemsHTML.push(itemHTML);
    });

    resultsContainer.innerHTML += `
        <h3>Gabarito:</h3>
        <div id="answer-key-items"></div>
        <div id="results-pagination">
            <button id="prev-results-page" disabled>Anterior</button>
            <span id="results-page-info"></span>
            <button id="next-results-page">Próxima</button>
        </div>
    `;
    
    currentResultsPage = 1;
    displayCurrentResultsPage();

    document.getElementById('prev-results-page').addEventListener('click', () => {
        if (currentResultsPage > 1) {
            currentResultsPage--;
            displayCurrentResultsPage();
        }
    });

    document.getElementById('next-results-page').addEventListener('click', () => {
        const totalPages = Math.ceil(allResultItemsHTML.length / resultsPerPage);
        if (currentResultsPage < totalPages) {
            currentResultsPage++;
            displayCurrentResultsPage();
        }
    });
    
    document.getElementById('previous').style.display = 'none';
    document.getElementById('next').style.display = 'none';
    document.getElementById('submit').style.display = 'none';
}

function displayCurrentResultsPage() {
    const answerKeyItemsContainer = document.getElementById('answer-key-items');
    const pageInfoSpan = document.getElementById('results-page-info');
    const prevButton = document.getElementById('prev-results-page');
    const nextButton = document.getElementById('next-results-page');

    if (!answerKeyItemsContainer) return; 

    const totalItems = allResultItemsHTML.length;
    const totalPages = Math.ceil(totalItems / resultsPerPage);

    const startIndex = (currentResultsPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const pageItems = allResultItemsHTML.slice(startIndex, endIndex);

    answerKeyItemsContainer.innerHTML = pageItems.join('');
    
    if (totalPages > 0) {
        pageInfoSpan.textContent = `Página ${currentResultsPage} de ${totalPages}`;
    } else {
        pageInfoSpan.textContent = 'Nenhum item no gabarito.';
    }


    prevButton.disabled = currentResultsPage === 1;
    nextButton.disabled = currentResultsPage === totalPages || totalPages === 0;

    const paginationControls = document.getElementById('results-pagination');
    if (totalPages <= 1) {
        paginationControls.style.display = 'none';
    } else {
        paginationControls.style.display = 'flex'; 
    }
}

document.getElementById('previous').addEventListener('click', () => {
    saveAnswer();
    currentQuestion--;
    loadQuestion();
});

document.getElementById('next').addEventListener('click', () => {
    saveAnswer();
    currentQuestion++;
    loadQuestion();
});

document.getElementById('submit').addEventListener('click', showResults);

async function fetchQuestionsAndStartQuiz() {
    try {
        const response = await fetch('/data/questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedQuestions = await response.json();
        questions = fetchedQuestions;
        userAnswers = new Array(questions.length);
        loadQuestion(); 
    } catch (error) {
        console.error("Falha ao carregar as questões do quiz:", error);
        const quizContainer = document.getElementById('quiz');
        if (quizContainer) {
            quizContainer.innerHTML = "<p>Desculpe, não foi possível carregar as questões do quiz. Tente novamente mais tarde.</p>";
        }
        document.getElementById('previous').disabled = true;
        document.getElementById('next').disabled = true;
        document.getElementById('submit').disabled = true;
    }
}

fetchQuestionsAndStartQuiz();