import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings, COLOR_THEMES } from "@/contexts/CompanySettingsContext";
import { Building2, Layers, Palette, Upload, Plus, Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FirstAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const DEFAULT_COST_CENTERS = [
  { name: "Vendas", description: "Receitas de vendas" },
  { name: "Operacional", description: "Custos operacionais" },
  { name: "Administrativo", description: "Despesas administrativas" },
  { name: "Marketing", description: "Investimentos em marketing" },
  { name: "Impostos", description: "Tributos e taxas" },
  { name: "Fornecedores", description: "Pagamentos a fornecedores" },
];

const COLOR_OPTIONS = [
  { name: "Verde", value: "green", color: "hsl(136, 42%, 40%)" },
  { name: "Azul", value: "blue", color: "hsl(210, 84%, 45%)" },
  { name: "Roxo", value: "purple", color: "hsl(270, 60%, 50%)" },
  { name: "Laranja", value: "orange", color: "hsl(25, 95%, 53%)" },
  { name: "Vermelho", value: "red", color: "hsl(0, 84%, 50%)" },
];

export function FirstAccessModal({ open, onOpenChange, onComplete }: FirstAccessModalProps) {
  const { user } = useAuth();
  const { updateSettings } = useCompanySettings();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Step 2
  const [selectedCostCenters, setSelectedCostCenters] = useState<string[]>([
    "Vendas",
    "Operacional",
    "Administrativo",
  ]);
  const [newCostCenter, setNewCostCenter] = useState("");

  // Step 3
  const [selectedColor, setSelectedColor] = useState("green");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCostCenter = () => {
    if (newCostCenter.trim() && !selectedCostCenters.includes(newCostCenter.trim())) {
      setSelectedCostCenters([...selectedCostCenters, newCostCenter.trim()]);
      setNewCostCenter("");
    }
  };

  const toggleCostCenter = (name: string) => {
    setSelectedCostCenters((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile || !user) return null;

    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${user.id}/logo.${fileExt}`;

    const { error } = await supabase.storage
      .from("company-logos")
      .upload(fileName, logoFile, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from("company-logos").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const createCostCenters = async () => {
    if (!user || selectedCostCenters.length === 0) return;

    const costCentersToCreate = selectedCostCenters.map((name) => ({
      user_id: user.id,
      name,
      description: DEFAULT_COST_CENTERS.find((c) => c.name === name)?.description || `Centro de custo: ${name}`,
    }));

    const { error } = await supabase.from("cost_centers").insert(costCentersToCreate);
    if (error) throw error;
  };

  const handleNext = () => {
    if (step === 1 && !companyName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome da sua empresa.",
        variant: "destructive",
      });
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Upload logo if exists
      const logoUrl = await uploadLogo();

      // Create cost centers
      await createCostCenters();

      // Save company settings
      await updateSettings({
        company_name: companyName.trim(),
        logo_url: logoUrl,
        primary_color: selectedColor,
        onboarding_completed: true,
      });

      toast({
        title: "Configuração concluída!",
        description: `Bem-vindo, ${companyName}! Seu sistema está pronto.`,
      });

      onComplete?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300",
            s === step
              ? "bg-primary text-primary-foreground scale-110"
              : s < step
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {s < step ? <Check className="h-4 w-4" /> : s}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Vamos começar!</h2>
        <p className="text-sm text-muted-foreground">
          Como devemos chamar sua empresa dentro do sistema?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Nome da Empresa *</Label>
          <Input
            id="company-name"
            placeholder="Ex: Minha Empresa Ltda"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label>Logo da Empresa (opcional)</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
              "hover:border-primary/50 hover:bg-primary/5",
              logoPreview ? "border-primary" : "border-border"
            )}
          >
            {logoPreview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <span className="text-sm text-muted-foreground">Clique para alterar</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Clique para fazer upload da logo
                </span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Layers className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Centros de Custo</h2>
        <p className="text-sm text-muted-foreground">
          Selecione os centros de custo que deseja ativar
        </p>
      </div>

      <div className="space-y-3">
        {DEFAULT_COST_CENTERS.map((center) => (
          <div
            key={center.name}
            onClick={() => toggleCostCenter(center.name)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              selectedCostCenters.includes(center.name)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
            )}
          >
            <Checkbox
              checked={selectedCostCenters.includes(center.name)}
              onCheckedChange={() => toggleCostCenter(center.name)}
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{center.name}</p>
              <p className="text-xs text-muted-foreground">{center.description}</p>
            </div>
          </div>
        ))}

        {selectedCostCenters
          .filter((c) => !DEFAULT_COST_CENTERS.find((d) => d.name === c))
          .map((name) => (
            <div
              key={name}
              onClick={() => toggleCostCenter(name)}
              className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-primary/5 cursor-pointer"
            >
              <Checkbox checked onCheckedChange={() => toggleCostCenter(name)} />
              <div className="flex-1">
                <p className="font-medium text-sm">{name}</p>
                <p className="text-xs text-muted-foreground">Centro de custo personalizado</p>
              </div>
            </div>
          ))}

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Novo centro de custo"
            value={newCostCenter}
            onChange={(e) => setNewCostCenter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCostCenter()}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleAddCostCenter}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Você poderá editar ou excluir os centros de custo futuramente nas configurações
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Palette className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Cor da Empresa</h2>
        <p className="text-sm text-muted-foreground">
          Escolha a cor principal do sistema
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {COLOR_OPTIONS.map((color) => (
          <button
            key={color.value}
            onClick={() => setSelectedColor(color.value)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
              selectedColor === color.value
                ? "border-2 border-foreground scale-105"
                : "border-border hover:border-foreground/30"
            )}
          >
            <div
              className="w-10 h-10 rounded-full shadow-md"
              style={{ backgroundColor: color.color }}
            />
            <span className="text-xs font-medium">{color.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mt-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">Quase lá!</p>
            <p className="text-xs text-muted-foreground">
              Ao concluir, o sistema será personalizado com o nome "{companyName}" e a cor
              selecionada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6">
        {renderStepIndicator()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className={cn(step === 1 && "invisible")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          {step < 3 ? (
            <Button onClick={handleNext}>
              Avançar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Concluir"}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
