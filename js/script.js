// Banco de dados de questões (simulado)
const questions = [
    {
        question: "O que significa o 'V' de Volume no contexto de Big Data?",
        answers: {
            a: "A velocidade de processamento dos dados",
            b: "A quantidade massiva de dados gerados",
            c: "A variedade de formatos de dados",
            d: "A veracidade das informações"
        },
        correctAnswer: "b"
    },
    {
        question: "Qual das seguintes NÃO é uma característica do Big Data?",
        answers: {
            a: "Volume",
            b: "Velocidade",
            c: "Variedade",
            d: "Virtualização"
        },
        correctAnswer: "d"
    },
    {
        question: "Qual tecnologia é comumente associada ao processamento de Big Data?",
        answers: {
            a: "Hadoop",
            b: "MySQL",
            c: "Microsoft Word",
            d: "Adobe Photoshop"
        },
        correctAnswer: "a"
    },
    {
        question: "O que o MapReduce faz no ecossistema Hadoop?",
        answers: {
            a: "Processa e gera grandes conjuntos de dados em paralelo",
            b: "Cria mapas geográficos de data centers",
            c: "Reduz o tamanho dos arquivos para economizar espaço",
            d: "Mapeia endereços IP para localizações físicas"
        },
        correctAnswer: "a"
    },
    {
        question: "Qual desses é um exemplo de dado não estruturado?",
        answers: {
            a: "Planilha Excel",
            b: "Tabela em um banco de dados relacional",
            c: "Post em uma rede social",
            d: "Arquivo CSV"
        },
        correctAnswer: "c"
    },
    {
        question: "O que significa 'ETL' no contexto de Big Data?",
        answers: {
            a: "Extract, Transform, Load",
            b: "Electronic Transaction Log",
            c: "Enterprise Technology Layer",
            d: "Extended Transfer Link"
        },
        correctAnswer: "a"
    },
    {
        question: "Qual dessas ferramentas é usada para processamento de fluxo de dados em tempo real?",
        answers: {
            a: "Apache Kafka",
            b: "Microsoft Excel",
            c: "Adobe Illustrator",
            d: "Oracle Database"
        },
        correctAnswer: "a"
    },
    {
        question: "O que é Data Lake?",
        answers: {
            a: "Um repositório que armazena dados brutos em seu formato nativo",
            b: "Um banco de dados relacional altamente estruturado",
            c: "Um software para análise de dados geográficos",
            d: "Um tipo específico de data warehouse"
        },
        correctAnswer: "a"
    },
    {
        question: "Qual desses é um desafio comum no trabalho com Big Data?",
        answers: {
            a: "Escassez de dados para análise",
            b: "Dificuldade em armazenar pequenos volumes de dados",
            c: "Integração de dados de diferentes fontes e formatos",
            d: "Velocidade de processamento extremamente rápida para pequenos conjuntos"
        },
        correctAnswer: "c"
    },
    {
        question: "O que o 'V' de Veracidade no Big Data se refere?",
        answers: {
            a: "A velocidade de coleta de dados",
            b: "A confiabilidade e qualidade dos dados",
            c: "A variedade de fontes de dados",
            d: "O valor comercial dos dados"
        },
        correctAnswer: "b"
    }
];

// Variáveis do quiz
let currentQuestion = 0;
let score = 0;
let userAnswers = new Array(questions.length);

// Função para carregar a questão atual
function loadQuestion() {
    const quizContainer = document.getElementById('quiz');
    const questionObj = questions[currentQuestion];
    
    // Construir HTML da questão
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
    
    // Marcar resposta anterior se existir
    if (userAnswers[currentQuestion] !== undefined) {
        document.querySelector(`input[value="${userAnswers[currentQuestion]}"]`).checked = true;
    }
    
    // Atualizar estado dos botões
    document.getElementById('previous').disabled = currentQuestion === 0;
    document.getElementById('next').disabled = currentQuestion === questions.length - 1;
}

// Função para salvar resposta
function saveAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        userAnswers[currentQuestion] = selectedOption.value;
    }
}

// Função para mostrar resultados
function showResults() {
    saveAnswer();
    
    // Calcular pontuação
    score = 0;
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].correctAnswer) {
            score++;
        }
    }
    
    // Mostrar resultado
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `Você acertou ${score} de ${questions.length} questões!`;
    
    // Esconder botões
    document.getElementById('previous').style.display = 'none';
    document.getElementById('next').style.display = 'none';
    document.getElementById('submit').style.display = 'none';
}

// Event Listeners
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

// Iniciar quiz
loadQuestion();