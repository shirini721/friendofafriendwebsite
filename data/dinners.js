/**
 * DINNER DATA
 * Edit this file to update dinners on the site.
 * Set "upcoming" to null when there's no upcoming dinner.
 * Set "galleryPassword" to null to disable password protection.
 *
 * For photos, use external URLs (e.g. Cloudinary, Imgur):
 *   "src": "https://res.cloudinary.com/yourname/image/upload/v1/foaf/dinner.jpg"
 */
window.FOAF_DATA = {
  "galleryPassword": "foaf2026",
  "upcoming": {
    "restaurant": "Shuka",
    "date": "2026-02-26",
    "time": "7:15 PM",
    "location": "New York, NY",
    "guestCount": 7,
    "rsvpDeadline": "2026-02-12",
    "partifulUrl": "https://partiful.com/e/2v7DwSYsQfxxv5xHfM95?c=86camiv3",
    "inviteMessage": "Hey! I've been invited to this dinner series called Friend of a Friend \u2014 every month, a group gathers at a great restaurant and everyone brings one new person. I'm bringing you as my +1! It's at Shuka on Feb 26 at 7:15 PM. RSVP here: https://partiful.com/e/2v7DwSYsQfxxv5xHfM95?c=86camiv3"
  },
  "dinners": [
    {
      "id": "ayah-january-2026",
      "restaurant": "Ayah",
      "date": "2026-01-22",
      "time": "7:30 PM",
      "location": "New York, NY",
      "partifulUrl": "https://partiful.com/e/1opZILdzn5Ti4Vzg1Q7h",
      "description": "The one that started it all. Great food, even better company.",
      "photos": [
        {
          "src": "images/ayah-january-2026/dinner-table.jpg",
          "alt": "The dinner table at Ayah"
        },
        {
          "src": "images/ayah-january-2026/group.jpg",
          "alt": "Friends gathered around the table"
        },
        {
          "src": "images/ayah-january-2026/food.jpg",
          "alt": "Dishes from Ayah"
        }
      ]
    }
  ]
};
