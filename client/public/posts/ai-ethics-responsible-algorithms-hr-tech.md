# AI Ethics 101: Building Responsible Algorithms for HR Tech

Hiring algorithms promise efficiency, but they also risk amplifying bias. This primer applies the **FAT** (Fairness, Accountability, Transparency) rubric to HR technology so you can deploy models responsibly.

## Fairness

* Conduct **disparate impact** tests—flag >20 % variance across protected classes.
* Apply counterfactual fairness checks: Would the prediction change if demographic attributes were flipped?

## Accountability

* Form an **AI Governance Board** with stakeholders from DEI, Legal, and Data Science.
* Maintain a *Model Card* documenting data provenance and limitations.

## Transparency

* Use SHAP or LIME to generate feature-attribution plots.
* Offer candidates explanations and opt-out mechanisms.

## Regulatory Landscape

| Region | Key Law | Effective |
|--------|---------|-----------|
| EU | AI Act | 2026 |
| U.S. | NYC Local Law 144 | 2024 |

## Implementation Checklist

1. Source-balanced training data (SkillBridgeAI Dataset Balancer).
2. Version models with MLflow; enable rollbacks.
3. Schedule quarterly bias audits.

## Business Case

A Fortune 500 retailer reduced legal exposure costs by **$3.4 M** after integrating bias detection pipelines.

---
*Written by Sara Lee, July 10 2025*
