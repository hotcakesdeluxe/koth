/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

// Start the main app logic.
requirejs([
    'hft/commonui',
    'hft/gameclient',
    'hft/misc/input',
    'hft/misc/misc',
    'hft/misc/mobilehacks',
    'hft/misc/touch',
  ], function(
    CommonUI,
    GameClient,
    Input,
    Misc,
    MobileHacks,
    Touch) {

  var globals = {
    debug: false,
  };
  Misc.applyUrlSettings(globals);
  MobileHacks.fixHeightHack();

  var score = 0;
  var g_jump = false;
  var statusElem = document.getElementById("gamestatus");
  var inputElem = document.getElementById("inputarea");
  var colorElem = document.getElementById("display");
  var client = new GameClient();

  // Note: CommonUI handles these events for almost all the samples.
  var onConnect = function() {
    statusElem.innerHTML = "you've connected to the relayserver";
  };

  var onDisconnect = function() {
    statusElem.innerHTML = "you were disconnected from the relayserver";
 }

   var handleJump = function(pressed) {
    if (g_jump != pressed) {
      g_jump = pressed;
      g_client.sendCmd('jump', {
          jump: pressed,
      });
    }
  };
  
  // If I was going to handle this without CommonUI this is what I'd do
  //client.addEventListener('connect', onConnect);
  //client.addEventListener('disconnect', onDisconnect);

  // Because I want the CommonUI to work
  globals.disconnectFn = onDisconnect;
  globals.connectFn = onConnect;

  CommonUI.setupStandardControllerUI(client, globals);

  var randInt = function(range) {
    return Math.floor(Math.random() * range);
  };


  // Pick a random color
  var color =  'rgb(' + randInt(256) + "," + randInt(256) + "," + randInt(256) + ")";
  // Send the color to the game.
  //
  // This will generate a 'color' event in the corresponding
  // NetPlayer object in the game.
  client.sendCmd('color', {
    color: color,
  });
  colorElem.style.backgroundColor = color;



  // Update our score when the game tells us.
  client.addEventListener('scored', function(cmd) {
    score += cmd.points;
    statusElem.innerHTML = "You scored: " + cmd.points + " total: " + score;
  });

    Touch.setupButtons({
    inputElement: $("buttons"),
    buttons: [
      { element: $("left"),  callback: function(e) { handleLeftRight(e.pressed, 0x1); }, },
      { element: $("right"), callback: function(e) { handleLeftRight(e.pressed, 0x2); }, },
      { element: $("jump"),  callback: function(e) { handleJump(e.pressed);           }, },
    ],
  });
  

  
});

