(function(window, document) {
    "use strict";

    /**
     * API between UserCentrics and this app.
     * @param {function} onUserCentricsIsReady
     * @param {object} templateIDs Object holding each service which must be accepted to show the images.
     *                             Example: {facebook:"foo", instagram: "bar"}
     *                             You get the templateID in JavaScript-Console when you have a look in 'usercentrics.consentTemplates'.
     */
    var UserCentricsHandler = function(onUserCentricsIsReady, templateIDs) {
        if (!window["usercentrics"]) {
            console.error("UserCentricsOptIn: You have to include usercentrics in the head-section of the page to run with UserCentricsOptIn-Extension of the pb_social extension.");
            return;
        }

        var _self = this;

        if (window["usercentrics"].isInitialized) {
            onUserCentricsIsReady(_self);
        } else {
            window["usercentrics"].onViewInit = function() {
                onUserCentricsIsReady(_self);
            };
        }

        /**
         * Checks if consent for all defined services is given.
         */
        this.hasConsent = function() {
            for (var service in templateIDs) {
                try {
                    var UCService = window.usercentrics.getConsents(templateIDs[service]);
                    if (!(UCService && UCService.hasOwnProperty("consentStatus") && UCService.consentStatus === true)) {
                        return false;
                    }
                } catch (e) {
                    console.error(
                        "UserCentricsOptIn->UserCentricsHandler: " + e.message + " (on service " + service + "). Maybe have a look at 'usercentrics.consentTemplates' to get the templateID."
                    );
                    return false;
                }
            }
            return true;
        };

        /**
         * Sets consent for all defined services
         */
        this.setConsent = function() {
            for (var service in templateIDs) {
                var UCService = window.usercentrics.getConsents(templateIDs[service]);
                window.usercentrics.updateConsents([{ templateId: templateIDs[service], status: true }]);
            }
        };
    };

    /**
     * Layer to ask for permission - the opt-in UI
     * @param {object} container
     * @param {function} onAgree
     * @param {function} onDisagree
     */
    var OptInLayer = function(stage, onAgree, onDisagree) {
        var _self = this;

        var stage = stage || document.querySelector("body");

        this.destroy = function() {
            stage.removeChild(_self.background);
            stage.removeChild(_self.container);
        };

        var onAgreeEvent = function(evt) {
            evt.preventDefault();
            if (typeof onAgree === "function") {
                onAgree();
            }
            _self.destroy();
        };

        var onDisagreeEvent = function(evt) {
            evt.preventDefault();
            if (typeof onDisagree === "function") {
                onDisagree();
            }
            _self.destroy();
        };

        this.background = document.createElement("DIV");
        this.background.setAttribute("class", "ucoi__layer__background");
        this.background.addEventListener("click", onDisagreeEvent, false);

        this.container = document.createElement("DIV");
        this.container.setAttribute("class", "ucoi__layer__container");

        this.title = document.createElement("DIV");
        this.title.setAttribute("class", "ucoi__layer__title");
        this.title.innerText = "Zustimmung erforderlich";

        this.info = document.createElement("DIV");
        this.info.setAttribute("class", "ucoi__layer__info");
        this.info.innerText = "Zum Anzeigen der externen Social-Media-Bilder benötigen wir Ihre Zustimmung. Beim Laden der Bilder wird Ihre IP-Adresse an die Social-Media-Plattform gesendet.";

        this.agree = document.createElement("button");
        this.agree.setAttribute("class", "ucoi__layer__agree");
        this.agree.innerText = "OK";
        this.agree.addEventListener("click", onAgreeEvent, false);

        this.disagree = document.createElement("a");
        this.disagree.setAttribute("class", "ucoi__layer__disagree");
        this.disagree.setAttribute("href", "{}");
        this.disagree.innerText = "abbrechen";
        this.disagree.addEventListener("click", onDisagreeEvent, false);

        this.container.appendChild(this.title);
        this.container.appendChild(this.info);
        this.container.appendChild(this.agree);
        this.container.appendChild(this.disagree);

        stage.appendChild(this.background);
        stage.appendChild(this.container);
    };

    /**
     * Class to handle the images (and button instead of an image to trigger the opt in)
     */
    var ImageButtons = function() {
        var buttonImage =
            '<svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 290"><rect class="svg__background" width="290" height="290"/><path class="svg__image" d="M36.1,127.0536V264.206H253.9V127.0536ZM247.7357,258.0418h-4.1194l-45.0654-48.5427L163.1432,247.64,109.171,182.5309,46.5741,258.0418h-4.31V133.2177H247.7357Z"/><circle class="svg__check__circle" cx="144.8636" cy="128.8825" r="56.9464"/><polygon class="svg__check__checkmark" points="104.368 130.69 116.662 120.566 131.847 135.752 173.066 96.703 185.359 108.996 134.017 161.062 104.368 130.69"/><text class="svg__text" x="50%" y="98%" dominant-baseline="bottom" text-anchor="middle">Klicken zum Aktivieren</text></svg>';

        var images = document.querySelectorAll("[data-uc-background-image]");

        this.hasImages = function() {
            return images.length > 0 ? true : false;
        };

        /**
         * Method to assign and to remove from the external anchor to get the click on the image button
         * @param {object} evt The Event
         */
        var _onClickPreventDefault = function(evt) {
            evt.preventDefault();
        };

        /**
         * Searches an anchor element in the direct parent tree.
         * @param {object} node
         */
        var _findParentAnchor = function(node) {
            var ATagFound = false;
            var parentNode = node.parentNode;
            while (ATagFound === false) {
                if (parentNode.tagName === "A") {
                    ATagFound = true;
                    return parentNode;
                }
                parentNode = parentNode.parentNode;
            }
        };

        this.initButtons = function(onButtonClick) {
            _initButtons(onButtonClick);
        };

        /**
         * Adds buttons to initialize opt in
         * @param {function} onButtonClick
         */
        var _initButtons = function(onButtonClick) {
            //console.log(images);
            for (var i = 0; i < images.length; i++) {
                // set position relative to wrap to add the button
                images[i].classList.add("ucoi__imagebutton__button-parent");

                // create button
                var button = document.createElement("DIV");
                button.setAttribute("class", "ucoi__imagebutton__button");
                button.setAttribute("title", "Bilder aktivieren");
                button.innerHTML = buttonImage;
                button.addEventListener(
                    "click",
                    function(evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        if (typeof onButtonClick === "function") {
                            onButtonClick();
                        }
                    },
                    false
                );

                images[i].appendChild(button);
                images[i].optInButton = button;

                // find the parent anchor and prevent default click
                var parentAnchor = _findParentAnchor(images[i]);
                if (parentAnchor) {
                    parentAnchor.addEventListener("click", _onClickPreventDefault, false);
                }
            }
        };

        this.showOriginalImages = function() {
            _showOriginalImages();
        };

        /**
         * Loads the external images and sets them as background image
         */
        var _showOriginalImages = function() {
            for (var i = 0; i < images.length; i++) {
                // remove the button (there is only a button when it was created before/when consent was not given)
                if (images[i].optInButton) {
                    images[i].removeChild(images[i].optInButton);
                }

                // set the image as background
                var bgImage = images[i].getAttribute("data-uc-background-image");
                if (bgImage) {
                    images[i].style.backgroundImage = "url(" + bgImage + ")";
                }

                // remove event listener from parent a tag
                var parentAnchor = _findParentAnchor(images[i]);
                if (parentAnchor) {
                    parentAnchor.removeEventListener("click", _onClickPreventDefault, false);
                }
            }
        };
    };

    /**
     * Main Class
     * @param {object} params 'params.templateIDs' must be set (also @see UserCentricsHandler on the top of this file.).
     */
    var UserCentricsOptIn = function(params) {
        var container = params.container;
        var IB = new ImageButtons();

        // we have to do nothing if there are no external images
        if (!IB.hasImages()) {
            return;
        }

        // wait for UC
        new UserCentricsHandler(function(UC) {
            if (UC.hasConsent()) {
                // consent was given before
                console.log("UC hasConsent");
                IB.showOriginalImages();
            } else {
                // generate buttons for the opt in
                IB.initButtons(function() {
                    new OptInLayer(container, function() {
                        UC.setConsent();
                        IB.showOriginalImages();
                    });
                });

                // and show the opt in directly
                new OptInLayer(container, function() {
                    UC.setConsent();
                    IB.showOriginalImages();
                });
            }
        }, params.templateIDs);
    };

    if (typeof define === "function" && define.amd) {
        define(function() {
            return UserCentricsOptIn;
        });
    } else {
        window.UserCentricsOptIn = UserCentricsOptIn;
    }
})(window, document);
