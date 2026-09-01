# Northstar Foods - Line PKG-07 Maintenance Manual

**Document ID:** MAINT-PKG07-001  
**Revision:** Demo 1.0  
**Applies to:** Northstar Foods packaging line PKG-07  
**Status:** Fictional demonstration document - not an OEM manual

## 1. Purpose and scope

This demo manual provides compact troubleshooting and preventive-maintenance guidance for PKG-07. It must be used with SAFE-PKG07-001 and the actual equipment-specific isolation sheets. It does not authorize work on energized or guarded equipment.

## 2. Line configuration

| ID | Component | Demo description |
|---|---|---|
| CV-07 | Infeed conveyor | Food-grade belt conveyor with guarded end-drive motor |
| FL-07 | Auger filler | Deposits nominal 500 g product into premade pouches |
| SL-07 | Heat sealer | Dual heated jaws with pneumatic closure |
| LB-07 | Labeler/coder | Applies product label and prints lot/date code |
| CK-07 | Checkweigher | Verifies package weight and pneumatically rejects failures |

The values and alarm limits in this document are invented plant settings for the prototype. An actual plant must use its approved OEM manuals, engineering limits, and validated recipes.

## 3. Maintenance priorities

1. Protect people: follow SAFE-PKG07-001 before inspection or adjustment.
2. Protect product: notify Quality whenever maintenance could affect product contact, fill weight, seal integrity, labeling, detection, or rejection.
3. Preserve evidence: record alarm code, operating speed, product, time, load, temperature, noise, vibration, and visible condition before changing settings.
4. Change one controlled variable at a time and document the result.
5. Do not repeatedly reset an overload, interlock, or temperature alarm without identifying the cause.

## 4. Preventive-maintenance schedule

### Each shift - operator external inspection

With guards closed and from a safe position:

- Confirm the belt is centered and not rubbing either frame edge.
- Listen for new scraping, knocking, squealing, or bearing noise.
- Look for fraying, product buildup, loose hardware, leaks, damaged cables, obstructed ventilation, or abnormal vibration.
- Confirm guards and interlocks appear intact.
- Record any motor overload, temperature, seal-temperature, weight, or reject alarm.
- Stop and escalate conditions listed in SAFE-PKG07-001 Section 8.

### Weekly - authorized maintenance under LOTO where exposure exists

- Inspect belt edges, splice, tracking, tension indicators, pulleys, bearings, and accessible fasteners.
- Clean motor air inlets and fan cover using an approved dry method.
- Inspect pneumatic tubing, fittings, regulator bowl, and reject-arm movement.
- Inspect sealer-jaw faces, insulation, thermocouple mounting, and wiring condition.
- Inspect filler-auger coupling and product-contact seals.
- Check label roll path, print-head cleanliness, and sensor alignment.
- Record findings in the maintenance log.

### Monthly

- Verify emergency-stop and guard-interlock function under the approved test procedure.
- Review recurring overload, drift, temperature, weight, and reject alarms.
- Verify belt tracking after cleaning and reassembly.
- Inspect electrical-enclosure filters and cooling paths.
- Compare CK-07 against approved check weights; Quality owns acceptance and calibration status.
- Confirm critical spare stock: CV-07 belt, drive bearing set, motor fan cover/filter, sealer thermocouple, heater cartridge, label sensor, and reject solenoid.

## 5. CV-07 conveyor troubleshooting

### 5.1 Belt drifts toward one side

Possible causes:

- product or residue on pulley/belt;
- conveyor frame not level or recently disturbed;
- unequal tension or tracking adjustment;
- loose end-plate fasteners;
- worn bearing, pulley, or belt edge;
- incorrect reassembly after sanitation.

Response:

1. Stop product feed and perform an orderly stop.
2. If the belt is rubbing, frayed, or approaching the frame, keep the conveyor out of service.
3. Apply LOTO before guard removal, cleaning behind guards, or mechanical adjustment.
4. Inspect for buildup, loose fasteners, wear, and correct assembly.
5. Correct the underlying condition before adjusting tracking.
6. Use only the designated discharge-end tracking cams. Make small, equal, documented adjustments; allow several belt revolutions between observations under the approved guarded test procedure.
7. Do not over-tension. Excess tension can increase pulley and bearing load and cause early failure.
8. After adjustment, verify centered tracking at low speed, normal speed, and representative load.
9. Quality performs restart checks before affected product is released.

### 5.2 Belt slips or conveyor speed is unstable

Possible causes include product overload, contamination on the drive pulley, insufficient or excessive belt tension, worn belt/pulley, loose coupling, drive fault, or motor overload.

- Stop and record load and alarm state.
- Do not increase tension or drive settings as a first response.
- Under LOTO, inspect the belt, pulley, coupling, and tension indicators.
- Remove contamination using the approved sanitation method.
- If slipping recurs, keep CV-07 out of service for Maintenance Lead review.

### 5.3 Conveyor motor is hot or trips on overload

Possible causes:

- blocked motor ventilation or warm-air recirculation;
- excessive product load;
- belt rubbing or over-tension;
- seized or deteriorating bearing;
- drive/pulley binding;
- frequent starts;
- incorrect electrical supply or drive parameters;
- internal motor fault.

Response:

1. Stop feeding product and perform an orderly shutdown. For smoke, burning odor, arcing, or immediate danger, follow SAFE-PKG07-001 emergency steps.
2. Record the displayed temperature/alarm, line speed, product load, ambient condition, and whether the trip recurred.
3. Do not touch the motor or remove its cover until isolated and cooled.
4. Apply LOTO for close inspection or guard removal.
5. Check that air inlets and outlets are clear and that exhaust air is not being recirculated.
6. Inspect for belt rub, excessive tension, pulley/bearing resistance, buildup, and fan damage.
7. Correct one identified cause; do not repeatedly reset the overload.
8. An electrician verifies supply, phase balance, current, drive parameters, insulation, and protection settings when mechanical causes are not evident.
9. If overheating or tripping recurs, remove CV-07 from service and escalate to Engineering/OEM support.

No fixed "safe-to-touch" temperature is asserted in this demo manual. Use the installed sensor limits, OEM rating, and site hazard assessment.

## 6. FL-07 filler troubleshooting

### 6.1 Average fill weight is low or high

Possible causes include incorrect recipe, product-density change, auger buildup, loose coupling, inconsistent hopper level, or checkweigher bias.

1. Quality places product since the last acceptable check on hold.
2. Verify the active recipe and product code without changing parameters.
3. Inspect hopper level and external indicators.
4. Apply LOTO before internal inspection or auger/coupling work.
5. Clean and inspect product-contact parts under the sanitation procedure.
6. After adjustment, Quality performs the first-piece and consecutive-package checks in QC-PKG07-001.

### 6.2 Fill weight varies widely

Check for bridging, inconsistent product feed, damaged auger, loose coupling, vibration, unstable checkweigher readings, or an incorrect product recipe. Do not compensate for a mechanical fault by widening quality limits.

## 7. SL-07 sealer troubleshooting

### 7.1 Seal temperature low or unstable

Possible causes include warm-up not complete, contaminated jaw, loose thermocouple, failed heater, damaged wiring, inadequate dwell time, or incorrect recipe.

- Stop and hold potentially affected product.
- Allow hot surfaces to cool and apply electrical/pneumatic LOTO before guarded inspection.
- Inspect jaw cleanliness, thermocouple attachment, wiring, heater resistance, pressure, and recipe.
- Do not raise the setpoint merely to mask a loose sensor or contaminated jaw.
- Quality must pass seal inspection after any heater, thermocouple, jaw, pressure, time, or recipe change.

### 7.2 Wrinkled, open, or contaminated seal

Check pouch alignment, product in the seal area, jaw cleanliness/parallelism, pressure, dwell time, temperature stability, and damaged pouch material. Segregate affected production according to QC-PKG07-001.

## 8. LB-07 and CK-07 troubleshooting

### 8.1 Missing/wrong label or unreadable code

- Stop the line when product identity or lot/date code cannot be verified.
- Quarantine product from the last confirmed acceptable label check.
- Verify loaded label stock, recipe, sensor, ribbon/ink, and print-head condition.
- Quality must approve the label and code before restart.

### 8.2 Checkweigher rejects too many packages

- Do not bypass the reject device or widen limits.
- Confirm conveyor contact, drafts, vibration, belt buildup, recipe, zero, and approved check-weight result.
- Determine whether FL-07 is varying or CK-07 is measuring incorrectly.
- Quality controls calibration status, test weights, acceptance limits, and product disposition.

### 8.3 Reject arm fails to remove a known bad package

Stop the line. Do not run production with an ineffective reject mechanism. Under the approved procedure inspect air pressure, solenoid, sensor timing, arm obstruction, guarding, and reject confirmation. Quality performs a challenge test before release.

## 9. Controlled return to service

After maintenance:

1. Confirm work is complete, parts/fasteners are secure, and tools/materials are removed.
2. Restore guards, covers, sensors, interlocks, and utilities.
3. Release LOTO only under SAFE-PKG07-001.
4. Conduct a controlled no-product run and observe direction, noise, vibration, tracking, temperatures, alarms, and leaks.
5. Run representative product at reduced speed, then normal speed if stable.
6. Record the maintenance action, settings changed, parts replaced, and observations.
7. Obtain Quality release under QC-PKG07-001 before sending product forward.

Maintenance may declare equipment mechanically functional; only Quality may release affected product.

## 10. Escalation rules

Escalate to the Maintenance Lead, Engineering, or OEM when:

- the energy source or isolation point is uncertain;
- a guard/interlock, emergency stop, or reject confirmation fails;
- overheating, overload, belt drift, abnormal vibration, or seal instability recurs;
- an electrical fault or damaged conductor is suspected;
- a setting conflicts with the approved recipe;
- a required calibrated instrument is unavailable; or
- the proposed repair is outside training or approved procedures.

## 11. Research basis

This fictional manual was informed by manufacturer and regulatory guidance. Equipment configuration, thresholds, and procedures are demo content, not OEM instructions.

- Dorner 2200 Series Center Drive Conveyor manual: https://www.dornerconveyors.com/wp-content/uploads/2017/09/453er.pdf
- Dorner sanitary conveyor preventive-maintenance guidance: https://www.dornerconveyors.com/resources-old/whitepaper/preventative-maintenance-for-sanitary-conveyors
- Siemens motor cooling/ventilation operating guidance: https://cache.industry.siemens.com/dl/files/823/109804823/att_1275756/v1/EN_1FZ_op_Instr_0424.pdf
- OSHA, 29 CFR 1910.147: https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147

