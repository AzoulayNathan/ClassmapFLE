import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Zap } from "lucide-react";
import { toast } from "sonner";

export default function AddLearners() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Manual form
  const [manual, setManual] = useState({ first_name: "", age: "", main_language: "", initial_level_estimate: "", notes: "" });

  // Quick paste
  const [quickText, setQuickText] = useState("");

  const createOne = useMutation({
    mutationFn: (data) => base44.entities.ClassLearner.create({ ...data, class_id: classId, status: "active" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learners", classId] });
      setManual({ first_name: "", age: "", main_language: "", initial_level_estimate: "", notes: "" });
      toast.success("Apprenant ajouté");
    },
  });

  const createBulk = useMutation({
    mutationFn: (items) => base44.entities.ClassLearner.bulkCreate(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learners", classId] });
      setQuickText("");
      toast.success("Apprenants ajoutés");
    },
  });

  const handleManualAdd = () => {
    if (!manual.first_name.trim()) return;
    createOne.mutate({
      first_name: manual.first_name.trim(),
      age: manual.age ? Number(manual.age) : undefined,
      main_language: manual.main_language.trim() || undefined,
      initial_level_estimate: manual.initial_level_estimate || undefined,
      notes: manual.notes.trim() || undefined,
    });
  };

  const handleQuickPaste = () => {
    const lines = quickText.split("\n").filter(l => l.trim());
    const items = lines.map(line => {
      const parts = line.split(",").map(s => s.trim());
      const learner = { class_id: classId, status: "active", first_name: parts[0] || "Sans nom" };
      if (parts[1]) {
        const num = parseInt(parts[1]);
        if (!isNaN(num) && num > 0 && num < 120) learner.age = num;
        else learner.main_language = parts[1];
      }
      if (parts[2]) learner.main_language = parts[2];
      return learner;
    });
    if (items.length > 0) createBulk.mutate(items);
  };

  const parsedPreview = quickText.split("\n").filter(l => l.trim()).map(line => {
    const parts = line.split(",").map(s => s.trim());
    return { name: parts[0], age: parts[1], lang: parts[2] };
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={`/classes/${classId}`}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="font-heading text-2xl font-bold">Ajouter des apprenants</h1>
          <p className="text-sm text-muted-foreground font-body">Ajout manuel ou collage rapide</p>
        </div>
      </div>

      <Tabs defaultValue="manual">
        <TabsList className="w-full">
          <TabsTrigger value="manual" className="flex-1 font-body gap-2"><Plus className="h-3.5 w-3.5" /> Manuel</TabsTrigger>
          <TabsTrigger value="quick" className="flex-1 font-body gap-2"><Zap className="h-3.5 w-3.5" /> Collage rapide</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <Label className="font-body text-sm font-medium">Prénom / Nom d'usage *</Label>
              <Input value={manual.first_name} onChange={e => setManual(m => ({ ...m, first_name: e.target.value }))} placeholder="Ex : Lina" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm font-medium">Âge</Label>
                <Input type="number" value={manual.age} onChange={e => setManual(m => ({ ...m, age: e.target.value }))} placeholder="Ex : 25" className="mt-1.5" />
              </div>
              <div>
                <Label className="font-body text-sm font-medium">Langue principale</Label>
                <Input value={manual.main_language} onChange={e => setManual(m => ({ ...m, main_language: e.target.value }))} placeholder="Ex : espagnol" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label className="font-body text-sm font-medium">Notes</Label>
              <Textarea value={manual.notes} onChange={e => setManual(m => ({ ...m, notes: e.target.value }))} placeholder="Notes optionnelles..." className="mt-1.5" rows={2} />
            </div>
            <Button onClick={handleManualAdd} disabled={!manual.first_name.trim() || createOne.isPending} className="w-full font-body">
              {createOne.isPending ? "Ajout..." : "Ajouter l'apprenant"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="quick">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <Label className="font-body text-sm font-medium">Coller la liste</Label>
              <p className="text-xs text-muted-foreground font-body mb-2">Format : Prénom, âge, langue (une ligne par apprenant)</p>
              <Textarea
                value={quickText}
                onChange={e => setQuickText(e.target.value)}
                placeholder={"Lina, 9, espagnol\nSami, 15, arabe\nMaria, 32, portugais"}
                className="mt-1 font-mono text-sm"
                rows={6}
              />
            </div>

            {parsedPreview.length > 0 && (
              <div>
                <p className="text-xs font-body font-medium text-muted-foreground mb-2">Aperçu ({parsedPreview.length} apprenant{parsedPreview.length !== 1 ? "s" : ""})</p>
                <div className="space-y-1">
                  {parsedPreview.map((p, i) => (
                    <div key={i} className="bg-muted/50 rounded-lg px-3 py-2 text-sm font-body flex items-center gap-3">
                      <span className="font-medium">{p.name}</span>
                      {p.age && <span className="text-muted-foreground text-xs">{p.age}</span>}
                      {p.lang && <span className="text-muted-foreground text-xs">{p.lang}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleQuickPaste} disabled={parsedPreview.length === 0 || createBulk.isPending} className="w-full font-body">
              {createBulk.isPending ? "Ajout..." : `Ajouter ${parsedPreview.length} apprenant${parsedPreview.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Link to={`/classes/${classId}`}>
          <Button variant="outline" className="font-body">Retour au profil de classe</Button>
        </Link>
      </div>
    </div>
  );
}