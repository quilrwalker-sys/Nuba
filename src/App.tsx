import React, { useState } from 'react';
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
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const IconButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="flex flex-col items-center gap-2 min-w-[80px]">
    <div className="w-16 h-16 rounded-full bg-nu-gray flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
      <Icon size={24} className="text-nu-text" />
    </div>
    <span className="text-xs font-semibold text-center">{label}</span>
  </div>
);

const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`p-6 border-b border-nu-gray hover:bg-gray-50 transition-colors cursor-pointer ${className}`}
  >
    {children}
  </div>
);

const InfoCard = ({ title, description, badge }: { title: string, description: string, badge?: string }) => (
  <div className="min-w-[280px] p-5 bg-nu-gray rounded-2xl flex flex-col gap-2 cursor-pointer hover:bg-gray-200 transition-colors">
    {badge && <span className="text-nu-purple text-xs font-bold">{badge}</span>}
    <p className="text-sm leading-relaxed">
      <span className="font-bold">{title}</span> {description}
    </p>
  </div>
);

export default function App() {
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
  const [lastTransaction, setLastTransaction] = useState<{ value: number, recipient: string, date: string } | null>(null);
  const [transactions, setTransactions] = useState<{ value: number, recipient: string, date: string }[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<{ value: number, recipient: string, date: string } | null>(null);

  // Loan State
  const [activeLoans, setActiveLoans] = useState<{ amount: number, installments: number, total: number, rate: number, date: string }[]>([]);
  const [loanSimulation, setLoanSimulation] = useState({ amount: 5000, installments: 12 });
  const LOAN_INTEREST_RATE = 0.0475; // 4.75% monthly

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
      const transaction = {
        value: val,
        recipient: pixRecipient,
        date: new Date().toLocaleString('pt-BR')
      };
      setLastTransaction(transaction);
      setTransactions(prev => [transaction, ...prev]);
      setActiveScreen('receipt');
    } else {
      alert("Verifique o valor e o destinatário.");
    }
  };

  const renderHome = () => (
    <>
      {/* Header */}
      <header className="bg-nu-purple p-6 pb-8">
        <div className="flex justify-between items-start mb-8">
          <div className="w-12 h-12 rounded-full bg-nu-purple-light flex items-center justify-center cursor-pointer">
            <User size={24} className="text-white" />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowBalance(!showBalance)} className="text-white">
              {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
            <HelpCircle size={24} className="text-white cursor-pointer" />
            <Settings size={24} className="text-white cursor-pointer" />
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
            <h2 className="text-xl font-bold">Conta</h2>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <div className="h-10 flex items-center">
            {showBalance ? (
              isEditingBalance ? (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-2xl font-bold">R$</span>
                  <input 
                    type="text"
                    value={tempBalance}
                    onChange={(e) => setTempBalance(e.target.value)}
                    className="text-2xl font-bold border-b-2 border-nu-purple outline-none w-full"
                    autoFocus
                    onBlur={handleSaveBalance}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveBalance()}
                  />
                </div>
              ) : (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold cursor-pointer hover:text-nu-purple transition-colors"
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
          <div onClick={() => setActiveScreen('pix-area')}>
            <IconButton icon={QrCode} label="Área Pix" />
          </div>
          <IconButton icon={Barcode} label="Pagar" />
          <IconButton icon={Receipt} label="Pagar Contas" />
          <IconButton icon={ArrowDownCircle} label="Pegar emprestado" />
          <IconButton icon={ArrowUpCircle} label="Transferir" />
          <IconButton icon={PlusCircle} label="Recarga de celular" />
          <IconButton icon={DollarSign} label="Depositar" />
          <IconButton icon={TrendingUp} label="Investir" />
        </div>

        {/* My Cards */}
        <div className="px-6 mb-6">
          <div className="bg-nu-gray p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-gray-200 transition-colors">
            <CreditCard size={20} />
            <span className="text-sm font-bold">Meus cartões</span>
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
              <CreditCard size={24} className="mb-2" />
              <h2 className="text-xl font-bold">Cartão de crédito</h2>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-nu-text-muted text-sm font-semibold">Fatura atual</span>
            {isEditingInvoice ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">R$</span>
                <input 
                  type="text"
                  value={tempInvoice}
                  onChange={(e) => setTempInvoice(e.target.value)}
                  className="text-2xl font-bold border-b-2 border-nu-purple outline-none w-full"
                  autoFocus
                  onBlur={handleSaveInvoice}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveInvoice()}
                />
              </div>
            ) : (
              <span 
                className="text-2xl font-bold cursor-pointer hover:text-nu-purple transition-colors"
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
              <DollarSign size={24} className="mb-2" />
              <h2 className="text-xl font-bold">Empréstimo</h2>
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
              <TrendingUp size={24} className="mb-2" />
              <h2 className="text-xl font-bold">Investimentos</h2>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <p className="text-nu-text-muted text-sm">O jeito Nu de investir: sem asteriscos, linguagem fácil e a partir de R$ 1.</p>
        </Card>

        {/* Insurance Section */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Seguros</h2>
          <div className="bg-nu-gray p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors">
            <div className="flex items-center gap-4">
              <Heart size={20} className="text-nu-purple" />
              <span className="font-bold text-sm">Seguro de vida</span>
            </div>
            <span className="text-nu-purple font-bold text-sm">Conhecer</span>
          </div>
        </div>

        {/* Shopping Section */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
              <ShoppingBag size={24} className="mb-2" />
              <h2 className="text-xl font-bold">Shopping</h2>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <p className="text-nu-text-muted text-sm">Vantagens exclusivas e cashback nas melhores lojas.</p>
        </Card>

        {/* Transaction History */}
        <div className="p-6 border-b border-nu-gray">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Histórico de Pix</h2>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          {transactions.length > 0 ? (
            <div className="space-y-6">
              {transactions.map((t, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 -mx-2 rounded-lg transition-colors"
                  onClick={() => setSelectedTransaction(t)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-nu-gray flex items-center justify-center">
                      <QrCode size={20} className="text-nu-purple" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Transferência enviada</p>
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
          <h2 className="text-xl font-bold mb-4">Descubra mais</h2>
          <div className="flex overflow-x-auto gap-4 no-scrollbar">
            <div className="min-w-[240px] bg-nu-gray rounded-2xl overflow-hidden cursor-pointer">
              <img src="https://picsum.photos/seed/nu1/400/200" alt="Nu" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1">Nu Reserva Imediata</h3>
                <p className="text-xs text-nu-text-muted mb-3">O fundo de renda fixa para sua reserva de emergência.</p>
                <button className="bg-nu-purple text-white px-4 py-2 rounded-full text-xs font-bold">Conhecer</button>
              </div>
            </div>
            <div className="min-w-[240px] bg-nu-gray rounded-2xl overflow-hidden cursor-pointer">
              <img src="https://picsum.photos/seed/nu2/400/200" alt="Nu" className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1">Indique seus amigos</h3>
                <p className="text-xs text-nu-text-muted mb-3">Espalhe a liberdade financeira para quem você gosta.</p>
                <button className="bg-nu-purple text-white px-4 py-2 rounded-full text-xs font-bold">Indicar</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );

  const renderPixArea = () => (
    <div className="bg-white min-h-screen">
      <header className="p-6 flex items-center justify-between">
        <button onClick={() => setActiveScreen('home')} className="text-nu-text">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <HelpCircle size={24} className="text-nu-text-muted" />
      </header>
      <div className="px-6 pb-6">
        <h1 className="text-3xl font-bold mb-8">Área Pix</h1>
        <p className="text-nu-text-muted mb-8">Envie e receba pagamentos a qualquer hora, 7 dias por semana.</p>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div onClick={() => setActiveScreen('make-pix')} className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-nu-gray flex items-center justify-center">
              <ArrowUpCircle size={24} />
            </div>
            <span className="text-xs font-bold text-center">Transferir</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-nu-gray flex items-center justify-center">
              <QrCode size={24} />
            </div>
            <span className="text-xs font-bold text-center">Ler QR code</span>
          </div>
          <div className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-nu-gray flex items-center justify-center">
              <Barcode size={24} />
            </div>
            <span className="text-xs font-bold text-center">Copia e Cola</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border-b border-nu-gray">
            <div className="flex items-center gap-4">
              <Settings size={20} className="text-nu-text-muted" />
              <span className="font-bold">Configurar Pix</span>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
          <div className="flex items-center justify-between p-4 border-b border-nu-gray">
            <div className="flex items-center gap-4">
              <ShieldCheck size={20} className="text-nu-text-muted" />
              <span className="font-bold">Minhas chaves</span>
            </div>
            <ChevronRight size={20} className="text-nu-text-muted" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMakePix = () => (
    <div className="bg-white min-h-screen p-6">
      <header className="flex items-center mb-8">
        <button onClick={() => setActiveScreen('pix-area')} className="text-nu-text">
          <ChevronRight size={24} className="rotate-180" />
        </button>
      </header>
      <h1 className="text-2xl font-bold mb-8">Qual é o valor da transferência?</h1>
      <div className="mb-8">
        <div className="flex items-center gap-2 border-b-2 border-nu-purple py-2">
          <span className="text-4xl font-bold">R$</span>
          <input 
            type="text"
            placeholder="0,00"
            value={pixValue}
            onChange={(e) => setPixValue(e.target.value)}
            className="text-4xl font-bold outline-none w-full"
            autoFocus
          />
        </div>
        <p className="mt-4 text-nu-text-muted">Saldo disponível: {formatCurrency(balance)}</p>
      </div>
      <div className="mb-12">
        <label className="block text-sm font-bold mb-2">Para quem você quer transferir?</label>
        <input 
          type="text"
          placeholder="Nome ou CPF/CNPJ"
          value={pixRecipient}
          onChange={(e) => setPixRecipient(e.target.value)}
          className="w-full p-4 bg-nu-gray rounded-xl outline-none font-bold"
        />
      </div>
      <button 
        onClick={handleConfirmPix}
        className="w-full bg-nu-purple text-white py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-transform"
      >
        Transferir
      </button>
    </div>
  );

  const renderReceipt = () => (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="p-6">
        <button onClick={() => setActiveScreen('home')} className="text-nu-text">
          <ChevronRight size={24} className="rotate-180" />
        </button>
      </header>
      <div className="flex-1 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Transferência realizada!</h1>
        <p className="text-nu-text-muted mb-8">Seu Pix foi enviado com sucesso.</p>
        
        <div className="w-full bg-nu-gray rounded-2xl p-6 text-left space-y-4">
          <div className="flex justify-between">
            <span className="text-nu-text-muted text-sm">Valor</span>
            <span className="font-bold">{formatCurrency(lastTransaction?.value || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nu-text-muted text-sm">Para</span>
            <span className="font-bold">{lastTransaction?.recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nu-text-muted text-sm">Data</span>
            <span className="font-bold text-sm">{lastTransaction?.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-nu-text-muted text-sm">Tipo</span>
            <span className="font-bold">Pix</span>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <button className="w-full border-2 border-nu-purple text-nu-purple py-4 rounded-full font-bold">
          Enviar comprovante
        </button>
        <button 
          onClick={() => setActiveScreen('home')}
          className="w-full bg-nu-purple text-white py-4 rounded-full font-bold"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );

  const renderLoanHome = () => (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <button onClick={() => setActiveScreen('home')} className="text-nu-text">
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <HelpCircle size={24} className="text-nu-text-muted" />
      </header>
      <div className="px-6 flex-1">
        <h1 className="text-3xl font-bold mb-4">Empréstimo</h1>
        
        {activeLoans.length > 0 ? (
          <div className="space-y-6 mt-8">
            <h2 className="text-lg font-bold">Seus empréstimos ativos</h2>
            {activeLoans.map((loan, idx) => (
              <div key={idx} className="bg-nu-gray p-6 rounded-2xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-nu-text-muted text-sm">Valor contratado</span>
                  <span className="font-bold">{formatCurrency(loan.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nu-text-muted text-sm">Parcelas</span>
                  <span className="font-bold">{loan.installments}x de {formatCurrency(loan.total / loan.installments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nu-text-muted text-sm">Data de contratação</span>
                  <span className="font-bold text-sm">{loan.date}</span>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setActiveScreen('loan-simulate')}
              className="w-full border-2 border-nu-purple text-nu-purple py-4 rounded-full font-bold mt-4"
            >
              Novo empréstimo
            </button>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-nu-gray rounded-full flex items-center justify-center mb-6">
              <DollarSign size={40} className="text-nu-purple" />
            </div>
            <p className="text-nu-text-muted mb-8">
              Você tem até <span className="font-bold text-nu-text">R$ 15.000,00</span> disponíveis para contratar agora.
            </p>
            <button 
              onClick={() => setActiveScreen('loan-simulate')}
              className="w-full bg-nu-purple text-white py-4 rounded-full font-bold text-lg shadow-lg"
            >
              Simular empréstimo
            </button>
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
      <div className="bg-white min-h-screen flex flex-col p-6">
        <header className="mb-8">
          <button onClick={() => setActiveScreen('loan-home')} className="text-nu-text">
            <ChevronRight size={24} className="rotate-180" />
          </button>
        </header>
        
        <h1 className="text-2xl font-bold mb-8">Quanto você precisa?</h1>
        
        <div className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-nu-purple py-2">
            <span className="text-4xl font-bold">R$</span>
            <input 
              type="number"
              value={loanSimulation.amount}
              onChange={(e) => setLoanSimulation({ ...loanSimulation, amount: Number(e.target.value) })}
              className="text-4xl font-bold outline-none w-full"
              autoFocus
            />
          </div>
          <p className="mt-4 text-nu-text-muted text-sm italic">Mínimo R$ 500,00 • Máximo R$ 15.000,00</p>
        </div>

        <h2 className="text-lg font-bold mb-4">Em quantas parcelas?</h2>
        <div className="grid grid-cols-3 gap-3 mb-12">
          {installmentsOptions.map(opt => (
            <button 
              key={opt}
              onClick={() => setLoanSimulation({ ...loanSimulation, installments: opt })}
              className={`py-3 rounded-xl font-bold transition-all ${loanSimulation.installments === opt ? 'bg-nu-purple text-white' : 'bg-nu-gray text-nu-text'}`}
            >
              {opt}x
            </button>
          ))}
        </div>

        <div className="bg-nu-gray p-6 rounded-2xl mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-nu-text-muted">Valor da parcela</span>
            <span className="font-bold">{formatCurrency(installmentValue)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-nu-text-muted">Taxa de juros</span>
            <span className="font-bold text-green-600">{(LOAN_INTEREST_RATE * 100).toFixed(2)}% ao mês</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
            <span className="text-nu-text-muted">Total a pagar</span>
            <span className="font-bold">{formatCurrency(totalToPay)}</span>
          </div>
        </div>

        <button 
          disabled={loanSimulation.amount < 500 || loanSimulation.amount > 15000}
          onClick={() => setActiveScreen('loan-confirm')}
          className="w-full bg-nu-purple text-white py-4 rounded-full font-bold text-lg shadow-lg disabled:opacity-50"
        >
          Continuar
        </button>
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
      <div className="bg-white min-h-screen flex flex-col p-6">
        <header className="mb-8">
          <button onClick={() => setActiveScreen('loan-simulate')} className="text-nu-text">
            <ChevronRight size={24} className="rotate-180" />
          </button>
        </header>
        
        <h1 className="text-2xl font-bold mb-4 text-nu-purple">Revise os termos</h1>
        <p className="text-nu-text-muted mb-8">Ao confirmar, o dinheiro cairá na sua conta imediatamente.</p>

        <div className="space-y-6 mb-12">
          <div className="flex justify-between border-b border-nu-gray pb-4">
            <div className="flex flex-col">
              <span className="text-nu-text-muted text-sm">Valor que você recebe</span>
              <span className="text-xl font-bold">{formatCurrency(loanSimulation.amount)}</span>
            </div>
            <DollarSign className="text-nu-purple" />
          </div>

          <div className="flex justify-between border-b border-nu-gray pb-4">
            <div className="flex flex-col">
              <span className="text-nu-text-muted text-sm">Custo total do empréstimo</span>
              <span className="text-xl font-bold">{formatCurrency(totalToPay)}</span>
            </div>
            <TrendingUp className="text-nu-purple" />
          </div>

          <div className="flex justify-between border-b border-nu-gray pb-4">
            <div className="flex flex-col">
              <span className="text-nu-text-muted text-sm">Primeiro pagamento</span>
              <span className="text-xl font-bold">Em 30 dias</span>
            </div>
            <ShieldCheck className="text-nu-purple" />
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <p className="text-[10px] text-nu-text-muted text-center px-4">
            Ao clicar em "Confirmar contratação", você concorda com os termos do contrato de empréstimo pessoal e autoriza o débito das parcelas em sua conta.
          </p>
          <button 
            onClick={handleContractLoan}
            className="w-full bg-nu-purple text-white py-4 rounded-full font-bold text-lg shadow-lg"
          >
            Confirmar contratação
          </button>
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
      <button 
        onClick={() => setActiveScreen('home')}
        className="w-full bg-white text-nu-purple py-4 rounded-full font-bold text-lg shadow-xl"
      >
        Ir para o início
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-24 relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >          {activeScreen === 'home' && renderHome()}
          {activeScreen === 'pix-area' && renderPixArea()}
          {activeScreen === 'make-pix' && renderMakePix()}
          {activeScreen === 'receipt' && renderReceipt()}
          {activeScreen === 'loan-home' && renderLoanHome()}
          {activeScreen === 'loan-simulate' && renderLoanSimulate()}
          {activeScreen === 'loan-confirm' && renderLoanConfirm()}
          {activeScreen === 'loan-success' && renderLoanSuccess()}
        </motion.div>
      </AnimatePresence>
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
              className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-nu-gray flex justify-between items-center">
                <h3 className="text-xl font-bold">Detalhes da transação</h3>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-nu-gray rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
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
                    <span className="text-nu-text-muted text-sm">Data e hora</span>
                    <span className="font-bold">{selectedTransaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nu-text-muted text-sm">Tipo de transação</span>
                    <span className="font-bold">Pix</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-nu-text-muted text-sm">Instituição</span>
                    <span className="font-bold">Nu Pagamentos S.A.</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button className="w-full bg-nu-purple text-white py-4 rounded-full font-bold shadow-lg active:scale-95 transition-transform">
                    Enviar comprovante
                  </button>
                  <button 
                    onClick={() => setSelectedTransaction(null)}
                    className="w-full py-4 rounded-full font-bold text-nu-purple"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {activeScreen === 'home' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-nu-gray px-6 py-3 flex justify-around items-center max-w-md mx-auto z-50">
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
    </div>
  );
}

// Helper for missing icon
const Barcode = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 5v14" /><path d="M8 5v14" /><path d="M12 5v14" /><path d="M17 5v14" /><path d="M21 5v14" />
  </svg>
);
