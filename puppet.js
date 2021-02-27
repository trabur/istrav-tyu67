var Composites = Matter.Composites;
var Common = Matter.Common;

let Puppet = {}

Puppet.init = function (options) {
  var puppet = Composites.car(
    options.position.x, // xx
    options.position.y, // yy
    100, // width
    50, // height
    50 // wheelsize
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