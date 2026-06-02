import { Link } from "react-router-dom";
import { Map, Users, Eye, Layers, ClipboardList, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const problems = [
  "Certains comprennent mais n'osent pas parler",
  "Certains parlent beaucoup mais restent imprécis",
  "Certains bloquent sur les consignes",
  "Certains manquent de vocabulaire",
  "Certains écrivent difficilement",
  "Certains ont besoin de structure",
  "Certains peuvent travailler en autonomie",
];

const steps = [
  { icon: Users, label: "Créer une classe", desc: "Ajoutez vos apprenants en quelques clics" },
  { icon: Eye, label: "Observer les compétences", desc: "Notez rapidement chaque élève sur une grille" },
  { icon: Map, label: "Visualiser la carte", desc: "Voyez les besoins de toute la classe d'un coup d'œil" },
  { icon: Layers, label: "Former les groupes", desc: "Groupes de besoin générés automatiquement" },
  { icon: ClipboardList, label: "Préparer la séance", desc: "Plan différencié adapté à chaque groupe" },
];

const outputs = [
  "Carte de classe par compétence",
  "Groupes de besoin automatiques",
  "Priorités collectives",
  "Élèves à surveiller",
  "Plan de séance différenciée",
  "Rapport professeur",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Map className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold text-lg">ClassMap FLE</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-body">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-body">Commencer</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Voir les besoins d'une classe FLE<br />
            <span className="text-primary">en un coup d'œil.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-10 leading-relaxed">
            ClassMap FLE aide les professeurs à identifier les profils, former des groupes de besoin et préparer des séances adaptées à une classe hétérogène.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="font-body text-base px-8 gap-2">
                Créer une classe <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="font-body text-base px-8">
                Voir un exemple de carte
              </Button>
            </Link>
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-16">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80"
            alt="ClassMap FLE illustration"
            className="w-full rounded-2xl shadow-xl border border-border/50"
          />
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-4">
            Une classe FLE n'est jamais vraiment homogène.
          </h2>
          <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
            Chaque apprenant a des besoins différents. Comment enseigner efficacement à tous ?
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((p, i) => (
              <div key={i} className="bg-background rounded-xl border border-border p-5 font-body text-sm text-foreground leading-relaxed">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">
            Une méthode simple en 5 étapes
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="font-heading font-semibold text-sm mb-1">{s.label}</div>
                <p className="text-xs text-muted-foreground font-body">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outputs */}
      <section className="py-20 px-6 bg-card border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">
            Ce que vous obtenez
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            {outputs.map((o, i) => (
              <div key={i} className="flex items-center gap-3 bg-background rounded-xl border border-border p-4">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-body text-sm text-foreground">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
          Prêt à voir votre classe autrement ?
        </h2>
        <p className="text-muted-foreground font-body mb-8">
          Créez votre première classe en moins de 2 minutes.
        </p>
        <Link to="/register">
          <Button size="lg" className="font-body text-base px-8 gap-2">
            Commencer gratuitement <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}