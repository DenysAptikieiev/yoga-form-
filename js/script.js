// const request = require("request");

window.addEventListener('DOMContentLoaded', () => {

    "use strict";
    // TABS
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    let hideTabContent = (item, elem) => {
        for (let i = item; i < elem.length; i++) {
            elem[i].classList.remove('show');
            elem[i].classList.add('hide');
        }
    };

    let showTabContent = (index, elem) => {
        if (elem[index].classList.contains('hide')) {
            elem[index].classList.remove('hide');
            elem[index].classList.add('show');
        }
    };

    hideTabContent(1, tabContent);

    info.addEventListener('click', event => {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0, tabContent);
                    showTabContent(i, tabContent);
                    break;
                }
            }
        }
    });
    //===================================================================
    //TIMER

    const deadLine = '2020-04-12';

    const getTimeRemaining = endTime => {
        let total = Date.parse(endTime) - Date.parse(new Date()),
            seconds = Math.floor((total / 1000) % 60),
            minutes = Math.floor((total / 1000 / 60) % 60),
            hours = Math.floor(total / (1000 * 60 * 60));

        return {
            'total': total,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    };

    const setClock = (id, endTime) => {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            const t = getTimeRemaining(endTime);

            for (let key in t) {
                if (key !== 'total' && t[key] < 10) {
                    t[key] = '0' + t[key];
                }
                if (key !== 'total' && t[key] > 60) {
                    t[key] = 59 + '...';
                }
            }

            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;

            if (t.total < 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    };

    setClock('timer', deadLine);
    //====================================================================
    //MODAL

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', () => {
        overlay.style.display = 'block';
        more.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', () => {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    //======================================================================
    //FORM
    let message = {
        loading: 'Загрузка...',
        succes: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то прошло не так...',
    };

    let form = document.querySelector('.main-form'),
        formContact = document.querySelector('#form'),
        input = document.querySelectorAll('input'),
        statusMessage = document.createElement('div');
    statusMessage.classList.add('status');

    let sendForm = elem => {
        elem.addEventListener('submit', function (event) {
            event.preventDefault();
            elem.appendChild(statusMessage);
            let formData = new FormData(elem);

            let obj = {};

            formData.forEach(function (value, key) {
                obj[key] = value;
            });
            const json = JSON.stringify(obj);

            let postData = data => {
                return new Promise(function (resolve, reject) {
                    let request = new XMLHttpRequest();
                    request.open('POST', 'server.php');
                    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                    request.onreadystatechange = () => {
                        if (request.readyState < 4) {
                            resolve(data);
                        } if (request.readyState === 4 && request.status === 200) {
                            resolve(data);
                        } else {
                            reject();
                        }
                    };
                    request.send(data);
                });
            };
            let clearInput = () => {
                for (let i = 0; i < input.length; i++) {
                    input[i].value = '';
                }
            };

            postData(json)
                .then(() => statusMessage.innerHTML = message.loading)
                .then(() => {
                    statusMessage.innerHTML = message.succes;
                    console.log(JSON.parse(json));
                })
                .catch(() => statusMessage.innerHTML = message.failure)
                .then(clearInput);
        });
    };

    sendForm(form);
    sendForm(formContact);
    //=======================================================================================
    //SLIDER

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    let showSlides = (n) => {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        slides.forEach(item => item.style.display = 'none');
        dots.forEach(item => item.classList.remove('dot-active'));
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    };

    showSlides(1);

    let plusSlide = n => {
        showSlides(slideIndex += n);
    };

    let currentSlide = n => {
        showSlides(slideIndex = n);
    };

    prev.addEventListener('click', () => {
        plusSlide(-1);
    });

    next.addEventListener('click', () => {
        plusSlide(1);
    });

    dotsWrap.addEventListener('click', (event) => {
        const target = event.target;

        for (let i = 0; i < dots.length + 1; i++) {
            if (target.classList.contains('dot') && target == dots[i - 1]) {
                currentSlide(i);
            }
        }
    });
    //================================================================================
    //CULC

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.querySelector('#select'),
        totalValue = document.querySelector('#total'),
        total = 0;

        totalValue.innerHTML = 0;

        let culc = (persons, restDays, total) => {
            let sum = (+persons.value + (+restDays.value));
            total = (sum) * 4000 * place.value;
        
            if (persons.value == '' || restDays.value == '' || persons.value == 0 || restDays.value == 0) {
                total = 0;
                return total;
            } else {
                return total;
            }
        };

        persons.addEventListener('input', function() {
            totalValue.innerHTML = culc(this, restDays, total);
            if (this.value < 0 || this.value == 0 || isNaN(this.value)) {
                this.value = '';
            }
        });

        restDays.addEventListener('input', function() {
            totalValue.innerHTML = culc(this, persons, total);
            if (this.value < 0 || this.value == 0 || isNaN(this.value)) {
                this.value = '';
            }
        });

        place.addEventListener('input', function() {
            let total = (+persons.value + (+restDays.value)) * 4000 * this.value;

            if (persons.value == '' || restDays.value == '') {
                totalValue.innerHTML = 0;
            } else {
                totalValue.innerHTML = total;
            }
        });
});