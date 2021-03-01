var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Engine = Matter.Engine;
var Events = Matter.Events;
var Vector = Matter.Vector;
var Bounds = Matter.Bounds;
var Mouse = Matter.Mouse;

let TYU67 = {}

TYU67.engine = function (game) {
  var options = {
    positionIterations: 6,
    velocityIterations: 4,
    enableSleeping: false,
    metrics: {
      extended: true
    }
  };

  return Engine.create(options);
};

TYU67.arena = function (game) {
  var engine = game.engine;
  var world = engine.world;
  var render = game.render;
  var player = game.player;
  var sceneEvents = game.sceneEvents;
  var viewportCenter = game.viewportCenter;
  var playerConstraint = game.playerConstraint;
  var focusConstraint = game.focusConstraint;
  var mouseConstraint = game.mouseConstraint;

  // beforeTick
  // tick
  // beforeUpdate
  // collisionStart
  // collisionActive
  // collisionEnd
  // afterUpdate
  // afterTick
  // beforeRender
  // afterRender
  sceneEvents.push(

    // fired at the start of a tick, before any updates to the engine or timing
    Events.on(engine, 'beforeTick', function (event) {
      /**
       * game controls and viewport
       */
      // console.log("beforeTick");

      // adjust viewport to the current player
      var deltaCenter = Vector.sub(playerConstraint.pointB, playerConstraint.pointA);
      Bounds.shift(render.bounds, deltaCenter);

      // update mouse
      Mouse.setOffset(mouseConstraint.mouse, render.bounds.min);
    }),
    Events.on(engine, "tick", function (event) {
        /**
         * accept player input
         */
        // console.log("tick");

        // player rotation
        Body.setAngle(player.parts[0], player.rotation + (Math.PI/180) * 90);

        // player movement
        Body.applyForce(
          player.parts[0],
          player.parts[0].position,
          (function () {
            var move = player.movement;
            var x = 0;
            var y = 0;

            if (move.up) y += -0.001;
            if (move.left) x += -0.001;
            if (move.down) y += 0.001;
            if (move.right) x += 0.001;

            return Vector.create(x, y);
          })()
        );

        // player weapons
        if (player.shooting) {
          var bullet = Bodies.circle(
            playerConstraint.pointB.x,
            playerConstraint.pointB.y,
            10, // radius
            {
              collisionFilter: {
                group: 0,
                mask: player.tyu67.attack.players | player.tyu67.attack.base | player.tyu67.attack.bullets, // may collide with
                category: player.tyu67.defend.bullets // collision category
              },
              render: {
                strokeStyle: player.tyu67.defend.color,
                fillStyle: 'transparent',
                lineWidth: 1
              },
              frictionAir: 0,
              force: Vector.rotate(
                {
                  x: 0.0,
                  y: 0.02 // bullet speed
                },
                player.parts[0].angle
              )
            }
          );
          World.addBody(world, bullet);
          // remove bullets after 1 second
          setTimeout(() => {
            World.remove(world, bullet)
          }, 1000)
        }

    }),
    Events.on(engine, "beforeUpdate", function (event) {
      /**
       * server: correct positions
       */
      // console.log("beforeUpdate");

      // notify server of all bullet/player collisions
    }),
    Events.on(engine, "collisionStart", function (event) {
      /**
       * bullet collision
       */
      // console.log("collisionStart");

      // console.log(event.pairs[0]);
    }),
    Events.on(engine, "collisionActive", function (event) {
      /**
       * bullet collision
       */
      // console.log("collisionActive");

      // console.log(event.pairs[0]);
    }),
    Events.on(engine, "collisionEnd", function (event) {
      /**
       * bullet collision
       */
      // console.log("collisionEnd");

      // console.log(event.pairs[0]);
    }),
    Events.on(engine, "afterUpdate", function (event) {
      /**
       * server: report positions
       */
      // console.log("afterUpdate");
    }),
    Events.on(engine, "afterTick", function (event) {
      // console.log("afterTick");
    }),
    Events.on(render, "beforeRender", function (event) {
      // console.log("beforeRender");
    }),
    Events.on(render, "afterRender", function (event) {
      // console.log("afterRender");
    })
  );
};

export default TYU67