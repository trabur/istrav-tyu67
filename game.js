import Puppet from './puppet.js'
import TYU67 from './main.js'

var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Constraint = Matter.Constraint;
var Engine = Matter.Engine;
var Common = Matter.Common;
var Events = Matter.Events;
var Render = Matter.Render;
var Vector = Matter.Vector;
var MouseConstraint = Matter.MouseConstraint;

let Game = {}

Game.create = function (id) {
  var defaults = {
    sceneEvents: []
  };

  // teams
  let redTeam = 0x0001
  let blueTeam = 0x0002
  // let greenTeam = 0x0004
  // let purpleTeam = 0x0005
  // let orangeTeam = 0x0006
  // let yellowTeam = 0x0008
  let redColor = '#ff0000'
  let blueColor = '#0000ff'
  // let greenColor = ''
  // let purpleColor = ''
  // let orangeColor = ''
  // let yellowColor = ''

  // TODO: grab game from server based on id arguement
  var game = {
    session: {
      id: id || 1,
      type: 'ffa', // ffa, koth, ctf
      teamEnabled: true, // boolean
      sceneName: 'arena', // the map that everyone is playing on
      resources: [], // resources that players interact with
      participantId: 1,
      participants: [
        {
          id: 1,
          name: "alice",
          attackId: blueTeam,
          defendId: redTeam,
          color: redColor,
          position: {x: 200, y: 100} // from the top left pixel of the viewport
        },
        {
          id: 2,
          name: "bob",
          attackId: blueTeam,
          defendId: redTeam,
          color: redColor,
          position: {x: 400, y: 400}
        },
        {
          id: 3,
          name: "carl",
          attackId: redTeam,
          defendId: blueTeam,
          color: blueColor,
          position: {x: 600, y: 600}
        }
      ]
    }
  };

  return Common.extend(defaults, game);
};

Game.init = function (id) {
  var game = Game.create(id);
  Matter.Game._game = game;

  // get container element for the canvas
  game.container = document.getElementById('canvas-container');

  /**
   * engine
   */
  // create an engine
  game.engine = TYU67.engine(game);

  // run the engine
  game.runner = Engine.run(game.engine);

  /**
   * render
   */
  game.render = Render.create({
    element: game.container,
    engine: game.engine,
    options: {
      hasBounds: true, // A flag that specifies if render.bounds should be used when rendering.
      height: window.innerHeight,
      width: window.innerWidth
    }
  });

  // run the renderer
  Render.run(game.render);

  /**
   * setup
   */
  // set up a scene with bodies
  Game.reset(game);
  Game.setScene(game, game.session.sceneName);

  // set up game interface
  Game.initControls(game);

  // pass through runner as timing for debug rendering
  game.engine.metrics.timing = game.runner;

  return game;
};

// call init when the page has loaded fully
if (window.addEventListener) {
  window.addEventListener('load', Game.init);
} else if (window.attachEvent) {
  window.attachEvent('load', Game.init);
}

// reinit when window resizes
// window.addEventListener('resize', Game.init);

Game.setScene = function (game, sceneName) {
    TYU67[sceneName](game);
};

Game.reset = function (game) {
  var world = game.engine.world;
  var i;

  World.clear(world);
  Engine.clear(game.engine);

  // clear all scene events
  if (game.engine.events) {
    for (i = 0; i < game.sceneEvents.length; i++) {
      Events.off(game.engine, game.sceneEvents[i]);
    }
  }

  if (world.events) {
    for (i = 0; i < game.sceneEvents.length; i++) {
      Events.off(world, game.sceneEvents[i]);
    }
  }

  if (game.runner && game.runner.events) {
    for (i = 0; i < game.sceneEvents.length; i++) {
      Events.off(game.runner, game.sceneEvents[i]);
    }
  }

  if (game.render && game.render.events) {
    for (i = 0; i < game.sceneEvents.length; i++) {
      Events.off(game.render, game.sceneEvents[i]);
    }
  }

  game.sceneEvents = [];

  // reset id pool
  Body._nextCollidingGroupId = 1;
  Body._nextNonCollidingGroupId = -1;
  Body._nextCategory = 0x0001;
  Common._nextId = 0;

  // reset random seed
  Common._seed = 0;

  // reset engine properties
  game.engine.enableSleeping = false;
  game.engine.world.gravity.y = 0;
  game.engine.world.gravity.x = 0;
  game.engine.timing.timeScale = 1;

  // reset viewport center
  game.viewportCenter = {
    x: game.render.options.width * 0.5,
    y: game.render.options.height * 0.5
  };

  /**
   * resources
   */

  let opts = {
    isStatic: true,
    render: {
      fillStyle: '#000',
      lineWidth: 0
    }
  }
  var offset = 500;
  World.add(world, [
    Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, opts),
    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, opts),
    Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, opts),
    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, opts)
  ]);

  // World.addComposite(
  //   world,
  //   Composites.softBody(
  //     500, 0, // x, y
  //     200, 2, // colms, rows
  //     5, 150, // columnGap, rowGap
  //     1, 25// crossBrace, particleRadius
  //   )
  // )

  /**
   * participants
   */
  // add the player to the world
  var player = game.session.participants.filter(function (participant) {
    return participant.id === game.session.participantId;
  })[0];

  game.player = player = Puppet.init(player);
  World.addBody(world, player);

  console.log(player);

  // add the other participants to the world
  game.session.participants.forEach(function (participant) {
    // skip the player that we already just added
    if (participant.id !== player.tyu67.id) {
      // // set participents intentions relative to the player
      // if (game.session.teamEnabled === true) {
      //   if (game.player.teamId === participant.teamId) {
      //     participant.type = 'ally';
      //   } else {
      //     participant.type = 'enemy';
      //   }
      // } else {
      //   participant.type = 'enemy';
      // }

      var puppet = Puppet.init(participant);
      World.addBody(world, puppet);
    }
  });


  if (game.player) {
    /**
     * mouse
     */
    game.mouseConstraint = MouseConstraint.create(game.engine, {
        element: game.render.canvas
    });

    World.add(world, game.mouseConstraint);

    // pass mouse to renderer to enable showMouseConstraint
    game.render.mouse = game.mouseConstraint.mouse;

    // constrain the center of the viewport to the player's body
    game.playerConstraint = Constraint.create({
      pointA: {
        x: game.render.options.width * 0.5,
        y: game.render.options.height * 0.5
      },
      pointB: game.player.position,
      render: {
        visible: false
      }
    });

    World.add(world, game.playerConstraint);

    // constrain mouse position to player body
    game.focusConstraint = Constraint.create({
      pointA: game.playerConstraint.pointB,
      pointB: game.mouseConstraint.mouse.position
    });

    World.add(world, game.focusConstraint);
  }

  /**
   * properties
   */
  if (game.render) {
    var renderOptions = game.render.options;
    renderOptions.wireframes = false // <-- important
    renderOptions.showBroadphase = false // boxes around everything thats near touching
    renderOptions.hasBounds = true // required for views to work
    renderOptions.showDebug = false
    renderOptions.showBounds = false
    renderOptions.showVelocity = false
    renderOptions.showCollisions = false
    renderOptions.showAxes = false
    renderOptions.showPositions = false
    renderOptions.showAngleIndicator = false
    renderOptions.showIds = false
    renderOptions.showShadows = false
    renderOptions.showVertexNumbers = false
    renderOptions.showConvexHulls = false
    renderOptions.showInternalEdges = false
    renderOptions.showSeparations = false
    renderOptions.background = '#111'
  }
};

Game.initControls = function (game) {
  var mouseConstraint = game.mouseConstraint;
  var viewportCenter = game.viewportCenter;
  var player = game.player;
  player.rotation = 0; // number
  player.shooting = false; // boolean
  player.movement = {
    up: false,
    left: false,
    down: false,
    right: false
  };

  function crosshairMoved (event) {
    var delta = Vector.sub(game.playerConstraint.pointB, game.focusConstraint.pointB);
    player.rotation = Math.atan2(delta.y, delta.x);
  }

  function update (event, status) {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      player.movement.up = status;
      break;

      case 'ArrowLeft':
      case 'a':
      player.movement.left = status;
      break;

      case 'ArrowDown':
      case 's':
      player.movement.down = status;
      break;

      case 'ArrowRight':
      case 'd':
      player.movement.right = status;
      break;

      default:
      // do nothing
      break;
    }
  }

  function startShooting (event) {
    player.shooting = true;
  }

  function stopShooting (event) {
    player.shooting = false;
  }

  function startMoving (event) {
    update(event, true);
  }

  function stopMoving (event) {
    update(event, false);
  }

  // keyboard controls player movement
  window.addEventListener('keydown', startMoving);
  window.addEventListener('keyup', stopMoving);

  // mouse controls player direction and weapons
  Events.on(mouseConstraint, 'mousemove', crosshairMoved);
  Events.on(mouseConstraint, 'mousedown', startShooting);
  Events.on(mouseConstraint, 'mouseup', stopShooting);
};

export default Game