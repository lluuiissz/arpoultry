document.addEventListener('DOMContentLoaded', () => {
    // --- DATA --- //
    const modules = {
        feed: {
            title: 'Feed System',
            info: ['Provide balanced commercial feed.', 'Layer hens need extra calcium.', 'Never use moldy food.', 'Use a feeder to reduce waste.', 'Supplement with vitamins during stress.'],
            quiz: [
                { q: 'What do layer hens need for strong shells?', a: ['Extra protein', 'Extra calcium', 'Extra fat'], correct: 1 },
                { q: 'Moldy feed should be?', a: ['Used anyway', 'Mixed with fresh', 'Discarded'], correct: 2 },
                { q: 'What is a primary benefit of using a feeder?', a: ['It makes chickens eat faster', 'It reduces feed waste', 'It keeps predators away'], correct: 1 },
                { q: 'Why is it important to provide balanced commercial feed?', a: ['To make chickens grow larger', 'To ensure chickens receive all necessary nutrients', 'To reduce the cost of feeding'], correct: 1 },
                { q: 'When might chickens need vitamin supplements?', a: ['During hot weather', 'During periods of stress', 'When they are young chicks'], correct: 1 }
            ]
        },
        water: {
            title: 'Water System',
            info: ['Constant access to clean water.', 'Change water daily.', 'Raise containers off the ground.', 'Protect from droppings.', 'Ensure enough waterers.'],
            quiz: [
                { q: 'How often should water be changed for chickens?', a: ['Weekly', 'Daily', 'Monthly'], correct: 1 },
                { q: 'Why should water containers be raised off the ground?', a: ['To make them easier to fill', 'To keep the water clean from droppings and dirt', 'To prevent chickens from sitting in it'], correct: 1 },
                { q: 'What is the most important aspect of a chicken\'s water supply?', a: ['It should be cold', 'It should be flavored', 'It should be constantly clean and accessible'], correct: 2 },
                { q: 'Why protect water from droppings?', a: ['To prevent algae growth', 'To avoid spreading diseases', 'To keep the coop tidy'], correct: 1 },
                { q: 'What happens if chickens don\'t have enough waterers?', a: ['They will drink less', 'They may become dehydrated and stressed', 'They will find water elsewhere'], correct: 1 }
            ]
        },
        housing: {
            title: 'Housing (The Coop)',
            info: ['Good ventilation is crucial.', 'Keep flooring dry and clean.', 'Provide 4 sq. ft. per chicken.', 'Include elevated perches.', 'One nesting box per 4-5 hens.'],
            quiz: [
                { q: 'Why is good ventilation crucial in a chicken coop?', a: ['To keep the coop cool in summer', 'To prevent respiratory diseases and ammonia buildup', 'To help eggs hatch faster'], correct: 1 },
                { q: 'How much space per chicken is generally recommended inside the coop?', a: ['1 sq. ft.', '4 sq. ft.', '10 sq. ft.'], correct: 1 },
                { q: 'What is the purpose of elevated perches?', a: ['To give chickens a place to lay eggs', 'To allow chickens to roost off the ground at night', 'To help them reach higher feeders'], correct: 1 },
                { q: 'Why is it important to keep coop flooring dry and clean?', a: ['To prevent bad odors', 'To reduce the risk of parasites and diseases', 'To make cleaning easier'], correct: 1 },
                { q: 'How many nesting boxes should be provided for 4-5 hens?', a: ['One', 'Two', 'Three'], correct: 0 }
            ]
        },
        chicken: {
            title: 'About Chickens',
            info: ['Chickens are social animals.', 'They establish a pecking order.', 'They take dust baths to clean themselves.', 'They communicate using various sounds.', 'A healthy chicken is active and alert.'],
            quiz: [
                { q: 'What is the social structure of chickens called?', a: ['A flock', 'A pecking order', 'A brood'], correct: 1 },
                { q: 'How do chickens clean themselves?', a: ['With water', 'By preening', 'By taking dust baths'], correct: 2 },
                { q: 'What is a sign of a healthy chicken?', a: ['Lethargy', 'Activity and alertness', 'Isolation'], correct: 1 },
                { q: 'Why do chickens make various sounds?', a: ['To communicate with each other', 'For no reason', 'To scare predators'], correct: 0 },
                { q: 'What is a common behavior of chickens?', a: ['Swimming', 'Flying long distances', 'Foraging for food'], correct: 2 }
            ]
        }


    };

    // --- DOM ELEMENTS --- //
    const infoPanel = document.getElementById('info-panel');
    const completionScreen = document.getElementById('completion-screen');
    const startScreen = document.getElementById('start-screen'); // New
    const startTourButton = document.getElementById('start-tour-button'); // New
    const appContainer = document.getElementById('app-container'); // New

    // --- APP STATE --- //
    let userProgress = { completedModules: [], scores: {}, totalAnswered: 0 };

    // --- INITIALIZATION --- //
    function init() {
        console.log("Initializing ARPoultry application.");
        // Initially show the start screen and hide the main app container
        startScreen.classList.remove('hidden');
        appContainer.classList.add('hidden'); // Ensure app container is hidden initially

        startTourButton.addEventListener('click', () => {
            // Save user input (optional)
            const userName = document.getElementById('userName').value;
            const userEmail = document.getElementById('userEmail').value;
            const userLocation = document.getElementById('userLocation').value;
            localStorage.setItem('arpoultry_userName', userName);
            localStorage.setItem('arpoultry_userEmail', userEmail);
            localStorage.setItem('arpoultry_userLocation', userLocation);

            startScreen.classList.add('hidden'); // Hide start screen
            appContainer.classList.remove('hidden'); // Show main app container

            // Now initialize the AR experience
            initializeARScene();
        });
    }

    function initializeARScene() { // New function to encapsulate AR scene initialization
        console.log("Initializing marker-based AR experience.");
        document.getElementById('progress-tracker').classList.remove('hidden');
        initHotspots();
        loadProgress();
    }

    function initHotspots() {
        const hotspots = {
            'feed-hotspot': { moduleId: 'feed', originalColor: '#FFFF33', hoverColor: '#FFFF7C', originalRadius: 0.5, hoverRadius: 0.6 },
            'water-hotspot': { moduleId: 'water', originalColor: '#3357FF', hoverColor: '#7C9BFF', originalRadius: 0.1, hoverRadius: 0.12 },
            'housing-hotspot': { moduleId: 'housing', originalColor: '#FF5733', hoverColor: '#FF9B7C', originalRadius: 0.5, hoverRadius: 0.6 },
            'chicken-hotspot': { moduleId: 'chicken', originalColor: '#33FF57', hoverColor: '#7CFF9B', originalRadius: 0.1, hoverRadius: 0.12 }
        };

        for (const hotspotId in hotspots) {
            const hotspot = document.getElementById(hotspotId);
            if (hotspot) {
                const { moduleId, originalColor, hoverColor, originalRadius, hoverRadius } = hotspots[hotspotId];

                hotspot.addEventListener('click', () => showInfoPanel(moduleId));

                hotspot.addEventListener('mouseenter', () => {
                    hotspot.setAttribute('material', 'color', hoverColor);
                    hotspot.setAttribute('radius', hoverRadius);
                });

                hotspot.addEventListener('mouseleave', () => {
                    hotspot.setAttribute('material', 'color', originalColor);
                    hotspot.setAttribute('radius', originalRadius);
                });
            }
        }
        console.log("Hotspot listeners initialized.");
    }

    // --- UI & QUIZ LOGIC --- //

    document.getElementById('close-panel').addEventListener('click', () => infoPanel.classList.add('hidden'));
    document.getElementById('restart-tour').addEventListener('click', () => {
        localStorage.removeItem('arpoultry_progress');
        location.reload();
    });

    function showInfoPanel(moduleId) {
        const module = modules[moduleId];
        if (!module) return;
        document.getElementById('info-title').textContent = module.title;
        const infoSlides = document.getElementById('info-slides');
        infoSlides.innerHTML = '<h3>Key Tips:</h3><ul>' + module.info.map(tip => `<li>${tip}</li>`).join('') + '</ul>';
        const startQuizBtn = document.createElement('button');
        startQuizBtn.textContent = 'Start Quiz';
        startQuizBtn.onclick = () => startQuiz(moduleId);
        infoSlides.appendChild(startQuizBtn);
        document.getElementById('quiz').innerHTML = '';
        infoPanel.classList.remove('hidden');
    }

    function startQuiz(moduleId) {
        const module = modules[moduleId];
        const quizContainer = document.getElementById('quiz');
        let currentQuestionIndex = 0;
        userProgress.scores[moduleId] = userProgress.scores[moduleId] || { correct: 0, total: module.quiz.length };
        document.getElementById('info-slides').innerHTML = '';

        function showQuestion(index) {
            quizContainer.innerHTML = '';
            if (index >= module.quiz.length) {
                quizFinished(moduleId);
                return;
            }
            const qData = module.quiz[index];
            const questionEl = document.createElement('div');
            questionEl.className = 'quiz-question';
            questionEl.innerHTML = `<p>${index + 1}. ${qData.q}</p>`;
            const optionsEl = document.createElement('div');
            optionsEl.className = 'quiz-options';
            qData.a.forEach((answer, i) => {
                const optionBtn = document.createElement('button');
                optionBtn.textContent = answer;
                optionBtn.onclick = () => selectAnswer(i, optionBtn);
                optionsEl.appendChild(optionBtn);
            });
            questionEl.appendChild(optionsEl);
            quizContainer.appendChild(questionEl);

            function selectAnswer(selectedIndex, button) {
                const isCorrect = selectedIndex === qData.correct;
                button.classList.add(isCorrect ? 'correct' : 'wrong');
                if (isCorrect) userProgress.scores[moduleId].correct++;
                userProgress.totalAnswered++;
                optionsEl.querySelectorAll('button').forEach(btn => btn.disabled = true);
                updateProgressTracker();
                setTimeout(() => showQuestion(++currentQuestionIndex), 1200);
            }
        }
        showQuestion(currentQuestionIndex);
    }

    function quizFinished(moduleId) {
        if (!userProgress.completedModules.includes(moduleId)) {
            userProgress.completedModules.push(moduleId);
        }
        updateProgressTracker();
        const score = userProgress.scores[moduleId];
        document.getElementById('quiz').innerHTML = `<h3>Quiz Complete!</h3><p>You scored ${score.correct} out of ${score.total}.</p>`;
        // Check if all *available* modules are completed.
        const availableModules = Object.keys(modules).filter(id => document.getElementById(`${id}-hotspot`));
        if (userProgress.completedModules.length === availableModules.length) {
            setTimeout(showCompletionScreen, 2000);
        }
    }

    function updateProgressTracker() {
        document.getElementById('modules-completed').textContent = userProgress.completedModules.length;
        document.getElementById('questions-answered').textContent = userProgress.totalAnswered;
        saveProgress();
    }

    function showCompletionScreen() {
        infoPanel.classList.add('hidden');
        completionScreen.classList.remove('hidden');
        const finalScoresEl = document.getElementById('final-scores');
        let totalCorrect = 0, totalQuestions = 0;
        finalScoresEl.innerHTML = '<h4>Module Scores:</h4>';
        // Only show scores for modules that have a hotspot and thus are "available"
        const availableModules = Object.keys(modules).filter(id => document.getElementById(`${id}-hotspot`));
        for (const moduleId of availableModules) {
            const score = userProgress.scores[moduleId];
            if (score) { // Only display if a score exists for the module
                finalScoresEl.innerHTML += `<p>${modules[moduleId].title}: ${score.correct} / ${score.total}</p>`;
                totalCorrect += score.correct;
                totalQuestions += score.total;
            }
        }
        document.getElementById('total-score').textContent = `${totalCorrect} / ${totalQuestions}`;
    }

    function saveProgress() {
        localStorage.setItem('arpoultry_progress', JSON.stringify(userProgress));
    }

    function loadProgress() {
        const savedProgress = localStorage.getItem('arpoultry_progress');
        if (savedProgress) {
            userProgress = JSON.parse(savedProgress);
            updateProgressTracker();
        }
    }

    init();
});
