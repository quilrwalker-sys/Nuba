import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  ChevronRight, 
  CreditCard, 
  Smartphone, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  PlusCircle, 
  HelpCircle, 
  Settings, 
  User,
  ShoppingBag,
  TrendingUp,
  Heart,
  DollarSign,
  QrCode,
  SmartphoneIcon,
  BarChart3,
  ShieldCheck,
  LayoutGrid,
  X,
  Receipt,
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  Barcode as BarcodeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const IconButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
  <motion.div 
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
  >
    <div className="w-16 h-16 rounded-full bg-nu-gray flex items-center justify-center group-hover:bg-nu-gray/80 transition-all">
      <Icon size={24} className="text-nu-text" />
    </div>
    <span className="text-xs font-semibold text-center text-nu-text">{label}</span>
  </motion.div>
);

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  disabled = false,
  type = "button"
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string,
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white',
  size?: 'sm' | 'md' | 'lg',
  fullWidth?: boolean,
  disabled?: boolean,
  type?: "button" | "submit" | "reset"
}) => {
  const variants = {
    primary: "bg-nu-purple text-white",
    secondary: "bg-nu-gray text-nu-text",
    outline: "border-2 border-nu-purple text-nu-purple bg-transparent",
    ghost: "text-nu-purple bg-transparent",
    white: "bg-white text-nu-purple"
  };

  const sizes = {
    sm: "py-2 px-4 text-xs",
    md: "py-4 px-6 text-lg",
    lg: "py-5 px-8 text-xl"
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      whileHover={disabled ? {} : { scale: 1.01 }}
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : 'w-auto'} rounded-full font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`p-6 border-b border-nu-gray hover:bg-nu-gray/50 transition-colors cursor-pointer ${className}`}
  >
    {children}
  </div>
);

const InfoCard = ({ title, description, badge }: { title: string, description: string, badge?: string }) => (
  <div className="min-w-[280px] p-5 bg-nu-gray rounded-2xl flex flex-col gap-2 cursor-pointer hover:bg-nu-gray/80 transition-colors">
    {badge && <span className="text-nu-purple text-xs font-bold">{badge}</span>}
    <p className="text-sm leading-relaxed text-nu-text">
      <span className="font-bold">{title}</span> {description}
    </p>
  </div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeScreen, setActiveScreen] = useState<'home' | 'pix-area' | 'make-pix' | 'receipt' | 'loan-home' | 'loan-simulate' | 'loan-confirm' | 'loan-success'>('home');
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(1250.00);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState("1250.00");

  const [userName, setUserName] = useState("Usuário");
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [tempUserName, setTempUserName] = useState("Usuário");

  const [invoice, setInvoice] = useState(450.20);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [tempInvoice, setTempInvoice] = useState("450.20");

  // Pix Flow State
  const [pixValue, setPixValue] = useState("");
  const [pixRecipient, setPixRecipient] = useState("");
  const [pixRecipientCpf, setPixRecipientCpf] = useState("");
  const [pixRecipientKey, setPixRecipientKey] = useState("");
  const [pixRecipientInstitution, setPixRecipientInstitution] = useState("PICPAY");
  const [pixRecipientAccountType, setPixRecipientAccountType] = useState("Conta de pagamentos");
  
  const [lastTransaction, setLastTransaction] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  // Loan State
  const [activeLoans, setActiveLoans] = useState<{ amount: number, installments: number, total: number, rate: number, date: string }[]>([]);
  const [loanSimulation, setLoanSimulation] = useState({ amount: 5000, installments: 12 });
  const LOAN_INTEREST_RATE = 0.0475; // 4.75% monthly

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(num)) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const handleSaveBalance = () => {
    const val = parseFloat(tempBalance.replace(',', '.'));
    if (!isNaN(val)) {
      setBalance(val);
    }
    setIsEditingBalance(false);
  };

  const handleSaveInvoice = () => {
    const val = parseFloat(tempInvoice.replace(',', '.'));
    if (!isNaN(val)) {
      setInvoice(val);
    }
    setIsEditingInvoice(false);
  };

  const handleSaveUserName = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName);
    }
    setIsEditingUserName(false);
  };

  const handleConfirmPix = () => {
    const val = parseFloat(pixValue.replace(',', '.'));
    if (!isNaN(val) && val > 0 && val <= balance && pixRecipient.trim()) {
      setBalance(prev => prev - val);
      const transactionId = 'E' + Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toLowerCase();
      const transaction = {
        id: transactionId,
        value: val,
        recipient: pixRecipient,
        recipientCpf: pixRecipientCpf || '***.' + Math.floor(Math.random() * 900 + 100) + '.' + Math.floor(Math.random() * 900 + 100) + '-**',
        recipientKey: pixRecipientKey || Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 15),
        recipientInstitution: pixRecipientInstitution,
        recipientAccountType: pixRecipientAccountType,
        originName: userName,
        originCpf: '***.022.373-**',
        originAccount: '60359614-1',
        originAgency: '0001',
        originInstitution: 'NU PAGAMENTOS - IP',
        date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).toUpperCase()
      };
      setLastTransaction(transaction);
      setTransactions(prev => [transaction, ...prev]);
      setActiveScreen('receipt');
    } else {
      alert("Verifique o valor e o destinatário.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.replace(/\D/g, "").length === 11 && password.length >= 4) {
      setIsLoggedIn(true);
    } else {
      alert("Por favor, preencha o CPF (11 dígitos) e a senha corretamente.");
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formatted = value;
    if (value.length > 9) {
      formatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
    } else if (value.length > 6) {
      formatted = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      formatted = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    setCpf(formatted.slice(0, 14));
  };

  const renderLogin = () => (
    <div className="bg-nu-purple min-h-screen flex flex-col p-8 text-white">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-12">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" opacity=".3"/>
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
          </svg>
          <h1 className="text-4xl font-bold mt-6">Olá!</h1>
          <p className="text-white/80 mt-2">Digite seu CPF para entrar.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60">CPF</label>
            <input 
              type="text" 
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              className="w-full bg-transparent border-b border-white/30 py-3 text-xl font-medium outline-none focus:border-white transition-colors"
              maxLength={14}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full bg-transparent border-b border-white/30 py-3 text-xl font-medium outline-none focus:border-white transition-colors"
            />
          </div>

          <Button 
            type="submit"
            variant="white"
            className="mt-8"
          >
            Continuar
          </Button>
        </form>

        <div className="mt-8 space-y-4 text-center">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="text-sm font-bold text-white/80 hover:text-white transition-colors"
          >
            Esqueci minha senha
          </motion.button>
          <div className="pt-4">
            <p className="text-xs text-white/60">Ainda não tem conta?</p>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="text-sm font-bold text-white mt-1"
            >
              Criar conta
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSettingsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-3xl overflow-hidden shadow-2xl m-4"
          >
            <div className="p-6 border-b border-nu-gray flex justify-between items-center">
              <h3 className="text-xl font-bold">Configurações</h3>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 hover:bg-nu-gray rounded-full transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>
            
            <div className="p-6 space-y-2">
              <div 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-nu-gray cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-nu-purple/10 flex items-center justify-center text-nu-purple">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </div>
                  <div>
                    <p className="font-bold">Modo Noturno</p>
                    <p className="text-xs text-nu-text-muted">{isDarkMode ? 'Ativado' : 'Desativado'}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-nu-purple' : 'bg-gray-300'}`}>
                  <motion.div 
                    animate={{ x: isDarkMode ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-nu-gray cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-nu-purple/10 flex items-center justify-center text-nu-purple">
                    <User size={20} />
                  </div>
                  <p className="font-bold">Perfil</p>
                </div>
                <ChevronRight size={20} className="text-nu-text-muted" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-nu-gray cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-nu-purple/10 flex items-center justify-center text-nu-purple">
                    <HelpCircle size={20} />
                  </div>
                  <p className="font-bold">Ajuda</p>
                </div>
                <ChevronRight size={20} className="text-nu-text-muted" />
              </div>

              <div 
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsSettingsOpen(false);
                }}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-red-50 text-red-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <p className="font-bold">Sair do app</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-nu-gray/30 text-center">
              <p className="text-[10px] text-nu-text-muted">Nubank Clone v2.0.0</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderHome = () => (
    <>
      {/* Header */}
      <header className="bg-nu-purple p-6 pb-8">
        <div className="flex justify-between items-start mb-8">
          <div className="w-12 h-12 rounded-full bg-nu-purple-light flex items-center justify-center cursor-pointer">
            <User size={24} className="text-white" />
          </div>
          <div className="flex gap-4">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowBalance(!showBalance)} 
              className="text-white"
            >
              {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
            </motion.button>
            <HelpCircle size={24} className="text-white cursor-pointer" />
            <Settings 
              size={24} 
              className="text-white cursor-pointer" 
              onClick={() => setIsSettingsOpen(true)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditingUserName ? (
            <input 
              type="text"
              value={tempUserName}
              onChange={(e) => setTempUserName(e.target.value)}
              className="text-white font-bold text-lg bg-transparent border-b border-white outline-none w-40"
              autoFocus
              onBlur={handleSaveUserName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveUserName()}
            />
          ) : (
            <h1 
              className="text-white font-bold text-lg cursor-pointer hover:underline"
              onClick={() => {
                setTempUserName(userName);
                setIsEditingUserName(true);
              }}
            >
              Olá, {userName}
            </h1>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col">
        {/* Account Balance */}
        <Card className="relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-nu-text">Conta</h2>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <div className="h-10 flex items-center">
            {showBalance ? (
              isEditingBalance ? (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-2xl font-bold text-nu-text">R$</span>
                  <input 
                    type="text"
                    value={tempBalance}
                    onChange={(e) => setTempBalance(e.target.value)}
                    className="text-2xl font-bold border-b-2 border-nu-purple outline-none w-full bg-transparent text-nu-text"
                    autoFocus
                    onBlur={handleSaveBalance}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveBalance()}
                  />
                </div>
              ) : (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold cursor-pointer hover:text-nu-purple transition-colors text-nu-text"
                  onClick={() => {
                    setTempBalance(balance.toString());
                    setIsEditingBalance(true);
                  }}
                  title="Clique para editar"
                >
                  {formatCurrency(balance)}
                </motion.span>
              )
            ) : (
              <div className="w-32 h-8 bg-nu-gray rounded-md" />
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="flex overflow-x-auto gap-4 p-6 no-scrollbar">
          <IconButton icon={QrCode} label="Área Pix" onClick={() => setActiveScreen('pix-area')} />
          <IconButton icon={BarcodeIcon} label="Pagar" />
          <IconButton icon={Receipt} label="Pagar Contas" />
          <IconButton icon={ArrowDownCircle} label="Empréstimo" onClick={() => setActiveScreen('loan-home')} />
          <IconButton icon={ArrowUpCircle} label="Transferir" onClick={() => setActiveScreen('make-pix')} />
          <IconButton icon={PlusCircle} label="Recarga" />
          <IconButton icon={DollarSign} label="Depositar" />
          <IconButton icon={TrendingUp} label="Investir" />
        </div>

        {/* My Cards */}
        <div className="px-6 mb-6">
          <div className="bg-nu-gray p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all">
            <CreditCard size={20} className="text-nu-text" />
            <span className="text-sm font-bold text-nu-text">Meus cartões</span>
          </div>
        </div>

        {/* Info Carousel */}
        <div className="flex overflow-x-auto gap-4 px-6 mb-8 no-scrollbar">
          <InfoCard 
            title="Novidade!" 
            description="Conheça as novas Caixinhas e organize seu dinheiro." 
          />
          <InfoCard 
            title="Seguro de Vida" 
            description="A partir de R$ 9/mês. Proteja quem você ama." 
            badge="Seguro"
          />
          <InfoCard 
            title="Convide amigos" 
            description="Tire seus amigos da fila e ganhe mimos." 
          />
        </div>

        {/* Credit Card Section */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <CreditCard size={24} className="mb-2 text-nu-text" />
              <h2 className="text-xl font-bold text-nu-text">Cartão de crédito</h2>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-nu-text-muted text-sm font-semibold">Fatura atual</span>
            {isEditingInvoice ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-nu-text">R$</span>
                <input 
                  type="text"
                  value={tempInvoice}
                  onChange={(e) => setTempInvoice(e.target.value)}
                  className="text-2xl font-bold border-b-2 border-nu-purple outline-none w-full bg-transparent text-nu-text"
                  autoFocus
                  onBlur={handleSaveInvoice}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveInvoice()}
                />
              </div>
            ) : (
              <span 
                className="text-2xl font-bold cursor-pointer hover:text-nu-purple transition-colors text-nu-text"
                onClick={() => {
                  setTempInvoice(invoice.toString());
                  setIsEditingInvoice(true);
                }}
                title="Clique para editar"
              >
                {formatCurrency(invoice)}
              </span>
            )}
            <span className="text-nu-text-muted text-sm">Limite disponível de R$ 2.500,00</span>
          </div>
        </Card>

        {/* Loan Section */}
        <Card onClick={() => setActiveScreen('loan-home')}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <DollarSign size={24} className="mb-2 text-nu-text" />
              <h2 className="text-xl font-bold text-nu-text">Empréstimo</h2>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <p className="text-nu-text-muted text-sm">
            {activeLoans.length > 0 
              ? `Você tem ${activeLoans.length} empréstimo${activeLoans.length > 1 ? 's' : ''} ativo${activeLoans.length > 1 ? 's' : ''}`
              : "Valor disponível de até R$ 15.000,00"}
          </p>
        </Card>

        {/* Investments Section */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <TrendingUp size={24} className="mb-2 text-nu-text" />
              <h2 className="text-xl font-bold text-nu-text">Investimentos</h2>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <p className="text-nu-text-muted text-sm">O jeito Nu de investir: sem asteriscos, linguagem fácil e a partir de R$ 1.</p>
        </Card>

        {/* Insurance Section */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-nu-text">Seguros</h2>
          <div className="bg-nu-gray p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:opacity-80 transition-all">
            <div className="flex items-center gap-4">
              <Heart size={20} className="text-nu-purple" />
              <span className="font-bold text-sm text-nu-text">Seguro de vida</span>
            </div>
            <span className="text-nu-purple font-bold text-sm">Conhecer</span>
          </div>
        </div>

        {/* Shopping Section */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <ShoppingBag size={24} className="mb-2 text-nu-text" />
              <h2 className="text-xl font-bold text-nu-text">Shopping</h2>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <p className="text-nu-text-muted text-sm">Vantagens exclusivas e cashback nas melhores lojas.</p>
        </Card>

        {/* Transaction History */}
        <div className="p-6 border-b border-nu-gray">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-nu-text">Histórico de Pix</h2>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          {transactions.length > 0 ? (
            <div className="space-y-6">
              {transactions.map((t, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between cursor-pointer hover:bg-nu-gray/50 p-2 -mx-2 rounded-lg transition-colors"
                  onClick={() => setSelectedTransaction(t)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-nu-gray flex items-center justify-center">
                      <QrCode size={20} className="text-nu-purple" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-nu-text">Transferência enviada</p>
                      <p className="text-xs text-nu-text-muted">{t.recipient}</p>
                      <p className="text-[10px] text-nu-text-muted mt-1">{t.date}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-red-500">
                    - {formatCurrency(t.value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-nu-text-muted text-sm italic">Nenhuma transação realizada ainda.</p>
          )}
        </div>

        {/* Discover More */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-nu-text">Descubra mais</h2>
          <div className="flex overflow-x-auto gap-4 no-scrollbar">
            <div className="min-w-[240px] bg-nu-gray rounded-2xl overflow-hidden cursor-pointer">
              <img src="https://picsum.photos/seed/nu1/400/200" alt="Nu" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 text-nu-text">Nu Reserva Imediata</h3>
                <p className="text-xs text-nu-text-muted mb-3">O fundo de renda fixa para sua reserva de emergência.</p>
                <Button size="sm" fullWidth={false}>Conhecer</Button>
              </div>
            </div>
            <div className="min-w-[240px] bg-nu-gray rounded-2xl overflow-hidden cursor-pointer">
              <img src="https://picsum.photos/seed/nu2/400/200" alt="Nu" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 text-nu-text">Indique seus amigos</h3>
                <p className="text-xs text-nu-text-muted mb-3">Espalhe a liberdade financeira para quem você gosta.</p>
                <Button size="sm" fullWidth={false}>Indicar</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );

  const renderPixArea = () => (
    <div className="bg-white dark:bg-[#000000] min-h-screen transition-colors duration-300">
      <header className="p-6 flex items-center justify-between">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveScreen('home')} 
          className="text-nu-text"
        >
          <ChevronRight size={24} className="rotate-180" />
        </motion.button>
        <HelpCircle size={24} className="text-nu-text-muted" />
      </header>
      <div className="px-6 pb-6">
        <h1 className="text-3xl font-bold mb-8 text-nu-text">Área Pix</h1>
        <p className="text-nu-text-muted mb-8">Envie e receba pagamentos a qualquer hora, 7 dias por semana.</p>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div onClick={() => setActiveScreen('make-pix')} className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-nu-gray flex items-center justify-center hover:opacity-80 transition-all">
              <ArrowUpCircle size={24} className="text-nu-text" />
            </div>
            <span className="text-xs font-bold text-center text-nu-text">Transferir</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-nu-gray flex items-center justify-center hover:opacity-80 transition-all">
              <QrCode size={24} className="text-nu-text" />
            </div>
            <span className="text-xs font-bold text-center text-nu-text">Ler QR code</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-nu-gray flex items-center justify-center hover:opacity-80 transition-all">
              <BarcodeIcon size={24} className="text-nu-text" />
            </div>
            <span className="text-xs font-bold text-center text-nu-text">Copia e Cola</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border-b border-nu-gray hover:bg-nu-gray/30 cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
              <Settings size={20} className="text-nu-text-muted" />
              <span className="font-bold text-nu-text">Configurar Pix</span>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-nu-gray hover:bg-nu-gray/30 cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
              <ShieldCheck size={20} className="text-nu-text-muted" />
              <span className="font-bold text-nu-text">Minhas chaves</span>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMakePix = () => (
    <div className="bg-white dark:bg-[#000000] min-h-screen p-6 transition-colors duration-300">
      <header className="flex items-center mb-8">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveScreen('pix-area')} 
          className="text-nu-text"
        >
          <ChevronRight size={24} className="rotate-180" />
        </motion.button>
      </header>
      <h1 className="text-2xl font-bold mb-8 text-nu-text">Qual é o valor da transferência?</h1>
      <div className="mb-8">
        <div className="flex items-center gap-2 border-b-2 border-nu-purple py-2">
          <span className="text-4xl font-bold text-nu-text">R$</span>
          <input 
            type="text"
            placeholder="0,00"
            value={pixValue}
            onChange={(e) => setPixValue(e.target.value)}
            className="text-4xl font-bold outline-none w-full bg-transparent text-nu-text"
            autoFocus
          />
        </div>
        <p className="mt-4 text-nu-text-muted">Saldo disponível: <span className="text-nu-text font-bold">{formatCurrency(balance)}</span></p>
      </div>
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-bold mb-2 text-nu-text">Nome do destinatário</label>
          <input 
            type="text"
            placeholder="Ex: Maria da Conceição"
            value={pixRecipient}
            onChange={(e) => setPixRecipient(e.target.value)}
            className="w-full p-4 bg-nu-gray rounded-xl outline-none font-bold text-nu-text"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-nu-text">CPF do destinatário</label>
          <input 
            type="text"
            placeholder="000.000.000-00"
            value={pixRecipientCpf}
            onChange={(e) => setPixRecipientCpf(e.target.value)}
            className="w-full p-4 bg-nu-gray rounded-xl outline-none font-bold text-nu-text"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-nu-text">Chave Pix</label>
          <input 
            type="text"
            placeholder="E-mail, CPF, Celular ou Aleatória"
            value={pixRecipientKey}
            onChange={(e) => setPixRecipientKey(e.target.value)}
            className="w-full p-4 bg-nu-gray rounded-xl outline-none font-bold text-nu-text"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-nu-text">Instituição</label>
          <input 
            type="text"
            placeholder="Ex: PICPAY"
            value={pixRecipientInstitution}
            onChange={(e) => setPixRecipientInstitution(e.target.value)}
            className="w-full p-4 bg-nu-gray rounded-xl outline-none font-bold text-nu-text"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-nu-text">Tipo de conta</label>
          <select 
            value={pixRecipientAccountType}
            onChange={(e) => setPixRecipientAccountType(e.target.value)}
            className="w-full p-4 bg-nu-gray rounded-xl outline-none font-bold text-nu-text appearance-none"
          >
            <option value="Conta de pagamentos">Conta de pagamentos</option>
            <option value="Conta corrente">Conta corrente</option>
            <option value="Conta poupança">Conta poupança</option>
          </select>
        </div>
      </div>
      <Button 
        onClick={handleConfirmPix}
        className="mt-4"
      >
        Transferir
      </Button>
    </div>
  );

  const renderReceipt = () => (
    <div className="bg-white min-h-screen flex flex-col transition-colors duration-300 text-black font-sans">
      <header className="p-6 flex justify-between items-center bg-white sticky top-0 z-10">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveScreen('home')} 
          className="text-black"
        >
          <ChevronRight size={24} className="rotate-180" />
        </motion.button>
        <div className="flex items-center gap-1">
          <span className="font-bold text-xl tracking-tighter">nu</span>
          <span className="text-[10px] font-medium text-gray-400 mt-1">Nubank</span>
        </div>
      </header>

      <div className="flex-1 px-8 py-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-1 tracking-tight">Comprovante de transferência</h1>
        <p className="text-gray-500 text-[11px] font-medium mb-10">{lastTransaction?.date}</p>

        <div className="grid grid-cols-2 gap-y-10 mb-10">
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Valor</p>
            <p className="text-xl font-bold">{formatCurrency(lastTransaction?.value || 0)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Tipo de transferência</p>
            <p className="text-xl font-bold">Pix</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 mb-8">
          <h2 className="font-bold text-sm mb-8">Destino</h2>
          <div className="grid grid-cols-2 gap-y-8">
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Nome</p>
              <p className="text-[11px] font-bold uppercase leading-tight pr-2">{lastTransaction?.recipient}</p>
            </div>
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Tipo de conta</p>
              <p className="text-[11px] font-medium">{lastTransaction?.recipientAccountType}</p>
            </div>
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">CPF</p>
              <p className="text-[11px] font-medium">{lastTransaction?.recipientCpf}</p>
            </div>
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Chave Pix</p>
              <p className="text-[11px] font-medium break-all leading-tight">{lastTransaction?.recipientKey}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Instituição</p>
              <p className="text-[11px] font-medium uppercase">{lastTransaction?.recipientInstitution}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 mb-10">
          <h2 className="font-bold text-sm mb-8">Origem</h2>
          <div className="grid grid-cols-2 gap-y-8">
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Nome</p>
              <p className="text-[11px] font-medium">{lastTransaction?.originName}</p>
            </div>
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Conta</p>
              <p className="text-[11px] font-medium">{lastTransaction?.originAccount}</p>
            </div>
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Instituição</p>
              <p className="text-[11px] font-medium uppercase">{lastTransaction?.originInstitution}</p>
            </div>
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">CPF</p>
              <p className="text-[11px] font-medium">{lastTransaction?.originCpf}</p>
            </div>
            <div className="col-span-1">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Agência</p>
              <p className="text-[11px] font-medium">{lastTransaction?.originAgency}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-[10px] text-gray-900 font-bold border-t border-gray-100 pt-8">
          <p>Nu Pagamentos S.A. - Instituição de Pagamento</p>
          <p>CNPJ 18.236.120/0001-58</p>
          <p>ID da transação: <span className="font-medium">{lastTransaction?.id}</span></p>
          <div className="pt-6 space-y-1 text-gray-500 font-medium leading-relaxed">
            <p>Estamos aqui para ajudar se você tiver alguma dúvida</p>
            <p>Ouvidoria: 0800 887 0463, atendimento em dias úteis, das 09h às 18h (horário de São Paulo).</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 bg-white border-t border-gray-50">
        <Button variant="outline" className="border-nu-purple text-nu-purple">
          Enviar comprovante
        </Button>
        <Button 
          onClick={() => setActiveScreen('home')}
          className="bg-nu-purple text-white"
        >
          Voltar ao início
        </Button>
      </div>
    </div>
  );

  const renderLoanHome = () => (
    <div className="bg-white dark:bg-[#000000] min-h-screen flex flex-col transition-colors duration-300">
      <header className="p-6 flex items-center justify-between">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveScreen('home')} 
          className="text-nu-text"
        >
          <ChevronRight size={24} className="rotate-180" />
        </motion.button>
        <HelpCircle size={24} className="text-nu-text-muted" />
      </header>
      <div className="px-6 flex-1">
        <h1 className="text-3xl font-bold mb-4 text-nu-text">Empréstimo</h1>
        
        {activeLoans.length > 0 ? (
          <div className="space-y-6 mt-8">
            <h2 className="text-lg font-bold text-nu-text">Seus empréstimos ativos</h2>
            {activeLoans.map((loan, idx) => (
              <div key={idx} className="bg-nu-gray p-6 rounded-2xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-nu-text-muted text-sm">Valor contratado</span>
                  <span className="font-bold text-nu-text">{formatCurrency(loan.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nu-text-muted text-sm">Parcelas</span>
                  <span className="font-bold text-nu-text">{loan.installments}x de {formatCurrency(loan.total / loan.installments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nu-text-muted text-sm">Data de contratação</span>
                  <span className="font-bold text-sm text-nu-text">{loan.date}</span>
                </div>
              </div>
            ))}
            <Button 
              onClick={() => setActiveScreen('loan-simulate')}
              variant="outline"
              className="mt-4"
            >
              Novo empréstimo
            </Button>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-nu-gray rounded-full flex items-center justify-center mb-6">
              <DollarSign size={40} className="text-nu-purple" />
            </div>
            <p className="text-nu-text-muted mb-8">
              Você tem até <span className="font-bold text-nu-text">R$ 15.000,00</span> disponíveis para contratar agora.
            </p>
            <Button 
              onClick={() => setActiveScreen('loan-simulate')}
            >
              Simular empréstimo
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderLoanSimulate = () => {
    const installmentsOptions = [6, 12, 18, 24, 36, 48];
    const totalToPay = loanSimulation.amount * Math.pow(1 + LOAN_INTEREST_RATE, loanSimulation.installments);
    const installmentValue = totalToPay / loanSimulation.installments;

    return (
      <div className="bg-white dark:bg-[#000000] min-h-screen flex flex-col p-6 transition-colors duration-300">
        <header className="mb-8">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveScreen('loan-home')} 
            className="text-nu-text"
          >
            <ChevronRight size={24} className="rotate-180" />
          </motion.button>
        </header>
        
        <h1 className="text-2xl font-bold mb-8 text-nu-text">Quanto você precisa?</h1>
        
        <div className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-nu-purple py-2">
            <span className="text-4xl font-bold text-nu-text">R$</span>
            <input 
              type="number"
              value={loanSimulation.amount}
              onChange={(e) => setLoanSimulation({ ...loanSimulation, amount: Number(e.target.value) })}
              className="text-4xl font-bold outline-none w-full bg-transparent text-nu-text"
              autoFocus
            />
          </div>
          <p className="mt-4 text-nu-text-muted text-sm italic">Mínimo R$ 500,00 • Máximo R$ 15.000,00</p>
        </div>

        <h2 className="text-lg font-bold mb-4 text-nu-text">Em quantas parcelas?</h2>
        <div className="grid grid-cols-3 gap-3 mb-12">
          {installmentsOptions.map(opt => (
            <motion.button 
              key={opt}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLoanSimulation({ ...loanSimulation, installments: opt })}
              className={`py-3 rounded-xl font-bold transition-all ${loanSimulation.installments === opt ? 'bg-nu-purple text-white' : 'bg-nu-gray text-nu-text'}`}
            >
              {opt}x
            </motion.button>
          ))}
        </div>

        <div className="bg-nu-gray p-6 rounded-2xl mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-nu-text-muted">Valor da parcela</span>
            <span className="font-bold text-nu-text">{formatCurrency(installmentValue)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-nu-text-muted">Taxa de juros</span>
            <span className="font-bold text-green-600">{(LOAN_INTEREST_RATE * 100).toFixed(2)}% ao mês</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 dark:border-gray-700 pt-2 mt-2">
            <span className="text-nu-text-muted">Total a pagar</span>
            <span className="font-bold text-nu-text">{formatCurrency(totalToPay)}</span>
          </div>
        </div>

        <Button 
          disabled={loanSimulation.amount < 500 || loanSimulation.amount > 15000}
          onClick={() => setActiveScreen('loan-confirm')}
        >
          Continuar
        </Button>
      </div>
    );
  };

  const renderLoanConfirm = () => {
    const totalToPay = loanSimulation.amount * Math.pow(1 + LOAN_INTEREST_RATE, loanSimulation.installments);
    const installmentValue = totalToPay / loanSimulation.installments;

    const handleContractLoan = () => {
      const newLoan = {
        amount: loanSimulation.amount,
        installments: loanSimulation.installments,
        total: totalToPay,
        rate: LOAN_INTEREST_RATE,
        date: new Date().toLocaleDateString('pt-BR')
      };
      setActiveLoans(prev => [...prev, newLoan]);
      setBalance(prev => prev + loanSimulation.amount);
      setActiveScreen('loan-success');
    };

    return (
      <div className="bg-white dark:bg-[#000000] min-h-screen flex flex-col p-6 transition-colors duration-300">
        <header className="mb-8">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveScreen('loan-simulate')} 
            className="text-nu-text"
          >
            <ChevronRight size={24} className="rotate-180" />
          </motion.button>
        </header>
        
        <h1 className="text-2xl font-bold mb-4 text-nu-purple">Revise os termos</h1>
        <p className="text-nu-text-muted mb-8">Ao confirmar, o dinheiro cairá na sua conta imediatamente.</p>

        <div className="space-y-6 mb-12">
          <div className="flex justify-between border-b border-nu-gray pb-4">
            <div className="flex flex-col">
              <span className="text-nu-text-muted text-sm">Valor que você recebe</span>
              <span className="text-xl font-bold text-nu-text">{formatCurrency(loanSimulation.amount)}</span>
            </div>
            <DollarSign className="text-nu-purple" />
          </div>

          <div className="flex justify-between border-b border-nu-gray pb-4">
            <div className="flex flex-col">
              <span className="text-nu-text-muted text-sm">Custo total do empréstimo</span>
              <span className="text-xl font-bold text-nu-text">{formatCurrency(totalToPay)}</span>
            </div>
            <TrendingUp className="text-nu-purple" />
          </div>

          <div className="flex justify-between border-b border-nu-gray pb-4">
            <div className="flex flex-col">
              <span className="text-nu-text-muted text-sm">Primeiro pagamento</span>
              <span className="text-xl font-bold text-nu-text">Em 30 dias</span>
            </div>
            <ShieldCheck className="text-nu-purple" />
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <p className="text-[10px] text-nu-text-muted text-center px-4">
            Ao clicar em "Confirmar contratação", você concorda com os termos do contrato de empréstimo pessoal e autoriza o débito das parcelas em sua conta.
          </p>
          <Button 
            onClick={handleContractLoan}
          >
            Confirmar contratação
          </Button>
        </div>
      </div>
    );
  };

  const renderLoanSuccess = () => (
    <div className="bg-nu-purple min-h-screen flex flex-col p-6 text-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8"
        >
          <ShieldCheck size={48} />
        </motion.div>
        <h1 className="text-3xl font-bold mb-4">Dinheiro na conta!</h1>
        <p className="text-white/80 text-lg mb-8">
          O valor de <span className="font-bold text-white">{formatCurrency(loanSimulation.amount)}</span> já está disponível para você usar.
        </p>
      </div>
      <Button 
        onClick={() => setActiveScreen('home')}
        variant="white"
      >
        Ir para o início
      </Button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white dark:bg-[#000000] pb-24 relative overflow-x-hidden transition-colors duration-300">
      {!isLoggedIn ? (
        renderLogin()
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeScreen === 'home' && renderHome()}
              {activeScreen === 'pix-area' && renderPixArea()}
              {activeScreen === 'make-pix' && renderMakePix()}
              {activeScreen === 'receipt' && renderReceipt()}
              {activeScreen === 'loan-home' && renderLoanHome()}
              {activeScreen === 'loan-simulate' && renderLoanSimulate()}
              {activeScreen === 'loan-confirm' && renderLoanConfirm()}
              {activeScreen === 'loan-success' && renderLoanSuccess()}
            </motion.div>
          </AnimatePresence>

          {renderSettings()}

          <AnimatePresence>
            {selectedTransaction && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTransaction(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-nu-gray flex justify-between items-center">
                <h3 className="text-xl font-bold text-nu-text">Detalhes da transação</h3>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-nu-gray rounded-full transition-colors text-nu-text"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <div className="p-8 space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-nu-gray rounded-full flex items-center justify-center mb-4">
                    <QrCode size={32} className="text-nu-purple" />
                  </div>
                  <span className="text-nu-text-muted text-sm font-medium">Transferência enviada</span>
                  <span className="text-3xl font-bold mt-1 text-red-500">
                    - {formatCurrency(selectedTransaction.value)}
                  </span>
                </div>

                <div className="space-y-6 bg-nu-gray/30 p-6 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-nu-text-muted text-sm">Para</span>
                    <span className="font-bold text-right max-w-[200px]">{selectedTransaction.recipient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nu-text-muted text-sm">CPF</span>
                    <span className="font-bold">{selectedTransaction.recipientCpf || '***.***.***-**'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nu-text-muted text-sm">Instituição</span>
                    <span className="font-bold">{selectedTransaction.recipientInstitution || 'Nu Pagamentos S.A.'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nu-text-muted text-sm">Data e hora</span>
                    <span className="font-bold">{selectedTransaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nu-text-muted text-sm">ID da transação</span>
                    <span className="font-bold text-xs break-all text-right ml-4">{selectedTransaction.id || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button>
                    Enviar comprovante
                  </Button>
                  <Button 
                    onClick={() => setSelectedTransaction(null)}
                    variant="ghost"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {activeScreen === 'home' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-nu-gray px-6 py-3 flex justify-around items-center max-w-md mx-auto z-50">
          <div className="flex flex-col items-center gap-1 text-nu-purple">
            <div className="p-2 rounded-full bg-nu-purple/10">
              <LayoutGrid size={24} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 text-nu-text-muted">
            <DollarSign size={24} />
          </div>
          <div className="flex flex-col items-center gap-1 text-nu-text-muted">
            <ShoppingBag size={24} />
          </div>
          <div className="flex flex-col items-center gap-1 text-nu-text-muted">
            <BarChart3 size={24} />
          </div>
        </nav>
      )}
        </>
      )}
    </div>
  );
}
