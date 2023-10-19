# Travelers API

## Routes

<p>/guides - This route allows you to GET and POST guides which consist of a guide type, city, recommendation, and comment section.</p>

<p>/:guide_id - This route allows you to GET or DELETE a guide by ID.</p>


# Travelers

## [Travelers](https://Travelers.vercel.app/)


## Description

<p>Whether you want to plan your own trip or live vicariously through others and their shared travel stories, let Traveler help!</p>

<p>Upon registering and logging in, the user will be taken to the homepage where they will see all the guides posted by other users, as well as their own guide. These guides are listed from the most recent to the oldest. Upon submitting a guide, the user will be redirected to the guides page where they will see all guides submitted. A user may edit and also delete their ownguide, but not the ones of other users. The edit and delete buttons are conditionally rendered to show when the guide user id matches the id of the user who is logged in.</p>

<p>If the user tries to navigate to a route or guide that does not exist, they will be rerouted to a 404 page.</p>

<p>Travelers is a PERN application, using PostgreSQL, Express, React and Node.js.</p>


![1](./src/images/screen/1.png)
![2](./src/images/screen/2.png)
![3](./src/images/screen/3.png)
![4](./src/images/screen/4.png)
