# Mapply is a little workout app with a map

This project is based on [Jonas Schmedtmann's](https://github.com/jonasschmedtmann) design of mapty.

## Improvements

The project was not compatible with older browser that do not support the newest features of JavaScript like private class methods and private class properties. I solved this problem by adding Babel 7. Also added webpack to package a smaller solution.

## Improvements

1. Workout data is saved to localStorage. The data is converted to JSON and as a result, the classes and all inheritance are destroyed. Fixed this by recreating the objects while loading them from the localStorage.
2. By clicking the trash icon next to a workout you can delete it. It is removed from the list and the localStorage.

## What is next

1. Add an option to change the layer of the map
2. Ability to delete all workouts
3. Remove the marker when deleting a workout
4. Ability to edit a workout
5. Ability to sort workouts bu dist/dur or speed
6. Create better error messages for form validation
7. Position the map to show all the workouts
8. Ability to draw lines and shapes instead of points
9. Geocode location from coordinates (Faro, Portugal)
10. Display weather for workouts time and place
11. Add an alert before deleting a workout
12. Fix the Date problem -- All dates are being reset to current day

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
