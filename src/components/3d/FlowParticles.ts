import * as THREE from 'three';

export interface ParticleSystemController {
  group: THREE.Group;
  update: (
    delta: number, 
    flowMode: 'BOTH' | 'POWER' | 'DATA' | 'OFF', 
    isRelayOpen: boolean, 
    isAbnormal: boolean, 
    isCritical: boolean
  ) => void;
}

export function createFlowParticles(): ParticleSystemController {
  const group = new THREE.Group();

  // 1. Waypoints
  // Power Path: AC In -> Protection -> CT -> Relay -> Load Out
  const powerWaypoints = [
    new THREE.Vector3(-1.3, 0.22, -0.65),
    new THREE.Vector3(-0.85, 0.25, -0.5),
    new THREE.Vector3(-0.35, 0.38, 0.15),
    new THREE.Vector3(0.95, 0.35, 0.55),
    new THREE.Vector3(1.3, 0.22, 0.65)
  ];
  const powerCurve = new THREE.CatmullRomCurve3(powerWaypoints);

  // Data Path: Sensors -> Metering IC -> MCU -> Comm Module
  const dataWaypoints = [
    new THREE.Vector3(-0.35, 0.35, 0.15),
    new THREE.Vector3(0.1, 0.22, 0.0),
    new THREE.Vector3(0.75, 0.22, 0.05),
    new THREE.Vector3(1.25, 0.25, -0.6)
  ];
  const dataCurve = new THREE.CatmullRomCurve3(dataWaypoints);

  // 2. Power Particles
  const POWER_COUNT = 45;
  const powerGeo = new THREE.BufferGeometry();
  const powerPositions = new Float32Array(POWER_COUNT * 3);
  const powerOffsets = new Float32Array(POWER_COUNT);
  for (let i = 0; i < POWER_COUNT; i++) {
    powerOffsets[i] = i / POWER_COUNT;
  }
  powerGeo.setAttribute('position', new THREE.BufferAttribute(powerPositions, 3));

  const powerMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.07,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const powerPoints = new THREE.Points(powerGeo, powerMat);
  group.add(powerPoints);

  // 3. Data Particles
  const DATA_COUNT = 30;
  const dataGeo = new THREE.BufferGeometry();
  const dataPositions = new Float32Array(DATA_COUNT * 3);
  const dataOffsets = new Float32Array(DATA_COUNT);
  for (let i = 0; i < DATA_COUNT; i++) {
    dataOffsets[i] = i / DATA_COUNT;
  }
  dataGeo.setAttribute('position', new THREE.BufferAttribute(dataPositions, 3));

  const dataMat = new THREE.PointsMaterial({
    color: 0x00a8ff,
    size: 0.06,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const dataPoints = new THREE.Points(dataGeo, dataMat);
  group.add(dataPoints);

  // 4. Subtle Flow Tube Lines
  const powerLineGeo = new THREE.TubeGeometry(powerCurve, 40, 0.015, 8, false);
  const powerLineMat = new THREE.MeshBasicMaterial({
    color: 0x0077aa,
    transparent: true,
    opacity: 0.25
  });
  const powerTube = new THREE.Mesh(powerLineGeo, powerLineMat);
  group.add(powerTube);

  const dataLineGeo = new THREE.TubeGeometry(dataCurve, 30, 0.012, 8, false);
  const dataLineMat = new THREE.MeshBasicMaterial({
    color: 0x005588,
    transparent: true,
    opacity: 0.25
  });
  const dataTube = new THREE.Mesh(dataLineGeo, dataLineMat);
  group.add(dataTube);

  let powerProgress = 0;
  let dataProgress = 0;

  const update = (
    delta: number,
    flowMode: 'BOTH' | 'POWER' | 'DATA' | 'OFF',
    isRelayOpen: boolean,
    isAbnormal: boolean,
    isCritical: boolean
  ) => {
    const showPower = flowMode === 'BOTH' || flowMode === 'POWER';
    const showData = flowMode === 'BOTH' || flowMode === 'DATA';

    powerPoints.visible = showPower;
    powerTube.visible = showPower;
    dataPoints.visible = showData;
    dataTube.visible = showData;

    // Power color logic
    if (isCritical) {
      powerMat.color.setHex(0xff1744);
      dataMat.color.setHex(0xff1744);
    } else if (isAbnormal) {
      powerMat.color.setHex(0xffb300);
      dataMat.color.setHex(0xffb300);
    } else {
      powerMat.color.setHex(0x00f0ff);
      dataMat.color.setHex(0x00a8ff);
    }

    // If relay is open, power flow ceases!
    if (isRelayOpen) {
      powerMat.opacity = 0.15;
    } else {
      powerMat.opacity = 0.9;
      powerProgress += delta * 0.45;
      if (powerProgress > 1.0) powerProgress -= 1.0;

      const pPos = powerGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < POWER_COUNT; i++) {
        const t = (powerOffsets[i] + powerProgress) % 1.0;
        const pt = powerCurve.getPointAt(t);
        pPos[i * 3] = pt.x;
        pPos[i * 3 + 1] = pt.y;
        pPos[i * 3 + 2] = pt.z;
      }
      powerGeo.attributes.position.needsUpdate = true;
    }

    // Data flow pulses
    dataProgress += delta * 0.65;
    if (dataProgress > 1.0) dataProgress -= 1.0;

    const dPos = dataGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < DATA_COUNT; i++) {
      const t = (dataOffsets[i] + dataProgress) % 1.0;
      const pt = dataCurve.getPointAt(t);
      dPos[i * 3] = pt.x;
      dPos[i * 3 + 1] = pt.y;
      dPos[i * 3 + 2] = pt.z;
    }
    dataGeo.attributes.position.needsUpdate = true;
  };

  return {
    group,
    update
  };
}
