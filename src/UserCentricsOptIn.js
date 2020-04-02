"use strict";
(function(window, document) {
    /**
     * Just a simple wrapper to create a html tag.
     */
    class Element {
        /**
         * @param {string} tagName The tag to create.
         * @param {object} params See code...
         */
        constructor(tagName, params) {
            this.element = document.createElement(tagName);

            if (!params) {
                return this.element;
            }

            if (params.innerHTML) {
                this.element.innerHTML = params.innerHTML;
            }

            if (params.innerText) {
                this.element.innerHTML = params.innerText;
            }

            if (params.class) {
                this.element.setAttribute("class", params.class);
            }

            if (params.onClick) {
                this.element.addEventListener("click", params.onClick, false);
            }

            if (params.attributes) {
                for (let attribute in params.attributes) {
                    this.element.setAttribute(attribute, params.attributes[attribute]);
                }
            }

            return this.element;
        }
    }

    /**
     * API between UserCentrics and this app.
     */
    class UserCentricsHandler {
        /**
         * @param {function} onUserCentricsIsReady
         * @param {object} templateIDs Object holding each service which must be accepted to show the images.
         *                             Example: {facebook:"foo", instagram: "bar"}
         *                             You get the templateID in JavaScript-Console when you have a look in 'usercentrics.consentTemplates'.
         */
        constructor(onUserCentricsIsReady, templateIDs) {
            this.templateIDs = templateIDs;

            if (!window["usercentrics"]) {
                console.error("UserCentricsOptIn: You have to include usercentrics in the head-section of the page to run with UserCentricsOptIn-Extension of the pb_social extension.");
                return;
            }

            if (window["usercentrics"].isInitialized) {
                onUserCentricsIsReady(this);
            } else {
                window["usercentrics"].onViewInit = function() {
                    onUserCentricsIsReady(this);
                };
            }
        }

        /**
         * Checks if consent for all defined services is given.
         */
        hasConsent() {
            for (let service in this.templateIDs) {
                try {
                    let UCService = window.usercentrics.getConsents(this.templateIDs[service]);
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
        }

        /**
         * Sets consent for all defined services
         */
        setConsent() {
            for (let service in this.templateIDs) {
                let UCService = window.usercentrics.getConsents(this.templateIDs[service]);
                window.usercentrics.updateConsents([{ templateId: this.templateIDs[service], status: true }]);
            }
        }
    }

    /**
     * Layer to ask for permission - the opt-in UI.
     */
    class OptInLayer {
        /**
         * @param {object} stageElement
         * @param {function} onAgree
         * @param {function} onDisagree
         */
        constructor(stageElement, onAgree, onDisagree) {
            const stage = stageElement || document.querySelector("body");

            /**
             * Removes the generated tags.
             */
            const destroy = () => {
                stage.removeChild(background);
                stage.removeChild(container);
            };

            /**
             * @param {object} evt Click event.
             */
            const onAgreeEvent = evt => {
                evt.preventDefault();
                if (typeof onAgree === "function") {
                    onAgree();
                }
                destroy();
            };

            /**
             * @param {object} evt Click event.
             */
            const onDisagreeEvent = evt => {
                console.log(typeof evt);
                evt.preventDefault();
                if (typeof onDisagree === "function") {
                    onDisagree();
                }
                destroy();
            };

            const background = new Element("DIV", {
                class: "ucoi__layer__background",
                onClick: onDisagreeEvent
            });

            const container = new Element("DIV", {
                class: "ucoi__layer__container"
            });

            let containerElements = [
                new Element("DIV", {
                    class: "ucoi__layer__icon",
                    innerHTML:
                        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 217.8 137.2" style="enable-background:new 0 0 217.8 137.2;" xml:space="preserve"><g><circle style="fill:currentColor" cx="133.7" cy="52.6" r="13.1"/><path style="fill:currentColor" d="M0,0v137.2h217.8V0H0z M211.6,131h-4.1l-45.1-48.5L127,120.6l-54-65.1L10.5,131H6.2V6.2h205.5V131z"/></g></svg>'
                }),
                new Element("DIV", {
                    class: "ucoi__layer__title",
                    innerText: "Externer Inhalt"
                }),
                new Element("DIV", {
                    class: "ucoi__layer__info",
                    innerText: "Dieses Element enthält Bilder von externen Social-Media Profilen wie Facebook, Instagram und Co. Ich bin damit einverstanden, dass mir diese Inhalte angezeigt werden."
                }),
                new Element("BUTTON", {
                    class: "ucoi__layer__agree",
                    innerText: "Einverstanden",
                    onClick: onAgreeEvent
                }),
                new Element("BR"),
                new Element("A", {
                    class: "ucoi__layer__disagree",
                    innerText: "ohne Bilder anzeigen",
                    onClick: onDisagreeEvent,
                    attributes: {
                        href: "#"
                    }
                })
            ];

            for (let e = 0; e < containerElements.length; e++) {
                container.appendChild(containerElements[e]);
            }

            stage.appendChild(background);
            stage.appendChild(container);
        }
    }

    /**
     * Class to handle the images (and button instead of an image to trigger the opt in)
     */
    class ImageButtons {
        constructor() {
            this.buttonImageMarkup =
                '<svg class="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 290 290" style="enable-background:new 0 0 290 290;" xml:space="preserve"><rect class="svg__background" width="290" height="290"/><g class="svg__image"><rect x="36.1" y="115.9" class="svg__image__background" width="217.8" height="137.2"/><circle class="svg__image__sun" cx="169.8" cy="168.6" r="13.1"/><path class="svg__image__mountains" d="M36.1,115.9v137.2h217.8V115.9H36.1z M247.7,246.9h-4.1l-45.1-48.5l-35.4,38.1l-54-65.1l-62.6,75.5h-4.3V122.1 h205.5V246.9z"/></g><text class="svg__text" x="50%" y="95%" dominant-baseline="bottom" text-anchor="middle">Klicken zum Aktivieren</text></svg>';

            this.images = document.querySelectorAll("[data-uc-background-image]");
        }

        /**
         * Method to assign and to remove from the external anchor to get the click on the image button
         * @param {object} evt The Event
         */
        static onClickPreventDefault(evt) {
            evt.preventDefault();
        }

        /**
         * Searches an anchor element in the direct parent tree.
         * @param {object} node
         */
        static findParentAnchor(node) {
            let ATagFound = false;
            let parentNode = node.parentNode;
            while (ATagFound === false) {
                if (parentNode.tagName === "A") {
                    ATagFound = true;
                    return parentNode;
                }
                parentNode = parentNode.parentNode;
            }
        }

        /**
         * @returns {boolean} true, when there are images
         */
        hasImages() {
            return this.images.length > 0 ? true : false;
        }

        /**
         * Adds buttons to initialize opt in on click
         * @param {function} onButtonClick
         */
        initButtons(onButtonClick) {
            for (let i = 0; i < this.images.length; i++) {
                // set position relative to wrap to add the button
                this.images[i].classList.add("ucoi__imagebutton__button-parent");

                // create button
                let button = new Element("DIV", {
                    class: "ucoi__imagebutton__button",
                    innerHTML: this.buttonImageMarkup,
                    onClick: evt => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        if (typeof onButtonClick === "function") {
                            onButtonClick();
                        }
                    },
                    attributes: {
                        title: "Bilder aktivieren"
                    }
                });

                this.images[i].appendChild(button);
                this.images[i].UCOI_optInButton = button;

                // find the parent anchor and prevent default click
                this.images[i].UCOI_parentAnchor = ImageButtons.findParentAnchor(this.images[i]);
                if (this.images[i].UCOI_parentAnchor) {
                    this.images[i].UCOI_parentAnchor.addEventListener("click", ImageButtons.onClickPreventDefault, false);
                }
            }
        }

        /**
         * Loads the external images and sets them as background image
         */
        showSocialMediaImages() {
            for (let i = 0; i < this.images.length; i++) {
                // remove the button (there is only a button when it was created before/when consent was not given)
                if (this.images[i].UCOI_optInButton) {
                    this.images[i].removeChild(this.images[i].UCOI_optInButton);
                }

                // set the image as background
                let bgImage = this.images[i].getAttribute("data-uc-background-image");
                if (bgImage) {
                    this.images[i].style.backgroundImage = "url(" + bgImage + ")";
                }

                // remove event listener from parent a tag
                if (this.images[i].UCOI_parentAnchor) {
                    this.images[i].UCOI_parentAnchor.removeEventListener("click", ImageButtons.onClickPreventDefault, false);
                }
            }
        }
    }

    /**
     * Main Class exported to use.
     */
    class UserCentricsOptIn {
        /**
         * @param {object} params
         *                      params.container {object} Should be set. AHTML-element where the opt-in will be added.
         *                      params.templateIDs {object} must be set (also @see UserCentricsHandler on the top of this file.).
         */
        constructor(params) {
            let container = params.container;
            let IB = new ImageButtons();

            // we have to do nothing if there are no external images
            if (!IB.hasImages()) {
                return;
            }

            // wait for UC
            new UserCentricsHandler((UCH) => {
                if (UCH.hasConsent()) {
                    // consent was given before
                    IB.showSocialMediaImages();
                } else {
                    // generate buttons for the opt in
                    IB.initButtons(() => {
                        new OptInLayer(container, () => {
                            UCH.setConsent();
                            IB.showSocialMediaImages();
                        });
                    });

                    // and show the opt in directly
                    new OptInLayer(container, () => {
                        UCH.setConsent();
                        IB.showSocialMediaImages();
                    });
                }
            }, params.templateIDs);
        }
    }

    if (typeof define === "function" && define.amd) {
        define(() => {
            return UserCentricsOptIn;
        });
    } else {
        window.UserCentricsOptIn = UserCentricsOptIn;
    }
})(window, document);
