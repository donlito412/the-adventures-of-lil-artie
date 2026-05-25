var ThirdPersonCameraRig = pc.createScript('thirdPersonCameraRig');

ThirdPersonCameraRig.attributes.add('target', { type: 'entity' });
ThirdPersonCameraRig.attributes.add('distance', { type: 'number', default: 7 });
ThirdPersonCameraRig.attributes.add('height', { type: 'number', default: 3.2 });
ThirdPersonCameraRig.attributes.add('followSpeed', { type: 'number', default: 8 });

ThirdPersonCameraRig.prototype.initialize = function () {
    this.targetPosition = new pc.Vec3();
    this.desiredPosition = new pc.Vec3();
};

ThirdPersonCameraRig.prototype.update = function (dt) {
    if (!this.target) return;

    this.targetPosition.copy(this.target.getPosition());
    this.desiredPosition.set(
        this.targetPosition.x,
        this.targetPosition.y + this.height,
        this.targetPosition.z + this.distance
    );

    this.entity.setPosition(this.entity.getPosition().lerp(this.entity.getPosition(), this.desiredPosition, Math.min(1, dt * this.followSpeed)));
    this.entity.lookAt(this.targetPosition.x, this.targetPosition.y + 1.4, this.targetPosition.z);
};
