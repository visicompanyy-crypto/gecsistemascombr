import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  pix_key: string;
  pix_key_type: string;
}

interface ClientSelectorProps {
  selectedClientId: string;
  onClientChange: (clientId: string, pixKey: string, clientName: string) => void;
}

const PIX_KEY_TYPES = [
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'email', label: 'E-mail' },
  { value: 'celular', label: 'Celular' },
  { value: 'chave_aleatoria', label: 'Chave aleatória' },
];

export function ClientSelector({ selectedClientId, onClientChange }: ClientSelectorProps) {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    pix_key_type: '',
    pix_key: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('clients')
        .select('id, name, pix_key, pix_key_type')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      onClientChange(client.id, client.pix_key, client.name);
    }
  };

  const handleSaveClient = async () => {
    if (!newClient.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!newClient.pix_key_type) {
      toast({
        title: "Erro",
        description: "Tipo da chave PIX é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!newClient.pix_key.trim()) {
      toast({
        title: "Erro",
        description: "Chave PIX é obrigatória",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: newClient.name.trim(),
          pix_key_type: newClient.pix_key_type,
          pix_key: newClient.pix_key.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Cliente cadastrado",
        description: "O cliente foi salvo com sucesso.",
      });

      // Update clients list
      setClients(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      
      // Select the new client automatically
      onClientChange(data.id, data.pix_key, data.name);

      // Close modal and reset form
      setModalOpen(false);
      setNewClient({ name: '', pix_key_type: '', pix_key: '' });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Cliente */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Cliente *</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="h-7 gap-1 text-xs text-primary hover:text-primary/90"
            >
              <Plus className="w-3 h-3" />
              Adicionar cliente
            </Button>
          </div>
          <Select
            value={selectedClientId}
            onValueChange={handleClientSelect}
          >
            <SelectTrigger className="border-input bg-white focus:ring-primary">
              <SelectValue placeholder={loading ? "Carregando..." : "Selecione um cliente"} />
            </SelectTrigger>
            <SelectContent>
              {clients.length === 0 ? (
                <div className="px-2 py-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Nenhum cliente cadastrado</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalOpen(true)}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar cliente
                  </Button>
                </div>
              ) : (
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      {client.name}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Chave PIX (read-only) */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Chave PIX</Label>
          <Input
            value={selectedClient?.pix_key || ''}
            readOnly
            placeholder="Selecione um cliente"
            className="border-input bg-muted/50 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Modal de Cadastro de Cliente */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-secondary flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Novo Cliente
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Nome do cliente */}
            <div className="space-y-2">
              <Label htmlFor="client-name" className="text-sm text-muted-foreground">
                Nome do cliente *
              </Label>
              <Input
                id="client-name"
                placeholder="Ex: João da Silva"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                className="border-input bg-white focus-visible:ring-primary"
              />
            </div>

            {/* Tipo da chave PIX */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Tipo da chave PIX *</Label>
              <Select
                value={newClient.pix_key_type}
                onValueChange={(value) => setNewClient({ ...newClient, pix_key_type: value })}
              >
                <SelectTrigger className="border-input bg-white focus:ring-primary">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PIX_KEY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chave PIX */}
            <div className="space-y-2">
              <Label htmlFor="pix-key" className="text-sm text-muted-foreground">
                Chave PIX *
              </Label>
              <Input
                id="pix-key"
                placeholder={
                  newClient.pix_key_type === 'cpf' ? '000.000.000-00' :
                  newClient.pix_key_type === 'cnpj' ? '00.000.000/0000-00' :
                  newClient.pix_key_type === 'email' ? 'email@exemplo.com' :
                  newClient.pix_key_type === 'celular' ? '+55 11 99999-9999' :
                  'Cole a chave aleatória'
                }
                value={newClient.pix_key}
                onChange={(e) => setNewClient({ ...newClient, pix_key: e.target.value })}
                className="border-input bg-white focus-visible:ring-primary"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="flex-1 sm:flex-initial border-input"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSaveClient}
              disabled={saving}
              className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {saving ? 'Salvando...' : 'Salvar cliente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
