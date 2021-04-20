# Mapply is a little workout app with a map

This project is based on [Jonas Schmedtmann's](https://github.com/jonasschmedtmann) design of mapty.

## Improvements

The project was not compatible with older browsers that do not support the newest features of JavaScript, like private class methods and private class properties. I solved this problem by adding Babel 7. Also added webpack to package a smaller solution.

## Improvements

1. Workout data is saved to localStorage. The data is converted to JSON and as a result, the classes and all inheritance are destroyed. Fixed this by recreating the objects while loading them from the localStorage.
2. User can delete a workout, by clicking the trash icon next to it. It is removed from the list and the localStorage.
3. Workout, Running and Cycling classes are in a separate file.
4. Fixed the Date reset to today problem. All dates are being saved and restored correctly.
5. Add map control to select which kind of map to display. Available options are Streets, Satellite, Hybrid, and Terrain.
6. The marker is removed when deleting a workout.
7. Add a helpful message with instructions, when there are no workouts stored.


## What is next

1. Ability to delete all workouts
2. Display weather for workouts time and place
3. Ability to edit a workout
4. Ability to show workouts based on category
5. Add an alert before deleting a workout
6. Create better error messages for form validation
7. Position the map to show all the workouts
8. Ability to draw lines and shapes instead of points
9. Geocode location from coordinates (Athens, Greece)
10. Keep the zoom level set by user
11. Add a loading spinner

# How to Install and Run in Your Computer

To run the scripts **npm** is required. To get npm you have to install [Node.js](https://nodejs.org). Follow the installation instructions for your system Mac, Linux or Windows.

After installing Node, use your terminal and run the commands after each instruction.

| Command                                           | Description                                  |
| ------------------------------------------------- | -------------------------------------------- |
| `git clone https://github.com/macnick/mapply.git` | Clone the repository to you computer         |
| `cd bookaduc-client`                              | Navigate to the newly created folder         |
| `npm install`                                     | Install dependencies on your directory       |
| `npm start`                                       | Run the app and start the development server |
|                                                   | Press `Ctrl + c` to kill http-server process |
| `http://localhost:3000`                           | Visit this link to use the App               |
