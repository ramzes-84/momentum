import playList from './playList.js';

const config = {
  lang: 'ru',
  defaultCity: 'Шымкент',
  isPlay: false,
  playNum: 0,
  blocks: ['time', 'date', 'greeting-container', 'quote-container', 'weather', 'player'],
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
city.value = (localStorage.getItem('city') || config.defaultCity);
const weatherError = document.body.querySelector('.weather-error');
const names = document.body.querySelector('.names');
const audio = new Audio();
const playBtn = document.body.querySelector('.play');
const playNext = document.body.querySelector('.play-next');
const playPrev = document.body.querySelector('.play-prev');
const soundOnOff = document.body.querySelector('.sound-off');
const rus = document.body.querySelector('.rus');
const eng = document.body.querySelector('.eng');
const settingsBtn = document.body.querySelector('.settings-icon');
const settingsBlock = document.body.querySelector('.settings-container');
let currentTimeOfTheDay;
let numOfBckgrndImg = getRandomNum();
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
audio.addEventListener('ended', turnNextSong);
soundOnOff.addEventListener('click', toggleSound);
settingsBtn.addEventListener('click', showSettings);

function setListenerToConfigs() { //Вешает слушатель на инпуты в настроках
  config.blocks.forEach(function (item) {
  let element = document.body.querySelector('input[name=' + item + ']');
  element.addEventListener('change', () => blockOnOff(item));
    }
  )
}

function blockOnOff(str) {
  let block = document.querySelector('.' + str);
  block.classList.toggle('hidden');
}

function showSettings() {
  settingsBlock.classList.toggle('hidden')
}

function toggleSound() {
  if (audio.volume === 1) audio.volume = 0;
  else audio.volume = 1;
}

function turnNextSong() {
  if (config.playNum < (playList.length - 1)) {
    config.playNum += 1;
  } else {
    config.playNum = 0;
  }
  config.isPlay = !config.isPlay
  playAudio();
}

function turnPrevSong() {
  if (config.playNum > 0) {
    config.playNum -= 1;
  } else {
    config.playNum = playList.length - 1;
  }
  config.isPlay = !config.isPlay
  playAudio();
}

function playAudio() {
  audio.src = playList[config.playNum].src;
  audio.currentTime = 0;
  if (!config.isPlay) {
    audio.play();
    playBtn.classList.add('pause');
  } else {
    audio.pause();
    playBtn.classList.remove('pause');
  }
  config.isPlay = !config.isPlay
  markCurrTrack()
}

function markCurrTrack() {
  let trackList = document.body.querySelectorAll('.play-item');
  trackList.forEach(element => element.classList.remove('play-now'));
  trackList[config.playNum].classList.add('play-now');
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
setListenerToConfigs();

console.log(`Ваша оценка - 108 баллов 
Не выполненные/не засчитанные пункты:
1) добавлен прогресс-бар в котором отображается прогресс проигрывания 
2) при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека 
3) над прогресс-баром отображается название трека 
4) отображается текущее и общее время воспроизведения трека 
5) добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука 
6) можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте 
7) переводятся настройки приложения, при переключении языка приложения в настройках, язык настроек тоже меняется 
8) в качестве источника изображений может использоваться Unsplash API 
9) в качестве источника изображений может использоваться Flickr API 
10) в настройках приложения можно указать источник получения фото для фонового изображения: коллекция изображений GitHub, Unsplash API, Flickr API 
11) если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото 
12) настройки приложения сохраняются при перезагрузке страницы 
13) ToDo List - список дел (как в оригинальном приложении) или Список ссылок (как в оригинальном приложении) или Свой собственный дополнительный функционал, по сложности аналогичный предложенным 

Выполненные пункты:
1) время выводится в 24-часовом формате, например: 21:01:00 
2) время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается) 
3) выводится день недели, число, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня" 
4) текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь). Проверяется соответствие приветствия текущему времени суток 
5) пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется 
6) ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20). Проверяем, что при перезагрузке страницы фоновое изображение изменилось. Если не изменилось, перезагружаем страницу ещё раз 
7) изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана.Изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке) 
8) изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке) 
9) при смене слайдов важно обеспечить плавную смену фоновых изображений. Не должно быть состояний, когда пользователь видит частично загрузившееся изображение или страницу без фонового изображения. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения 
10) при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage 
11) для указанного пользователем населённого пункта выводятся данные о погоде, если их возвращает API. Данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел 
12) выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) 
13) при загрузке страницы приложения отображается рандомная цитата и её автор 
14) при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую) 
15) при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause 
16) при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play 
17) треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev) 
18) трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем 
19) после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. 
20) есть кнопка звука при клике по которой можно включить/отключить звук 
21) переводится язык и меняется формат отображения даты 
22) переводится приветствие и placeholder 
23) переводится прогноз погоды в т.ч описание погоды и город по умолчанию 
24) переводится цитата дня т.е цитата отображается на текущем языке приложения. Сама цитата может быть другая 
25) в настройках приложения можно указать язык приложения (en/ru или en/be)  
26) в настройках приложения можно скрыть/отобразить любой из блоков, которые находятся на странице: время, дата, приветствие, цитата дня, прогноз погоды, аудиоплеер, список дел/список ссылок/ваш собственный дополнительный функционал 
27) Скрытие и отображение блоков происходит плавно, не влияя на другие элементы, которые находятся на странице, или плавно смещая их`)