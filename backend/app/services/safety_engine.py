"""
HealthSense AI - Transparent Rule-Based Clinical Safety Engine

CRITICAL SAFETY PRINCIPLES:
1. Never claim webcam analysis or symptom questionnaires can diagnose an internal medical condition.
2. Immediate hard-stop if any acute red flag is reported (cardiovascular, acute neurological, cauda equina, acute trauma).
3. Transparent decision rules: Users and clinicians can see exactly which rule triggered the alert.
4. Distinguish between Emergency (Call Emergency Services), Urgent Medical (Physician within 24h), Specialist Physiotherapy, and Educational Self-Care.
"""

from typing import Any
from ..schemas.assessment import SafetyScreeningSchema

# Comprehensive red-flag definitions
RED_FLAG_DEFINITIONS = {
    "chest_pain_shortness_breath": {
        "title": "Chest Pain or Difficulty Breathing",
        "urgency": "emergency",
        "description": "Report of chest tightness, radiating arm/jaw pain, or shortness of breath.",
        "action": "Immediate emergency room evaluation or call local emergency services (100 / 112 / 108)."
    },
    "stroke_fast_signs": {
        "title": "Sudden Neurological Symptoms (FAST Signs)",
        "urgency": "emergency",
        "description": "Sudden facial drooping, speech difficulty, or sudden one-sided arm/leg weakness.",
        "action": "Emergency stroke evaluation required immediately. Do not delay."
    },
    "saddle_anesthesia_incontinence": {
        "title": "Cauda Equina Syndrome Red Flags",
        "urgency": "emergency",
        "description": "New onset numbness around the groin/buttocks/saddle region, or loss of bowel/bladder control.",
        "action": "Immediate emergency orthopedic/neurosurgical assessment required to prevent permanent nerve injury."
    },
    "major_trauma": {
        "title": "Severe Acute Trauma / Suspected Fracture",
        "urgency": "urgent_physician",
        "description": "Recent severe fall, vehicular impact, inability to bear weight, or obvious structural deformity.",
        "action": "Seek prompt urgent medical care for physical examination and radiological imaging (X-ray/CT)."
    },
    "progressive_motor_weakness": {
        "title": "Rapidly Progressing Motor Weakness",
        "urgency": "urgent_physician",
        "description": "Noticeable loss of muscular strength progressing over hours or days (e.g., foot drop, dropping objects).",
        "action": "Consult a physician or neurologist urgently for formal neurological examination."
    },
    "fever_with_neck_stiffness": {
        "title": "Fever with Severe Neck Stiffness",
        "urgency": "emergency",
        "description": "High temperature accompanied by rigid neck stiffness and light sensitivity.",
        "action": "Immediate medical attention needed to rule out acute central nervous system infection."
    },
    "unexplained_weight_loss_night_pain": {
        "title": "Constant Non-Mechanical Severe Night Pain",
        "urgency": "urgent_physician",
        "description": "Severe deep pain unyielding to position changes, waking from sleep with unexplained weight loss.",
        "action": "Comprehensive medical evaluation with a general physician recommended."
    }
}

class SafetyEngine:
    @staticmethod
    def evaluate(
        body_area: str,
        severity: int,
        duration: str,
        red_flag_symptoms: list[str],
        user_description: str = ""
    ) -> SafetyScreeningSchema:
        detected_flags: list[str] = []
        highest_urgency = "self_care"
        
        # 1. Check explicit red-flag symptom tags
        for flag in red_flag_symptoms:
            if flag in RED_FLAG_DEFINITIONS:
                detected_flags.append(RED_FLAG_DEFINITIONS[flag]["title"])
                urgency = RED_FLAG_DEFINITIONS[flag]["urgency"]
                if urgency == "emergency":
                    highest_urgency = "emergency"
                elif urgency == "urgent_physician" and highest_urgency != "emergency":
                    highest_urgency = "urgent_physician"
        
        # 2. Free-text heuristic scan for emergency cues
        desc_lower = (user_description or "").lower()
        if any(term in desc_lower for term in ["chest pain", "shortness of breath", "can't breathe", "cannot breathe", "heart racing"]):
            if "chest_pain_shortness_breath" not in red_flag_symptoms:
                detected_flags.append(RED_FLAG_DEFINITIONS["chest_pain_shortness_breath"]["title"])
                highest_urgency = "emergency"
                
        if any(term in desc_lower for term in ["facial droop", "slurred speech", "stroke", "half my body numb"]):
            if "stroke_fast_signs" not in red_flag_symptoms:
                detected_flags.append(RED_FLAG_DEFINITIONS["stroke_fast_signs"]["title"])
                highest_urgency = "emergency"

        if any(term in desc_lower for term in ["lost control of bladder", "lost control of bowel", "saddle numbness", "groin numbness"]):
            if "saddle_anesthesia_incontinence" not in red_flag_symptoms:
                detected_flags.append(RED_FLAG_DEFINITIONS["saddle_anesthesia_incontinence"]["title"])
                highest_urgency = "emergency"

        # 3. Assess pain severity & duration thresholds
        if severity >= 8:
            if highest_urgency == "self_care":
                highest_urgency = "urgent_physician"
                detected_flags.append(f"Severe self-reported pain intensity ({severity}/10)")
        elif severity >= 5 or duration in ["months", "chronic"]:
            if highest_urgency == "self_care":
                highest_urgency = "physiotherapist"

        # 4. Synthesize safety result
        is_safe = (highest_urgency in ["self_care", "physiotherapist"]) and (len(detected_flags) == 0 or (len(detected_flags) == 1 and "Severe self-reported" in detected_flags[0] and severity < 9))
        # If severe red flags are present, absolutely NOT safe for exercise
        if highest_urgency in ["emergency", "urgent_physician"]:
            is_safe = False

        if highest_urgency == "emergency":
            guidance = (
                "CRITICAL WARNING: The reported symptoms include signs that may indicate a serious medical emergency. "
                "Do NOT attempt any exercises. Please immediately call your local emergency services (100 / 112 / 108) "
                "or proceed to the nearest emergency department."
            )
            emergency_contact_advised = True
        elif highest_urgency == "urgent_physician":
            guidance = (
                "IMPORTANT CLINICAL ADVICE: Your responses indicate symptoms that warrant a prompt, in-person clinical "
                "examination by a qualified physician or urgent care center. Exercise routines are paused until a doctor "
                "has ruled out underlying structural injuries or acute pathology."
            )
            emergency_contact_advised = False
        elif highest_urgency == "physiotherapist":
            guidance = (
                "PROFESSIONAL CONSULTATION RECOMMENDED: Your symptoms indicate moderate or persistent musculoskeletal discomfort. "
                "We recommend consulting a licensed physiotherapist for an individual hands-on evaluation. "
                "Gentle educational mobility information is provided below for discussion with your therapist."
            )
            emergency_contact_advised = False
        else:
            guidance = (
                "GENERAL WELLNESS GUIDANCE: Reported discomfort appears mild and typical of common mechanical postural strain. "
                "You may explore the gentle educational movement exercises below. Stop immediately if any movement causes pain, "
                "dizziness, or discomfort."
            )
            emergency_contact_advised = False

        return SafetyScreeningSchema(
            is_safe_for_exercise=is_safe,
            red_flags_present=len(detected_flags) > 0,
            red_flag_items=detected_flags,
            referral_urgency=highest_urgency,
            guidance_message=guidance,
            emergency_contact_advised=emergency_contact_advised
        )
