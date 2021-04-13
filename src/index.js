'use strict';
import { Running, Cycling } from './workoutClasses.js';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #mymap;
  #latlng;
  #workouts = [];
  #layers = { streets: 'm', hybrid: 's,h', sat: 's', terrain: 'p' };
  streets = this._createLayer('streets');
  hybrid = this._createLayer('hybrid');
  satellite = this._createLayer('sat');
  terrain = this._createLayer('terrain');

  basemaps = {
    Streets: this.streets,
    Satellite: this.satellite,
    Hybrid: this.hybrid,
    Terrain: this.terrain,
  };

  constructor() {
    this._getPosition();
    form.addEventListener('submit', e => this._newWorkout(e));
    inputType.addEventListener('change', this._toggleElevation);
    containerWorkouts.addEventListener('click', e => this._handleClick(e));
  }

  _createLayer(layer) {
    return L.tileLayer(
      `http://{s}.google.com/vt/lyrs=${this.#layers[layer]}&x={x}&y={y}&z={z}`,
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );
  }

  _handleClick(e) {
    this._moveToMarker(e);
    if (e.target.className.includes('trash')) {
      let workoutId = e.target.closest('.workout').dataset.id;
      this._deleteWorkout(workoutId);
      // alert('are you sure?');
    }
  }

  _deleteWorkout(id) {
    for (let i = 0; i < this.#workouts.length; i++) {
      if (this.#workouts[i].id == id) {
        // this._deleteMarker(this.#workouts[i]);
        this.#workouts.splice(i, 1);
      }
    }
    this._storeWorkouts();
    // also we have to remove the marker
  }

  _deleteMarker(workout) {
    console.log('trying to delete the marker now');
    let { lat, lng } = workout.coords;
    let tempMarker = [lat, lng];
    this.#mymap.removeLayer(tempMarker);
  }

  _getPosition() {
    const error = () =>
      console.log('there was an error getting your position ');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), error);
    }
  }

  _loadMap(position) {
    let { latitude, longitude } = position.coords;
    this.#mymap = L.map('map', { layers: [this.streets, this.hybrid] }).setView(
      [latitude, longitude],
      14
    );

    L.tileLayer(
      `http://{s}.google.com/vt/lyrs=${this.#layers.streets}&x={x}&y={y}&z={z}`,
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    ).addTo(this.#mymap);

    L.control.layers(this.basemaps, null).addTo(this.#mymap);

    L.marker([latitude, longitude])
      .addTo(this.#mymap)
      .bindPopup('You are here!')
      .openPopup();

    this._loadWorkouts();
    this.#mymap.on('click', e => this._showForm(e));
  }

  _showForm(e) {
    form.classList.remove('hidden');
    inputDistance.focus();
    this.#latlng = e.latlng;
  }

  _toggleElevation() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _clearForm() {
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
    form.classList.add('hidden');
  }

  _notValid(input) {
    return isNaN(input) || input <= 0;
  }

  _newWorkout(e) {
    e.preventDefault();

    const type = inputType.value;
    const dist = +inputDistance.value;
    const duration = +inputDuration.value;

    if (this._notValid(duration) || this._notValid(dist)) {
      return alert('Inputs have to be positive numbers!');
    }

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (this._notValid(cadence))
        return alert('Cadence must be a positive number!');

      const workout = new Running(
        this.#latlng,
        dist,
        duration,
        new Date(),
        cadence,
        type
      );

      this.#workouts.push(workout);
      console.log(this.#workouts);
      this._renderWorkoutMarker(workout);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (isNaN(elevation)) return alert('Elevation must be a number!');

      const workout = new Cycling(
        this.#latlng,
        dist,
        duration,
        new Date(),
        elevation,
        type
      );
      this.#workouts.push(workout);
      this._renderWorkoutMarker(workout);
    }
  }

  _renderWorkoutMarker(workout) {
    let { lat, lng } = workout.coords;
    L.marker([lat, lng])
      .addTo(this.#mymap)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 120,
          riseOnHover: true,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
    this._clearForm();
    this._renderWorkout(workout);
    this._storeWorkouts();
  }

  _renderWorkout(workout) {
    let { type } = workout;
    const html = `
    <li class="workout workout--${type}" data-id="${workout.id}" id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${type === 'running' ? '🏃‍♂' : '🚴‍♀️'}</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${
              type === 'running'
                ? workout.pace.toFixed(1)
                : workout.speed.toFixed(1)
            }</span>
            <span class="workout__unit">${
              type === 'running' ? 'min/km' : 'km/h'
            }</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${
              type === 'running' ? '👟' : '⛰'
            }</span>
            <span class="workout__value">${
              type === 'running' ? workout.pace.toFixed(1) : workout.elevGain
            }</span>
            <span class="workout__unit">${
              type === 'running' ? 'spm' : 'm'
            }</span>
          </div>
          <div class="workout__btns">
          <span class="workout__btn edit">✏️</span>
            <span class="workout__btn trash">🗑</span>
          </div>
        </li>
    `;
    form.style.display = 'none';
    form.insertAdjacentHTML('afterend', html);
    setTimeout(() => (form.style.display = 'grid'), 700);
  }

  _moveToMarker(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;
    const workout = this.#workouts.find(
      work => work.id == workoutEl.dataset.id
    );
    this.#mymap.setView(workout.coords, 14, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  _storeWorkouts() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _loadWorkouts() {
    let data = JSON.parse(localStorage.getItem('workouts'));
    if (!data) return;
    data.forEach(work => {
      if (work.type == 'running') {
        this.#workouts.push(
          new Running(
            work.coords,
            work.distance,
            work.duration,
            new Date(work.date),
            work.cadence,
            work.pace,
            work.type
          )
        );
      }
      if (work.type == 'cycling') {
        this.#workouts.push(
          new Cycling(
            work.coords,
            work.distance,
            work.duration,
            new Date(work.date),
            work.elevGain,
            work.speed,
            work.type
          )
        );
      }
    });
    this.#workouts.forEach(w => {
      this._renderWorkoutMarker(w);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
  }
}

const app = new App();
