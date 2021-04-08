class Workout {
  id = Date.now().toString().slice(-9);

  constructor(coords, distance, duration, date) {
    this.date = date;
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

export class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, date, cadence) {
    super(coords, distance, duration, date);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this;
  }
}

export class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, date, elevGain) {
    super(coords, distance, duration, date);
    this.elevGain = elevGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = (this.distance / this.duration) * 60;
  }
}
