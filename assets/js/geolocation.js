/*
 * Copyright (C) 2015 ioerror
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

window.geolocation = (function () {
    /**
     * Tłumaczenia komunikatów
     * @type geolocation_L18|@exp;window@pro;geolocation
     */
    var messages = window.geolocation || {};

    /**
     * Wyświetla na stronie lokalizację użytkownika
     * @param {Position} position Obiekt klasy Position zawierający informacje o pozycji
     */
    function displayPosition(position) {
        document.getElementById("msg").innerHTML = messages.dispPos.loc;
        document.getElementById("latitude").innerHTML = position.coords.latitude + "°";
        document.getElementById("longitude").innerHTML = position.coords.longitude + "°";
        document.getElementById("coordsAccuracy").innerHTML = "±" + position.coords.accuracy + " m";
        document.getElementById("altitude").innerHTML = (position.coords.altitude == null) ? "–" : position.coords.altitude + " m";
        document.getElementById("altitudeAccuracy").innerHTML = (position.coords.altitudeAccuracy == null) ? "–" : "±" + position.coords.altitudeAccuracy + " m";

        /**
         * Url obrazka mapki
         * @type {String}
         */
        var src = "https://maps.googleapis.com/maps/api/staticmap?zoom=14&size=400x300&markers=color:green|" + position.coords.latitude + "," + position.coords.longitude;

        /**
         * Element HTML zawierający wyłacznie obrazek mapki
         * @type @exp;document@call;getElementById
         */
        var map = document.getElementById("map");

        //jeśli istnieje element podrzędny (obrazek mapki) to zmień src obrazka
        if (map.firstChild) {
            map.firstChild.src = src;
        }
        else {
            /**
             * Obrazek z mapką
             * @type @exp;document@call;createElement
             */
            var img = document.createElement("img");
            img.src = src;
            document.getElementById("map").appendChild(img);
        }
    }

    /**
     * Wyświtla komunikat błędu
     * @param {PositionError} error Obiekt klasy PositionError z informacjami o błędzie
     */
    function displayError(error) {
        /**
         * Treść komunikatu błędu
         * @type String
         */
        var msg = "";

        switch (error.code) {
            case error.PERMISSION_DENIED:
                msg = messages.dispErr.permDen;
                break;
            case error.POSITION_UNAVAILABLE:
                msg = messages.dispErr.posUnav;
                break;
            case error.TIMEOUT:
                msg = messages.dispErr.timeout;
                break;
            case error.UNKNOWN_ERROR:
                msg = messages.dispErr.unknown;
                break;
        }

        document.getElementById("msg").innerHTML = msg;
    }

    /**
     * Ustala lokalizację użytkownika
     */
    function getPosition() {
        /**
         * Element HTML służący do wyświetlania statusu/msgów
         * @type @exp;document@call;getElementById
         */
        var divMsg = document.getElementById("msg");
        divMsg.innerHTML = messages.getPos.locating;

        //sprawdzenie czy przeglądarka udostępnia objekt klasy Geolocation
        if (navigator.geolocation) {
            //ustalenie lokalizacji
            navigator.geolocation.getCurrentPosition(displayPosition, displayError, {timeout: 20000});
        } else {
            divMsg.innerHTML = messages.getPos.notSup;
        }
    }

    /**
     * Przypina zdarzenia do elementów HTML i wywołuje ustalenie lokalizacji użytkownika.
     */
    function init() {
        /**
         * HTML
         * @type @exp;document@pro;documentElement
         */
        var html = document.documentElement;
        html.className = html.className.replace(/\bnoscript\b/, "js");

        /**
         * Przycisk ponownego ustalenia lokalizacji
         * @type @exp;document@call;getElementById
         */
        var button = document.getElementById("button");
        button.addEventListener("click", getPosition, false);

        // ustalenie lokalizacji
        getPosition();
    }

    var pub = {
        messages: messages,
        init: init,
        getPosition: getPosition
    };

    return pub;
})();

/**
 * addEventListener() nie jest obsługiwane w MSIE <= 8 (1,20% pl użytkowników 07.2015)
 * http://ranking.pl/pl/rankings/web-browsers.html
 *
 * dodanie obsługi zdarzenia po załadowaniu drzewa DOM
 */
if (window.addEventListener) {
    window.addEventListener("DOMContentLoaded", geolocation.init, false);
}
else {
    window.onload = function() { document.getElementById("msg").innerHTML = messages.upgrade; };
}
