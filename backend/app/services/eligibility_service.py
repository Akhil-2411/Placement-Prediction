from typing import List, Dict, Any
from ..schemas.company import CompanyEligibilityStatus

SAMPLE_COMPANIES = [
    {
        "company_id": "comp-1",
        "company_name": "Google",
        "role_title": "Associate Software Engineer",
        "min_cgpa": 8.5,
        "max_backlogs": 0,
        "eligible_branches": ["CSE", "IT", "ECE"],
        "package_lpa": 32.0
    },
    {
        "company_id": "comp-2",
        "company_name": "Microsoft",
        "role_title": "Software Engineer (L59)",
        "min_cgpa": 8.0,
        "max_backlogs": 0,
        "eligible_branches": ["CSE", "IT", "ECE", "EE"],
        "package_lpa": 26.5
    },
    {
        "company_id": "comp-3",
        "company_name": "Amazon",
        "role_title": "Software Development Engineer I",
        "min_cgpa": 7.5,
        "max_backlogs": 0,
        "eligible_branches": ["CSE", "IT", "ECE", "EE", "ME", "CE"],
        "package_lpa": 28.0
    },
    {
        "company_id": "comp-4",
        "company_name": "Goldman Sachs",
        "role_title": "Analyst - Engineering",
        "min_cgpa": 8.0,
        "max_backlogs": 0,
        "eligible_branches": ["CSE", "IT", "ECE", "EE"],
        "package_lpa": 24.0
    },
    {
        "company_id": "comp-5",
        "company_name": "Oracle",
        "role_title": "Member of Technical Staff",
        "min_cgpa": 7.0,
        "max_backlogs": 1,
        "eligible_branches": ["CSE", "IT", "ECE", "EE", "ME"],
        "package_lpa": 16.0
    },
    {
        "company_id": "comp-6",
        "company_name": "TCS Digital",
        "role_title": "Digital Systems Engineer",
        "min_cgpa": 6.5,
        "max_backlogs": 1,
        "eligible_branches": ["CSE", "IT", "ECE", "EE", "ME", "CE", "Chemical"],
        "package_lpa": 7.5
    }
]

class EligibilityService:
    @staticmethod
    def evaluate_companies(cgpa: float, backlogs: int, branch: str, custom_companies: List[Dict[str, Any]] = None) -> List[CompanyEligibilityStatus]:
        companies = custom_companies or SAMPLE_COMPANIES
        results: List[CompanyEligibilityStatus] = []

        for comp in companies:
            reasons = []
            missing = []
            is_eligible = True

            # CGPA check
            min_cgpa = comp.get('min_cgpa', 6.0)
            if cgpa >= min_cgpa:
                reasons.append(f"CGPA {cgpa:.2f} satisfies required threshold of {min_cgpa:.2f}")
            else:
                is_eligible = False
                missing.append(f"CGPA {cgpa:.2f} is below minimum requirement of {min_cgpa:.2f}")

            # Backlogs check
            max_backlogs = comp.get('max_backlogs', 0)
            if backlogs <= max_backlogs:
                reasons.append(f"Active backlogs ({backlogs}) within allowable limit ({max_backlogs})")
            else:
                is_eligible = False
                missing.append(f"Active backlogs ({backlogs}) exceed maximum allowed ({max_backlogs})")

            # Branch check
            eligible_branches = comp.get('eligible_branches', [])
            if branch in eligible_branches:
                reasons.append(f"Branch '{branch}' is eligible for recruitment")
            else:
                is_eligible = False
                missing.append(f"Branch '{branch}' is not in shortlisted disciplines: {', '.join(eligible_branches)}")

            results.append(
                CompanyEligibilityStatus(
                    company_id=str(comp.get('id', comp.get('company_id', ''))),
                    company_name=comp.get('name', comp.get('company_name', '')),
                    role_title=comp.get('role_title', ''),
                    package_lpa=comp.get('package_lpa'),
                    is_eligible=is_eligible,
                    reasons=reasons,
                    missing_criteria=missing
                )
            )

        return results

eligibility_service = EligibilityService()
