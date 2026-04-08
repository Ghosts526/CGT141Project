# Operation Breakpoint 
### CGT 14100 Final Project
<p>Purdue University - May 1st, 2026</p>

## Content:
* Game Overview
* Game Features
* How to Play
* Running the Game
* Credits
* License

## Game Overview:

<p>Operation Breakpoint is a top‑down spaceship shooter where players pilot a spaceship through waves of hostile enemy ships. The gameplay focuses on fast vertical movement, precise dodging, and timing your shots to survive increasingly difficult encounters.</p>

<p>As players destroy enemy ships, they earn credits that can be spent on ship upgrades — improving firepower, durability, and overall survivability. Each wave becomes more challenging, pushing players to react quickly, manage positioning, and strategically invest in upgrades to progress further. Upgrading is accessible before you start the game and after the game is over.</p>

<p>The game is built using HTML5, CSS, and JavaScript.</p>

## Game Features:

**Top-Down Space Combat**
<p>Fast, arcade-systle gameplay where you move vertically to dodge enemy fire and line up shots.</p>

**Enemy Waves & Attack Patterns**
<p>There are multiple enemy types with different moving patterns and firing behaviors. As the player progress further, harder enemies start to appear to keep the enviornment fun and challenging.</p>

**Credits & Upgrade System**
<p>Credits are earn by destroying enemy ships and can be spend to upgrade your ship capabilities such as:</p>

* Increased Health
* Increased Firerate
* Decreased Missile Cooldown
* Increase Shield Health
* Decreased Shield Cooldown

**Collision & Damage System**
<p>Collisions are detected by players and enemy projectiles interacting with the game objects. Damage output is consistant to all projectile but health is what changes the difficulty in destroying ships</p>

**Score Tracking**
<p>Score is awarded every time they destroy the enemy ships. With higher rewards with tougher enemies.</p>

**Multiple Pages**
<p>Includes a main menu, game menu, game screen, upgrades, settings, how to play, leaderboards, and credits</p>

## How to Play

**Controls**

* W/S - Moves your ship up and down
* Space - Fires your primary weapon (Blaster)
* E - Fires your secondary weapon (Missile)

**Objective**
<p>Survive as long as possible while defeating waves of enemies and by upgrading your ship. Each wave becomes progressively harder, introducing tougher enemies and faster spawn rates.</p>

**Gameplay Loop**

1. Move and dodge incoming enemy fire
2. Shoot enemies to earn score
3. Survive multiple waves that increase in difficulty
4. Use your credits to upgrade your ship
5. Push for a high score and climb the leaderboard

**Upgrades & Progression**
<p>From the main menu, you can enhance your ship with upgrades such as:</p>

* Increased Health
* Increased Firerate
* Decreased Missile Cooldown
* Increase Shield Health
* Decreased Shield Cooldown

<p>Upgrades persist until data has been cleared, either by the user or by the browser. These upgrades help you survive more intense waves.</p>

**Leaderboard**
<p>Your score is saved locally and in the server.</p>

**Additional Pages**

* How to Play - Quick reference for controls and mechanics
* Settings - Adjust audio and gameplay preferences
* Upgrades - Improve your shipship between runs
* Credits - Acknowledgements and project contributors

## Running the Game

<p>Operation Breakout is a browser-based game that runs on a server.</p>

**Requirements**
<p>If you are running this game locally, you'll need to have Python 3 already installed on your system. You then can fun the run_server.bat file, so that your system can create a local server for the game to run on.</p>

<p>If you are running this game on a website from a server, then no additional requirements are needed only that the server has to be up and running.</p>

<p>Note: Python is only required if you are running this game locally. This is due to JavaScript ES Modules, requiring proper HTTP serving with correct headers, path resolution, and security compliance — something the file:// protocol can’t provide.</p>

**Starting the Game**

<p>The easiest way to launch this game locally is by running the run_server.bat file. This file does all the work by creating a local server and opening the game for you. Similar to an actaul application.</p>

<p>If the server is up and running, then you are able to have access to the game just by going to its website url.</p>

## Credits

<p>Operation Breakout was designed and developed as a multi-page web game project. It was created as a coursework in Purdue University CGT 14100 Web Development Course. It incorporates HTML5, CSS, and JS to create and run the game.</p>

<p>All the game design and development was all created by Enrique Zavala.</p>

## License

<p>This project is licensed under the MIT License.</p>

<p>You are free to use, modify, and distribute this project for personal, educational, or research purposes, provided that proper credit is given.</p>

<p>See the full license text in the LICENSE file if needed.</p>
