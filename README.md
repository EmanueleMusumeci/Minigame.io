# Minigame.io

The presented project implements a simple videogame featuring a series of “mini-games” (easy levels with a specific objective), designed modularly to allow an easy addition of new levels. It is implemented using the Babylon.js framework and Cannon.js as a physics engine. Currently two mini-games are available: one featuring a shooting range with a pistol, that requires shooting targets, the other one featuring a basketball and a basket, that requires scoring some free-throws. After a first round where all mini-games are played in sequence, mini-games will be chosen randomly and randomized (each mini-game provides its own randomization features). The player is implemented as a hierarchical model representing a “drawing mannequin” with animations for walking (forward, left, right, back), jumping, falling and being idle. Possible actions triggered by user input are: moving the player, picking up/dropping objects (not all objects are pickable), some of which can shoot projectiles (currently only a pistol can do so but the game provides a modular way of creating a “shooter” object).

## Commands

* W - Move forward
* S - Move backward
* A - Move left
* D - Move right
* SPACEBAR - Jump
* F - Pick up/Drop object
* R - First/Third person camera
* T - While in third person, view the player from the side
* M - Menu

If an object is highlighted when looking at it, you can pick it up. Wait for it to be highlighted then press F (press the same key to drop it).
If it's a gun (currently there's only the pistol), press Left Mouse Button while holding it to shoot, otherwise keep Left Mouse Button pressed to charge its launch and then launch it by releasing the button.

[Game link](https://emanuelemusumeci.github.io/Minigame.io/)

Notice: the game has sounds but Babylon.js requires you to click on the speaker icon (in the upper left corner of the canvas) to enable them.