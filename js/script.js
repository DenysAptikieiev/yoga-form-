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
        elem.addEventListener('submit', function(event) {
            event.preventDefault();
            elem.appendChild(statusMessage);
            let formData = new FormData(elem);

            let obj = {};

            formData.forEach(function (value, key) {
                obj[key] = value;
            });
            const json = JSON.stringify(obj);
    
            let postData = data => {
                return new Promise(function(resolve, reject) {
                    let request = new XMLHttpRequest();
                    request.open('POST', 'server.php');
                    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                    request.onreadystatechange = () => {
                        if (request.readyState < 4) {
                            resolve();
                        } if (request.readyState === 4 && request.status === 200) {
                            resolve();
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
                .then(() => statusMessage.innerHTML = message.succes)
                .catch(() => statusMessage.innerHTML = message.failure)
                .then(clearInput);
        });
    };

    sendForm(form);
    sendForm(formContact);
});