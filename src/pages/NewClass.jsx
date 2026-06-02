import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const levels = ["pré-A1", "A1", "A2", "B1", "B2", "mixte", "à confirmer"];
const contexts = ["école", "association", "cours privé", "centre de langue", "intégration", "examen", "autre"];
const profiles = ["enfants", "ados", "adultes", "mixte"];
const goals = ["oral", "consignes", "vocabulaire", "écrit", "grammaire", "conversation", "examen", "intégration", "soutien scolaire", "autre"];

export default function NewClass() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", level_label: "", context_type: "", profile_type: "", main_goal: "", notes: "" });

  const create = useMutation({
    mutationFn: (data) => base44.entities.ClassGroup.create({ ...data, status: "active" }),
    onSuccess: (result) => navigate(`/classes/${result.id}`),
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Link to="/classes"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="font-heading text-2xl font-bold">Nouvelle classe</h1>
          <p className="text-sm text-muted-foreground font-body">Créez une classe pour commencer</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div>
          <Label className="font-body text-sm font-medium">Nom de la classe *</Label>
          <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ex : Groupe A1 mardi" className="mt-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-body text-sm font-medium">Profil dominant</Label>
            <Select value={form.profile_type} onValueChange={v => set("profile_type", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{profiles.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-body text-sm font-medium">Contexte</Label>
            <Select value={form.context_type} onValueChange={v => set("context_type", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{contexts.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-body text-sm font-medium">Niveau général estimé</Label>
            <Select value={form.level_label} onValueChange={v => set("level_label", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-body text-sm font-medium">Objectif principal</Label>
            <Select value={form.main_goal} onValueChange={v => set("main_goal", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choisir" /></SelectTrigger>
              <SelectContent>{goals.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="font-body text-sm font-medium">Notes</Label>
          <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Notes libres sur la classe..." className="mt-1.5" rows={3} />
        </div>

        <Button onClick={() => create.mutate(form)} disabled={!form.name || create.isPending} className="w-full font-body">
          {create.isPending ? "Création..." : "Créer la classe"}
        </Button>
      </div>
    </div>
  );
}