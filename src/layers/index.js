var animTimer;

function fadeIn() {
  if (animTimer) {
    return;
  }

  animTimer = setInterval(function() {
    var dataItems = Data.items,
      isNeeded = false;

    for (var i = 0, il = dataItems.length; i < il; i++) {
      if (dataItems[i].scale < 1) {
        dataItems[i].scale += 0.5*0.2; // amount*easing
        if (dataItems[i].scale > 1) {
          dataItems[i].scale = 1;
        }
        isNeeded = true;
      }
    }

    Layers.render();

    if (!isNeeded) {
      clearInterval(animTimer);
      animTimer = null;
    }
  }, 33);
}

var Layers = {

  container: document.createElement('DIV'),
  items: [],

  init: function() {
    this.container.style.pointerEvents = 'none';
    this.container.style.position = 'absolute';
    this.container.style.left = 0;
    this.container.style.top  = 0;

    // TODO: improve this to .setContext(context)
    Shadows.init(this.createContext(this.container));
    Simplified.init(this.createContext(this.container));
    Buildings.init(this.createContext(this.container));
    HitAreas.init(this.createContext());
    Debug.init(this.createContext(this.container));
  },

  clear: function() {
    Shadows.clear();
    Simplified.clear();
    Buildings.clear();
    HitAreas.clear();
    Debug.clear();
  },

  setOpacity: function(opacity) {
    Shadows.setOpacity(opacity);
    Simplified.setOpacity(opacity);
    Buildings.setOpacity(opacity);
    HitAreas.setOpacity(opacity);
    Debug.setOpacity(opacity);
  },

  render: function(quick) {
    // show on high zoom levels only and avoid rendering during zoom
    if (ZOOM < MIN_ZOOM || isZooming) {
      this.clear();
      return;
    }

    requestAnimFrame(function() {
      if (!quick) {
        Shadows.render();
        Simplified.render();
        HitAreas.render(); // TODO: do this on demand
      }
      Buildings.render();
    });
  },

  createContext: function(container) {
    var canvas = document.createElement('CANVAS');
    canvas.style.transform = 'translate3d(0, 0, 0)'; // turn on hw acceleration
    canvas.style.imageRendering = 'optimizeSpeed';
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top  = 0;

    var context = canvas.getContext('2d');
    context.lineCap   = 'round';
    context.lineJoin  = 'round';
    context.lineWidth = 1;
    context.imageSmoothingEnabled = false;

    this.items.push(canvas);
    if (container) {
      container.appendChild(canvas);
    }

    return context;
  },

  appendTo: function(parentNode) {
    parentNode.appendChild(this.container);
  },

  remove: function() {
    this.container.parentNode.removeChild(this.container);
  },

  setSize: function(width, height) {
    for (var i = 0, il = this.items.length; i < il; i++) {
      this.items[i].width  = width;
      this.items[i].height = height;
    }
  },

  // usually called after move: container jumps by move delta, cam is reset
  setPosition: function(x, y) {
    this.container.style.left = x +'px';
    this.container.style.top  = y +'px';
  }
};

