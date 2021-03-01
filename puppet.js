// var Composites = Matter.Composites;
var Common = Matter.Common;
var Bodies = Matter.Bodies

let Puppet = {}

Puppet.init = function (options) {
  // var puppet = Composites.car(
  //   options.position.x, // xx
  //   options.position.y, // yy
  //   100, // width
  //   50, // height
  //   50 // wheelsize
  // );

  var puppet = Bodies.circle(
    options.position.x,
    options.position.y,
    30, // radius
    {
      collisionFilter: {
        group: 0,
        mask: options.attack.bullets | options.attack.players | options.attack.base, // may collide with
        category: options.defend.players // collision category
      },
      render: {
        fillStyle: options.defend.color,
        lineWidth: 0
      },
      frictionAir: 0.2,
      density: 0.0001
    }
  );

  puppet.tyu67 = options;

  return puppet;
};

Puppet.properties = function (options) {
  var defaults = {
    health: 10,
    maxHealth: 10,
    healthRegain: 1,
    bodyDamage: 1,
    bulletSpeed: 1,
    bulletPenetration: 1,
    bulletDamage: 1,
    reload: 1,
    movementSpeed: 1
  };

  return Common.extend(defaults, options);
};


export default Puppet