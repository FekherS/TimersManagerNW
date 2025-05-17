# My Implementation of a Timers Manager
## Why
I have issues with concentration/focus, I read about the [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique), as a solution and thought i should implement it on my own.


## ***Moved from one file Structure to MVC structure***
following (trying to at least) best practices

## What is implemented:
- add / remove timers.
- set loops.
- start, stop, pause timers.
- generic beep sound.

## What to implement next:
- add cookie so I don't need to setup the timers each time.
- upload some nice beeps to choose from.
- add upload for those that have their own beeps.
- upload project to aws for personal use

## Issues encountered:
- Browsers throttle inactive web pages, countdowns timers pause/stall. 
    - **Solution** : change logic from countdown to set time and count till time.
    - **Fixed**