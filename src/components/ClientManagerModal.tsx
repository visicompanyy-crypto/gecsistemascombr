import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Pencil, Trash2, UserCircle } from "lucide-react";

interface Client {
  id: string;
  name: string;
  pix_key: string;
  pix_key_type: string;
}

interface ClientManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

const PIX_KEY_TYPES = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "telefone", label: "Telefone" },
  { value: "aleatoria", label: "Chave Aleatória" },
];

const formatPixKey = (value: string, type: string): string => {
  const digits = value.replace(/\D/g, "");
  
  switch (type) {
    case "cpf":
      return digits
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    case "cnpj":
      return digits
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    case "telefone":
      if (digits.length <= 2) return digits;
      if (digits.length <= 4) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
      if (digits.length <= 6) return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
      return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 9)}-${digits.slice(9, 13)}`;
    default:
      return value;
  }
};

const validatePixKey = (value: string, type: string): boolean => {
  const digits = value.replace(/\D/g, "");
  
  switch (type) {
    case "cpf":
      return digits.length === 11;
    case "cnpj":
      return digits.length === 14;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case "telefone":
      return digits.length >= 12 && digits.length <= 13;
    case "aleatoria":
      return value.trim().length > 0;
    default:
      return true;
  }
};

const getPixKeyPlaceholder = (type: string): string => {
  switch (type) {
    case "cpf":
      return "000.000.000-00";
    case "cnpj":
      return "00.000.000/0000-00";
    case "email":
      return "email@exemplo.com";
    case "telefone":
      return "+55 11 99999-9999";
    case "aleatoria":
      return "Chave aleatória";
    default:
      return "";
  }
};

export function ClientManagerModal({ open, onOpenChange, onUpdate }: ClientManagerModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [pixKeyType, setPixKeyType] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const fetchClients = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("name");
      
      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar clientes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open, user?.id]);

  const resetForm = () => {
    setName("");
    setPixKeyType("");
    setPixKey("");
    setEditingClient(null);
  };

  const handlePixKeyChange = (value: string) => {
    if (pixKeyType && pixKeyType !== "email" && pixKeyType !== "aleatoria") {
      setPixKey(formatPixKey(value, pixKeyType));
    } else {
      setPixKey(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o nome do cliente.",
        variant: "destructive",
      });
      return;
    }

    if (!pixKeyType) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione o tipo de chave PIX.",
        variant: "destructive",
      });
      return;
    }

    if (!pixKey.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe a chave PIX do cliente.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePixKey(pixKey, pixKeyType)) {
      toast({
        title: "Chave PIX inválida",
        description: `O formato da chave ${PIX_KEY_TYPES.find(t => t.value === pixKeyType)?.label} está incorreto.`,
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    const isDuplicate = clients.some(
      c => c.name.toLowerCase() === name.trim().toLowerCase() && 
           c.pix_key === pixKey.trim() &&
           c.id !== editingClient?.id
    );

    if (isDuplicate) {
      toast({
        title: "Cliente duplicado",
        description: "Já existe um cliente com este nome e chave PIX.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      if (editingClient) {
        // Update existing client
        const { error } = await supabase
          .from("clients")
          .update({
            name: name.trim(),
            pix_key_type: pixKeyType,
            pix_key: pixKey.trim(),
          })
          .eq("id", editingClient.id);

        if (error) throw error;

        toast({
          title: "Cliente atualizado",
          description: `${name} foi atualizado com sucesso.`,
        });
      } else {
        // Insert new client
        const { error } = await supabase.from("clients").insert({
          name: name.trim(),
          pix_key_type: pixKeyType,
          pix_key: pixKey.trim(),
          user_id: user?.id,
        });

        if (error) throw error;

        toast({
          title: "Cliente cadastrado",
          description: `${name} foi adicionado com sucesso.`,
        });
      }

      resetForm();
      fetchClients();
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: editingClient ? "Erro ao atualizar" : "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setPixKeyType(client.pix_key_type);
    setPixKey(client.pix_key);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientToDelete.id);

      if (error) throw error;

      toast({
        title: "Cliente excluído",
        description: `${clientToDelete.name} foi removido com sucesso.`,
      });

      fetchClients();
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const getPixTypeLabel = (type: string) => {
    return PIX_KEY_TYPES.find(t => t.value === type)?.label || type;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground text-xl">
              <Users className="h-6 w-6 text-primary" />
              Gerenciar Clientes
            </DialogTitle>
          </DialogHeader>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nome do Cliente <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pixKeyType" className="text-foreground">
                  Tipo da Chave PIX <span className="text-destructive">*</span>
                </Label>
                <Select value={pixKeyType} onValueChange={(value) => {
                  setPixKeyType(value);
                  setPixKey("");
                }}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="pixKey" className="text-foreground">
                Chave PIX <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pixKey"
                placeholder={getPixKeyPlaceholder(pixKeyType)}
                value={pixKey}
                onChange={(e) => handlePixKeyChange(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary/90"
              >
                {saving ? "Salvando..." : editingClient ? "Atualizar" : "+ Adicionar"}
              </Button>
              {editingClient && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="border-t border-border my-4" />

          {/* Clients List Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Clientes cadastrados
              </h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {clients.length}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando...
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <UserCircle className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Nenhum cliente cadastrado ainda
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Adicione seu primeiro cliente usando o formulário acima.
                </p>
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-foreground font-medium">Nome</TableHead>
                      <TableHead className="text-foreground font-medium">Tipo PIX</TableHead>
                      <TableHead className="text-foreground font-medium">Chave PIX</TableHead>
                      <TableHead className="text-foreground font-medium text-right w-24">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow 
                        key={client.id} 
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground">
                          {client.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {getPixTypeLabel(client.pix_key_type)}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-sm max-w-[200px] truncate">
                          {client.pix_key}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(client)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(client)}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir <strong>{clientToDelete?.name}</strong> e sua chave PIX? 
              Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
