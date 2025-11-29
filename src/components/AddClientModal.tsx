import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus } from "lucide-react";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PIX_KEY_TYPES = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "telefone", label: "Telefone" },
  { value: "aleatoria", label: "Chave Aleatória" },
];

export function AddClientModal({ open, onOpenChange, onSuccess }: AddClientModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [pixKeyType, setPixKeyType] = useState("");
  const [pixKey, setPixKey] = useState("");

  const resetForm = () => {
    setName("");
    setPixKeyType("");
    setPixKey("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Informe o nome do cliente.",
        variant: "destructive",
      });
      return;
    }

    if (!pixKeyType) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de chave Pix.",
        variant: "destructive",
      });
      return;
    }

    if (!pixKey.trim()) {
      toast({
        title: "Erro",
        description: "Informe a chave Pix do cliente.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("clients").insert({
        name: name.trim(),
        pix_key_type: pixKeyType,
        pix_key: pixKey.trim(),
        user_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Cliente cadastrado!",
        description: `${name} foi adicionado com sucesso.`,
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar cliente",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <UserPlus className="h-5 w-5 text-primary" />
            Adicionar Cliente
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nome do Cliente</Label>
            <Input
              id="name"
              placeholder="Ex: João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pixKeyType" className="text-foreground">Tipo de Chave Pix</Label>
            <Select value={pixKeyType} onValueChange={setPixKeyType}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {PIX_KEY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pixKey" className="text-foreground">Chave Pix</Label>
            <Input
              id="pixKey"
              placeholder={
                pixKeyType === "cpf" ? "000.000.000-00" :
                pixKeyType === "cnpj" ? "00.000.000/0000-00" :
                pixKeyType === "email" ? "email@exemplo.com" :
                pixKeyType === "telefone" ? "+55 11 99999-9999" :
                "Chave aleatória"
              }
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? "Salvando..." : "Cadastrar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
