/**
 * playerMovement.ts — Handles player movement, jumping, and physics integration.
 */

import { Mesh, Ray, Vector3, Scene } from '@babylonjs/core';
import { PhysicsAggregate, PhysicsShapeType } from '../core/physics';
import { InputManager } from '../input/inputManager';
import { PlayerStats } from './playerStats';
import { PlayerStamina } from './playerStamina';
import { GameConfig } from '../core/config';
import { ClimbingSystem } from '../traversal/climbing';
import { GlidingSystem } from '../traversal/gliding';
import { LedgeGrabSystem } from '../traversal/ledgeGrab';
import { SwimmingSystem } from '../traversal/swimming';
import { WhipSwingSystem } from '../traversal/whipSwing';

export type MovementState =
  | 'idle'
  | 'walking'
  | 'running'
  | 'jumping'
  | 'falling'
  | 'landing'
  | 'climbing'
  | 'gliding'
  | 'swimming'
  | 'sliding'
  | 'dodging';

export class PlayerMovement {
  private mesh: Mesh;
  private aggregate!: PhysicsAggregate;
  private input: InputManager;
  private stats: PlayerStats;
  private stamina: PlayerStamina;
  private scene: Scene;

  private state: MovementState = 'idle';
  private isGrounded: boolean = false;
  private coyoteTimer: number = 0;
  private readonly COYOTE_TIME = 0.12;
  private jumpCooldown: number = 0;
  private dodgeTimer: number = 0;
  private dodgeCooldown: number = 0;
  private lastMoveDirection = new Vector3(0, 0, 1);
  private climbing: ClimbingSystem;
  private gliding: GlidingSystem;
  private ledgeGrab: LedgeGrabSystem;
  private swimming: SwimmingSystem;
  private whipSwing: WhipSwingSystem;
  private lastGrounded = false;
  private lastVerticalVelocity = 0;

  constructor(mesh: Mesh, scene: Scene, input: InputManager, stats: PlayerStats, stamina: PlayerStamina) {
    this.mesh = mesh;
    this.scene = scene;
    this.input = input;
    this.stats = stats;
    this.stamina = stamina;
    this.climbing = new ClimbingSystem(scene, mesh);
    this.gliding = new GlidingSystem(mesh);
    this.ledgeGrab = new LedgeGrabSystem(scene, mesh);
    this.swimming = new SwimmingSystem(scene, mesh);
    this.whipSwing = new WhipSwingSystem(scene, mesh);
  }

  initPhysics(): void {
    this.aggregate = new PhysicsAggregate(
      this.mesh,
      PhysicsShapeType.CAPSULE,
      { mass: 70, restitution: 0, friction: 0.8 },
      this.scene
    );
    // Lock rotation so capsule doesn't tip over
    this.aggregate.body.setMassProperties({ inertia: Vector3.Zero() });
  }

  update(deltaTime: number, cameraYaw: number): void {
    this.lastGrounded = this.isGrounded;
    this.lastVerticalVelocity = this.getVerticalVelocity();
    this.checkGrounded();
    this.swimming.checkWater();

    if (this.isGrounded && !this.lastGrounded) {
      this.applyFallDamage(this.lastVerticalVelocity);
    }

    if (!this.isGrounded) {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - deltaTime);
    } else {
      this.coyoteTimer = this.COYOTE_TIME;
    }

    if (this.jumpCooldown > 0) this.jumpCooldown -= deltaTime;
    if (this.dodgeCooldown > 0) this.dodgeCooldown -= deltaTime;

    const axes = this.input.axes;
    const isRunning = this.input.isPressed('run') && this.stats.hasStamina && !this.stamina.isExhausted;
    const hasMovement = Math.abs(axes.moveX) > 0.05 || Math.abs(axes.moveY) > 0.05;
    const moveDirection = this.getCameraRelativeMoveDirection(axes.moveX, axes.moveY, cameraYaw);

    if (hasMovement) {
      this.lastMoveDirection = moveDirection.clone();
    }

    if (this.input.wasJustPressed('dodge') && this.canDodge()) {
      this.startDodge(moveDirection);
    }

    if (this.handleWhipSwing(deltaTime, moveDirection)) {
      return;
    }

    if (this.handleLedgeGrab()) {
      return;
    }

    if (this.handleClimbing(deltaTime, axes.moveY)) {
      return;
    }

    if (this.handleGliding()) {
      this.state = 'gliding';
    }

    if (this.dodgeTimer > 0) {
      this.updateDodge(deltaTime);
      this.stamina.update(deltaTime, false, false);
      return;
    }

    // Determine movement state
    if (!this.isGrounded && this.state !== 'gliding') {
      this.state = 'falling';
    } else if (this.isGrounded) {
      if (!hasMovement) this.state = 'idle';
      else if (isRunning) this.state = 'running';
      else this.state = 'walking';
    }

    // Apply horizontal movement relative to camera
    if (hasMovement) {
      const speed = isRunning ? GameConfig.PLAYER_RUN_SPEED : GameConfig.PLAYER_WALK_SPEED;
      let velocity = new Vector3(moveDirection.x * speed, this.getVerticalVelocity(), moveDirection.z * speed);
      velocity = this.applyAirTraversalPhysics(velocity, deltaTime);
      this.aggregate.body.setLinearVelocity(velocity);

      // Rotate mesh to face movement direction
      const angle = Math.atan2(moveDirection.x, moveDirection.z);
      this.mesh.rotation.y = angle;
    } else {
      const vel = this.aggregate.body.getLinearVelocity();
      const traversalVelocity = this.applyAirTraversalPhysics(new Vector3(0, vel.y, 0), deltaTime);
      this.aggregate.body.setLinearVelocity(traversalVelocity);
    }

    // Jump
    if (this.input.wasJustPressed('jump') && this.coyoteTimer > 0 && this.jumpCooldown <= 0) {
      const vel = this.aggregate.body.getLinearVelocity();
      this.aggregate.body.setLinearVelocity(new Vector3(vel.x, GameConfig.PLAYER_JUMP_FORCE, vel.z));
      this.coyoteTimer = 0;
      this.jumpCooldown = 0.3;
      this.state = 'jumping';
    }

    // Stamina update
    this.stamina.update(
      deltaTime,
      isRunning && hasMovement && this.isGrounded,
      false
    );
  }

  private checkGrounded(): void {
    const ray = new Ray(
      this.mesh.position.add(new Vector3(0, 0.05, 0)),
      Vector3.Down(),
      1.05
    );
    const hit = this.scene.pickWithRay(ray, mesh => mesh !== this.mesh && mesh.isPickable);
    const vel = this.getVerticalVelocity();
    this.isGrounded = !!hit?.hit && vel <= 0.75;
    if (this.isGrounded) {
      this.gliding.stopGlide();
    }
  }

  private getVerticalVelocity(): number {
    return this.aggregate?.body.getLinearVelocity().y ?? 0;
  }

  get movementState(): MovementState {
    return this.state;
  }

  get grounded(): boolean {
    return this.isGrounded;
  }

  get position(): Vector3 {
    return this.mesh.position;
  }

  teleport(position: Vector3): void {
    this.mesh.position = position.clone();
    this.aggregate?.body.setLinearVelocity(Vector3.Zero());
  }

  private getCameraRelativeMoveDirection(moveX: number, moveY: number, cameraYaw: number): Vector3 {
    const worldDir = new Vector3(moveX, 0, moveY);
    if (worldDir.lengthSquared() < 0.0001) return this.lastMoveDirection.clone();

    const cos = Math.cos(cameraYaw);
    const sin = Math.sin(cameraYaw);
    return new Vector3(
      worldDir.x * cos - worldDir.z * sin,
      0,
      worldDir.x * sin + worldDir.z * cos
    ).normalize();
  }

  private canDodge(): boolean {
    return (
      this.isGrounded &&
      this.dodgeCooldown <= 0 &&
      this.dodgeTimer <= 0 &&
      this.stamina.canSpend(GameConfig.PLAYER_DODGE_STAMINA_COST)
    );
  }

  private startDodge(direction: Vector3): void {
    const dodgeState: MovementState = this.input.isPressed('run') ? 'sliding' : 'dodging';
    const dodgeDirection = direction.lengthSquared() > 0.0001
      ? direction
      : this.lastMoveDirection;

    this.stamina.spend(GameConfig.PLAYER_DODGE_STAMINA_COST);
    this.dodgeTimer = GameConfig.PLAYER_DODGE_DURATION;
    this.dodgeCooldown = 0.45;
    this.state = dodgeState;
    this.mesh.rotation.y = Math.atan2(dodgeDirection.x, dodgeDirection.z);
    this.aggregate.body.setLinearVelocity(new Vector3(
      dodgeDirection.x * GameConfig.PLAYER_DODGE_SPEED,
      this.getVerticalVelocity(),
      dodgeDirection.z * GameConfig.PLAYER_DODGE_SPEED
    ));
  }

  private updateDodge(deltaTime: number): void {
    this.dodgeTimer = Math.max(0, this.dodgeTimer - deltaTime);
    if (this.dodgeTimer <= 0) {
      const vel = this.aggregate.body.getLinearVelocity();
      this.aggregate.body.setLinearVelocity(new Vector3(0, vel.y, 0));
      this.state = this.isGrounded ? 'idle' : 'falling';
    }
  }

  private handleClimbing(deltaTime: number, moveY: number): boolean {
    const climbSurface = this.climbing.checkForClimbableSurface();
    const wantsClimb = this.input.isPressed('climbUp') || this.input.isPressed('jump');

    if (climbSurface && wantsClimb && this.stamina.canSpend(GameConfig.PLAYER_CLIMB_STAMINA_DRAIN * deltaTime)) {
      if (!this.climbing.climbing) {
        this.climbing.startClimbing(climbSurface);
      }
      this.aggregate.body.setLinearVelocity(Vector3.Zero());
      const climbInput = moveY < -0.05 ? 1 : 0.6;
      this.climbing.updateClimb(climbInput, GameConfig.PLAYER_CLIMB_SPEED, deltaTime);
      this.stamina.spend(GameConfig.PLAYER_CLIMB_STAMINA_DRAIN * deltaTime);
      this.state = 'climbing';
      return true;
    }

    if (this.climbing.climbing) {
      this.climbing.stopClimbing();
    }
    return false;
  }

  private handleLedgeGrab(): boolean {
    if (this.ledgeGrab.hanging) {
      this.aggregate.body.setLinearVelocity(Vector3.Zero());
      if (this.input.wasJustPressed('jump') || this.input.wasJustPressed('climbUp')) {
        this.ledgeGrab.pullUp();
        this.aggregate.body.setLinearVelocity(Vector3.Zero());
      }
      this.state = 'climbing';
      return true;
    }

    if (!this.isGrounded && this.getVerticalVelocity() <= 1 && this.ledgeGrab.detectLedge()) {
      this.ledgeGrab.grab();
      this.aggregate.body.setLinearVelocity(Vector3.Zero());
      this.state = 'climbing';
      return true;
    }

    return false;
  }

  private handleGliding(): boolean {
    if (this.input.isPressed('glide') && !this.isGrounded && this.stats.hasStamina) {
      return this.gliding.startGlide(this.isGrounded);
    }

    if (this.gliding.gliding) {
      this.gliding.stopGlide();
    }
    return false;
  }

  private handleWhipSwing(deltaTime: number, moveDirection: Vector3): boolean {
    if (this.whipSwing.swinging) {
      if (!this.input.isPressed('attackSecondary') && !this.input.isPressed('interact')) {
        this.whipSwing.release();
        return false;
      }
      this.whipSwing.update(deltaTime);
      const swingVelocity = moveDirection.scale(GameConfig.PLAYER_WALK_SPEED);
      this.aggregate.body.setLinearVelocity(new Vector3(swingVelocity.x, this.getVerticalVelocity(), swingVelocity.z));
      this.state = 'gliding';
      return true;
    }

    if (this.input.wasJustPressed('attackSecondary') || this.input.wasJustPressed('interact')) {
      const anchor = this.findSwingPoint();
      if (anchor) {
        this.whipSwing.attachToAnchor(anchor);
        this.state = 'gliding';
        return true;
      }
    }

    return false;
  }

  private findSwingPoint(): Vector3 | null {
    const candidates = this.scene.meshes.filter(mesh => mesh.metadata?.swingPoint);
    let nearest: Vector3 | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const mesh of candidates) {
      const distance = Vector3.Distance(this.mesh.position, mesh.getAbsolutePosition());
      if (distance < 8 && distance < nearestDistance) {
        nearest = mesh.getAbsolutePosition().clone();
        nearestDistance = distance;
      }
    }

    return nearest;
  }

  private applyAirTraversalPhysics(velocity: Vector3, deltaTime: number): Vector3 {
    let nextVelocity = velocity;
    if (this.gliding.gliding && this.stamina.canSpend(GameConfig.PLAYER_GLIDE_STAMINA_DRAIN * deltaTime)) {
      nextVelocity = this.gliding.applyGlide(nextVelocity);
      this.stamina.spend(GameConfig.PLAYER_GLIDE_STAMINA_DRAIN * deltaTime);
    }

    if (this.swimming.submerged) {
      nextVelocity = this.swimming.applyWaterPhysics(nextVelocity, deltaTime);
      if (this.input.isPressed('jump')) {
        this.swimming.swimUp(deltaTime);
      }
      this.state = 'swimming';
    }

    return nextVelocity;
  }

  private applyFallDamage(verticalVelocity: number): void {
    const impactSpeed = Math.abs(Math.min(0, verticalVelocity));
    if (impactSpeed <= GameConfig.FALL_DAMAGE_THRESHOLD) return;

    const damage = Math.round((impactSpeed - GameConfig.FALL_DAMAGE_THRESHOLD) * 4);
    this.stats.takeDamage(damage);
  }
}
