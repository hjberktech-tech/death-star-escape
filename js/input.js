export const Input = {
  forward: false,
  back: false,
  rotLeft: false,
  rotRight: false,
  strafeLeft: false,
  strafeRight: false,
  shoot: false,
  shootConsumed: false,
  interact: false,
  interactConsumed: false,
  mouseDX: 0,
  _mouseDXAccum: 0,
  pointerLocked: false,

  init(canvas) {
    document.addEventListener('keydown', e => this._onKey(e, true));
    document.addEventListener('keyup', e => this._onKey(e, false));
    canvas.addEventListener('click', () => {
      if (!this.pointerLocked) canvas.requestPointerLock();
      else { this.shoot = true; }
    });
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === canvas;
    });
    document.addEventListener('mousemove', e => {
      if (this.pointerLocked) this._mouseDXAccum += e.movementX;
    });
    document.addEventListener('mousedown', e => {
      if (e.button === 0 && this.pointerLocked) this.shoot = true;
    });
  },

  _onKey(e, down) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp':    this.forward    = down; break;
      case 'KeyS': case 'ArrowDown':  this.back       = down; break;
      case 'ArrowLeft':  this.rotLeft    = down; break;
      case 'ArrowRight': this.rotRight   = down; break;
      case 'KeyA':       this.strafeRight = down; break;
      case 'KeyD':       this.strafeLeft  = down; break;
      case 'Space':
        if (down) this.shoot = true;
        e.preventDefault();
        break;
      case 'KeyF': case 'Enter':
        if (down) this.interact = true;
        break;
    }
  },

  consumeShoot() {
    const v = this.shoot;
    this.shoot = false;
    return v;
  },

  consumeInteract() {
    const v = this.interact;
    this.interact = false;
    return v;
  },

  flushMouse() {
    this.mouseDX = this._mouseDXAccum;
    this._mouseDXAccum = 0;
  },
};
