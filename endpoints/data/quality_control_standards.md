# Northstar Foods - Line PKG-07 Quality Control Standards

**Document ID:** QC-PKG07-001  
**Revision:** Demo 1.0  
**Product:** 500 g Northstar granola pouch  
**Status:** Fictional demonstration document - not a validated food-safety plan

## 1. Purpose and disclaimer

This compact standard defines demo acceptance, monitoring, hold, and release rules for product packed on PKG-07. Numeric limits are fictional plant specifications selected to support the AI prototype. They are not FDA requirements, validated critical limits, or suitable for real production.

Food-safety plans, hazard analyses, preventive controls, allergen programs, sanitation controls, labeling approvals, and regulatory decisions must be established by qualified personnel for the actual product and facility.

## 2. Roles

- **Operator:** Performs routine checks, records results, stops the line for failures, and segregates product.
- **Floor supervisor:** Coordinates response, protects product identity, and ensures holds are applied; cannot release nonconforming product.
- **Quality technician:** Verifies instruments, performs release tests, defines affected quantity, and approves or rejects product.
- **Maintenance:** Restores equipment function and records changes; cannot independently release product.
- **Quality manager:** Approves deviation disposition, rework, or exceptional release under the site's formal process.

## 3. Product and coding specification

| Attribute | Demo specification |
|---|---|
| Product | Northstar Classic Granola |
| Declared net quantity | 500 g |
| Internal package acceptance band | 490-510 g |
| Package | Premade food-contact pouch, material code PCH-500-A |
| Seal recipe | SL-07 recipe GRAN-500-A |
| Label | Approved artwork NS-GRAN-500 Rev D |
| Lot format | `NS7-YYDDD-S` (line, year, Julian day, shift) |
| Date code | Best-by date from approved production schedule |
| Checkweigher recipe | CK-07 GRAN-500-A |

The 490-510 g band is an internal demo operating specification, not a statement of legal metrology compliance. Quality must investigate both underweight and overweight trends.

## 4. Pre-operational release

Quality and Operations verify before the first production run and after major cleaning or maintenance:

1. Line clearance: previous product, labels, packaging, documents, and loose materials removed.
2. Cleaning status: food-contact areas visibly clean, dry where required, correctly assembled, and released by Sanitation.
3. Equipment status: guards and covers installed; Safety owns safety acceptance.
4. Correct product, pouch material, label stock, ribbon/ink, recipe, lot code, and date code loaded.
5. FL-07, SL-07, LB-07, and CK-07 recipes match the production order.
6. CK-07 passes approved low, nominal, and high check-weight challenges.
7. Reject station removes each challenge package and confirms rejection.
8. Measuring devices are within calibration status.
9. Documentation is present and the hold area is available.

Failure of any check blocks production release.

## 5. Startup and restart verification

Perform these checks at initial startup and after adjustments or maintenance affecting fill, seal, label, code, checkweigher, reject system, belt speed/tracking, sensors, or product-contact parts.

### 5.1 First-piece review

Quality examines the first package for:

- correct product and pouch;
- correct label version and placement;
- readable, correct lot and best-by code;
- seal centered, continuous, clean, and free of product contamination;
- no puncture, tear, wrinkle through the seal, or open channel;
- acceptable appearance and weight.

### 5.2 Consecutive-package confirmation

Collect five consecutive packages after stable operation begins.

- All five must be within 490-510 g.
- All five must pass visual seal and package-integrity inspection.
- All five must have correct, readable labels and codes.
- Any failure resets the sequence after correction and expands the hold investigation.

Do not average an out-of-spec package into compliance; each unit must meet the acceptance band.

## 6. In-process monitoring

### Every 30 minutes

- Record five consecutive package weights.
- Review CK-07 reject count and any trend toward either limit.
- Verify correct label and readable lot/date code.

### Every 60 minutes

- Perform visual seal inspection on five packages.
- Perform the approved non-destructive seal challenge described in the work instruction.
- Confirm seal area is clean and pouch alignment is stable.
- Challenge the reject station with one identified test package.

### At each roll, lot, recipe, or shift change

- Perform line clearance.
- Verify materials and artwork against the production order.
- Verify lot/date code and record the changeover time.
- Repeat first-piece and five-package checks.

Operators shall stop and notify Quality for any failed check, unexplained upward or downward trend, repeated reject, missing record, damaged packaging, or mismatch.

## 7. Process adjustments

Only trained personnel may change an approved recipe parameter. Record the old value, new value, reason, person, time, and affected product interval.

- Do not widen weight limits to reduce rejects.
- Do not raise sealer temperature to mask contamination, sensor looseness, heater failure, or insufficient pressure.
- Do not bypass CK-07 or its reject device.
- Do not continue using incorrect or obsolete label stock.
- After any adjustment, repeat the applicable restart checks in Section 5.

If an adjustment requires guard opening or exposure to hazardous energy, SAFE-PKG07-001 and MAINT-PKG07-001 apply before Quality testing.

## 8. Product hold and traceability

Place product on electronic and physical hold when:

- a weight, seal, label, code, material, sanitation, or reject-system check fails;
- equipment malfunction may affect conformity;
- a check is late or missing;
- maintenance changes a product-affecting component or setting;
- a jam, belt event, or uncontrolled stop could damage or mix product;
- contamination or foreign material is suspected.

### 8.1 Define the affected interval

Unless evidence supports a narrower interval, hold product from the **last documented acceptable check** through the time the process is corrected and the restart verification passes. Include product still on the conveyor, in accumulation, or awaiting case packing.

### 8.2 Identify and segregate

Record:

- product and lot code;
- line and equipment ID;
- start/end time and pallet/case identifiers;
- estimated quantity;
- reason for hold;
- related alarm, maintenance work order, and check records.

Move or electronically block affected units so they cannot ship. Use a unique hold identifier. Do not mix held and released product.

### 8.3 Disposition

Quality evaluates reinspection, rework, relabeling, destruction, or other approved disposition. Only authorized Quality personnel may release the hold. The disposition and approving authority must be recorded.

## 9. Nonconformance decision examples

### Weight failure

- Stop and hold since the last acceptable 30-minute weight check.
- Determine whether FL-07 output or CK-07 measurement is responsible.
- Verify checkweigher performance with approved weights.
- Correct the cause and repeat five consecutive-package checks.

### Open, wrinkled, or contaminated seal

- Stop SL-07 and hold since the last acceptable hourly seal check.
- Inspect pouch alignment, jaw cleanliness, recipe, temperature stability, pressure, and dwell time.
- Maintenance work behind guards requires LOTO.
- Repeat first-piece and seal verification before release.

### Wrong or unreadable label/lot code

- Stop immediately and hold since the last documented correct-code check or material change, whichever provides the defensible boundary.
- Reconcile label inventory and production records.
- Relabel only under an approved, documented instruction with verification.

### Reject mechanism failure

- Stop the line; do not manually compensate while continuing production.
- Hold product since the last successful reject challenge.
- Maintenance corrects the fault; Quality repeats low/high weight and reject challenges.

### Conveyor belt drift, rub, or overheating event

- Hold exposed product from the last acceptable check when package damage, contamination, missed rejection, or timing disruption is plausible.
- Safety determines safe access; Maintenance determines mechanical function.
- Quality inspects affected product and repeats startup checks before release.

## 10. Release after maintenance or downtime

Quality may release production only after:

- Safety confirms guards/interlocks are restored and the authorized energy-control process is complete;
- Maintenance documents the repair and controlled functional test;
- line clearance and sanitation status are acceptable;
- correct materials, recipes, label, lot code, and date code are verified;
- CK-07 and reject challenges pass when relevant;
- first-piece and five consecutive packages pass; and
- all related records and hold boundaries are complete.

If required evidence is missing, support is insufficient for release. Keep product on hold and escalate to the Quality Manager.

## 11. Records

Retain the demo production order, pre-op checklist, weight/seal/code checks, checkweigher challenges, alarms, hold record, maintenance work order, adjustment log, and disposition decision under the same lot identifier. Corrections must preserve the original entry, identify who made the correction, and include the date/reason.

## 12. Research basis

This fictional standard was informed by FDA CGMP/traceability concepts and ISO quality-management guidance. Numeric specifications, frequencies, product, and equipment IDs are invented for demonstration.

- FDA, Current Good Manufacturing Practices for Food: https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/current-good-manufacturing-practices-cgmps-food-and-dietary-supplements
- FDA, Traceability Lot Code overview: https://www.fda.gov/food/food-safety-modernization-act-fsma/traceability-lot-code
- FDA, FSMA technical assistance FAQ (food packaging and quality controls): https://www.fda.gov/files/food/published/FSMA-Tan-Popular-Topics-FAQs-PDF.pdf
- ISO 9001 Auditing Practices Group, monitoring and measuring resources: https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-MonitoringMeasuring.pdf
- ISO guidance on documented information and nonconformity authority: https://www.iso.org/files/live/sites/isoorg/files/standards/docs/en/iso_9001_2015_guidance_documented_information.pdf

