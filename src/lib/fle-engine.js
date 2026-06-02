// ─── FLE Engine ────────────────────────────────────────────────────────────
// Scoring, profils, priorités, groupes, alertes

export const SCORE_MAP = { solide: 4, correct: 3, fragile: 2, bloqué: 1 };
export const WEAK = ["fragile", "bloqué"];

export const ALL_CRITERIA = [
  { key: "instruction_comprehension", label: "Compréhension des consignes", short: "Consignes" },
  { key: "participation",             label: "Participation orale",         short: "Particip." },
  { key: "oral_confidence",           label: "Confiance orale",             short: "Confiance" },
  { key: "vocabulary",                label: "Vocabulaire disponible",      short: "Vocab." },
  { key: "grammar_accuracy",          label: "Précision grammaticale",      short: "Gramm." },
  { key: "written_production",        label: "Production écrite",           short: "Écrit" },
  { key: "comprehension",             label: "Compréhension écrite/orale",  short: "Compréh." },
  { key: "autonomy",                  label: "Autonomie",                   short: "Autonomie" },
  { key: "error_reaction",            label: "Réaction face à l'erreur",    short: "Réact." },
  { key: "oral_production",           label: "Production orale",            short: "Oral" },
];

export const QUICK_KEYS   = ["instruction_comprehension", "participation", "vocabulary", "written_production", "autonomy"];
export const STANDARD_KEYS = ["instruction_comprehension", "participation", "oral_confidence", "vocabulary",
                               "grammar_accuracy", "written_production", "comprehension", "autonomy", "error_reaction"];
export const COMPLETE_KEYS = ALL_CRITERIA.map(c => c.key);

// ── Tags individuels ──────────────────────────────────────────────────────
export const TAG_META = {
  soutien_prioritaire:        { label: "Soutien prioritaire",      color: "bg-red-100 text-red-800 border-red-200" },
  comprend_mais_parle_peu:    { label: "Comprend mais parle peu",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  oral_a_securiser:           { label: "Oral à sécuriser",         color: "bg-amber-100 text-amber-800 border-amber-200" },
  besoin_consignes:           { label: "Besoin consignes",         color: "bg-rose-100 text-rose-800 border-rose-200" },
  vocabulaire_fonctionnel_faible: { label: "Vocabulaire faible",   color: "bg-purple-100 text-purple-800 border-purple-200" },
  ecrit_fragile:              { label: "Écrit fragile",            color: "bg-orange-100 text-orange-800 border-orange-200" },
  grammaire_a_stabiliser:     { label: "Grammaire à stabiliser",   color: "bg-pink-100 text-pink-800 border-pink-200" },
  autonomie_faible:           { label: "Autonomie faible",         color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  profil_autonome:            { label: "Profil autonome",          color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  profil_a_confirmer:         { label: "Profil à confirmer",       color: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function computeTags(obs) {
  if (!obs) return { main: "profil_a_confirmer", secondary: [], reliability: "low" };
  const unobserved = ALL_CRITERIA.filter(c => !obs[c.key] || obs[c.key] === "non observé").length;
  if (unobserved >= 8) return { main: "profil_a_confirmer", secondary: [], reliability: "low" };

  const tags = [];
  const weakCount = ALL_CRITERIA.filter(c => WEAK.includes(obs[c.key])).length;

  if (weakCount >= 3) tags.push("soutien_prioritaire");
  if (["solide", "correct"].includes(obs.comprehension) && WEAK.includes(obs.participation) && WEAK.includes(obs.oral_confidence)) tags.push("comprend_mais_parle_peu");
  if (WEAK.includes(obs.oral_confidence) && WEAK.includes(obs.error_reaction) && WEAK.includes(obs.participation)) tags.push("oral_a_securiser");
  if (WEAK.includes(obs.instruction_comprehension)) tags.push("besoin_consignes");
  if (WEAK.includes(obs.vocabulary)) tags.push("vocabulaire_fonctionnel_faible");
  if (WEAK.includes(obs.written_production)) tags.push("ecrit_fragile");
  if (WEAK.includes(obs.grammar_accuracy)) tags.push("grammaire_a_stabiliser");
  if (WEAK.includes(obs.autonomy)) tags.push("autonomie_faible");
  if (["solide", "correct"].includes(obs.autonomy)) {
    const solidCount = ALL_CRITERIA.filter(c => ["solide", "correct"].includes(obs[c.key])).length;
    if (solidCount >= 5) tags.push("profil_autonome");
  }
  if (unobserved >= 4) tags.push("profil_a_confirmer");

  const main = tags[0] || "profil_a_confirmer";
  const secondary = [...new Set(tags.slice(1))].slice(0, 4);
  const reliability = unobserved <= 2 ? "high" : unobserved <= 5 ? "medium" : "low";
  return { main, secondary, reliability };
}

// ── Priorités collectives ─────────────────────────────────────────────────
const PRIORITY_ADVICE = {
  instruction_comprehension: {
    risk: "Les erreurs peuvent venir de la consigne, pas du français lui-même.",
    action: "Travailler les verbes de consigne avant les exercices (entourer, relier, compléter).",
  },
  participation: {
    risk: "Faible participation masque le niveau réel de la classe.",
    action: "Créer des rituels de prise de parole courte et sécurisée.",
  },
  oral_confidence: {
    risk: "Le manque de confiance freine toute la progression orale.",
    action: "Réponses courtes préparées. Pas de correction immédiate.",
  },
  vocabulary: {
    risk: "Vocabulaire limité bloque la communication dans tous les domaines.",
    action: "Lexique situationnel ciblé avant chaque activité de production.",
  },
  grammar_accuracy: {
    risk: "Les erreurs récurrentes peuvent se fossiliser si non traitées.",
    action: "Un point grammatical à la fois, ancré dans le contexte de classe.",
  },
  written_production: {
    risk: "Production écrite fragile fausse l'évaluation du niveau réel.",
    action: "Introduire des modèles à compléter avant la production libre.",
  },
  comprehension: {
    risk: "Compréhension insuffisante compromet toutes les activités réceptives.",
    action: "Travailler la compréhension globale avant le détail.",
  },
  autonomy: {
    risk: "Dépendance à l'enseignant freine le rythme de la classe.",
    action: "Fiches-guides avec étapes numérotées. Encourager l'auto-vérification.",
  },
  error_reaction: {
    risk: "Blocage face à l'erreur inhibe la prise de risque linguistique.",
    action: "Dédramatiser l'erreur. Intégrer des activités de correction entre pairs.",
  },
  oral_production: {
    risk: "Production orale faible indique un fossé réception/expression.",
    action: "Activités de reformulation et production orale guidée.",
  },
};

export function computePriorities(learners, obsMap) {
  if (!learners.length) return [];
  const total = learners.length;
  return ALL_CRITERIA.map(c => {
    const dist = { solide: 0, correct: 0, fragile: 0, bloqué: 0, "non observé": 0 };
    learners.forEach(l => {
      const val = obsMap[l.id]?.[c.key] || "non observé";
      dist[val] = (dist[val] || 0) + 1;
    });
    const weakCount = dist.fragile + dist.bloqué;
    const weakPct = weakCount / total;
    const priority = weakPct >= 0.4 ? "forte" : weakPct >= 0.25 ? "moyenne" : "faible";
    const advice = PRIORITY_ADVICE[c.key] || { risk: "", action: "" };
    return { ...c, dist, weakCount, weakPct, priority, ...advice };
  }).sort((a, b) => b.weakPct - a.weakPct);
}

// ── Alertes ───────────────────────────────────────────────────────────────
export function computeAlerts(learners, obsMap) {
  const alerts = [];
  learners.forEach(l => {
    const obs = obsMap[l.id];
    if (!obs) {
      alerts.push({ learner: l, type: "données_insuffisantes", label: "Données insuffisantes", icon: "❓", action: "Observer cet élève dès la prochaine séance." });
      return;
    }
    const unobserved = ALL_CRITERIA.filter(c => !obs[c.key] || obs[c.key] === "non observé").length;
    if (unobserved >= 6) {
      alerts.push({ learner: l, type: "données_insuffisantes", label: "Données insuffisantes", icon: "❓", action: `${unobserved} critères non observés. Compléter l'observation.` });
    }
    const weakFields = ALL_CRITERIA.filter(c => WEAK.includes(obs[c.key])).map(c => c.short);
    if (weakFields.length >= 3) {
      alerts.push({ learner: l, type: "soutien_prioritaire", label: "Soutien prioritaire", icon: "🔴", action: `Fragile/bloqué en : ${weakFields.slice(0, 4).join(", ")}. Prévoir un temps individuel ou petit groupe renforcé.` });
    }
    if (WEAK.includes(obs.oral_confidence) && WEAK.includes(obs.participation)) {
      alerts.push({ learner: l, type: "confiance_orale_basse", label: "Confiance orale basse", icon: "🔇", action: "Éviter interrogation directe. Utiliser binôme sécurisé. Phrases modèles." });
    }
    if (WEAK.includes(obs.autonomy) && !weakFields.includes("Consignes")) {
      alerts.push({ learner: l, type: "autonomie_faible", label: "Autonomie faible", icon: "🧩", action: "Proposer une fiche-guide avec étapes numérotées et auto-vérification." });
    }
    if (["solide", "correct"].includes(obs.comprehension) && WEAK.includes(obs.written_production) && WEAK.includes(obs.oral_production)) {
      alerts.push({ learner: l, type: "décalage_compréhension_production", label: "Décalage compréhension/production", icon: "⚡", action: "Travail de passage réception → expression. Activités de reformulation guidée." });
    }
    const solidCount = ALL_CRITERIA.filter(c => ["solide", "correct"].includes(obs[c.key])).length;
    if (solidCount >= 6 && ["solide", "correct"].includes(obs.autonomy)) {
      alerts.push({ learner: l, type: "élève_ressource", label: "Élève ressource", icon: "⭐", action: "Proposer rôle de pair aidant ou activité défi. Ne pas freiner." });
    }
  });
  return alerts;
}

// ── Groupes de besoin ─────────────────────────────────────────────────────
const GROUP_INFO = {
  consignes:    { priority: "haute",   duration: "15–20 min", success: "L'élève exécute la consigne sans aide supplémentaire.", teacherNote: "Ne pas reformuler d'emblée. Laisser chercher, puis guider par question." },
  oral:         { priority: "haute",   duration: "15–20 min", success: "L'élève répond en phrase courte sans aide.", teacherNote: "Pas de correction immédiate. Valoriser chaque tentative orale." },
  vocabulaire:  { priority: "moyenne", duration: "15 min",    success: "L'élève réutilise 3 nouveaux mots en contexte.", teacherNote: "Répétition espacée. Ne pas surcharger en vocabulaire nouveau." },
  ecrit:        { priority: "moyenne", duration: "20 min",    success: "L'élève produit une phrase correcte sans modèle.", teacherNote: "Correction ciblée sur 1 type d'erreur à la fois." },
  grammaire:    { priority: "moyenne", duration: "15 min",    success: "L'élève applique la règle sans erreur sur 3 exemples.", teacherNote: "Mini-routine : modèle → répétition → production libre." },
  autonomie:    { priority: "faible",  duration: "10–15 min", success: "L'élève passe à l'étape suivante sans demander d'aide.", teacherNote: "Poser des questions guidantes plutôt que donner la réponse." },
  consolidation:{ priority: "faible",  duration: "15 min",    success: "L'élève atteint « solide » sur 2 compétences ciblées.", teacherNote: "Valoriser la progression. Auto-évaluation en fin de séquence." },
  defi:         { priority: "faible",  duration: "20–25 min", success: "L'élève produit de manière autonome avec créativité.", teacherNote: "Plusieurs options. Ne pas sur-cadrer. Rôle pair aidant possible." },
};

const GROUP_RISK = {
  consignes:    { risk: "Les erreurs peuvent venir de la consigne, pas du français lui-même.", action: "Travailler les verbes de consigne avant les exercices." },
  oral:         { risk: "Blocage à l'oral peut freiner toute la progression.", action: "Espace sécurisé, phrases modèles, binôme de confiance." },
  vocabulaire:  { risk: "Vocabulaire limité bloque la communication.", action: "Lexique situationnel avant activités de production." },
  ecrit:        { risk: "Production écrite fragile fausse l'évaluation du niveau.", action: "Modèles à compléter avant production libre." },
  grammaire:    { risk: "Erreurs récurrentes peuvent se fossiliser.", action: "Un point à la fois, ancré dans le contexte de classe." },
  autonomie:    { risk: "Dépendance freine le rythme collectif.", action: "Checklist de tâche et auto-vérification systématique." },
  consolidation:{ risk: "Niveau fragile peut régresser sans renforcement.", action: "Révision active avec auto-évaluation." },
  defi:         { risk: "Élèves avancés se décrochent si pas stimulés.", action: "Tâche ouverte ou rôle de pair aidant." },
};

function makeGroup(type, name, memberIds, activity) {
  const info = GROUP_INFO[type];
  const risk = GROUP_RISK[type];
  const unique = [...new Set(memberIds)];
  return { type, name, priority: info.priority, memberIds: unique, activity, duration: info.duration, success: info.success, teacherNote: info.teacherNote, ...risk };
}

function splitIfNeeded(groups, type, name, memberIds, activity) {
  const unique = [...new Set(memberIds)];
  if (unique.length === 0) return;
  if (unique.length > 6) {
    const half = Math.ceil(unique.length / 2);
    groups.push(makeGroup(type, name + " A", unique.slice(0, half), activity));
    groups.push(makeGroup(type, name + " B", unique.slice(half), activity));
  } else {
    groups.push(makeGroup(type, name, unique, activity));
  }
}

const has = (obsMap, learnerId, key) => WEAK.includes(obsMap[learnerId]?.[key]);

export function generateNeedGroups(learners, obsMap) {
  const groups = [];

  splitIfNeeded(groups, "consignes", "Groupe consignes",
    learners.filter(l => has(obsMap, l.id, "instruction_comprehension")).map(l => l.id),
    "Associer verbes de consigne à actions. Mini-cartes : entourer / compléter / relier / choisir / expliquer."
  );
  splitIfNeeded(groups, "oral", "Groupe oral sécurisé",
    learners.filter(l => has(obsMap, l.id, "oral_confidence") || has(obsMap, l.id, "participation")).map(l => l.id),
    "Réponses courtes préparées. Phrases modèles fournies. Dialogue en binôme."
  );
  splitIfNeeded(groups, "vocabulaire", "Groupe vocabulaire",
    learners.filter(l => has(obsMap, l.id, "vocabulary")).map(l => l.id),
    "Cartes mots/images par situation. Phrases utiles. Répétition espacée."
  );
  splitIfNeeded(groups, "ecrit", "Groupe écrit guidé",
    learners.filter(l => has(obsMap, l.id, "written_production")).map(l => l.id),
    "Phrases à compléter → modèle → variation → mini-production guidée."
  );
  splitIfNeeded(groups, "grammaire", "Groupe grammaire ciblée",
    learners.filter(l => has(obsMap, l.id, "grammar_accuracy")).map(l => l.id),
    "Un point à la fois. Erreurs fréquentes. Transformation de phrases. Mini-routine."
  );
  splitIfNeeded(groups, "autonomie", "Groupe autonomie",
    learners.filter(l => has(obsMap, l.id, "autonomy")).map(l => l.id),
    "Checklist de tâche. Choisir l'étape suivante. Demander de l'aide correctement. Auto-vérification."
  );

  const consolidationIds = learners.filter(l => {
    const d = obsMap[l.id] || {};
    const vals = ALL_CRITERIA.map(c => d[c.key]).filter(v => v && v !== "non observé");
    return vals.filter(v => v === "correct").length >= 3 && !vals.includes("bloqué") && !vals.includes("fragile");
  }).map(l => l.id);
  splitIfNeeded(groups, "consolidation", "Groupe consolidation",
    consolidationIds,
    "Révision active avec auto-évaluation. Renforcement des points corrects vers solide."
  );

  const defiIds = learners.filter(l => {
    const d = obsMap[l.id] || {};
    const solidCount = ALL_CRITERIA.filter(c => ["solide", "correct"].includes(d[c.key])).length;
    return solidCount >= 5 && ["solide", "correct"].includes(d.autonomy);
  }).map(l => l.id);
  splitIfNeeded(groups, "defi", "Groupe défi / extension",
    defiIds,
    "Tâche ouverte. Mini-projet. Production libre. Rôle de pair aidant."
  );

  return groups;
}

// ── Fiabilité de la carte ─────────────────────────────────────────────────
export function computeReliability(learners, obsMap) {
  if (learners.length === 0) return { label: "à compléter", score: 0, pct: 0 };
  const KEY_CRITERIA = ["instruction_comprehension", "participation", "oral_confidence", "vocabulary", "written_production", "comprehension", "autonomy"];
  let filled = 0;
  const total = learners.length * KEY_CRITERIA.length;
  learners.forEach(l => {
    const obs = obsMap[l.id] || {};
    KEY_CRITERIA.forEach(k => { if (obs[k] && obs[k] !== "non observé") filled++; });
  });
  const score = total > 0 ? filled / total : 0;
  const label = score >= 0.8 ? "carte solide" : score >= 0.6 ? "assez fiable" : score >= 0.35 ? "carte partielle" : "à compléter";
  return { label, score, pct: Math.round(score * 100) };
}

// ── Construction ClassMapResult ───────────────────────────────────────────
export function buildClassMapResult(classGroup, learners, learnerObservations) {
  const obsMap = {};
  learnerObservations.forEach(lo => { obsMap[lo.learner_id] = lo; });
  const priorities = computePriorities(learners, obsMap);
  const alerts = computeAlerts(learners, obsMap);
  const reliability = computeReliability(learners, obsMap);
  const learner_profiles = learners.map(l => ({
    learner_id: l.id, name: l.first_name, ...computeTags(obsMap[l.id] || {}),
  }));
  const recommended_groups = generateNeedGroups(learners, obsMap);
  const highPriorities = priorities.filter(p => p.priority === "forte");
  const medPriorities = priorities.filter(p => p.priority === "moyenne");
  const watchList = alerts.filter(a => a.type !== "élève_ressource");
  const resources = alerts.filter(a => a.type === "élève_ressource");
  const parts = [];
  if (learners.length > 0) parts.push(`Cette classe compte ${learners.length} apprenant${learners.length > 1 ? "s" : ""}.`);
  if (highPriorities.length > 0) parts.push(`Priorité forte : ${highPriorities.slice(0, 2).map(p => p.label).join(", ")}.`);
  if (medPriorities.length > 0) parts.push(`Priorité moyenne : ${medPriorities.slice(0, 2).map(p => p.label).join(", ")}.`);
  if (watchList.length > 0) parts.push(`${watchList.length} élève${watchList.length > 1 ? "s nécessitent" : " nécessite"} une attention particulière.`);
  if (resources.length > 0) parts.push(`Élève${resources.length > 1 ? "s ressources" : " ressource"} : ${resources.map(r => r.learner.first_name).join(", ")}.`);
  if (recommended_groups.length > 0) parts.push(`${recommended_groups.length} groupe${recommended_groups.length > 1 ? "s" : ""} de besoin recommandé${recommended_groups.length > 1 ? "s" : ""}.`);
  const risks = [];
  if (highPriorities.some(p => p.key === "instruction_comprehension")) risks.push("consignes fragiles");
  if (highPriorities.some(p => ["oral_confidence", "participation"].includes(p.key))) risks.push("oral fragile");
  if (highPriorities.some(p => p.key === "written_production")) risks.push("écrit fragile");
  if (highPriorities.some(p => p.key === "vocabulary")) risks.push("vocabulaire limité");
  if (highPriorities.some(p => p.key === "autonomy")) risks.push("autonomie faible");
  const unobservedLearners = learners.filter(l => !obsMap[l.id]);
  if (unobservedLearners.length > learners.length * 0.3) risks.push("données insuffisantes");
  return { class_summary: parts.join(" "), priorities, alerts, learner_profiles, recommended_groups, risks, reliability_label: reliability.label, reliability_pct: reliability.pct, reliability_score: reliability.score };
}

// ── Workflow pédagogique ──────────────────────────────────────────────────
export function computeClassWorkflow(classGroup, learners, observations, mapResult, groups, reports) {
  const hasLearners = learners.length > 0;
  const completedObs = observations.filter(o => o.status === "completed");
  const draftObs = observations.filter(o => o.status === "draft");
  const hasCompletedObs = completedObs.length > 0;
  const hasGroups = groups.length > 0;
  const hasSessionPlan = reports.some(r => r.report_type === "session_plan");
  const baseUrl = `/classes/${classGroup?.id}`;
  let status, human_label, next_action_label, next_action_url, missing_parts = [];
  if (!hasLearners) {
    status = "no_learners"; human_label = "Classe vide";
    next_action_label = "Ajouter des apprenants"; next_action_url = `${baseUrl}/add-learners`;
    missing_parts = ["apprenants"];
  } else if (!hasCompletedObs) {
    if (draftObs.length > 0) {
      status = "observation_draft"; human_label = "Observation en cours";
      next_action_label = "Continuer l'observation"; next_action_url = `${baseUrl}/observe/${draftObs[0].id}`;
      missing_parts = ["observation terminée"];
    } else {
      status = "ready_for_observation"; human_label = "Prête pour l'observation";
      next_action_label = "Lancer une observation"; next_action_url = `${baseUrl}/observe`;
      missing_parts = ["observation"];
    }
  } else if (!hasGroups) {
    status = mapResult ? "map_generated" : "observation_completed"; human_label = "Observation terminée";
    next_action_label = "Générer les groupes"; next_action_url = `${baseUrl}/groups`;
    missing_parts = ["groupes de besoin"];
  } else if (!hasSessionPlan) {
    status = "groups_generated"; human_label = "Groupes constitués";
    next_action_label = "Préparer la séance"; next_action_url = `${baseUrl}/session-plan`;
    missing_parts = ["plan de séance"];
  } else {
    status = "session_plan_ready"; human_label = "Classe prête";
    next_action_label = "Exporter la synthèse"; next_action_url = `${baseUrl}/print`;
    missing_parts = [];
  }
  return { status, human_label, next_action_label, next_action_url, missing_parts,
    can_generate_map: hasCompletedObs, can_generate_groups: hasCompletedObs,
    can_generate_session_plan: hasGroups, can_export: hasCompletedObs };
}