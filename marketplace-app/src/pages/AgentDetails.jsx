import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, ShieldCheck, Terminal, User, Star, FileCode, Github, Globe, Shield, Activity, Brackets, Bot, ArrowUpRight, Clock, Key } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import AgentAvatar from '../components/AgentAvatar';
import './AgentDetails.css';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

const AgentDetails = () => {
    const { id } = useParams();
    const { marketplaceAgents: agents = [], isConnected, account, username, buyAgent, deleteAgent, openDispute, subscribeToAgent, extendAgentSubscription, rawPurchases = [] } = useWallet();
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isDelisting, setIsDelisting] = useState(false);
    const [isDisputing, setIsDisputing] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    const [showDisputeForm, setShowDisputeForm] = useState(false);
    const [activeTab, setActiveTab] = useState('specs');
    const [hasRated, setHasRated] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [apiKey, setApiKey] = useState(null);
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const navigate = useNavigate();

    const agent = agents.find(a => a.id.toString() === id.toString());

    // Check if the current user is the owner
    const isOwner = agent && (
        (agent.owner && username && agent.owner.toLowerCase() === username.toLowerCase()) ||
        (agent.owner && account && agent.owner.toLowerCase() === account.toLowerCase())
    );

    // Mock calculations for specialized dashboard
    const architectRating = useMemo(() => (4.5 + (agent?.id % 5) / 10).toFixed(1), [agent]);
    const reviewCount = useMemo(() => 12 + (agent?.id % 20), [agent]);
    const canRate = isConnected;

    const purchaseRecord = useMemo(() => {
        if (!agent || !rawPurchases) return null;
        return rawPurchases.find(p => p.agentId === agent.id.toString());
    }, [agent, rawPurchases]);

    const escrowStatus = purchaseRecord?.status || null;
    const escrowExpiry = purchaseRecord?.expiryAt ? new Date(purchaseRecord.expiryAt) : null;
    const isEscrowActive = escrowStatus === 'CREATED' && escrowExpiry && new Date() < escrowExpiry;

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!isEscrowActive || !escrowExpiry) return;
        const interval = setInterval(() => {
            const now = new Date();
            const diff = escrowExpiry - now;
            if (diff <= 0) {
                setTimeLeft('EXPIRED');
                clearInterval(interval);
            } else {
                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${h}h ${m}m remaining`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isEscrowActive, escrowExpiry]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const pollSubscription = async () => {
        if (!isConnected || !account || !agent || agent.pricingModel !== 'RECURRING') return;
        try {
            const res = await fetch(`${API_URL}/api/users/${account}/subscriptions/${agent.id}`);
            if (res.ok) {
                const sub = await res.json();
                setSubscription(sub);
            }
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        pollSubscription();
        const interval = setInterval(pollSubscription, 10000);
        return () => clearInterval(interval);
    }, [account, agent]);

    if (!agent) {
        return (
            <div className="details-container" style={{ textAlign: 'center', paddingTop: '200px' }}>
                <h1 style={{ color: '#fff' }}>AGENT_NOT_FOUND</h1>
                <Link to="/explore" className="back-link" style={{ justifyContent: 'center', marginTop: '40px' }}>
                    <ArrowLeft size={16} /> RETURN TO REGISTRY
                </Link>
            </div>
        );
    }

    const similarAgents = agents.filter(a => a.id !== agent.id && a.role === agent.role).slice(0, 4);

    const handlePurchase = async () => {
        if (!isConnected) return alert('Please connect your wallet to initialize acquisition.');
        setIsPurchasing(true);
        const result = await buyAgent(agent);
        setIsPurchasing(false);
        if (result && result.success) {
            alert('Acquisition sequence complete. Agent initialized in your workspace.');
        } else {
            alert(result?.error || 'Acquisition failed.');
        }
    };

    const handleSubscribe = async () => {
        if (!isConnected) return alert('Please connect your wallet.');
        setIsPurchasing(true);
        const result = await subscribeToAgent(agent);
        setIsPurchasing(false);
        if (result && result.success) {
            alert('Subscription transaction submitted. Waiting for confirmation...');
            setTimeout(pollSubscription, 5000);
        } else {
            alert(result?.error || 'Subscription failed.');
        }
    };

    const handleExtend = async () => {
        if (!isConnected) return alert('Please connect your wallet.');
        setIsPurchasing(true);
        const result = await extendAgentSubscription(agent);
        setIsPurchasing(false);
        if (result && result.success) {
            alert('Extension transaction submitted. Waiting for confirmation...');
            setTimeout(pollSubscription, 5000);
        } else {
            alert(result?.error || 'Extension failed.');
        }
    };

    const handleGenerateKey = async () => {
        if (!isConnected) return alert('Please connect your wallet.');
        setIsGeneratingKey(true);
        try {
            const res = await fetch(`${API_URL}/api/api-keys`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` },
                body: JSON.stringify({ agentId: agent.id })
            });
            const data = await res.json();
            if (res.ok) {
                setApiKey(data.apiKey);
            } else {
                alert(data.error || 'Failed to generate key');
            }
        } catch (e) {
            alert('Network error');
        }
        setIsGeneratingKey(false);
    };

    const handleDelist = async () => {
        if (!window.confirm("Are you sure you want to delist this agent? This action cannot be entirely undone on-chain, but it will be removed from marketplace discovery.")) return;

        setIsDelisting(true);
        const result = await deleteAgent(agent.id);
        setIsDelisting(false);

        if (result && result.success) {
            alert('Agent successfully delisted.');
            navigate('/dashboard');
        } else {
            alert(result?.error || 'Delisting failed.');
        }
    };

    const handleDispute = async () => {
        if (!disputeReason) return alert("Please provide evidence/reason.");
        setIsDisputing(true);
        const res = await openDispute(purchaseRecord.escrowId, disputeReason);
        setIsDisputing(false);
        if (res.success) {
            alert('Dispute opened. Arbiter has been notified.');
            setShowDisputeForm(false);
        } else {
            alert(res.error || 'Failed to open dispute');
        }
    };

    return (
        <div className="details-container animate-fade-in-up">
            <nav style={{ marginBottom: '48px' }}>
                <Link to="/explore" className="back-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '14px', fontWeight: '700' }}>
                    <ArrowLeft size={16} />
                    <span>Back to Registry</span>
                </Link>
            </nav>

            <header className="details-header-v5">
                <div className="header-left-v5">
                    <div className="id-tag-v5">#{(agent.id % 1000).toString().padStart(3, '0')} RECOGNIZED</div>
                    <h1 className="agent-title-v5">{agent.name}</h1>
                    <div className="arch-line-v5">
                        <User size={14} />
                        <span>MASTER_ARCHITECT: <strong>@{agent.owner || 'independent'}</strong></span>
                        <div className="trust-meter-v5" style={{ backgroundColor: agent.trustTier === 'VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : agent.trustTier === 'REVIEWED' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: agent.trustTier === 'VERIFIED' ? '#10b981' : agent.trustTier === 'REVIEWED' ? '#3b82f6' : '#f59e0b', padding: '2px 8px', borderRadius: '4px' }}>
                            <ShieldCheck size={12} fill="currentColor" color="var(--bg)" />
                            <span style={{ fontWeight: 'bold' }}>{agent.trustTier || 'EXPERIMENTAL'} • {agent.trustScore || agent.creatorTrust || 10}</span>
                        </div>
                    </div>
                </div>

                <div className="header-right-v5">
                    <div className="price-card-v5" style={{ minWidth: '200px' }}>
                        <span className="price-label-v5">
                            {agent.pricingModel === 'RECURRING' ? 'SUBSCRIPTION (30 DAYS)' : 'LIFETIME ASSET'}
                        </span>
                        <div className="price-value-v5" style={{ fontSize: '24px' }}>
                            <Zap size={24} className="zap-glow" fill="currentColor" />
                            <span>{agent.price} {agent.currency || 'ETH'} {agent.pricingModel === 'RECURRING' && <span style={{ fontSize: '12px', color: '#94a3b8' }}>/mo</span>}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="details-dashboard-v5">
                {/* Main Content Area */}
                <div className="dashboard-content-v5">
                    <div className="description-box-v5">
                        <div className="box-label-v5">ENTITY_ABSTRACT</div>
                        <p>{agent.description || "Autonomous logic engine optimized for specialized task execution and production-scale workspace integration."}</p>
                    </div>

                    <div className="tabs-container-v5">
                        <div className="tabs-list-v5">
                            <button className={`tab-trigger-v5 ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>TECHNICAL_SPECS</button>
                            <button className={`tab-trigger-v5 ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>CORE_DOCUMENTATION</button>
                        </div>

                        <div className="tab-panel-v5">
                            {activeTab === 'specs' ? (
                                <div className="specs-grid-v5">
                                    <div className="spec-tile-v5">
                                        <span className="tile-label">ROLE</span>
                                        <span className="tile-val">{agent.role}</span>
                                    </div>
                                    <div className="spec-tile-v5">
                                        <span className="tile-label">MODEL</span>
                                        <span className="tile-val">{agent.model || 'GPT-4o MINIFIED'}</span>
                                    </div>
                                    <div className="spec-tile-v5">
                                        <span className="tile-label">CONTEXT</span>
                                        <span className="tile-val">128K TOKENS</span>
                                    </div>
                                    <div className="spec-tile-v5">
                                        <span className="tile-label">KERNEL</span>
                                        <span className="tile-val">{agent.framework || 'Custom-LangChain'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="docs-terminal-v5">
                                    <div className="terminal-top">
                                        <Terminal size={12} />
                                        <span>SHELL_DEPLOYMENT</span>
                                    </div>
                                    <div className="terminal-content">
                                        <code>$ npx openagent init --id {agent.id.toString().slice(-6)} --force</code>
                                        <button className="term-copy-btn" onClick={() => navigator.clipboard.writeText(`npx openagent init --id ${agent.id.toString().slice(-6)}`)}>COPY</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="security-module-v5">
                        <div className="box-label-v5">AUDIT & TAMPER PROOFING</div>
                        <div className="security-check-v5">
                            <ShieldCheck size={18} color="var(--brand-primary)" />
                            <div className="check-info-v5">
                                <span className="check-title-v5">SECURE_KERNEL_VERIFIED</span>
                                <span className="check-desc-v5">Registry compliance verified. On-chain checksum binding active.</span>
                            </div>
                        </div>

                        {agent.artifactHash && agent.artifactHash !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                            <div className="hash-verification-v5" style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: '3px solid var(--brand-primary)' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', marginBottom: '8px', letterSpacing: '0.05em' }}>IMMUTABLE ARTIFACT HASH (ON-CHAIN)</div>
                                <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#fff', wordBreak: 'break-all', marginBottom: '12px', background: '#000', padding: '10px', borderRadius: '8px' }}>
                                    {agent.artifactHash}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                                    <strong>How to verify:</strong> After downloading the source code zip, run <code style={{ color: '#e2e8f0', background: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>shasum -a 256 file.zip</code> in your terminal. The resulting hash must perfectly match the on-chain signature above to guarantee the code has not been tampered with.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Action Hub */}
                <aside className="dashboard-sidebar-v5">
                    <div className="identity-module-v5">
                        <AgentAvatar image={agent.image} name={agent.name} size="80%" />
                    </div>

                    <div className="action-panel-v5">
                        {!isOwner ? (
                            <>
                                {agent.pricingModel === 'RECURRING' ? (
                                    <>
                                        {subscription && subscription.status === 'ACTIVE' && new Date(subscription.expiresAt) > new Date() ? (
                                            <div style={{ marginBottom: '16px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
                                                <div style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <ShieldCheck size={16} /> ACTIVE SUBSCRIPTION
                                                </div>
                                                <div style={{ color: '#fff', fontSize: '11px', marginBottom: '12px' }}>
                                                    Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
                                                </div>
                                                <button
                                                    className="primary-buy-btn-v5"
                                                    style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '10px' }}
                                                    disabled={isPurchasing}
                                                    onClick={handleExtend}
                                                >
                                                    <Clock size={16} />
                                                    <span>{isPurchasing ? 'PROCESSING...' : 'EXTEND (+30 DAYS)'}</span>
                                                </button>

                                                {agent.deliveryType === 'API' && (
                                                    <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                                                        {apiKey ? (
                                                            <div>
                                                                <div style={{ color: '#f59e0b', fontSize: '11px', marginBottom: '4px' }}>YOUR API KEY (COPY NOW)</div>
                                                                <code style={{ background: '#000', padding: '8px', borderRadius: '4px', color: '#fff', display: 'block', wordBreak: 'break-all' }}>{apiKey}</code>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={handleGenerateKey}
                                                                disabled={isGeneratingKey}
                                                                style={{ width: '100%', background: '#3b82f6', border: 'none', color: '#fff', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                                            >
                                                                <Key size={16} /> {isGeneratingKey ? 'GENERATING...' : 'GENERATE API KEY'}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                className="primary-buy-btn-v5"
                                                disabled={isPurchasing}
                                                onClick={subscription ? handleExtend : handleSubscribe}
                                            >
                                                <Zap size={18} fill="currentColor" />
                                                <span>{isPurchasing ? 'PROCESSING...' : (subscription ? 'RENEW SUBSCRIPTION' : 'SUBSCRIBE NOW')}</span>
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        className="primary-buy-btn-v5"
                                        disabled={isPurchasing || hasBought}
                                        onClick={handlePurchase}
                                    >
                                        <Zap size={18} fill="currentColor" />
                                        <span>{isPurchasing ? 'VERIFYING...' : (hasBought ? 'SECURED' : 'INITIALIZE ACQUISITION')}</span>
                                    </button>
                                )}
                                {agent.trustTier === 'EXPERIMENTAL' && (
                                    <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', color: '#f59e0b', fontSize: '11px', textAlign: 'center', fontWeight: 'bold' }}>
                                        Experimental listing. Higher risk. Escrow is 72h.
                                    </div>
                                )}
                            </>
                        ) : (
                            <button
                                className="primary-buy-btn-v5"
                                style={{ background: 'var(--bg-card)', color: '#ff4d4d', border: '1px dashed #ff4d4d' }}
                                disabled={isDelisting}
                                onClick={handleDelist}
                            >
                                <Terminal size={18} />
                                <span>{isDelisting ? 'DELISTING...' : 'DELIST AGENT'}</span>
                            </button>
                        )}

                        <div className="utility-links-v5">
                            {agent.github && <a href={agent.github} target="_blank" rel="noreferrer" className="util-link-v5"><Github size={18} /> SOURCE</a>}
                            {agent.docs && <a href={agent.docs} target="_blank" rel="noreferrer" className="util-link-v5"><FileCode size={18} /> MANUAL</a>}
                        </div>

                        {purchaseRecord && escrowStatus && (
                            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', marginBottom: '8px', letterSpacing: '0.05em' }}>TRANSACTION SECURITY</div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '12px', color: '#fff' }}>Escrow Status:</span>
                                    <span style={{
                                        fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px',
                                        background: escrowStatus === 'CREATED' ? 'rgba(56, 189, 248, 0.2)' : escrowStatus === 'DISPUTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: escrowStatus === 'CREATED' ? '#38bdf8' : escrowStatus === 'DISPUTED' ? '#ef4444' : '#10b981'
                                    }}>
                                        {escrowStatus}
                                    </span>
                                </div>

                                {isEscrowActive && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <span style={{ fontSize: '12px', color: '#fff' }}>Protection Window:</span>
                                            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#f59e0b' }}>{timeLeft || 'Calculating...'}</span>
                                        </div>
                                        {!showDisputeForm ? (
                                            <button onClick={() => setShowDisputeForm(true)} style={{ width: '100%', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                                                OPEN DISPUTE
                                            </button>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                                                <textarea
                                                    placeholder="Describe the issue or provide evidence link..."
                                                    value={disputeReason}
                                                    onChange={(e) => setDisputeReason(e.target.value)}
                                                    style={{ width: '100%', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '6px', fontSize: '12px', minHeight: '60px' }}
                                                />
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button onClick={() => setShowDisputeForm(false)} style={{ flex: 1, background: '#333', border: 'none', color: '#fff', padding: '6px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>CANCEL</button>
                                                    <button onClick={handleDispute} disabled={isDisputing} style={{ flex: 1, background: '#ef4444', border: 'none', color: '#fff', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                                                        {isDisputing ? 'SUBMITTING...' : 'CONFIRM DISPUTE'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {canRate && !hasRated && (
                            <button className="secondary-action-v5" onClick={() => setHasRated(true)}>
                                <Star size={16} />
                                <span>CERTIFY ASSET</span>
                            </button>
                        )}

                        {hasRated && (
                            <div className="certified-msg-v5">
                                <ShieldCheck size={14} />
                                <span>ASSET CERTIFIED</span>
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            <div className="recommendations-container-v5">
                <div className="module-label-v5">PROPOSED_ALTERNATIVES</div>
                <div className="rec-grid-v5">
                    {similarAgents.map((rec) => (
                        <Link to={`/agent/${rec.id}`} key={rec.id} className="rec-card-v5">
                            <div className="rec-visual-v5">
                                <AgentAvatar image={rec.image} name={rec.name} size="60%" />
                            </div>
                            <div className="rec-info-v5">
                                <span className="rec-name-v5">{rec.name}</span>
                                <span className="rec-price-v5">{rec.price} {rec.currency || 'ETH'}</span>
                            </div>
                            <ArrowUpRight size={14} className="rec-arrow-v5" />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AgentDetails;
