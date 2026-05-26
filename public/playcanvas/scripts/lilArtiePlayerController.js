var LilArtiePlayerController = pc.createScript('lilArtiePlayerController');

LilArtiePlayerController.attributes.add('inputEntity', { type: 'entity' });
LilArtiePlayerController.attributes.add('cameraEntity', { type: 'entity' });
LilArtiePlayerController.attributes.add('walkSpeed', { type: 'number', default: 4.2 });
LilArtiePlayerController.attributes.add('runSpeed', { type: 'number', default: 7.2 });
LilArtiePlayerController.attributes.add('jumpForce', { type: 'number', default: 6.5 });
LilArtiePlayerController.attributes.add('staminaMax', { type: 'number', default: 100 });
LilArtiePlayerController.attributes.add('staminaDrainPerSecond', { type: 'number', default: 18 });
LilArtiePlayerController.attributes.add('staminaRecoverPerSecond', { type: 'number', default: 12 });

LilArtiePlayerController.prototype.initialize = function () {
    this.velocity = new pc.Vec3();
    this.forward = new pc.Vec3();
    this.right = new pc.Vec3();
    this.direction = new pc.Vec3();
    this.nextPosition = new pc.Vec3();
    this.stamina = this.staminaMax;
    this.health = 100;
    this.grounded = true;
    this.animComponents = [];
    this.collectAnimComponents(this.entity);
    this.setAnimationMoving(false);
};

LilArtiePlayerController.prototype.collectAnimComponents = function (entity) {
    if (!entity) return;
    if (entity.anim) {
        this.animComponents.push(entity.anim);
    }

    for (var i = 0; i < entity.children.length; i++) {
        this.collectAnimComponents(entity.children[i]);
    }
};

LilArtiePlayerController.prototype.setAnimationMoving = function (moving) {
    for (var i = 0; i < this.animComponents.length; i++) {
        this.animComponents[i].speed = moving ? 1 : 0;
    }
};

LilArtiePlayerController.prototype.update = function (dt) {
    var input = this.inputEntity && this.inputEntity.script && this.inputEntity.script.lilArtieInput;
    if (!input) return;

    var move = input.move;
    var hasMoveInput = move.lengthSq() > 0.04;
    var running = input.runHeld && hasMoveInput && this.stamina > 0;
    var speed = running ? this.runSpeed : this.walkSpeed;

    this.direction.set(0, 0, 0);

    if (this.cameraEntity && hasMoveInput) {
        this.forward.copy(this.cameraEntity.forward);
        this.forward.y = 0;
        this.forward.normalize();

        this.right.copy(this.cameraEntity.right);
        this.right.y = 0;
        this.right.normalize();

        this.direction.add(this.right.clone().scale(move.x));
        this.direction.add(this.forward.clone().scale(-move.y));
    } else if (hasMoveInput) {
        this.direction.set(move.x, 0, move.y);
    }

    if (hasMoveInput && this.direction.lengthSq() > 0.001) {
        this.direction.normalize();
        this.nextPosition.copy(this.entity.getPosition());
        this.nextPosition.x += this.direction.x * speed * dt;
        this.nextPosition.z += this.direction.z * speed * dt;
        this.entity.setPosition(this.nextPosition);
        this.entity.lookAt(this.nextPosition.clone().add(this.direction));
    }

    this.setAnimationMoving(hasMoveInput);

    if (running) {
        this.stamina = Math.max(0, this.stamina - this.staminaDrainPerSecond * dt);
    } else {
        this.stamina = Math.min(this.staminaMax, this.stamina + this.staminaRecoverPerSecond * dt);
    }

    if (input.consumeJump() && this.grounded) {
        this.velocity.y = this.jumpForce;
        this.grounded = false;
    }

    if (!this.grounded) {
        this.velocity.y -= 18 * dt;
        this.entity.translate(0, this.velocity.y * dt, 0);
        if (this.entity.getPosition().y <= 1) {
            var pos = this.entity.getPosition();
            pos.y = 1;
            this.entity.setPosition(pos);
            this.velocity.y = 0;
            this.grounded = true;
        }
    }
};
