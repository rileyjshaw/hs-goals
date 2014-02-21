Creature {
  prototype {
    edible: 0, // 0 means that it is inedible, # represents energy needed to eat it
    vegan: true, // determines whether it's an herbivore or a carnivore
    maxEnergy: 0, // higher for larger organisms, 0 makes it boundless
    maxAge: 100, // measured in steps, 0 makes it immortal
    initialEnergy: 34,
    color: [125, 123, 206], // rgb from 0 - 255, will be multiplied by energy
    character: 'x', // needs to be collected somewhere
    moveCost: 1, // how much energy is expended on movement
    efficiency: .8, // number from 0 -> 1 determining energy conversion after consumption (during eat or photosynthesize)

  },
  instance {
    energy: 34, // will die if 0
    direction: 'sw' // maybe change this
  }
}

lichen: 5 - 20
?
?

L:
l:

move
eat
photosynthesize
reproduce
wait
