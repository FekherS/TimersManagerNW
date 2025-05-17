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
- added a local storage configuration (save, load);
- apploaded to aws, [Live demo] (http://timersmanagerbucket.s3-website.eu-central-1.amazonaws.com/)

## What to implement next:
- upload some nice beeps to choose from.
- add upload for those that have their own beeps.

## Issues encountered:
- Browsers throttle inactive web pages, countdowns timers pause/stall. 
    - **Solution** : change logic from countdown to set time and count till time.
    - **Fixed**