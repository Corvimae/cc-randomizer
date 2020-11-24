import random from './seedrandom.js';

function shuffle(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * i);
    const temp = array[i];

    array[i] = array[j];
    array[j] = temp;
  }
}

export default class CCRandomizer extends Plugin {
	constructor(mod) {
		super();
    this.mod = mod;
	}
    
	main() {
    this.hookNewGame();

    const rng = new random('test');
    
    const itemsByType = sc.inventory.items.reduce((acc, item, index) => ({
      ...acc,
      [item.type]: [
        ...(acc[item.type] || []),
        {
          index,
          item
        }
      ],
    }), {});

    shuffle(sc.inventory.items, rng);

    itemsByType.TOGGLE.forEach(({ item, index }) => {
      const temp = sc.inventory.items[index];

      const replacedItemIndex = Object.entries(itemsByType).reduce((acc, [_key, value]) => [...acc, ...value], []).find(({ item: elem }) => elem === temp).index;

      sc.inventory.items[index] = item;
      sc.inventory.items[replacedItemIndex] = temp;
    });
  }

  hookNewGame() {
    sc.CrossCode.inject({
			start() {
        sc.model.enterGame();
        ig.vars.set('map.shockOpen', true);
        ig.vars.set('map.coldOpen', true);
        // ig.vars.set('rhombus-sqr.central-inner.coldOpen', true);
        ig.game.teleport('rhombus-sqr.central-inner', ig.TeleportPosition.createFromJson({ marker: 'entrance' }), "LOAD");
        ig.vars.set('map.shockOpen', true);
        ig.vars.set('map.coldOpen', true);

        console.log(ig.vars.get('map.coldOpen'));
			}
		});
  }
}