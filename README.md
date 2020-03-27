# typo3.extension.pb_social.usercentrics

This small package can be used to extend the Typo3-Extension [pb_social](https://extensions.typo3.org/extension/pb_social/) (maybe also others) to use with [usercentrics](https://usercentrics.com).

In the frontend of the pb_social-extension images of social-media plattforms are directly linked. The IP-address of the user will be submitted to them. According to the GDPR, you have to ask the user beforehand whether he agrees to it.

This extension of the extension checks, if the consents for the used plattforms are given. If it is ok, the images are loaded and displayed. If consents are not given, the user will be asked for permission. If the user gives his/her OK, usercentrics will be updated and the images be shown.

## Changes in Templates

Maybe have a look into the `Examples` folder. There are some modified templates.

In the feeds you have to replace the background-image style with a data-attribute.

Replace this ...
``` html
style="background-image: url({feed.image})"
```

... with this:
``` html
data-uc-background-image="{feed.image}">
```

To define the container with the feeds, you have to set a css-class to set `position:relative` and to add the userinterface with the opt-in (add `ucoi__wrapper`):

``` html
<div class="pb-list ucoi__wrapper">
```

## Instantiate

Just load the script, the styles and instantiate the class. Here is an `requirejs`-example:

``` html
<script>
requirejs([
    "../Plugins/pb_social/Resources/Public/dist/UserCentricsOptIn", 
    "css!../Plugins/pb_social/Resources/Public/dist/UserCentricsOptIn.css", 
    "css!../Stylesheets/Extension/pb_social.css"], function (UserCentricsOptIn) {
    new UserCentricsOptIn({
        container: document.querySelector(".ucoi__wrapper"),
        templateIDs: {
            facebook: "{templateID for facebook}",
            instagram: "{templateID for instagram}"
        }
    });
});
</script>
```

## Get the `templateID`s

When usercentrics is loaded open the developer tools -> console and search in `usercentrics.consentTemplates` for `templateID`.

## Repository

https://github.com/sunixzs/typo3.extension.pb_social.usercentrics/

## License

Do what you want, but don't ask for compensation. I don't guarantee anything :-)