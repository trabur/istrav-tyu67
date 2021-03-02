var World = Matter.World;
var Bodies = Matter.Bodies;

export let base = (x, y, offset, world, defense, offense) => {
  let boundryOpts = {
    collisionFilter: {
      group: 0,
      mask: defense.players | offense.players,
      category: defense.boundry | offense.boundry
    },
    isStatic: true,
    render: {
      fillStyle: '#000',
      lineWidth: 1,
      strokeStyle: 'white'
    }
  }
  let stairsOpts = {
    isStatic: true,
    collisionFilter: {
      group: 0,
      mask: offense.players,
      category: defense.base
    },
    render: {
      fillStyle: '#000',
      lineWidth: 1,
      strokeStyle: defense.color
    }
  }
  let opts = {
    isStatic: true,
    collisionFilter: {
      group: 0,
      mask: offense.players,
      category: defense.base
    },
    render: {
      fillStyle: '#000',
      lineWidth: 4,
      strokeStyle: defense.color
    }
  }
  var offset = 200;
  World.add(world, [
    // Bodies.rectangle(x, y, width, height, [options])
    Bodies.rectangle(x + 400,          y + -offset,      800.5 + 2 * offset, 200.5,              opts),        // top
    Bodies.rectangle(x + 400,          y + 125 -offset,  100.5 + 2 * offset, 25.5,               stairsOpts),  // top stairs
    Bodies.rectangle(x + 400,          y + 160 -offset,  100.5 + 2 * offset, 25.5,               stairsOpts),  // top stairs
    Bodies.rectangle(x + 400,          y + 195 -offset,  100.5 + 2 * offset, 25.5,               stairsOpts),  // top stairs
    Bodies.rectangle(x + 400,          y + 200 -offset,  100.5 + 2 * offset, 25.5,               boundryOpts), // boundry: top
    Bodies.rectangle(x + 800 + offset, y + 300,          200.5,              600.5 + 2 * offset, opts),        // right
    Bodies.rectangle(x + 400,          y + 600 + offset, 800.5 + 2 * offset, 200.5,              opts),        // bottom
    Bodies.rectangle(x + -offset,      y + 300,          200.5,              600.5 + 2 * offset, opts),        // left
    // Bodies.circle(x, y, radius, [options], [maxSides])
    Bodies.polygon(x + -offset, y + -offset, 4, 200, opts), // top left
    Bodies.polygon(x + offset + 800, y + -offset, 4, 200, opts), // top right
    Bodies.polygon(x + offset + 800, y + offset + 600, 4, 200, opts), // bottom right
    Bodies.polygon(x + -offset, y + offset + 600, 4, 200, opts), // bottom left
  ]);

}