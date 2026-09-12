# Module boundaries

The modular monolith separates `Domain`, `Application`, `Infrastructure`, and `Http`. Domain modules are Identity, Consent, Profiles, Evidence, SkillTaxonomy, Analysis, TalentDNA, Assessments, Opportunities, Matching, PublicCards, Privacy, and Audit.

- Potential skills remain validated analysis output and require explicit user confirmation. There is no first-class `CandidateSkill` entity.
- Only confirmed skills enter Talent DNA; snapshots are versioned and append-only.
- Skill Signal, Evidence Confidence, Credential Assurance, and Opportunity Match remain distinct concepts.
- AI extracts or explains. Deterministic, versioned services calculate; unapproved scoring formulas have no weights or magic numbers.
- Public Cards read immutable allowlisted publication data, never a filtered private profile.
- Assessment administration is limited to banks, MCQ/essay questions, exam name/version, timer, attempt rules, publication, and manual essay review.
