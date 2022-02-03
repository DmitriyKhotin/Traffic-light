import { ref, Ref } from 'vue';

import { debugLog } from './utils/debugLog';
export type Light = 'red' | 'yellow' | 'green';

// 0 - вниз, 1 - вверх
type Direction = 0 | 1;
const LightNumber = {
  red: 0,
  yellow: 1,
  green: 2,
};

interface ILightByRoute {
  [route: string]: Light;
}

export const LightByRoute: ILightByRoute = {
  '/red': 'red',
  '/yellow': 'yellow',
  '/green': 'green',
};

type Condition<T> = (prevValue: T, newValue: T) => boolean;

type Seconds = number;

type Callback<T> = (value: T) => void;
// finally state machine
class FSM<T> {
  private value: T;
  private condition: Condition<T>;
  private callbacks: Callback<T>[] = [];

  constructor(initialValue: T, condition: Condition<T>) {
    this.value = initialValue;
    this.condition = condition;
  }

  dispatch(newValue: T) {
    if (this.condition(this.value, newValue)) {
      this.value = newValue;
      this.callbacks.forEach((callback: Callback<T>) => callback(this.value));
    } else {
      throw new Error(
        `Dispatched wrong value in FSM. Wrong value: ${newValue}`
      );
    }
  }

  add(callback: Callback<T>) {
    this.callbacks.push(callback);
  }

  remove() {
    this.callbacks = [];
  }

  getValue() {
    return this.value;
  }
}

export class TrafficLightController {
  private currentLight;
  private direction: Direction = 0;
  private currentTime: Seconds = 0;
  private timerId: NodeJS.Timer | undefined;

  public currentLightRef: Ref<Light>;
  public currentTimeRef: Ref<Seconds> = ref(0);

  constructor(currenLight: Light) {
    debugLog('init TrafficLightController with light:', currenLight);
    // если горит зеленый, то направление вверх. В остальных случаях - вниз
    if (LightNumber[currenLight] === 2) {
      this.direction = 1;
    }

    this.currentLightRef = ref(currenLight);

    this.currentLight = new FSM<Light>(currenLight, (prevValue, newValue) => {
      // красный -> желтый -> зеленый
      if (
        this.direction === 0 &&
        LightNumber[newValue] > LightNumber[prevValue]
      ) {
        return true;
      }

      // красный <- желтый <- зеленый
      if (
        this.direction === 1 &&
        LightNumber[newValue] < LightNumber[prevValue]
      ) {
        return true;
      }

      return false;
    });

    this.currentLight.add((newValue) => {
      debugLog('disptached new light:', newValue);
      this.toogleTimer();

      window.history.pushState(
        'state',
        'something',
        `/${this.getCurrentLight()}`
      );
      this.currentLightRef.value = newValue;
      localStorage.setItem('currentLight', newValue);
    });
  }

  getCurrentLight(): Light {
    return this.currentLight.getValue();
  }

  /*
  / если это обновление страницы, то оставшееся время берется из local storage.
  / иначе - дефолтное время
  */
  startTrafficLight() {
    const currentLightFromLocalStorage = localStorage.getItem(
      'currentLight'
    ) as Light;
    const currentTimeFromLocalStorage = Number(
      localStorage.getItem('currentTime')
    ) as Seconds;

    if (
      this.getCurrentLight() === currentLightFromLocalStorage &&
      currentTimeFromLocalStorage
    ) {
      this.startTimer(currentTimeFromLocalStorage);
    } else {
      localStorage.setItem('currentLight', this.getCurrentLight());
      this.toogleTimer();
    }
  }

  private toogleTimer() {
    if (this.getCurrentLight() === 'red') {
      this.startTimer(10); // по условию красный горит 10 секунд
    }

    if (this.getCurrentLight() === 'yellow') {
      this.startTimer(3); // по условию желтый горит 3 секунд
    }

    if (this.getCurrentLight() === 'green') {
      this.startTimer(15); // по условию зеленый горит 15 секунд
    }
  }

  private dispatchNextLight() {
    if (
      this.getCurrentLight() === 'red' ||
      this.getCurrentLight() === 'green'
    ) {
      this.currentLight.dispatch('yellow');
      return;
    }

    // красный -> желтый -> зеленый
    if (this.direction === 0) {
      this.currentLight.dispatch('green');
      this.direction = 1;
      return;
    }

    this.currentLight.dispatch('red');
    this.direction = 0;
  }

  private startTimer(seconds: Seconds) {
    debugLog('startTimer for:', seconds, 'seconds');
    this.currentTime = seconds;
    this.currentTimeRef.value = seconds;
    this.timerId = setInterval(() => {
      this.currentTime = this.currentTime - 1;
      this.currentTimeRef.value = this.currentTime;

      if (this.currentTime === 0 && this.timerId) {
        clearInterval(this.timerId);
        this.dispatchNextLight();
        localStorage.removeItem('currentTime');
      } else {
        localStorage.setItem('currentTime', this.currentTime.toString());
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  public onDestroy() {
    this.stopTimer();
    this.currentLight.remove();
  }
}
