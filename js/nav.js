"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//SUBMIT FORM
// allows a user to pull up the submit story form
function navSubmitEvent(e) {
  console.debug("navSubmitStory", e);
  const $storyForm = $('#story-form');
  $storyForm.show();
}

//event listener that runs the above function when the form is submitted
const $navSubmitStory = $('#nav-submit-story'); 
$navSubmitStory.on("click", navSubmitEvent);

//USERS FAVORITE STORIES PAGE
function navFavoritesEvent(e) {
  console.debug("navFavoritesEvent", e);
  
  //function created on main.js
  hidePageComponents();

  //only favorites list is showing 
  favoritesPage();
}

$body.on("click", "#nav-favorites", navFavoritesEvent);

//USERS MY STORIES PAGE
function navMyStoriesEvent(e) {
  console.debug("navMyStoriesEvent", e);

  hidePageComponents();
  myStoriesPage();

  const $ownStories = $("#my-stories");
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStoriesEvent);