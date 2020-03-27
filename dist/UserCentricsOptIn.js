"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}!function(i,u){function h(e,t){if(_classCallCheck(this,h),this.element=u.createElement(e),!t)return this.element;if(t.innerHTML&&(this.element.innerHTML=t.innerHTML),t.innerText&&(this.element.innerHTML=t.innerText),t.class&&this.element.setAttribute("class",t.class),t.onClick&&this.element.addEventListener("click",t.onClick,!1),t.attributes)for(var n in t.attributes)this.element.setAttribute(n,t.attributes[n]);return this.element}function f(e,t,n){_classCallCheck(this,f);for(var i=e||u.querySelector("body"),s=function(){i.removeChild(a),i.removeChild(o)},r=function(e){console.log(_typeof(e)),e.preventDefault(),"function"==typeof n&&n(),s()},a=new h("DIV",{class:"ucoi__layer__background",onClick:r}),o=new h("DIV",{class:"ucoi__layer__container"}),c=[new h("DIV",{class:"ucoi__layer__icon",innerHTML:'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 217.8 137.2" style="enable-background:new 0 0 217.8 137.2;" xml:space="preserve"><g><circle style="fill:currentColor" cx="133.7" cy="52.6" r="13.1"/><path style="fill:currentColor" d="M0,0v137.2h217.8V0H0z M211.6,131h-4.1l-45.1-48.5L127,120.6l-54-65.1L10.5,131H6.2V6.2h205.5V131z"/></g></svg>'}),new h("DIV",{class:"ucoi__layer__title",innerText:"Externer Inhalt"}),new h("DIV",{class:"ucoi__layer__info",innerText:"Dieses Element enthält Bilder von externen Social-Media Profilen wie Facebook, Instagram und Co. Ich bin damit einverstanden, dass mir diese Inhalte angezeigt werden."}),new h("BUTTON",{class:"ucoi__layer__agree",innerText:"Einverstanden",onClick:function(e){e.preventDefault(),"function"==typeof t&&t(),s()}}),new h("BR"),new h("A",{class:"ucoi__layer__disagree",innerText:"ohne Bilder anzeigen",onClick:r,attributes:{href:"#"}})],l=0;l<c.length;l++)o.appendChild(c[l]);i.appendChild(a),i.appendChild(o)}function s(e){_classCallCheck(this,s);var t=e.container,n=new a;if(n.hasImages())var i=new r(function(){i.hasConsent()?n.showSocialMediaImages():(n.initButtons(function(){new f(t,function(){i.setConsent(),n.showSocialMediaImages()})}),new f(t,function(){i.setConsent(),n.showSocialMediaImages()}))},e.templateIDs)}var r=function(){function n(e,t){_classCallCheck(this,n),this.templateIDs=t,i.usercentrics?i.usercentrics.isInitialized?e():i.usercentrics.onViewInit=function(){e()}:console.error("UserCentricsOptIn: You have to include usercentrics in the head-section of the page to run with UserCentricsOptIn-Extension of the pb_social extension.")}return _createClass(n,[{key:"hasConsent",value:function(){for(var t in this.templateIDs)try{var e=i.usercentrics.getConsents(this.templateIDs[t]);if(!e||!e.hasOwnProperty("consentStatus")||!0!==e.consentStatus)return!1}catch(e){return console.error("UserCentricsOptIn->UserCentricsHandler: "+e.message+" (on service "+t+"). Maybe have a look at 'usercentrics.consentTemplates' to get the templateID."),!1}return!0}},{key:"setConsent",value:function(){for(var e in this.templateIDs){i.usercentrics.getConsents(this.templateIDs[e]);i.usercentrics.updateConsents([{templateId:this.templateIDs[e],status:!0}])}}}]),n}(),a=function(){function i(){_classCallCheck(this,i),this.buttonImageMarkup='<svg class="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 290 290" style="enable-background:new 0 0 290 290;" xml:space="preserve"><rect class="svg__background" width="290" height="290"/><g class="svg__image"><rect x="36.1" y="115.9" class="svg__image__background" width="217.8" height="137.2"/><circle class="svg__image__sun" cx="169.8" cy="168.6" r="13.1"/><path class="svg__image__mountains" d="M36.1,115.9v137.2h217.8V115.9H36.1z M247.7,246.9h-4.1l-45.1-48.5l-35.4,38.1l-54-65.1l-62.6,75.5h-4.3V122.1 h205.5V246.9z"/></g><text class="svg__text" x="50%" y="95%" dominant-baseline="bottom" text-anchor="middle">Klicken zum Aktivieren</text></svg>',this.images=u.querySelectorAll("[data-uc-background-image]")}return _createClass(i,[{key:"hasImages",value:function(){return 0<this.images.length}},{key:"initButtons",value:function(t){for(var e=0;e<this.images.length;e++){this.images[e].classList.add("ucoi__imagebutton__button-parent");var n=new h("DIV",{class:"ucoi__imagebutton__button",innerHTML:this.buttonImageMarkup,onClick:function(e){e.preventDefault(),e.stopPropagation(),"function"==typeof t&&t()},attributes:{title:"Bilder aktivieren"}});this.images[e].appendChild(n),this.images[e].UCOI_optInButton=n,this.images[e].UCOI_parentAnchor=i.findParentAnchor(this.images[e]),this.images[e].UCOI_parentAnchor&&this.images[e].UCOI_parentAnchor.addEventListener("click",i.onClickPreventDefault,!1)}}},{key:"showSocialMediaImages",value:function(){for(var e=0;e<this.images.length;e++){this.images[e].UCOI_optInButton&&this.images[e].removeChild(this.images[e].UCOI_optInButton);var t=this.images[e].getAttribute("data-uc-background-image");t&&(this.images[e].style.backgroundImage="url("+t+")"),this.images[e].UCOI_parentAnchor&&this.images[e].UCOI_parentAnchor.removeEventListener("click",i.onClickPreventDefault,!1)}}}],[{key:"onClickPreventDefault",value:function(e){e.preventDefault()}},{key:"findParentAnchor",value:function(e){for(var t=!1,n=e.parentNode;!1===t;){if("A"===n.tagName)return t=!0,n;n=n.parentNode}}}]),i}();"function"==typeof define&&define.amd?define(function(){return s}):i.UserCentricsOptIn=s}(window,document);