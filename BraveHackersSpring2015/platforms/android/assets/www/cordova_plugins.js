cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/com.att.bravehackers.uverseplugin/www/android/UversePlugin.js",
        "id": "com.att.bravehackers.uverseplugin.UversePlugin",
        "clobbers": [
            "window.plugins.uverseplugin"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/www/Toast.js",
        "id": "nl.x-services.plugins.toast.Toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/test/tests.js",
        "id": "nl.x-services.plugins.toast.tests"
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "nl.x-services.plugins.socialsharing": "4.3.17",
    "com.att.bravehackers.uverseplugin": "3.2.2",
    "nl.x-services.plugins.toast": "2.0.4"
}
// BOTTOM OF METADATA
});