// ======================================
// STUDYFLOW FINAL
// ======================================


// ===============================
// РАСПИСАНИЕ ШКОЛЫ
// ===============================

const DAYS = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота"
];

const SHORT = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
];


// ===============================
// ВРЕМЯ УРОКОВ
// ===============================

// 1-я смена

const SHIFTS = {

    first: [

        ["08:00", "08:45"],

        ["08:50", "09:35"],

        ["09:40", "10:25"],

        ["10:35", "11:20"],

        ["11:25", "12:10"],

        ["12:20", "13:05"]

    ],


    // 2-я смена

    second: [

        ["13:10", "13:55"],

        ["14:00", "14:45"],

        ["14:50", "15:35"],

        ["15:45", "16:30"],

        ["16:35", "17:20"],

        ["17:30", "18:15"]

    ]

};


// ===============================
// ELEMENTS
// ===============================

const modal =
    document.getElementById("modal");

const form =
    document.getElementById("lessonForm");

const grid =
    document.getElementById("scheduleGrid");

const themeBtn =
    document.getElementById("themeBtn");

const toast =
    document.getElementById("toast");


// ===============================
// VARIABLES
// ===============================

let currentWeek = 0;


// ===============================
// LOAD DATA
// ===============================

let lessons =
    JSON.parse(
        localStorage.getItem(
            "studyflow_final_lessons"
        ) || "[]"
    );


// ===============================
// DATE
// ===============================

function mondayOf(date) {

    const d =
        new Date(date);

    const day =
        d.getDay() || 7;

    d.setDate(
        d.getDate() - day + 1
    );

    d.setHours(
        0,
        0,
        0,
        0
    );

    return d;
}


function weekKey(date) {

    return (
        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            date.getDate()
        ).padStart(2, "0")
    );

}


function formatDate(date) {

    return date.toLocaleDateString(
        "ru-RU",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


// ===============================
// SECURITY
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            function (character) {

                const symbols = {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"

                };

                return symbols[
                    character
                ];

            }
        );

}


// ===============================
// SAVE
// ===============================

function saveLessons() {

    localStorage.setItem(
        "studyflow_final_lessons",
        JSON.stringify(lessons)
    );

}


// ===============================
// TOAST
// ===============================

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


// ===============================
// TIME PREVIEW
// ===============================

function updateTimePreview() {

    const shift =
        document.getElementById(
            "lessonShift"
        ).value;


    const number =
        Number(
            document.getElementById(
                "lessonNumber"
            ).value
        );


    const time =
        SHIFTS[
            shift
        ][
            number
        ];


    document.getElementById(
        "timePreview"
    ).textContent =
        `${time[0]} — ${time[1]}`;

}


document
    .getElementById(
        "lessonShift"
    )
    .addEventListener(
        "change",
        updateTimePreview
    );


document
    .getElementById(
        "lessonNumber"
    )
    .addEventListener(
        "change",
        updateTimePreview
    );


// ===============================
// MODAL
// ===============================

function openModal() {

    modal.classList.remove(
        "hidden"
    );

    document
        .getElementById(
            "subject"
        )
        .focus();

    updateTimePreview();

}


function closeModal() {

    modal.classList.add(
        "hidden"
    );

}


document
    .getElementById(
        "openModalBtn"
    )
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById(
        "heroAddBtn"
    )
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById(
        "closeModalBtn"
    )
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {

            closeModal();

        }

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


// ===============================
// ADD LESSON
// ===============================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const day =
            Number(
                document.getElementById(
                    "lessonDay"
                ).value
            );


        const shift =
            document.getElementById(
                "lessonShift"
            ).value;


        const number =
            Number(
                document.getElementById(
                    "lessonNumber"
                ).value
            );


        const subject =
            document.getElementById(
                "subject"
            ).value.trim();


        const teacher =
            document.getElementById(
                "teacher"
            ).value.trim();


        const room =
            document.getElementById(
                "room"
            ).value.trim();


        const color =
            document.querySelector(
                'input[name="lessonColor"]:checked'
            ).value;


        if (!subject) {

            return;

        }


        const monday =
            mondayOf(
                new Date()
            );


        monday.setDate(
            monday.getDate() +
            currentWeek * 7
        );


        const time =
            SHIFTS[
                shift
            ][
                number
            ];


        const lesson = {

            id:
                Date.now(),

            week:
                weekKey(
                    monday
                ),

            day:
                day,

            shift:
                shift,

            number:
                number,

            start:
                time[0],

            end:
                time[1],

            subject:
                subject,

            teacher:
                teacher,

            room:
                room,

            color:
                color

        };


        lessons.push(
            lesson
        );


        saveLessons();


        form.reset();


        updateTimePreview();


        closeModal();


        renderSchedule();


        showToast(
            "Урок добавлен ✓"
        );

    }
);


// ===============================
// RENDER
// ===============================

function renderSchedule() {

    const monday =
        mondayOf(
            new Date()
        );


    monday.setDate(
        monday.getDate() +
        currentWeek * 7
    );


    const saturday =
        new Date(
            monday
        );


    saturday.setDate(
        saturday.getDate() + 5
    );


    document.getElementById(
        "weekTitle"
    ).textContent =

        currentWeek === 0
            ? "Текущая неделя"

            : currentWeek > 0
                ? "Следующая неделя"

                : "Прошлая неделя";


    document.getElementById(
        "weekRange"
    ).textContent =

        `${formatDate(monday)} — ${formatDate(saturday)}`;


    document.getElementById(
        "heroDate"
    ).textContent =
        monday.getFullYear();


    grid.innerHTML = "";


    const currentWeekKey =
        weekKey(
            monday
        );


    DAYS.forEach(
        function (
            dayName,
            index
        ) {

            const date =
                new Date(
                    monday
                );


            date.setDate(
                monday.getDate() +
                index
            );


            const column =
                document.createElement(
                    "div"
                );


            column.className =
                "day-column";


            column.innerHTML = `

                <div class="day-header">

                    <span class="short">
                        ${SHORT[index]}
                    </span>

                    <strong>
                        ${dayName}
                    </strong>

                    <b class="day-number">
                        ${String(
                            date.getDate()
                        ).padStart(2, "0")}
                    </b>

                </div>

                <div class="lessons-container"></div>

            `;


            const container =
                column.querySelector(
                    ".lessons-container"
                );


            const dayLessons =
                lessons
                    .filter(
                        function (lesson) {

                            return (
                                lesson.week ===
                                    currentWeekKey &&

                                lesson.day ===
                                    index
                            );

                        }
                    )
                    .sort(
                        function (a, b) {

                            if (
                                a.shift !==
                                b.shift
                            ) {

                                return (
                                    a.shift ===
                                    "first"
                                        ? -1
                                        : 1
                                );

                            }


                            return (
                                a.number -
                                b.number
                            );

                        }
                    );


            if (
                dayLessons.length === 0
            ) {

                container.innerHTML = `

                    <div class="empty-day">

                        <span>＋</span>

                        <p>
                            Нет уроков
                        </p>

                        <small>
                            Добавь первое занятие
                        </small>

                    </div>

                `;

            }

            else {

                dayLessons.forEach(
                    function (
                        lesson
                    ) {

                        container.appendChild(
                            createLessonCard(
                                lesson
                            )
                        );

                    }
                );

            }


            grid.appendChild(
                column
            );

        }
    );


    updateStats(
        currentWeekKey
    );

}


// ===============================
// CARD
// ===============================

function createLessonCard(
    lesson
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        `lesson-card ${lesson.color}`;


    card.innerHTML = `

        <button
            class="delete-lesson"
            title="Удалить"
        >
            ×
        </button>


        <div class="lesson-badge">

            ${
                lesson.shift === "first"
                    ? "1-я смена"
                    : "2-я смена"
            }

            •
            ${lesson.number + 1}
            урок

        </div>


        <div class="lesson-time">

            ${lesson.start}
            —
            ${lesson.end}

        </div>


        <h3>
            ${escapeHTML(
                lesson.subject
            )}
        </h3>


        ${
            lesson.teacher
                ? `
                    <p>
                        👨‍🏫
                        ${escapeHTML(
                            lesson.teacher
                        )}
                    </p>
                `
                : ""
        }


        ${
            lesson.room
                ? `
                    <p>
                        📍 Кабинет
                        ${escapeHTML(
                            lesson.room
                        )}
                    </p>
                `
                : ""
        }

    `;


    card
        .querySelector(
            ".delete-lesson"
        )
        .addEventListener(
            "click",
            function () {

                lessons =
                    lessons.filter(
                        function (
                            item
                        ) {

                            return (
                                item.id !==
                                lesson.id
                            );

                        }
                    );


                saveLessons();


                renderSchedule();


                showToast(
                    "Урок удалён"
                );

            }
        );


    return card;

}


// ===============================
// STATISTICS
// ===============================

function updateStats(
    currentWeekKey
) {

    const current =
        lessons.filter(
            function (
                lesson
            ) {

                return (
                    lesson.week ===
                    currentWeekKey
                );

            }
        );


    document.getElementById(
        "heroLessons"
    ).textContent =
        current.length;


    const usedDays =
        new Set(
            current.map(
                function (
                    lesson
                ) {

                    return lesson.day;

                }
            )
        );


    document.getElementById(
        "heroDays"
    ).textContent =
        usedDays.size;


    const sorted =
        current.slice()
            .sort(
                function (
                    a,
                    b
                ) {

                    const firstA =
                        a.day * 100 +
                        (
                            a.shift === "first"
                                ? 0
                                : 50
                        ) +
                        a.number;


                    const firstB =
                        b.day * 100 +
                        (
                            b.shift === "first"
                                ? 0
                                : 50
                        ) +
                        b.number;


                    return (
                        firstA -
                        firstB
                    );

                }
            );


    document.getElementById(
        "nextLesson"
    ).textContent =
        sorted.length
            ? sorted[0].start
            : "—";

}


// ===============================
// WEEK NAVIGATION
// ===============================

document
    .getElementById(
        "prevWeek"
    )
    .addEventListener(
        "click",
        function () {

            currentWeek--;

            renderSchedule();

        }
    );


document
    .getElementById(
        "nextWeek"
    )
    .addEventListener(
        "click",
        function () {

            currentWeek++;

            renderSchedule();

        }
    );


// ===============================
// DARK MODE
// ===============================

function loadTheme() {

    const dark =
        localStorage.getItem(
            "studyflow_final_theme"
        ) === "dark";


    document.body.classList.toggle(
        "dark",
        dark
    );


    themeBtn.textContent =
        dark
            ? "☀"
            : "☾";

}


themeBtn.addEventListener(
    "click",
    function () {

        const dark =
            !document.body.classList.contains(
                "dark"
            );


        document.body.classList.toggle(
            "dark",
            dark
        );


        localStorage.setItem(
            "studyflow_final_theme",
            dark
                ? "dark"
                : "light"
        );


        themeBtn.textContent =
            dark
                ? "☀"
                : "☾";

    }
);


// ===============================
// CLEAR
// ===============================

document
    .getElementById(
        "clearBtn"
    )
    .addEventListener(
        "click",
        function () {

            if (
                lessons.length === 0
            ) {

                showToast(
                    "Расписание уже пустое"
                );

                return;

            }


            const answer =
                confirm(
                    "Удалить всё расписание?"
                );


            if (!answer) {
                return;
            }


            lessons = [];


            saveLessons();


            renderSchedule();


            showToast(
                "Расписание очищено"
            );

        }
    );


// ===============================
// START
// ===============================

loadTheme();

updateTimePreview();

renderSchedule();