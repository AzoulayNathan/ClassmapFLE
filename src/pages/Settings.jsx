import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PREFS_KEY = "classmap_prefs";

const defaultPrefs = {
  default_obs_type: "standard",
  max_group_size: "5",
  include_resource_learners: "oui",
  include_defi_group: "oui",
  session_duration: "45",
  report_format: "complet",
};

function loadPrefs() {
  try { return { ...defaultPrefs, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") }; } catch { return defaultPrefs; }
}

export default function Settings() {
  const [user, setUser] = useState(null);
  const [prefs, setPrefs] = useState(loadPrefs);
  const [saved, setSaved] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

  const setPref = (key, value) => setPrefs(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Préférences et informations</p>
      </div>

      {/* Profil */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-heading font-semibold">Profil</h2>
        {user ? (
          <>
            <div>
              <Label className="font-body text-sm">Nom</Label>
              <Input value={user.full_name || ""} disabled className="mt-1 bg-muted font-body" />
            </div>
            <div>
              <Label className="font-body text-sm">Email</Label>
              <Input value={user.email || ""} disabled className="mt-1 bg-muted font-body" />
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground font-body">Chargement…</p>
        )}
      </div>

      {/* Préférences */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-heading font-semibold">Préférences pédagogiques</h2>

        <div>
          <Label className="font-body text-sm">Type d'observation par défaut</Label>
          <Select value={prefs.default_obs_type} onValueChange={v => setPref("default_obs_type", v)}>
            <SelectTrigger className="mt-1.5 font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="quick">Rapide — 5 critères</SelectItem>
              <SelectItem value="standard">Standard — 9 critères (recommandé)</SelectItem>
              <SelectItem value="complete">Complète — 10 critères détaillés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="font-body text-sm">Taille max recommandée par groupe</Label>
          <Select value={prefs.max_group_size} onValueChange={v => setPref("max_group_size", v)}>
            <SelectTrigger className="mt-1.5 font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 élèves</SelectItem>
              <SelectItem value="4">4 élèves</SelectItem>
              <SelectItem value="5">5 élèves (recommandé)</SelectItem>
              <SelectItem value="6">6 élèves</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="font-body text-sm">Inclure les élèves ressources dans la génération</Label>
          <Select value={prefs.include_resource_learners} onValueChange={v => setPref("include_resource_learners", v)}>
            <SelectTrigger className="mt-1.5 font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="oui">Oui — inclure dans un groupe défi</SelectItem>
              <SelectItem value="non">Non — ne pas les regrouper</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="font-body text-sm">Durée de séance par défaut</Label>
          <Select value={prefs.session_duration} onValueChange={v => setPref("session_duration", v)}>
            <SelectTrigger className="mt-1.5 font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="font-body text-sm">Format de rapport</Label>
          <Select value={prefs.report_format} onValueChange={v => setPref("report_format", v)}>
            <SelectTrigger className="mt-1.5 font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="court">Court — synthèse et groupes uniquement</SelectItem>
              <SelectItem value="complet">Complet — tous les éléments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} className="w-full font-body">
          {saved ? "✓ Préférences sauvegardées" : "Sauvegarder les préférences"}
        </Button>
        <p className="text-xs text-muted-foreground font-body text-center">Les préférences sont enregistrées localement sur cet appareil.</p>
      </div>

      {/* À propos */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-2">
        <h2 className="font-heading font-semibold">À propos</h2>
        <p className="font-body text-sm text-muted-foreground">
          ClassMap FLE aide les professeurs à visualiser les besoins d'une classe et organiser des groupes de travail.
          Ce n'est pas un outil de notation ni un LMS : c'est une carte pédagogique pour préparer des séances différenciées.
        </p>
      </div>

      {/* Confidentialité */}
      <div className="bg-muted/40 border border-border rounded-xl p-6 space-y-2">
        <h2 className="font-heading font-semibold">Confidentialité</h2>
        <ul className="space-y-1.5 font-body text-sm text-muted-foreground list-none">
          <li>→ Ne stocker que les informations pédagogiques nécessaires.</li>
          <li>→ Éviter les informations sensibles (santé, situation personnelle).</li>
          <li>→ Attention lors d'observations impliquant des mineurs.</li>
          <li>→ Les exports sont à partager avec prudence.</li>
        </ul>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={() => base44.auth.logout()} className="font-body">
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}