import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2020',
    title: 'first job',
    subtitle: 'frontend',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2021',
    title: 'XPrep',
    subtitle: 'Frontend Intern',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: '?',
    subtitle: '???',
    position: 'right',
  }
]