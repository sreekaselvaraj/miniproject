document.addEventListener('DOMContentLoaded', () => {
    // Get HTML elements
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');

    // Timer Mode Buttons
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');

    // Direct Time Adjustment Buttons
    const minutesUpBtn = document.getElementById('minutes-up');
    const minutesDownBtn = document.getElementById('minutes-down');

    // Control Buttons
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Settings Input Fields
    const pomodoroTimeSettingInput = document.getElementById('pomodoro-time-setting');
    const shortBreakTimeSettingInput = document.getElementById('short-break-time-setting');
    const longBreakTimeSettingInput = document.getElementById('long-break-time-setting');
    const applySettingsBtn = document.getElementById('apply-settings-btn');

    const alarmSound = document.getElementById('alarm-sound');

    let timerInterval;
    let totalSeconds; // Current countdown seconds
    let initialTotalSecondsForMode; // Stores the *current* initial seconds for the active mode
    let isPaused = true;
    let currentMode = 'pomodoro'; // 'pomodoro', 'short-break', 'long-break'

    // Default durations (editable in settings)
    let defaultDurations = {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15
    };

    // --- Core Timer Functions ---

    // Function to update the display
    function updateDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }

    // Function to set the timer based on the current mode's default or adjusted initial time
    function setTimerForMode(mode) {
        currentMode = mode;
        clearInterval(timerInterval); // Clear any existing timer
        isPaused = true; // Ensure timer is paused when mode changes
        updateControlButtons(); // Show start, hide pause

        // Set initialTotalSecondsForMode based on the default durations
        if (mode === 'pomodoro') {
            initialTotalSecondsForMode = defaultDurations.pomodoro * 60;
        } else if (mode === 'short-break') {
            initialTotalSecondsForMode = defaultDurations.shortBreak * 60;
        } else if (mode === 'long-break') {
            initialTotalSecondsForMode = defaultDurations.longBreak * 60;
        }

        totalSeconds = initialTotalSecondsForMode; // Set the current timer to the mode's initial time
        updateDisplay();
        updateActiveModeButton(mode);
        toggleAdjustmentButtons(true); // Enable adjustment buttons
    }

    // Function to start the countdown
    function startTimer() {
        if (!isPaused) return; // Already running

        // If totalSeconds is 0 when trying to start, and it wasn't already running
        if (totalSeconds <= 0) {
            alert("Time cannot be zero. Please set a time before starting.");
            return;
        }

        isPaused = false;
        updateControlButtons(); // Show pause, hide start
        toggleAdjustmentButtons(false); // Disable adjustment buttons while running

        timerInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                alarmSound.play();
                alert(`${currentMode === 'pomodoro' ? 'Pomodoro' : 'Break'} finished!`);

                // Auto-switch logic
                if (currentMode === 'pomodoro') {
                    setTimerForMode('short-break'); // Suggest short break after Pomodoro
                } else {
                    setTimerForMode('pomodoro'); // Go back to Pomodoro after any break
                }
                return;
            }
            totalSeconds--;
            updateDisplay();
        }, 1000);
    }

    // Function to pause the countdown
    function pauseTimer() {
        if (isPaused) return; // Already paused

        isPaused = true;
        clearInterval(timerInterval);
        updateControlButtons(); // Show start, hide pause
        toggleAdjustmentButtons(true); // Enable adjustment buttons
    }

    // Function to reset the timer to its initial state for the current mode
    function resetTimer() {
        pauseTimer(); // Stop any running timer first
        totalSeconds = initialTotalSecondsForMode; // Revert to the time set for the current mode
        updateDisplay();
        toggleAdjustmentButtons(true); // Ensure adjustment buttons are enabled on reset
    }

    // --- UI Update Functions ---

    // Update active mode button styling
    function updateActiveModeButton(activeButtonId) {
        const buttons = document.querySelectorAll('.timer-mode button');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`${activeButtonId}-btn`).classList.add('active');
    }

    // Update Start/Pause button visibility
    function updateControlButtons() {
        if (isPaused) {
            startBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        } else {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'block';
        }
    }

    // Enable/disable direct time adjustment buttons
    function toggleAdjustmentButtons(enable) {
        minutesUpBtn.style.pointerEvents = enable ? 'auto' : 'none';
        minutesDownBtn.style.pointerEvents = enable ? 'auto' : 'none';
        minutesUpBtn.style.opacity = enable ? '1' : '0.5';
        minutesDownBtn.style.opacity = enable ? '1' : '0.5';
    }

    // --- Event Handlers ---

    // Mode button clicks
    pomodoroBtn.addEventListener('click', () => setTimerForMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => setTimerForMode('short-break'));
    longBreakBtn.addEventListener('click', () => setTimerForMode('long-break'));

    // Control button clicks
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Direct time adjustment clicks
    minutesUpBtn.addEventListener('click', () => {
        if (isPaused) { // Only adjust if paused
            totalSeconds = Math.min(totalSeconds + 60, 3600); // Add 1 minute, max 60 min for simplicity
            updateDisplay();
            initialTotalSecondsForMode = totalSeconds; // Update the initial time for reset too
        }
    });

    minutesDownBtn.addEventListener('click', () => {
        if (isPaused) { // Only adjust if paused
            totalSeconds = Math.max(totalSeconds - 60, 0); // Subtract 1 minute, min 0
            updateDisplay();
            initialTotalSecondsForMode = totalSeconds; // Update the initial time for reset too
        }
    });

    // Apply default settings
    applySettingsBtn.addEventListener('click', () => {
        const newPomodoro = parseInt(pomodoroTimeSettingInput.value);
        const newShortBreak = parseInt(shortBreakTimeSettingInput.value);
        const newLongBreak = parseInt(longBreakTimeSettingInput.value);

        if (newPomodoro > 0 && newShortBreak > 0 && newLongBreak > 0) {
            defaultDurations.pomodoro = newPomodoro;
            defaultDurations.shortBreak = newShortBreak;
            defaultDurations.longBreak = newLongBreak;
            alert('Default durations applied successfully!');
            // Re-set the timer for the current mode to apply new default
            setTimerForMode(currentMode);
        } else {
            alert('Please enter valid positive numbers for all default durations.');
        }
    });

    // --- Initial Setup ---
    setTimerForMode('pomodoro'); // Initialize with Pomodoro mode
});
