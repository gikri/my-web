import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2001',
    title: 'Hello World!',
    subtitle: '출생 (Born)',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-3, -1, -4),
    year: '2020',
    title: 'Military',
    subtitle: '입대',
    position: 'left',
  },
  {
    point: new THREE.Vector3(2, -5, -7),
    year: '2022',
    title: 'First Job',
    subtitle: 'Frontend Developer',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-2, 1, -12),
    year: '2024',
    title: 'Freelancer',
    subtitle: 'Web App Developer',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -16),
    year: new Date().getFullYear().toString(),
    title: '...',
    subtitle: 'To Be Continued',
    position: 'right',
  }
];