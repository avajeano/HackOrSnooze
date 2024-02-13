"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

//added the trash icon to the story markup 
function generateStoryMarkup(story, showTrash = true) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //shows the logged in users it's favorites stars 
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
          ${showTrash ? getTrash(): ""}
          ${showStar ? getStar(story, currentUser) : ""}
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//******************************************************************************

//SUBMITTING A NEW STORY
//add new story to page when new story form is submitted
async function addNewStoryToPage(e) {
  console.debug("addNewStoryToPage");
  e.preventDefault();
  //getting user input from form
  const title = $('#post-title').val();
  const url = $("#post-url").val();
  const author = $("#post-author").val();
  const username = currentUser.username
  const newStory = {title, url, author, username};

  console.log(newStory);
  
  //calls the addStory function from the StoryList class (located in models.js)
  const story = await storyList.addStory(currentUser, newStory);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //hides the form and resets the inputs 
  const $submitForm = $('#story-form');
  $submitForm.slideUp('slow');
  $submitForm.trigger('reset');
}

//submit click event 
const $submitForm = $('#story-form');
$submitForm.on('submit', addNewStoryToPage);
//******************************************************************************

//DELETE STORY

//retrieving the trash icon from font awesome 
function getTrash() {
  return `<span class="trash"><i class ="fa-solid fa-trash"></i></span>`;
}

//deleting a story
async function deleteStory(e) {
  console.log("deleteStory");
  
  const $closestLi = $(e.target).closest("li");
  const storyId = $closestLi.attr("id");

  //deletes the story from the API
  await storyList.removeStory(currentUser, storyId);

  //returns our list without the deleted story
  await myStoriesPage();
}

//event listener when user clicks trash icon
const $ownStories = $("#my-stories");
$ownStories.on("click", ".trash", deleteStory);

//******************************************************************************

//FAVORITE STORY

//retrieving the star icon from font awesome
function getStar(story, user) {
  //checks if a story is a users favorite
  const isFavorite = user.isFavorite(story);
  //a solid star is a favorite 
  const starStatus = isFavorite ? "fa-solid" : "fa-regular";
  return `<span class="star"><i class="${starStatus} fa-star"></i></span>`;
}

//favoriting and un-favoring a story
async function toggleFavorite(e) {
  console.debug("toggleFavorite");

  const $target = $(e.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  //finds the favorited story 
  const story = storyList.stories.find(s => s.storyId === storyId);
  
  //if favorited un-favorite or the opposite 
  if($target.hasClass("fa-solid")){
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fa-solid fa-regular");
  }else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fa-solid fa-regular")
  }
}

//event listener for the favorite star 
const $storiesLists = $(".stories-list");
$storiesLists.on("click", ".star", toggleFavorite);

//add users favorites to their favorites page
function favoritesPage() {
  console.debug("favoritesPage");

  const $favoriteStories = $("#favorite-stories");
  $favoriteStories.empty();

  //lets the user know they have not favorited any stories or it will append the favorites to the list
  if(currentUser.favorites.length === 0) {
    $favoriteStories.append("<h5>you don't have any favorite stories</h5>");
  }else {
    for(let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStories.append($story);
    }
  }
  $favoriteStories.show();
}
//******************************************************************************

//USER STORIES (MY STORIES)
function myStoriesPage() {
  console.debug("myStoriesPage");

  const $ownStories = $("#my-stories");
  $ownStories.empty();

  //lets the user know they have not created any stories or it will append their stories to the list
  if(currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>you don't have any stories</h5>");
  }else {
    for(let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}