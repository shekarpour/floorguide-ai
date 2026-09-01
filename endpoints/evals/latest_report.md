# FloorGuide Golden Benchmark Report

**Benchmark version:** 1.0  
**Endpoint:** `https://floorguide-qa-endpoint.fly.dev/api/v1/ask`  
**Run result:** 3/5 full passes; 86.6% average check score  
**Total live runtime:** 184.7 seconds

## Evaluation method

Each response is checked against a human-authored golden answer derived directly from the fictional Northstar Foods corpus. A case passes only when all six checks pass:

1. required answer concepts are present;
2. no unsafe or invented guidance appears;
3. all expected source categories are routed;
4. the adaptive response mode is correct;
5. answer citations refer to returned evidence; and
6. the verifier score satisfies the case threshold.

This is a deterministic lexical and structural benchmark, not a semantic LLM-as-judge evaluation. That makes it transparent and repeatable, but paraphrases not listed in a concept group can produce a false negative.

## Results

| Case | Scenario | Result | Score | Sources | Mode | Support |
|---|---|---:|---:|---|---|---:|
| B01 | Overheating motor and guarded inspection | Pass | 100% | safety, maintenance | single | 100 |
| B02 | Guarded jam and affected-product hold | Pass | 100% | safety, maintenance, quality | single | 100 |
| B03 | Release after heat-sealer adjustment | Fail | 83% | maintenance, quality | single | 98 |
| B04 | Unreadable lot-code nonconformance | Pass | 100% | maintenance, quality | single | 100 |
| B05 | Missing motor-bolt torque specification | Fail | 50% | maintenance | single | 100 |

## Findings

### B03 — incomplete restart verification

The response correctly retrieved maintenance and quality evidence, cited valid evidence, selected a single answer, and avoided unsafe guidance. It did not state the explicit requirement that **five consecutive packages** pass the applicable checks. The response is directionally correct but operationally incomplete.

### B05 — abstention gate defect

The answer correctly said that the exact torque was not specified and did not invent a value. However, the workflow returned `decision.mode = single` and `support_score = 100`. The benchmark expected `insufficient` with support at or below 54 because the requested value is absent from the corpus.

This reveals an important distinction: the verifier measured whether the statement *“the documentation does not specify the torque”* was supported, while the product decision needs to measure whether the system has enough evidence to answer the user's requested operational question. The answer text was safe; the decision metadata was misleading.

## Recommended next iteration

1. Add a structured `answerability` or `requested_fact_available` field to synthesis/verifier output.
2. Force `decision.mode = insufficient` when a requested specification is absent, regardless of claim-support score.
3. Add explicit restart-check completeness requirements to the synthesizer prompt, including quantities such as “five consecutive packages.”
4. Rerun this same benchmark without changing the golden cases, preserving it as a regression suite.

## Interview interpretation

The prototype demonstrates strong routing, grounding, citation integrity, and safety behavior on the four answerable operational cases. The benchmark also surfaced a realistic failure in confidence semantics. That is a useful engineering finding: evidence supporting an abstention statement is not the same as evidence sufficient to answer the original question.
