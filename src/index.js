'use strict';

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
  #layers = { streets: 'm', hybrid: 's,h', sat: 's', terain: 'p' };

  constructor() {
    this._getPosition();
    form.addEventListener('submit', e => this._newWorkout(e));
    inputType.addEventListener('change', this._toggleElevation);
    containerWorkouts.addEventListener('click', e => this._moveToMarker(e));
  }

  changeLayer(layer) {
    L.tileLayer(
      `http://{s}.google.com/vt/lyrs=${this.#layers[layer]}&x={x}&y={y}&z={z}`,
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    ).addTo(this.#mymap);
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
    this.#mymap = L.map('map').setView([latitude, longitude], 14);

    // L.control.layers(baseMaps, overlayMaps).addTo(this.#mymap);

    L.tileLayer(
      `http://{s}.google.com/vt/lyrs=${this.#layers.streets}&x={x}&y={y}&z={z}`,
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    ).addTo(this.#mymap);

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

      const workout = new Running(this.#latlng, dist, duration, cadence, type);
      this.#workouts.push(workout);
      this._renderWorkoutMarker(workout);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (isNaN(elevation)) return alert('Elevation must be a number!');

      const workout = new Cycling(
        this.#latlng,
        dist,
        duration,
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
    <li class="workout workout--${type}" data-id="${workout.id}">
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
          <span class="workout__btn">✏️</span>
            <span class="workout__btn">🗑</span>
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
    // now we have lost the __proto__ chain because we load just objects from localStorage
    // to restore it I have to write code inside the forEach()
    this.#workouts = data;
    this.#workouts.forEach(w => {
      this._renderWorkoutMarker(w);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
  }
}

class Workout {
  date = new Date();
  id = Date.now().toString().slice(-9);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevGain) {
    super(coords, distance, duration);
    this.elevGain = elevGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = (this.distance / this.duration) * 60;
  }
}

const app = new App();
