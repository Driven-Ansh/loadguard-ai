import * as THREE from 'three';

export interface Hardware3DScene {
  group: THREE.Group;
  componentsMap: Map<string, THREE.Object3D>;
  relayArmature: THREE.Object3D | null;
  statusLeds: {
    powerLed: THREE.Mesh;
    statusLed: THREE.Mesh;
    protectLed: THREE.Mesh;
  };
  updateExploded: (progress: number) => void;
  updateRelay: (isOpen: boolean) => void;
  updateVariant: (variant: 'HOUSEHOLD' | 'INDUSTRIAL') => void;
  updateCasing: (mode: 'OPAQUE' | 'TRANSPARENT' | 'OFF') => void;
  highlightComponent: (id: string | null, isAbnormal: boolean, isCritical: boolean) => void;
}

export function buildProceduralHardware(): Hardware3DScene {
  const rootGroup = new THREE.Group();
  const componentsMap = new Map<string, THREE.Object3D>();

  // Exploded view tracking list: { obj, basePos, explodeOffset }
  const explodedItems: { obj: THREE.Object3D; basePos: THREE.Vector3; offset: THREE.Vector3 }[] = [];

  const registerExploded = (obj: THREE.Object3D, offset: THREE.Vector3) => {
    explodedItems.push({
      obj,
      basePos: obj.position.clone(),
      offset
    });
  };

  // Premium Industrial Materials
  const pcbMaterial = new THREE.MeshStandardMaterial({
    color: 0x072217, // Deep dark green FR4
    roughness: 0.35,
    metalness: 0.15
  });

  const goldPadMaterial = new THREE.MeshStandardMaterial({
    color: 0xe5b838, // Real ENIG gold finish
    metalness: 0.95,
    roughness: 0.15
  });

  const casingOpaqueMat = new THREE.MeshStandardMaterial({
    color: 0x0f1422, // Matte industrial charcoal navy
    roughness: 0.5,
    metalness: 0.35
  });

  const casingLidMat = new THREE.MeshPhysicalMaterial({
    color: 0x162238,
    roughness: 0.12,
    metalness: 0.08,
    transmission: 0.78, // Translucent smoky acrylic
    thickness: 1.0,
    ior: 1.45,
    transparent: true,
    opacity: 0.58
  });

  const dinRailMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // Brushed galvanized steel
    metalness: 0.9,
    roughness: 0.25
  });

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xd97736, // Vivid pure copper
    metalness: 0.9,
    roughness: 0.22
  });

  const terminalMat = new THREE.MeshStandardMaterial({
    color: 0x1e2638,
    roughness: 0.6,
    metalness: 0.2
  });

  const brassScrewMat = new THREE.MeshStandardMaterial({
    color: 0xdfab35,
    metalness: 0.92,
    roughness: 0.18
  });

  const silverContactMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.96,
    roughness: 0.12
  });

  const chipMat = new THREE.MeshStandardMaterial({
    color: 0x0b0e14,
    roughness: 0.38,
    metalness: 0.25
  });

  const silverShieldMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.92,
    roughness: 0.18
  });

  // 1. BASE ENCLOSURE & DIN RAIL
  const enclosureGroup = new THREE.Group();
  rootGroup.add(enclosureGroup);

  // Household Case Base with subtle rounded bevel feel
  const householdBaseGeo = new THREE.BoxGeometry(3.6, 0.4, 2.4);
  const householdBase = new THREE.Mesh(householdBaseGeo, casingOpaqueMat);
  householdBase.position.set(0, -0.2, 0);
  householdBase.castShadow = true;
  householdBase.receiveShadow = true;
  enclosureGroup.add(householdBase);
  registerExploded(householdBase, new THREE.Vector3(0, -0.6, 0));

  // Industrial DIN-Rail Chassis attachment
  const dinRailBase = new THREE.Group();
  const railGeo = new THREE.BoxGeometry(4.0, 0.15, 0.8);
  const railMesh = new THREE.Mesh(railGeo, dinRailMat);
  railMesh.position.set(0, -0.5, 0);
  dinRailBase.add(railMesh);

  // DIN rail latch clips
  const clipGeo = new THREE.BoxGeometry(0.5, 0.25, 0.9);
  const clipMesh = new THREE.Mesh(clipGeo, terminalMat);
  clipMesh.position.set(0, -0.4, 0);
  dinRailBase.add(clipMesh);
  dinRailBase.visible = false;
  enclosureGroup.add(dinRailBase);

  // 2. MAIN PCB BOARD
  const pcbGroup = new THREE.Group();
  rootGroup.add(pcbGroup);

  const pcbGeo = new THREE.BoxGeometry(3.2, 0.08, 2.0);
  const pcbMesh = new THREE.Mesh(pcbGeo, pcbMaterial);
  pcbMesh.position.set(0, 0.04, 0);
  pcbMesh.receiveShadow = true;
  pcbGroup.add(pcbMesh);
  registerExploded(pcbGroup, new THREE.Vector3(0, 0, 0));

  // 4 PCB Standoff Brass Screws in corners
  const standoffGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.09, 16);
  const corners = [
    [-1.48, -0.88],
    [1.48, -0.88],
    [-1.48, 0.88],
    [1.48, 0.88]
  ];
  corners.forEach(([cx, cz]) => {
    const screw = new THREE.Mesh(standoffGeo, silverShieldMat);
    screw.position.set(cx, 0.05, cz);
    pcbGroup.add(screw);

    // Standoff pad ring
    const ringGeo = new THREE.RingGeometry(0.065, 0.11, 16);
    const ring = new THREE.Mesh(ringGeo, goldPadMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(cx, 0.085, cz);
    pcbGroup.add(ring);
  });

  // Decorative gold traces & silkscreen on PCB
  const traceGeo = new THREE.BoxGeometry(2.8, 0.01, 0.035);
  for (let i = -0.7; i <= 0.7; i += 0.35) {
    const trace = new THREE.Mesh(traceGeo, goldPadMaterial);
    trace.position.set(0, 0.082, i);
    pcbGroup.add(trace);
  }

  // Cross bus traces
  const crossTraceGeo = new THREE.BoxGeometry(0.035, 0.01, 1.6);
  [-0.6, 0.0, 0.6].forEach(posX => {
    const cTrace = new THREE.Mesh(crossTraceGeo, goldPadMaterial);
    cTrace.position.set(posX, 0.082, 0);
    pcbGroup.add(cTrace);
  });

  // 3. TOP ENCLOSURE LID
  const topLidGeo = new THREE.BoxGeometry(3.6, 0.5, 2.4);
  const topLid = new THREE.Mesh(topLidGeo, casingLidMat);
  topLid.position.set(0, 0.9, 0);
  topLid.castShadow = true;
  rootGroup.add(topLid);
  registerExploded(topLid, new THREE.Vector3(0, 1.2, 0));

  // Function to tag components for raycasting
  const tagComponent = (obj: THREE.Object3D, id: string, name: string) => {
    obj.userData = { componentId: id, componentName: name, isInteractive: true };
    obj.traverse((child) => {
      child.userData = { componentId: id, componentName: name, isInteractive: true };
    });
    componentsMap.set(id, obj);
  };

  // Helper to create screw terminal block
  const createTerminalBlock = (id: string, name: string, pos: THREE.Vector3, labelText: string) => {
    const block = new THREE.Group();
    block.position.copy(pos);

    const bodyGeo = new THREE.BoxGeometry(0.6, 0.45, 0.6);
    const body = new THREE.Mesh(bodyGeo, terminalMat);
    body.position.set(0, 0.22, 0);
    block.add(body);

    // 2 brass terminal screws
    const screwGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16);
    for (let s = -0.15; s <= 0.15; s += 0.3) {
      const screw = new THREE.Mesh(screwGeo, brassScrewMat);
      screw.position.set(s, 0.45, 0);
      block.add(screw);
    }

    tagComponent(block, id, name);
    pcbGroup.add(block);
    registerExploded(block, new THREE.Vector3(pos.x * 0.4, 0.3, pos.z * 0.4));
    return block;
  };

  // A. AC Input Terminal Block
  createTerminalBlock('ac_input', 'AC Input Terminal Block', new THREE.Vector3(-1.3, 0.08, -0.65), 'AC_IN');

  // K. Load Output Terminal Block
  createTerminalBlock('load_output', 'Load Output Terminal Block', new THREE.Vector3(1.3, 0.08, 0.65), 'LOAD_OUT');

  // B. Protection Section (MOV + Ceramic Fuse + Gas Tube)
  const protGroup = new THREE.Group();
  protGroup.position.set(-0.85, 0.08, -0.5);

  // Blue MOV disc
  const movGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 24);
  const movMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4 });
  const movMesh = new THREE.Mesh(movGeo, movMat);
  movMesh.rotation.x = Math.PI / 2;
  movMesh.position.set(-0.15, 0.2, 0);
  protGroup.add(movMesh);

  // Ceramic fuse tube
  const fuseGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.4, 16);
  const fuseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2 });
  const fuseMesh = new THREE.Mesh(fuseGeo, fuseMat);
  fuseMesh.rotation.z = Math.PI / 2;
  fuseMesh.position.set(0.15, 0.15, 0);
  protGroup.add(fuseMesh);

  tagComponent(protGroup, 'protection_module', 'Primary Protection Section');
  pcbGroup.add(protGroup);
  registerExploded(protGroup, new THREE.Vector3(-0.3, 0.3, -0.2));

  // C. Current Sensor (Toroidal Current Transformer)
  const ctGroup = new THREE.Group();
  ctGroup.position.set(-0.35, 0.08, 0.15);

  // Toroid Ring
  const toroidGeo = new THREE.TorusGeometry(0.24, 0.09, 16, 32);
  const toroidMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const toroidMesh = new THREE.Mesh(toroidGeo, toroidMat);
  toroidMesh.rotation.y = Math.PI / 2;
  toroidMesh.position.set(0, 0.3, 0);
  ctGroup.add(toroidMesh);

  // Copper coil windings
  const wireGeo = new THREE.TorusGeometry(0.25, 0.02, 8, 24);
  for (let w = -0.15; w <= 0.15; w += 0.06) {
    const wire = new THREE.Mesh(wireGeo, copperMat);
    wire.rotation.y = Math.PI / 2;
    wire.position.set(w, 0.3, 0);
    ctGroup.add(wire);
  }

  // Thick primary copper busbar through center hole
  const busbarGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16);
  const busbar = new THREE.Mesh(busbarGeo, copperMat);
  busbar.rotation.z = Math.PI / 2;
  busbar.position.set(0, 0.3, 0);
  ctGroup.add(busbar);

  tagComponent(ctGroup, 'current_sensor', 'Toroidal Current Transformer (CT)');
  pcbGroup.add(ctGroup);
  registerExploded(ctGroup, new THREE.Vector3(-0.1, 0.4, 0.1));

  // D. Voltage Sensor
  const vsGroup = new THREE.Group();
  vsGroup.position.set(0.25, 0.08, -0.6);
  const vsGeo = new THREE.BoxGeometry(0.3, 0.12, 0.2);
  const vsMesh = new THREE.Mesh(vsGeo, chipMat);
  vsMesh.position.set(0, 0.06, 0);
  vsGroup.add(vsMesh);
  tagComponent(vsGroup, 'voltage_sensor', 'Precision Voltage Sensing Section');
  pcbGroup.add(vsGroup);
  registerExploded(vsGroup, new THREE.Vector3(0.1, 0.3, -0.2));

  // E. Dedicated Energy Metering IC (with silver pins)
  const meterGroup = new THREE.Group();
  meterGroup.position.set(0.1, 0.08, 0.0);
  const meterGeo = new THREE.BoxGeometry(0.36, 0.1, 0.36);
  const meterMesh = new THREE.Mesh(meterGeo, chipMat);
  meterMesh.position.set(0, 0.05, 0);
  meterGroup.add(meterMesh);

  // Silver IC Pins for metering IC
  const pinGeo = new THREE.BoxGeometry(0.04, 0.02, 0.08);
  for (let p = -0.12; p <= 0.12; p += 0.06) {
    const pinL = new THREE.Mesh(pinGeo, silverContactMat);
    pinL.position.set(-0.2, 0.02, p);
    meterGroup.add(pinL);
    const pinR = new THREE.Mesh(pinGeo, silverContactMat);
    pinR.position.set(0.2, 0.02, p);
    meterGroup.add(pinR);
  }

  tagComponent(meterGroup, 'metering_ic', 'Dedicated Energy Metering IC');
  pcbGroup.add(meterGroup);
  registerExploded(meterGroup, new THREE.Vector3(0.0, 0.35, 0.0));

  // F. MCU / Edge AI Processor (with metal RF/EMI shield + laser mark)
  const mcuGroup = new THREE.Group();
  mcuGroup.position.set(0.75, 0.08, 0.05);
  const mcuGeo = new THREE.BoxGeometry(0.52, 0.14, 0.52);
  const mcuMesh = new THREE.Mesh(mcuGeo, silverShieldMat);
  mcuMesh.position.set(0, 0.07, 0);
  mcuMesh.castShadow = true;
  mcuGroup.add(mcuMesh);

  // Laser etched core chip die on shield top
  const dieGeo = new THREE.BoxGeometry(0.32, 0.01, 0.32);
  const dieMesh = new THREE.Mesh(dieGeo, chipMat);
  dieMesh.position.set(0, 0.145, 0);
  mcuGroup.add(dieMesh);

  // Glowing micro AI activity indicator point on MCU
  const mcuLedGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const mcuLedMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const mcuLed = new THREE.Mesh(mcuLedGeo, mcuLedMat);
  mcuLed.position.set(0.18, 0.15, -0.18);
  mcuGroup.add(mcuLed);

  tagComponent(mcuGroup, 'mcu_edge', 'MCU / Edge AI Processor');
  pcbGroup.add(mcuGroup);
  registerExploded(mcuGroup, new THREE.Vector3(0.25, 0.38, 0.05));

  // G. Communication Module & Antenna Trace
  const commGroup = new THREE.Group();
  commGroup.position.set(1.25, 0.08, -0.6);
  const commGeo = new THREE.BoxGeometry(0.35, 0.1, 0.45);
  const commMesh = new THREE.Mesh(commGeo, silverShieldMat);
  commMesh.position.set(0, 0.05, 0);
  commGroup.add(commMesh);

  // PCB Meander antenna trace
  const antGeo = new THREE.BoxGeometry(0.04, 0.02, 0.3);
  const antMesh = new THREE.Mesh(antGeo, goldPadMaterial);
  antMesh.position.set(0.2, 0.05, 0);
  commGroup.add(antMesh);

  tagComponent(commGroup, 'comm_module', 'Communication Module & Antenna');
  pcbGroup.add(commGroup);
  registerExploded(commGroup, new THREE.Vector3(0.4, 0.35, -0.2));

  // H. Temperature Sensor (NTC on thermal shunt)
  const tempGroup = new THREE.Group();
  tempGroup.position.set(0.4, 0.08, 0.6);
  const tempGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.15, 12);
  const tempMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
  const tempMesh = new THREE.Mesh(tempGeo, tempMat);
  tempMesh.position.set(0, 0.08, 0);
  tempGroup.add(tempMesh);
  tagComponent(tempGroup, 'temp_sensor', 'Precision Temperature Sensor');
  pcbGroup.add(tempGroup);
  registerExploded(tempGroup, new THREE.Vector3(0.15, 0.3, 0.25));

  // I. Isolated Power Supply (Flyback Transformer + Electrolytic Cap)
  const psGroup = new THREE.Group();
  psGroup.position.set(-0.85, 0.08, 0.55);

  // Transformer cube with copper tape wrap
  const transGeo = new THREE.BoxGeometry(0.45, 0.4, 0.45);
  const transMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const transMesh = new THREE.Mesh(transGeo, transMat);
  transMesh.position.set(0, 0.2, 0);
  transMesh.castShadow = true;
  psGroup.add(transMesh);

  // Copper flux band on transformer
  const bandGeo = new THREE.BoxGeometry(0.46, 0.12, 0.46);
  const bandMesh = new THREE.Mesh(bandGeo, copperMat);
  bandMesh.position.set(0, 0.2, 0);
  psGroup.add(bandMesh);

  // Electrolytic capacitor cylinder with silver negative stripe
  const capGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.36, 16);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.25 });
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.set(0.3, 0.18, 0);
  capMesh.castShadow = true;
  psGroup.add(capMesh);

  // Cap aluminum top seal
  const capTopGeo = new THREE.CylinderGeometry(0.128, 0.128, 0.02, 16);
  const capTop = new THREE.Mesh(capTopGeo, silverShieldMat);
  capTop.position.set(0.3, 0.36, 0);
  psGroup.add(capTop);

  tagComponent(psGroup, 'power_supply', 'Isolated Switched-Mode Power Supply');
  pcbGroup.add(psGroup);
  registerExploded(psGroup, new THREE.Vector3(-0.3, 0.35, 0.25));

  // J. Deterministic Relay / Contactor Control Section
  const relayGroup = new THREE.Group();
  relayGroup.position.set(0.95, 0.08, 0.55);

  // Crystal clear transparent polycarbonate relay housing
  const relayCaseGeo = new THREE.BoxGeometry(0.56, 0.46, 0.46);
  const relayCaseMat = new THREE.MeshPhysicalMaterial({
    color: 0x94a3b8,
    transmission: 0.88,
    opacity: 0.45,
    transparent: true,
    roughness: 0.08,
    ior: 1.52,
    thickness: 0.6
  });
  const relayCase = new THREE.Mesh(relayCaseGeo, relayCaseMat);
  relayCase.position.set(0, 0.23, 0);
  relayGroup.add(relayCase);

  // Heavy copper electromagnetic coil spool inside relay
  const coilGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.28, 16);
  const coilMesh = new THREE.Mesh(coilGeo, copperMat);
  coilMesh.position.set(-0.12, 0.2, 0);
  relayGroup.add(coilMesh);

  // Mechanical Moving Armature & Solid Silver Contacts
  const armatureGroup = new THREE.Group();
  armatureGroup.position.set(0.08, 0.12, 0);

  const armBladeGeo = new THREE.BoxGeometry(0.04, 0.28, 0.06);
  const armBladeMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
  const armBlade = new THREE.Mesh(armBladeGeo, armBladeMat);
  armBlade.position.set(0, 0.14, 0);
  armatureGroup.add(armBlade);

  // Bright silver contact button on the tip
  const contactTipGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12);
  const contactTip = new THREE.Mesh(contactTipGeo, silverContactMat);
  contactTip.rotation.z = Math.PI / 2;
  contactTip.position.set(0.025, 0.26, 0);
  armatureGroup.add(contactTip);

  // Fixed contact terminal with silver mating pad
  const fixedContactGeo = new THREE.BoxGeometry(0.04, 0.15, 0.06);
  const fixedContact = new THREE.Mesh(fixedContactGeo, armBladeMat);
  fixedContact.position.set(0.16, 0.25, 0);
  relayGroup.add(fixedContact);

  const fixedTip = new THREE.Mesh(contactTipGeo, silverContactMat);
  fixedTip.rotation.z = Math.PI / 2;
  fixedTip.position.set(0.14, 0.26, 0);
  relayGroup.add(fixedTip);

  relayGroup.add(armatureGroup);
  tagComponent(relayGroup, 'relay_section', 'Deterministic Latching Contactor / Relay');
  pcbGroup.add(relayGroup);
  registerExploded(relayGroup, new THREE.Vector3(0.35, 0.4, 0.25));

  // 4. FRONT STATUS LEDs
  const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
  const powerLedMat = new THREE.MeshBasicMaterial({ color: 0x00e676 });
  const powerLed = new THREE.Mesh(ledGeo, powerLedMat);
  powerLed.position.set(-0.3, 0.28, 1.21);
  enclosureGroup.add(powerLed);

  const statusLedMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const statusLed = new THREE.Mesh(ledGeo, statusLedMat);
  statusLed.position.set(0.0, 0.28, 1.21);
  enclosureGroup.add(statusLed);

  const protectLedMat = new THREE.MeshBasicMaterial({ color: 0x00e676 });
  const protectLed = new THREE.Mesh(ledGeo, protectLedMat);
  protectLed.position.set(0.3, 0.28, 1.21);
  enclosureGroup.add(protectLed);

  // Highlight state management
  let highlightedObj: THREE.Object3D | null = null;
  const originalMaterials = new Map<THREE.Mesh, THREE.Material>();

  const highlightComponent = (id: string | null, isAbnormal: boolean, isCritical: boolean) => {
    // Reset previous
    if (highlightedObj) {
      highlightedObj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && originalMaterials.has(child as THREE.Mesh)) {
          (child as THREE.Mesh).material = originalMaterials.get(child as THREE.Mesh)!;
        }
      });
      highlightedObj = null;
    }

    if (!id) return;
    const target = componentsMap.get(id);
    if (!target) return;

    highlightedObj = target;
    const glowColor = isCritical ? 0xff1744 : isAbnormal ? 0xffb300 : 0x00f0ff;
    const highlightMat = new THREE.MeshStandardMaterial({
      color: glowColor,
      emissive: glowColor,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.5
    });

    target.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!originalMaterials.has(mesh)) {
          const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          originalMaterials.set(mesh, mat);
        }
        mesh.material = highlightMat;
      }
    });
  };

  // Update functions
  const updateExploded = (progress: number) => {
    explodedItems.forEach(item => {
      item.obj.position.lerpVectors(item.basePos, item.basePos.clone().add(item.offset), progress);
    });
  };

  const updateRelay = (isOpen: boolean) => {
    if (armatureGroup) {
      // Rotate contact armature away by ~22 degrees when tripped open
      const targetAngle = isOpen ? -0.38 : 0.0;
      armatureGroup.rotation.z = targetAngle;
    }
  };

  const updateVariant = (variant: 'HOUSEHOLD' | 'INDUSTRIAL') => {
    if (variant === 'INDUSTRIAL') {
      dinRailBase.visible = true;
      householdBase.scale.set(1.0, 1.2, 0.9);
    } else {
      dinRailBase.visible = false;
      householdBase.scale.set(1.0, 1.0, 1.0);
    }
  };

  const updateCasing = (mode: 'OPAQUE' | 'TRANSPARENT' | 'OFF') => {
    if (mode === 'OFF') {
      topLid.visible = false;
    } else if (mode === 'OPAQUE') {
      topLid.visible = true;
      (topLid as any).material = casingOpaqueMat;
    } else {
      topLid.visible = true;
      (topLid as any).material = casingLidMat;
    }
  };

  return {
    group: rootGroup,
    componentsMap,
    relayArmature: armatureGroup,
    statusLeds: {
      powerLed,
      statusLed,
      protectLed
    },
    updateExploded,
    updateRelay,
    updateVariant,
    updateCasing,
    highlightComponent
  };
}
