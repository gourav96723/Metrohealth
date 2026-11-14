"""
HealthSense AI - Educational Physiotherapy Exercise Library
Comprehensive, evidence-based exercise routines organized by anatomical region.
"""

from typing import Optional
from ..schemas.assessment import ExerciseRecommendationSchema

EXERCISE_DATABASE: list[dict] = [
    # --- NECK ---
    {
        "id": "neck_chin_tuck",
        "name": "Cervical Retraction (Chin Tucks)",
        "category": "Postural Alignment & Deep Flexor Activation",
        "body_area": "neck",
        "purpose": "Corrects forward head posture and relieves suboccipital tension from screen use.",
        "difficulty": "Beginner",
        "instructions": [
            "Sit tall with your shoulders relaxed.",
            "Look straight ahead. Gently glide your chin backward horizontally, as if sliding a drawer straight back.",
            "Hold the retracted position for 3 to 5 seconds while breathing smoothly.",
            "Release gently back to neutral."
        ],
        "suggested_dosage": "2 sets of 10 repetitions, 2x daily",
        "precautions": ["Do not tilt head down toward your chest; motion is strictly horizontal."],
        "stop_conditions": ["Stop if you feel dizziness, nausea, or radiating arm tingling."],
        "evidence_note": "JOSPT Clinical Practice Guidelines for Neck Pain & Postural Strain."
    },
    {
        "id": "neck_trapezius_stretch",
        "name": "Upper Trapezius Gentle Stretch",
        "category": "Cervical Tension Relief",
        "body_area": "neck",
        "purpose": "Eases muscular tightness along the lateral neck and upper shoulders.",
        "difficulty": "Gentle",
        "instructions": [
            "Sit upright with both shoulders relaxed downward.",
            "Gently tilt your right ear toward your right shoulder without shrugging.",
            "Feel a mild, comfortable stretch along the left side of the neck for 20 seconds.",
            "Slowly return to center and repeat on the opposite side."
        ],
        "suggested_dosage": "2-3 repetitions per side, 20s hold",
        "precautions": ["Let gravity guide the stretch; never yank with your hand."],
        "stop_conditions": ["Stop if sharp pinching occurs in the cervical spine."],
        "evidence_note": "Ergonomic physical therapy tension-relief protocol."
    },
    {
        "id": "neck_isometric_holds",
        "name": "Neck Isometric Strengthening",
        "category": "Cervical Stabilization",
        "body_area": "neck",
        "purpose": "Builds isometric strength in cervical stabilizers without joint movement.",
        "difficulty": "Beginner",
        "instructions": [
            "Place your palm against your forehead.",
            "Gently push your head forward into your palm while resisting with equal hand pressure so your head doesn't move.",
            "Hold for 5 seconds, then relax. Repeat with hand on the side of the head and back of head."
        ],
        "suggested_dosage": "5 repetitions each direction (front, back, left, right), 5s hold",
        "precautions": ["Use gentle pressure (about 20-30% of max effort)."],
        "stop_conditions": ["Stop if neck pain or headache spikes."],
        "evidence_note": "Standard physical therapy cervical stabilization protocol."
    },

    # --- SHOULDERS ---
    {
        "id": "shoulder_scapular_slides",
        "name": "Scapular Wall Slides",
        "category": "Scapulothoracic Mobility & Retraction",
        "body_area": "shoulder",
        "purpose": "Strengthens serratus anterior and lower trapezius to correct rounded shoulders.",
        "difficulty": "Intermediate",
        "instructions": [
            "Stand with your back, head, and elbows flat against a smooth wall.",
            "Slowly slide your arms upward along the wall into a 'W' or 'V' position, keeping forearms in contact.",
            "Squeeze your shoulder blades gently at the top, then slowly slide back down."
        ],
        "suggested_dosage": "2 sets of 8 to 10 repetitions",
        "precautions": ["Avoid arching your lower back away from the wall."],
        "stop_conditions": ["Stop if anterior shoulder impingement pain occurs."],
        "evidence_note": "Clinical guideline for scapulohumeral rhythm rehabilitation."
    },
    {
        "id": "shoulder_pendulum",
        "name": "Codman's Pendulum Exercise",
        "category": "Passive Glenohumeral Decompression",
        "body_area": "shoulder",
        "purpose": "Provides pain-free passive joint mobility and decompression for stiff shoulders.",
        "difficulty": "Very Gentle",
        "instructions": [
            "Lean forward supporting your non-affected arm on a sturdy table.",
            "Let the affected arm dangle freely toward the floor.",
            "Sway your torso gently in small circles, allowing your dangling arm to swing passively with momentum.",
            "Perform clockwise for 30s, then counter-clockwise for 30s."
        ],
        "suggested_dosage": "1 to 2 minutes, 2x daily",
        "precautions": ["Do not actively flex shoulder muscles; let torso momentum swing the arm."],
        "stop_conditions": ["Stop if sharp pinching pain occurs."],
        "evidence_note": "Classical post-injury and rotator cuff mobilization standard."
    },
    {
        "id": "shoulder_doorway_stretch",
        "name": "Pectoral Doorway Stretch",
        "category": "Anterior Chest Expansion",
        "body_area": "shoulder",
        "purpose": "Opens tight chest muscles caused by prolonged computer work, reducing shoulder roll.",
        "difficulty": "Beginner",
        "instructions": [
            "Stand in an open doorway with your forearms resting on the door jamb at 90-degree angles.",
            "Step one foot forward until you feel a comfortable stretch across the front of your chest and shoulders.",
            "Hold upright with tall posture for 20-30 seconds, breathing deeply."
        ],
        "suggested_dosage": "3 repetitions of 20-30 seconds",
        "precautions": ["Keep neck relaxed and shoulders down."],
        "stop_conditions": ["Stop if numbness or tingling travels down the arms."],
        "evidence_note": "Ergonomic thoracic posture correction protocol."
    },

    # --- UPPER BACK / THORACIC ---
    {
        "id": "thoracic_open_books",
        "name": "Side-Lying Thoracic Open Books",
        "category": "Thoracic Spine Mobility",
        "body_area": "upper_back",
        "purpose": "Restores thoracic rotational mobility to ease upper-back stiffness.",
        "difficulty": "Beginner",
        "instructions": [
            "Lie on your side with knees bent at 90 degrees and arms extended straight out.",
            "Slowly rotate your top arm up and across your body toward the opposite floor, following your hand with your eyes.",
            "Hold the open rotation for 2-3 deep breaths, keeping knees together.",
            "Slowly return to start."
        ],
        "suggested_dosage": "8 slow repetitions per side",
        "precautions": ["Keep knees stacked together on the floor; rotate from the mid-back."],
        "stop_conditions": ["Stop if rib pain or sharp lumbar twisting occurs."],
        "evidence_note": "Evidence-backed thoracic mobilization protocol."
    },
    {
        "id": "thoracic_cat_cow",
        "name": "Quadruped Cat-Cow Spinal Flow",
        "category": "Segmental Spinal Articulation",
        "body_area": "upper_back",
        "purpose": "Mobilizes the entire spinal column to relieve mid-back rigidity and tension.",
        "difficulty": "Gentle",
        "instructions": [
            "Start on all fours with hands under shoulders and knees under hips.",
            "Inhale: gently drop your belly and lift your chest forward (Cow).",
            "Exhale: press the floor away, rounding your spine toward the ceiling and tucking your chin (Cat).",
            "Move fluidly with your breath."
        ],
        "suggested_dosage": "10 smooth cycles, once or twice daily",
        "precautions": ["Move within a comfortable pain-free range."],
        "stop_conditions": ["Stop if nerve twinges occur."],
        "evidence_note": "Standard spine mobility sequence in physical therapy."
    },

    # --- LOWER BACK / LUMBAR ---
    {
        "id": "lumbar_pelvic_tilts",
        "name": "Supine Pelvic Tilts",
        "category": "Core & Lumbar Stabilization",
        "body_area": "lower_back",
        "purpose": "Activates deep transversus abdominis to stabilize the lower spine and relieve lumbar tension.",
        "difficulty": "Gentle",
        "instructions": [
            "Lie on your back with knees bent and feet flat on the floor.",
            "Gently engage your lower abdomen and flatten your lower back against the floor by tilting your pelvis backward.",
            "Hold for 4 to 5 seconds while breathing smoothly.",
            "Relax back to neutral."
        ],
        "suggested_dosage": "10-12 repetitions, 1-2x daily",
        "precautions": ["Engage abdominals rather than pushing aggressively through feet."],
        "stop_conditions": ["Stop if back pain increases or radiates into the leg."],
        "evidence_note": "McGill Spine Stabilization Foundations."
    },
    {
        "id": "lumbar_bird_dog",
        "name": "Bird-Dog Core Stability",
        "category": "Multifidus & Core Strengthening",
        "body_area": "lower_back",
        "purpose": "Builds lumbar spine endurance and rotational stability with minimal compressive load.",
        "difficulty": "Intermediate",
        "instructions": [
            "Begin on hands and knees with flat back (neutral spine).",
            "Simultaneously extend your right arm forward and left leg backward until parallel to the floor.",
            "Hold for 3 seconds without letting your hips tilt or back arch.",
            "Return to center with control, then alternate to opposite arm and leg."
        ],
        "suggested_dosage": "2 sets of 6-8 repetitions per side",
        "precautions": ["Keep your pelvis square to the floor; don't twist hips."],
        "stop_conditions": ["Stop if lower back pinches or spasms."],
        "evidence_note": "McGill Big 3 Core Spine Protocol."
    },
    {
        "id": "lumbar_child_pose",
        "name": "Extended Child's Pose Decompression",
        "category": "Lumbar & Latissimus Relaxation",
        "body_area": "lower_back",
        "purpose": "Passively elongates the spine, opens lumbar facet joints, and relaxes paraspinal muscles.",
        "difficulty": "Gentle",
        "instructions": [
            "Kneel on a soft mat with big toes touching and knees comfortably wide.",
            "Sit your hips back toward your heels and walk your hands forward on the floor.",
            "Rest your forehead on the floor and breathe deeply into your lower back for 30-45 seconds."
        ],
        "suggested_dosage": "2-3 holds of 30-45 seconds",
        "precautions": ["If knees are tender, place a folded blanket behind your knees."],
        "stop_conditions": ["Stop if acute disc pain or knee pinching occurs."],
        "evidence_note": "Restorative lumbar decompression guidelines."
    },

    # --- HIPS & PELVIS ---
    {
        "id": "hip_glute_bridge",
        "name": "Glute Bridge Activation",
        "category": "Pelvic Stability & Posterior Chain",
        "body_area": "hip",
        "purpose": "Strengthens gluteus maximus to stabilize the pelvis and counteract prolonged sitting.",
        "difficulty": "Beginner",
        "instructions": [
            "Lie on your back with knees bent and feet flat on the floor hip-width apart.",
            "Squeeze your glutes and push through your heels to lift hips toward ceiling until thighs and torso align.",
            "Hold at the top for 2 seconds without hyperextending your lower back.",
            "Slowly lower back down with control."
        ],
        "suggested_dosage": "2 sets of 10-12 repetitions",
        "precautions": ["Drive through heels; do not over-arch lumbar spine."],
        "stop_conditions": ["Stop if hamstring cramps or front-hip pinching occurs."],
        "evidence_note": "Standard pelvic stabilization & gluteal reactivation protocol."
    },
    {
        "id": "hip_clamshell",
        "name": "Side-Lying Clamshells",
        "category": "Gluteus Medius Strengthening",
        "body_area": "hip",
        "purpose": "Targets gluteus medius to improve pelvic levelness and knee tracking.",
        "difficulty": "Beginner",
        "instructions": [
            "Lie on your side with hips and knees bent at 45 degrees, feet stacked together.",
            "Keeping your feet together, rotate your top knee upward toward the ceiling.",
            "Pause at the top for 1 second without letting your pelvis roll backward.",
            "Lower slowly."
        ],
        "suggested_dosage": "2 sets of 12 repetitions per side",
        "precautions": ["Keep hips perpendicular to the floor; do not rock backward."],
        "stop_conditions": ["Stop if lateral hip joint sharp pain arises."],
        "evidence_note": "Pelvic symmetry & runner's knee prevention research."
    },

    # --- KNEES ---
    {
        "id": "knee_straight_leg_raise",
        "name": "Supine Straight Leg Raise",
        "category": "Quadriceps Activation (Non-Weight Bearing)",
        "body_area": "knee",
        "purpose": "Strengthens anterior quadriceps without compressing the patellofemoral joint.",
        "difficulty": "Beginner",
        "instructions": [
            "Lie on your back with one leg bent and the target leg straight.",
            "Tighten the thigh of the straight leg and pull toes upward.",
            "Lift the straight leg about 12 inches off the ground, matching the opposite knee height.",
            "Hold for 2 seconds, then lower down slowly."
        ],
        "suggested_dosage": "2 sets of 10 repetitions per leg",
        "precautions": ["Keep your lower back flat on the floor."],
        "stop_conditions": ["Stop if sharp patellar pain occurs."],
        "evidence_note": "Clinical knee rehabilitation non-weight-bearing standard."
    },
    {
        "id": "knee_wall_sit_isometric",
        "name": "Supported Wall Squat Isometric",
        "category": "Quadriceps & Tendon Load Capacity",
        "body_area": "knee",
        "purpose": "Builds quad and tendon endurance with controlled, stable joint angles.",
        "difficulty": "Intermediate",
        "instructions": [
            "Stand with your back against a smooth wall, feet about 2 feet in front of you.",
            "Slide down the wall until knees are bent to a comfortable angle (45 to 60 degrees, not past 90).",
            "Ensure knees stay behind your toes and hold for 20 to 30 seconds while breathing calmly.",
            "Slide back up to stand."
        ],
        "suggested_dosage": "3 holds of 20-30 seconds",
        "precautions": ["Do not let knees cave inward."],
        "stop_conditions": ["Stop immediately if patellar pain is felt."],
        "evidence_note": "Patellar tendinopathy isometric loading guidelines."
    },

    # --- ANKLES & FEET ---
    {
        "id": "ankle_alphabet_pumps",
        "name": "Ankle Pumps & Mobility Circles",
        "category": "Ankle Range of Motion & Circulation",
        "body_area": "ankle",
        "purpose": "Improves dorsiflexion, plantarflexion, and lower leg circulation.",
        "difficulty": "Very Gentle",
        "instructions": [
            "Sit with leg extended or foot elevated.",
            "Point toes forward, pull back toward shin, then trace big alphabet letters in the air.",
            "Repeat on the opposite ankle."
        ],
        "suggested_dosage": "2 minutes per foot, 2x daily",
        "precautions": ["Move only the ankle, keep leg stationary."],
        "stop_conditions": ["Stop if calf pain or unusual swelling occurs."],
        "evidence_note": "Lower extremity mobility foundation."
    },
    {
        "id": "ankle_calf_raise",
        "name": "Standing Heel Raises",
        "category": "Gastrocnemius & Soleus Strengthening",
        "body_area": "ankle",
        "purpose": "Strengthens calves and Achilles tendon to support stable gait and balance.",
        "difficulty": "Beginner",
        "instructions": [
            "Stand near a wall or sturdy counter for light fingertip balance.",
            "Slowly rise up onto the balls of your feet, lifting heels as high as comfortable.",
            "Hold for 1 second at the top, then lower heels down with control over 3 seconds."
        ],
        "suggested_dosage": "2 sets of 12 repetitions",
        "precautions": ["Control the lowering phase; don't drop down quickly."],
        "stop_conditions": ["Stop if sharp Achilles tendon pain is felt."],
        "evidence_note": "Achilles tendon loading & balance protocol."
    }
]

class ExerciseService:
    @staticmethod
    def get_exercises_for_assessment(
        body_area: Optional[str] = None,
        is_safe_for_exercise: bool = True
    ) -> list[ExerciseRecommendationSchema]:
        """
        Retrieves safe educational exercises.
        If safety screening flags unsafe conditions, returns EMPTY list with a referral policy.
        """
        if not is_safe_for_exercise:
            return []

        results: list[ExerciseRecommendationSchema] = []
        target_area = (body_area or "").lower().strip()

        # Map user terms
        area_mapping = {
            "neck": "neck",
            "cervical": "neck",
            "shoulder": "shoulder",
            "shoulders": "shoulder",
            "upper_back": "upper_back",
            "thoracic": "upper_back",
            "lower_back": "lower_back",
            "lumbar": "lower_back",
            "back": "lower_back",
            "hip": "hip",
            "hips": "hip",
            "knee": "knee",
            "knees": "knee",
            "ankle": "ankle",
            "foot": "ankle",
            "feet": "ankle"
        }

        normalized_area = area_mapping.get(target_area, None)

        for ex in EXERCISE_DATABASE:
            if normalized_area is None or ex["body_area"] == normalized_area:
                results.append(ExerciseRecommendationSchema(**ex))

        # If general or other, provide well-rounded postural set
        if not results:
            for ex in EXERCISE_DATABASE:
                if ex["body_area"] in ["neck", "shoulder", "lower_back"]:
                    results.append(ExerciseRecommendationSchema(**ex))

        return results

    @staticmethod
    def get_all_exercises() -> list[ExerciseRecommendationSchema]:
        return [ExerciseRecommendationSchema(**ex) for ex in EXERCISE_DATABASE]
