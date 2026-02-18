(function () {
    "use strict";

    var MIN_DELAY = 1500;
    var MAX_DELAY = 4500;

    var $ = function (id) { return document.getElementById(id); };

    var states = {
        welcome: $("stateWelcome"),
        waiting: $("stateWaiting"),
        go: $("stateGo"),
        early: $("stateEarly"),
        result: $("stateResult"),
    };

    var btnStart = $("btnStart");
    var btnRetryEarly = $("btnRetryEarly");
    var btnPlayAgain = $("btnPlayAgain");
    var btnHome = $("btnHome");
    var resultTimeEl = $("resultTime");
    var resultBadge = $("resultBadge");

    var waitTimer = null;
    var startTimestamp = 0;
    var gameActive = false;



    function showState(name) {
        var allStates = Object.keys(states);
        for (var i = 0; i < allStates.length; i++) {
            states[allStates[i]].classList.remove("active");
        }

        document.body.className = "";
        states[name].classList.add("active");
    }

    function startGame() {
        gameActive = false;
        showState("waiting");

        var delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;

        waitTimer = setTimeout(function () {
            showState("go");
            startTimestamp = performance.now();
            gameActive = true;
        }, delay);
    }

    function handleClick() {
        if (!gameActive) return;

        var reactionTime = Math.round(performance.now() - startTimestamp);
        gameActive = false;
        showResult(reactionTime);
    }

    function handleEarlyClick() {
        clearTimeout(waitTimer);
        waitTimer = null;
        gameActive = false;
        showState("early");
    }

    function showResult(ms) {
        showState("result");
        animateCounter(resultTimeEl, 0, ms, 500);

        var badge = getBadge(ms);
        resultBadge.className = "result-badge " + badge.className;
        resultBadge.querySelector(".result-badge__icon").textContent = badge.icon;
        resultBadge.querySelector(".result-badge__text").textContent = badge.label;
    }

    function getBadge(ms) {
        if (ms < 150) return { label: "Lightning Fast!", icon: "⚡", className: "result-badge--lightning" };
        if (ms < 250) return { label: "Fast!", icon: "🚀", className: "result-badge--fast" };
        if (ms < 400) return { label: "Average", icon: "👍", className: "result-badge--average" };
        return { label: "Keep Practicing", icon: "🐢", className: "result-badge--slow" };
    }

    function animateCounter(el, from, to, duration) {
        var startTime = performance.now();
        function tick(now) {
            var elapsed = now - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(from + (to - from) * ease);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    btnStart.addEventListener("click", startGame);
    states.waiting.addEventListener("click", handleEarlyClick);
    states.go.addEventListener("click", handleClick);
    btnRetryEarly.addEventListener("click", startGame);
    btnPlayAgain.addEventListener("click", startGame);
    btnHome.addEventListener("click", function () { showState("welcome"); });

    document.addEventListener("keydown", function (e) {
        if (e.code !== "Space") return;
        e.preventDefault();

        var activeState = document.querySelector(".state.active");
        if (activeState === states.waiting) handleEarlyClick();
        else if (activeState === states.go) handleClick();
    });

    showState("welcome");
})();
