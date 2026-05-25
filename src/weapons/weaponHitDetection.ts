import { Mesh, Scene, Vector3 } from '@babylonjs/core';
import { EnemyBase } from '../enemies/enemyBase';

export interface EnemyHit {
  id: string;
  enemy: EnemyBase;
  mesh: Mesh;
  distance: number;
}

export function findEnemyHits(scene: Scene, origin: Vector3, radius: number): EnemyHit[] {
  const hits: EnemyHit[] = [];

  for (const mesh of scene.meshes) {
    const enemy = mesh.metadata?.enemy as EnemyBase | undefined;
    const enemyId = mesh.metadata?.enemyId as string | undefined;
    if (!enemy || !enemyId || !enemy.isAlive) continue;

    const distance = Vector3.Distance(mesh.getAbsolutePosition(), origin);
    if (distance <= radius) {
      hits.push({ id: enemyId, enemy, mesh: mesh as Mesh, distance });
    }
  }

  return hits.sort((a, b) => a.distance - b.distance);
}

export function findEnemyHitsInCone(
  scene: Scene,
  origin: Vector3,
  direction: Vector3,
  range: number,
  halfAngleRadians: number
): EnemyHit[] {
  const dir = direction.normalize();
  const hits: EnemyHit[] = [];

  for (const mesh of scene.meshes) {
    const enemy = mesh.metadata?.enemy as EnemyBase | undefined;
    const enemyId = mesh.metadata?.enemyId as string | undefined;
    if (!enemy || !enemyId || !enemy.isAlive) continue;

    const toEnemy = mesh.getAbsolutePosition().subtract(origin);
    const distance = toEnemy.length();
    if (distance > range || distance <= 0.001) continue;

    const angle = Math.acos(Math.max(-1, Math.min(1, Vector3.Dot(dir, toEnemy.normalize()))));
    if (angle <= halfAngleRadians) {
      hits.push({ id: enemyId, enemy, mesh: mesh as Mesh, distance });
    }
  }

  return hits.sort((a, b) => a.distance - b.distance);
}
