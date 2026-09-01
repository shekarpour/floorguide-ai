/**
 * ISOLATED MOCK DATA — UI development only.
 *
 * Used only when VITE_USE_MOCK_API === "true". Never imported by production
 * request paths other than the explicit guard in `api.ts`.
 */
import type { AskRequest, AskResponse } from "@/types/floorguide";

export function buildMockResponse(req: AskRequest): AskResponse {
  const q = req.question.toLowerCase();
  const isQuality = /quality|spec|tolerance|seal|weight|label/.test(q);
  const isSafety = /guard|reach|jam|lock|hot|overheat|safe|restart/.test(q);

  return {
    request_id: `req_mock_${Date.now()}`,
    user_name: req.user_name,
    question: req.question,
    intent:
      "Troubleshoot an overheating conveyor while determining safe inspection conditions",
    routed_sources: [
      ...(isSafety || !isQuality
        ? [
            {
              source: "safety" as const,
              reason: "The question involves guard opening and hazardous energy.",
            },
          ]
        : []),
      {
        source: "maintenance" as const,
        reason: "The question requires motor-overheating troubleshooting guidance.",
      },
      ...(isQuality
        ? [
            {
              source: "quality" as const,
              reason: "Product disposition after a line stop must meet QC standards.",
            },
          ]
        : []),
    ],
    answer: {
      summary:
        "Do not open the guard or inspect the motor internally while the conveyor is operating.",
      actions: [
        "Stop feeding product and perform an orderly line shutdown.",
        "Record the alarm, load, operating condition, and visible symptoms.",
        "Have authorized Maintenance apply the equipment-specific lockout/tagout procedure.",
        "After isolation and cooling, inspect ventilation, belt tracking, tension, pulleys, bearings, and the motor fan.",
      ],
      warnings: [
        "An emergency stop or software stop does not isolate hazardous energy.",
        "Do not repeatedly reset an overload without identifying its cause.",
      ],
      missing_information: [
        "The displayed temperature or overload code was not provided.",
        "It is unknown whether smoke, burning odor, or arcing is present.",
      ],
      escalation:
        "Remove CV-07 from service and escalate to Engineering or OEM support if overheating or tripping recurs.",
    },
    evidence: [
      {
        source: "safety",
        document_id: "SAFE-PKG07-001",
        document_title: "Line PKG-07 Safety Procedures",
        section: "8",
        section_title: "Overheating, unusual noise, vibration, or belt drift",
        excerpt:
          "Do not open the guard, touch the motor, or run the conveyor solely to see if it clears. Stop the line, tag the asset, and request authorized maintenance support.",
        relevance: 0.96,
      },
      {
        source: "maintenance",
        document_id: "MAINT-PKG07-001",
        document_title: "Line PKG-07 Maintenance Manual",
        section: "5.3",
        section_title: "Conveyor motor is hot or trips on overload",
        excerpt:
          "Apply LOTO for close inspection or guard removal. Verify ventilation paths, belt tension and tracking, and bearing condition before restoring power.",
        relevance: 0.94,
      },
      ...(isQuality
        ? [
            {
              source: "quality" as const,
              document_id: "QC-PKG07-004",
              document_title: "Packaging Quality Control Standards",
              section: "3.2",
              section_title: "Product disposition after unplanned line stops",
              excerpt:
                "Product in the sealing zone at the time of an unplanned stop must be quarantined and seal-integrity verified before release.",
              relevance: 0.81,
            },
          ]
        : []),
    ],
    verification: {
      support_score: 92,
      support_level: "high",
      claims_total: 4,
      claims_supported: 4,
      unsupported_claims: [],
      sources_consulted: isQuality ? 3 : 2,
    },
    processing: { latency_ms: 1840 },
  };
}
