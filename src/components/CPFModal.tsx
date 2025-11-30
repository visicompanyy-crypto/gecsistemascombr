import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CPFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cpfCnpj: string) => void;
  isLoading: boolean;
  planName: string;
}

const formatCPFCNPJ = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length <= 11) {
    // CPF format: 000.000.000-00
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ format: 00.000.000/0000-00
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
};

const validateCPFCNPJ = (value: string): boolean => {
  const numbers = value.replace(/\D/g, "");
  return numbers.length === 11 || numbers.length === 14;
};

export const CPFModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  planName,
}: CPFModalProps) => {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPFCNPJ(e.target.value);
    if (formatted.replace(/\D/g, "").length <= 14) {
      setCpfCnpj(formatted);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!validateCPFCNPJ(cpfCnpj)) {
      setError("Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido");
      return;
    }
    onConfirm(cpfCnpj.replace(/\D/g, ""));
  };

  const handleClose = () => {
    setCpfCnpj("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Informações para pagamento</DialogTitle>
          <DialogDescription>
            Para assinar o <strong>{planName}</strong>, precisamos do seu CPF ou CNPJ.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
            <Input
              id="cpfCnpj"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              value={cpfCnpj}
              onChange={handleChange}
              className={error ? "border-red-500" : ""}
              autoComplete="off"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !cpfCnpj}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Continuar para pagamento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
