// var Composites = Matter.Composites;
var Common = Matter.Common
var Bodies = Matter.Bodies
var Composite = Matter.Composite
var Constraint = Matter.Constraint

let Puppet = {}

Puppet.init = function (options) {
  // var puppet = Composites.car(
  //   options.position.x, // xx
  //   options.position.y, // yy
  //   100, // width
  //   50, // height
  //   50 // wheelsize
  // );
  function createImage(string) {

    let drawing = document.createElement("canvas");

    drawing.width = '150'
    drawing.height = '250'

    let ctx = drawing.getContext("2d");

    ctx.fillStyle = "transparent";
    //ctx.fillRect(0, 0, 150, 150);
    ctx.beginPath();
    ctx.arc(75, 75, 20, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "20pt sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(string, 75, 85);
    // ctx.strokeText("Canvas Rocks!", 5, 130);

    return drawing.toDataURL("image/png");
  }

  let body = Bodies.circle(
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
        lineWidth: 0,  
      },
      frictionAir: 0.2,
      density: 0.0001
    }
  );

  let nameTag = Bodies.circle(
    options.position.x,
    options.position.y,
    30, // radius
    {
      collisionFilter: {
        group: 1,
        mask: null,
        category: null
      },
      render: {
        fillStyle: 'transparent',
        lineWidth: 0,
        sprite: {
          texture: createImage(options.name),
          xScale: 1,
          yScale: 1
        }      
      },
      frictionAir: 0.0,
      density: 0.00001,
      inertia: Infinity
    }
  );
    
  let puppet = Composite.create({
    id: options.name
  })

  // add bodies
  Composite.add(puppet, body)
  Composite.add(puppet, nameTag)
  // add constraints
  Composite.add(puppet, Constraint.create({
    bodyA: body,
    bodyB: nameTag,
    render: {
      visible: true
    }
  }))

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