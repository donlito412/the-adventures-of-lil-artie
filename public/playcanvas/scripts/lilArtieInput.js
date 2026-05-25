var LilArtieInput = pc.createScript('lilArtieInput');

LilArtieInput.prototype.initialize = function () {
    this.move = new pc.Vec2();
    this.look = new pc.Vec2();
    this.jumpPressed = false;
    this.runHeld = false;
    this.attackPressed = false;
    this.interactPressed = false;
    this.lastDevice = 'keyboard';

    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    this.app.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
};

LilArtieInput.prototype.onKeyDown = function (event) {
    this.lastDevice = 'keyboard';

    if (event.key === pc.KEY_SPACE) {
        this.jumpPressed = true;
    }

    if (event.key === pc.KEY_E) {
        this.interactPressed = true;
    }

    if (event.key === pc.KEY_SHIFT) {
        this.runHeld = true;
    }

    if (event.key === pc.KEY_F) {
        this.attackPressed = true;
    }
};

LilArtieInput.prototype.onKeyUp = function (event) {
    if (event.key === pc.KEY_SHIFT) {
        this.runHeld = false;
    }
};

LilArtieInput.prototype.update = function () {
    var keyboard = this.app.keyboard;
    var x = 0;
    var z = 0;

    if (keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_LEFT)) x -= 1;
    if (keyboard.isPressed(pc.KEY_D) || keyboard.isPressed(pc.KEY_RIGHT)) x += 1;
    if (keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_UP)) z -= 1;
    if (keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_DOWN)) z += 1;

    var pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < pads.length; i++) {
        var pad = pads[i];
        if (!pad) continue;

        var deadzone = 0.18;
        var lx = Math.abs(pad.axes[0]) > deadzone ? pad.axes[0] : 0;
        var ly = Math.abs(pad.axes[1]) > deadzone ? pad.axes[1] : 0;
        var rx = Math.abs(pad.axes[2]) > deadzone ? pad.axes[2] : 0;
        var ry = Math.abs(pad.axes[3]) > deadzone ? pad.axes[3] : 0;

        if (lx || ly || rx || ry) {
            this.lastDevice = pad.id && pad.id.indexOf('Wireless Controller') !== -1 ? 'playstation' : 'xbox';
            x = lx;
            z = ly;
            this.look.set(rx, ry);
        }

        this.jumpPressed = this.jumpPressed || !!(pad.buttons[0] && pad.buttons[0].pressed);
        this.attackPressed = this.attackPressed || !!(pad.buttons[2] && pad.buttons[2].pressed);
        this.interactPressed = this.interactPressed || !!(pad.buttons[3] && pad.buttons[3].pressed);
        this.runHeld = this.runHeld || !!(pad.buttons[10] && pad.buttons[10].pressed);
    }

    this.move.set(x, z);
    if (this.move.lengthSq() > 1) {
        this.move.normalize();
    }
};

LilArtieInput.prototype.consumeJump = function () {
    var pressed = this.jumpPressed;
    this.jumpPressed = false;
    return pressed;
};

LilArtieInput.prototype.consumeAttack = function () {
    var pressed = this.attackPressed;
    this.attackPressed = false;
    return pressed;
};

LilArtieInput.prototype.consumeInteract = function () {
    var pressed = this.interactPressed;
    this.interactPressed = false;
    return pressed;
};
