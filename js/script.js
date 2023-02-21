import playList from './playList.js';

const config = {
  lang: 'ru',
  defaultCity: 'Шымкент',
  imgSrc: 'github'
}
const time = document.querySelector('.time');
const dateToday = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const bkgnBtnNext = document.body.querySelector('.slide-next');
const bkgnBtnPrev = document.body.querySelector('.slide-prev');
const quotesArr = [
  [
    {
      text: "Programs must be written for people to read, and only incidentally for machines to execute.",
      author: "Harold Abelson",
    },
    {
      text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      author: "Martin Fowler",
    },
    {
      text: "I'm not a great programmer; I'm just a good programmer with great habits.",
      author: "Kent Beck",
    },
    {
      text: "Truth can only be found in one place: the code.",
      author: "Robert C. Martin",
    },
    {
      text: "How you look at it is pretty much how you'll see it",
      author: "Rasheed Ogunlaru",
    },
    {
      text: "The most disastrous thing that you can ever learn is your first programming language.",
      author: "Alan Kay",
    },
    {
      text: "The most important property of a program is whether it accomplishes the intention of its user.",
      author: "C.A.R. Hoare",
    },
  ],
  [
    {
      text: "Не волнуйтесь, если что-то не работает. Если бы всё работало, вас бы уволили.",
      author: "Закон Мошера",
    },
    {
      text: "Иногда лучше остаться спать дома в понедельник, чем провести всю неделю в отладке написанного в понедельник кода.",
      author: "Кристофер томпсон",
    },
    {
      text: "Измерять продуктивность программиста подсчетом строк кода — это так же, как оценивать постройку самолета по его весу.",
      author: "Билл Гейтс",
    },
    {
      text: "Многие из вас знакомы с достоинствами программиста. Их всего три, и разумеется это: лень, нетерпеливость и гордыня.",
      author: "Ларри Уолл",
    },
    {
      text: "Всегда пишите код так, будто сопровождать его будет склонный к насилию психопат, который знает, где вы живете.",
      author: "Мартин Голдинг",
    },
    {
      text: "Люди, которые думают, что ненавидят компьютеры, на самом деле ненавидят плохих программистов.",
      author: "Ларри Нимен",
    },
    {
      text: "Мы наблюдаем общество, которое все больше зависит от машин, но при этом использует их все неэффективнее.",
      author: "Дуглас Рушкоф",
    },
  ],

];
const ulForSongs = document.body.querySelector('.play-list');
const changeQuote = document.body.querySelector('.change-quote');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.body.querySelector('.city');
city.value = config.defaultCity;
const weatherError = document.body.querySelector('.weather-error');
const names = document.body.querySelector('.names');
const audio = new Audio();
const playBtn = document.body.querySelector('.play');
const playNext = document.body.querySelector('.play-next');
const playPrev = document.body.querySelector('.play-prev');
const rus = document.body.querySelector('.rus');
const eng = document.body.querySelector('.eng');
let currentTimeOfTheDay;
let numOfBckgrndImg = getRandomNum();
let isPlay = false;
let playNum = 0;
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
bkgnBtnNext.addEventListener('click', getSlideNext);
bkgnBtnPrev.addEventListener('click', getSlidePrev);
city.addEventListener('change', getWeather);
changeQuote.addEventListener('click', getQuote);
playBtn.addEventListener('click', playAudio);
playNext.addEventListener('click', turnNextSong);
playPrev.addEventListener('click', turnPrevSong);
rus.addEventListener('click', () => translate('ru'));
eng.addEventListener('click', () => translate('en'));

function markCurrTrack() {
  let trackList = document.body.querySelectorAll('.play-item');
  trackList.forEach(element => element.classList.remove('play-now'));
  trackList[playNum].classList.add('play-now');
}

function translate(lang) {
  config.lang = lang;
  getWeather();
  getQuote();
}

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    currentTimeOfTheDay = getTimeOfDay();
    if (config.lang === 'en') {
      greeting.textContent = `Good ${currentTimeOfTheDay},`;
      names.placeholder = 'enter your name';
    } else {
      if (currentTimeOfTheDay === 'morning') greeting.textContent = `Хорошего утра,`;
      else if (currentTimeOfTheDay === 'afternoon') greeting.textContent = `Хорошего дня,`;
      else if (currentTimeOfTheDay === 'evening') greeting.textContent = `Хорошего вечера,`;
      else greeting.textContent = `Хорошей ночи,`;
      names.placeholder = 'введите имя';
    }
    setTimeout(showTime, 1000);
}

function makeSongList() {
  for (let item of playList) {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = item['title'];
    ulForSongs.append(li);
  }
}

function turnNextSong() {
  if (playNum < (playList.length - 1)) {
    playNum += 1;
  } else {
    playNum = 0;
  }
  playAudio();
}

function turnPrevSong() {
  if (playNum > 0) {
    playNum -= 1;
  } else {
    playNum = playList.length - 1;
  }
  playAudio();
}

function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  if (!isPlay) {
    audio.play();
    isPlay = true;
    playBtn.classList.add('pause');
  } else {
    audio.pause();
    isPlay = false;
    playBtn.classList.remove('pause');
  }
  markCurrTrack()
}

function getQuote() {
  let langOfQuotes = (config.lang === "ru") ? 1 : 0;
  let randomQuoteNum = Math.floor(Math.random() * quotesArr[langOfQuotes].length);
  let quoteText = document.body.querySelector(".quote");
  let quoteAuthor = document.body.querySelector(".author");
  quoteText.textContent = quotesArr[langOfQuotes][randomQuoteNum]["text"];
  quoteAuthor.textContent = quotesArr[langOfQuotes][randomQuoteNum]["author"];
}

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${config.lang}&APPID=f6543e09bb5c937e037e2eb70d051498&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.cod == "404" || data.cod == "400") {
      weatherError.innerHTML = '<img src="./assets/img/error.png">';
      weatherIcon.className = 'weather-icon owf'
      temperature.textContent = '';
      weatherDescription.textContent = '';
      wind.textContent = '';
      humidity.textContent = '';
    } else {
      city.value = data.name;
      weatherError.innerHTML = '';
      weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      temperature.textContent = `${Math.round(data.main.temp)}°C`;
      weatherDescription.textContent = data.weather[0].description;
      wind.textContent = (config.lang === 'ru') ? `Ветер: ${Math.round(data.wind.speed)}м/с` : `Wind: ${Math.round(data.wind.speed)}m/s`;      humidity.textContent = (config.lang === 'ru') ? `Влажность: ${Math.round(data.main.humidity)}%` : `Humidity: ${Math.round(data.main.humidity)}%`;
    }
}

function getSlideNext() {
    if (numOfBckgrndImg < 20) numOfBckgrndImg = (+numOfBckgrndImg + 1).toString().padStart(2, "0");
    else  numOfBckgrndImg = '01';
    setBg(numOfBckgrndImg);
}

function getSlidePrev() {
    if (numOfBckgrndImg > 1) numOfBckgrndImg = (+numOfBckgrndImg - 1).toString().padStart(2, "0");
    else  numOfBckgrndImg = '20';
    setBg(numOfBckgrndImg);
}

function setBg(num) {
    const img = new Image();
    img.src = `./assets/img/${currentTimeOfTheDay}/${num}.jpg`;
    // img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${currentTimeOfTheDay}/${num}.jpg`;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`;
    };
}

function showDate() {
    const date = new Date();
    const options = {month: 'long', day: 'numeric', year: 'numeric',};
    const currentDate = (config.lang === 'ru') ? date.toLocaleDateString('ru-Ru', options) : date.toLocaleDateString('en-En', options);
    dateToday.textContent = currentDate;
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 0 && hours < 6) return 'night';
    else if (hours >= 6 && hours < 12) return 'morning';
    else if (hours >= 12 && hours < 18) return 'afternoon';
    else return 'evening';
}

function setLocalStorage() {
    localStorage.setItem('names', names.value);
    localStorage.setItem('city', city.value);
}

function getLocalStorage() {
    if(localStorage.getItem('names')) {
      names.value = localStorage.getItem('names');
    }
    if(localStorage.getItem('city')) {
      city.value = localStorage.getItem('city');
    }

}

function getRandomNum() {
    return (Math.floor(Math.random() * (20 - 1 + 1)) + 1).toString().padStart(2, "0");
}

showTime();
setBg(numOfBckgrndImg);
getWeather();
getQuote();
makeSongList();