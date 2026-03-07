import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Zap, ShieldCheck, Terminal, User, Star, FileCode, Github,
    Globe, Shield, Activity, Brackets, Bot, ArrowUpRight, Clock, Key,
    Cpu, Database, BarChart3, Lock, Rocket, Users, Play, Image as ImageIcon,
    ExternalLink, MessageCircle, Info, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Share2, Award, Hexagon, Cloud, Layers, Coins, ListChecks
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import AgentAvatar from '../components/AgentAvatar';
import AgentCard from '../components/AgentCard';
import './AgentDetails.css';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

const AgentDetails = () => {
    const { id } = useParams();
    const { marketplaceAgents: agents = [], isConnected, account, username, buyAgent, deleteAgent, openDispute, subscribeToAgent, extendAgentSubscription, rawPurchases = [], purchasedAgents = [] } = useWallet();
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isDelisting, setIsDelisting] = useState(false);
    const [isGeneratingKey, setIsGeneratingKey] = useState(false);
    const [apiKey, setApiKey] = useState(null);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [subscription, setSubscription] = useState(null);
    const navigate = useNavigate();

    const agent = agents.find(a => a.id.toString() === id.toString());

    // Check if the current user is the owner
    const isOwner = agent && (
        (agent.owner && username && agent.owner.toLowerCase() === username.toLowerCase()) ||
        (agent.owner && account && agent.owner.toLowerCase() === account.toLowerCase())
    );

    const hasBought = useMemo(() => {
        return purchasedAgents.some(a => a.id.toString() === id.toString());
    }, [id, purchasedAgents]);

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
        } catch (e) { }
    };

    useEffect(() => {
        pollSubscription();
        const interval = setInterval(pollSubscription, 10000);
        return () => clearInterval(interval);
    }, [account, agent]);

    const handlePurchase = async () => {
        if (!isConnected) return alert('Please connect your wallet.');
        setIsPurchasing(true);
        const result = await buyAgent(agent);
        setIsPurchasing(false);
        if (result && result.success) {
            alert('Acquisition sequence complete.');
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
            alert('Subscription submitted.');
            setTimeout(pollSubscription, 5000);
        } else {
            alert(result?.error || 'Subscription failed.');
        }
    };

    const handleGenerateKey = async () => {
        setIsGeneratingKey(true);
        try {
            const res = await fetch(`${API_URL}/api/api-keys`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` },
                body: JSON.stringify({ agentId: agent.id })
            });
            const data = await res.json();
            if (res.ok) setApiKey(data.apiKey);
            else alert(data.error || 'Failed to generate key');
        } catch (e) { alert('Network error'); }
        setIsGeneratingKey(false);
    };

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

    const similarAgents = agents.filter(a => a.id !== agent.id && (a.role === agent.role || a.tags?.includes(agent.tags?.[0]))).slice(0, 5);

    const getVideoEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
        return url;
    };

    const videoUrl = getVideoEmbedUrl(agent.videoLink);
    const galleryItems = agent.gallery ? (Array.isArray(agent.gallery) ? agent.gallery : JSON.parse(agent.gallery)) : [];
    const mediaItems = [];
    if (videoUrl) mediaItems.push({ type: 'video', url: videoUrl });
    galleryItems.forEach(img => mediaItems.push({ type: 'image', url: `${API_URL}${img}` }));
    // If no media, use agent image
    if (mediaItems.length === 0 && agent.image) {
        mediaItems.push({ type: 'image', url: agent.image });
    }

    const nextMedia = () => setActiveMediaIndex(prev => (prev + 1) % mediaItems.length);
    const prevMedia = () => setActiveMediaIndex(prev => (prev - 1 + mediaItems.length) % mediaItems.length);

    const tags = agent.tags ? (typeof agent.tags === 'string' ? JSON.parse(agent.tags) : agent.tags) : [];

    return (
        <div className="agent-page-wrapper animate-fade-in">
            {/* Ambient Background Elements */}
            <div className="ambient-glow top-right"></div>
            <div className="ambient-glow bottom-left"></div>

            <div className="details-container">
                {/* Navigation & Header */}
                <nav className="details-top-nav">
                    <Link to="/explore" className="btn-back-refined">
                        <ArrowLeft size={18} />
                        <span>Back to Discovery</span>
                    </Link>
                    <div className="registry-badge">
                        <Hexagon size={14} className="icon-pulse" />
                        <span>REGISTRY_AUTH_ID: {agent.id.toString().slice(-8).toUpperCase()}</span>
                    </div>
                </nav>

                <div className="main-content-layout">
                    {/* LEFT COLUMN */}
                    <div className="primary-column">
                        {/* AGENT CORE INFO - MOVED UP */}
                        <div className="agent-profile-header">
                            <div className="header-top-row">
                                <div className="profile-identity">
                                    <div className="main-avatar-wrapper">
                                        <AgentAvatar image={agent.image} name={agent.name} size="100%" />
                                    </div>
                                    <div className="identity-text">
                                        <div className="tier-label">
                                            <Award size={12} />
                                            <span>{agent.trustTier || 'VERIFIED'} PROTOCOL</span>
                                        </div>
                                        <h1 className="agent-display-title">{agent.name}</h1>
                                        {agent.tagline && <p className="agent-tagline">{agent.tagline}</p>}
                                        <div className="creator-link">
                                            <span className="label">ARCHITECT</span>
                                            <span className="value">@{agent.owner || 'independent_dev'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="header-actions">
                                    <button className="action-btn-circle"><Share2 size={18} /></button>
                                    <button className="action-btn-circle"><Star size={18} /></button>
                                </div>
                            </div>
                        </div>

                        {/* COMPACT SHOWCASE ROW */}
                        <div className="showcase-technical-row">
                            {/* THE CAROUSEL */}
                            <div className="premium-carousel-container">
                                <div className="carousel-viewport">
                                    {mediaItems.length > 0 && (
                                        <div className="active-media-frame">
                                            {mediaItems[activeMediaIndex].type === 'video' ? (
                                                <iframe
                                                    src={mediaItems[activeMediaIndex].url}
                                                    title="Agent Video"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            ) : (
                                                <img src={mediaItems[activeMediaIndex].url} alt="Agent Showcase" />
                                            )}
                                        </div>
                                    )}

                                    {mediaItems.length > 1 && (
                                        <>
                                            <button className="carousel-nav prev" onClick={prevMedia} aria-label="Previous">
                                                <ChevronLeft size={24} />
                                            </button>
                                            <button className="carousel-nav next" onClick={nextMedia} aria-label="Next">
                                                <ChevronRight size={24} />
                                            </button>
                                        </>
                                    )}

                                    <div className="carousel-pagination">
                                        {mediaItems.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`pagination-dot ${activeMediaIndex === idx ? 'active' : ''}`}
                                                onClick={() => setActiveMediaIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Thumbnails below carousel */}
                                {mediaItems.length > 1 && (
                                    <div className="carousel-thumbnails">
                                        {mediaItems.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`thumb-item ${activeMediaIndex === idx ? 'selected' : ''}`}
                                                onClick={() => setActiveMediaIndex(idx)}
                                            >
                                                {item.type === 'video' ? (
                                                    <div className="thumb-video-placeholder"><Play size={16} /></div>
                                                ) : (
                                                    <img src={item.url} alt={`thumb-${idx}`} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* INLINE SPECS GRID - UTILIZING SPACE */}
                            <div className="inline-specs-panel">
                                <div className="blueprint-grid-compact">
                                    <div className="blueprint-cell">
                                        <div className="cell-content">
                                            <label>Core Model</label>
                                            <span>{agent.aiModel || agent.model || 'GPT-4o'}</span>
                                        </div>
                                    </div>
                                    <div className="blueprint-cell">
                                        <div className="cell-content">
                                            <label>Agent Type</label>
                                            <span>{agent.agentType || 'Code Package'}</span>
                                        </div>
                                    </div>
                                    <div className="blueprint-cell">
                                        <div className="cell-content">
                                            <label>Architecture</label>
                                            <span>{agent.architecture || 'Python'}</span>
                                        </div>
                                    </div>
                                    <div className="blueprint-cell">
                                        <div className="cell-content">
                                            <label>Complexity</label>
                                            <span>{agent.deploymentComplexity || 'Intermediate'}</span>
                                        </div>
                                    </div>
                                    <div className="blueprint-cell">
                                        <div className="cell-content">
                                            <label>Delivery</label>
                                            <span>{agent.deliveryType || 'Download'}</span>
                                        </div>
                                    </div>
                                    <div className="blueprint-cell">
                                        <div className="cell-content">
                                            <label>License</label>
                                            <span>{agent.license || 'MIT'}</span>
                                        </div>
                                    </div>

                                    <div className="tags-container-refined">
                                        <div className="domain-pill">{agent.role}</div>
                                        {tags.map(tag => (
                                            <span key={tag} className="spec-pill">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CAPABILITIES & USE CASE */}
                        <div className="details-highlights-row">
                            {agent.capabilities && (
                                <div className="info-section half-width">
                                    <h3 className="section-heading"><ListChecks size={18} /> KEY_CAPABILITIES</h3>
                                    <ul className="capabilities-list">
                                        {(typeof agent.capabilities === 'string' ? JSON.parse(agent.capabilities) : agent.capabilities).map((cap, idx) => (
                                            <li key={idx}><CheckCircle2 size={14} /> <span>{cap}</span></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {agent.useCase && (
                                <div className="info-section half-width">
                                    <h3 className="section-heading"><Users size={18} /> INTENDED_USERS</h3>
                                    <p className="use-case-text">{agent.useCase}</p>
                                </div>
                            )}
                        </div>

                        {/* DESCRIPTION */}
                        <div className="info-section">
                            <h3 className="section-heading"><Bot size={18} /> MISSION_MANIFESTO</h3>
                            <div className="rich-description">
                                {agent.description}
                            </div>
                        </div>

                        {/* FULL INFRASTRUCTURE */}
                        <div className="info-section">
                            <h3 className="section-heading"><Cpu size={18} /> EXTENDED_SPEC</h3>
                            <div className="blueprint-grid">
                                <div className="blueprint-cell">
                                    <div className="cell-icon"><Terminal size={16} /></div>
                                    <div className="cell-content">
                                        <label>Runtime Requirement</label>
                                        <span>{agent.runtime || 'Python 3.11'}</span>
                                    </div>
                                </div>
                                <div className="blueprint-cell">
                                    <div className="cell-icon"><Layers size={16} /></div>
                                    <div className="cell-content">
                                        <label>Source Visibility</label>
                                        <span>{agent.sourceVisibility || 'Open Source'}</span>
                                    </div>
                                </div>
                                <div className="blueprint-cell">
                                    <div className="cell-icon"><Clock size={16} /></div>
                                    <div className="cell-content">
                                        <label>Update Frequency</label>
                                        <span>{agent.updateFrequency || 'Actively maintained'}</span>
                                    </div>
                                </div>
                                <div className="blueprint-cell">
                                    <div className="cell-icon"><Database size={16} /></div>
                                    <div className="cell-content">
                                        <label>Context Window</label>
                                        <span>{agent.contextWindow || '128k'}</span>
                                    </div>
                                </div>
                                <div className="blueprint-cell">
                                    <div className="cell-icon"><Rocket size={16} /></div>
                                    <div className="cell-content">
                                        <label>Docker Required</label>
                                        <span>{agent.dockerRequired || 'No'}</span>
                                    </div>
                                </div>
                                <div className="blueprint-cell">
                                    <div className="cell-icon"><Zap size={16} /></div>
                                    <div className="cell-content">
                                        <label>GPU Required</label>
                                        <span>{agent.gpuRequired || 'No'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <aside className="secondary-column">
                        <div className="sticky-sidebar-content">
                            {/* TRANSACTION CARD */}
                            <div className="glass-card acquisition-box">
                                <div className="card-glare"></div>
                                <div className="price-header">
                                    <div className="price-tag">
                                        <Zap size={24} className="zap-icon-branded" fill="currentColor" />
                                        <span className="price-value">{agent.price}</span>
                                        <span className="currency-label">{agent.currency || 'ETH'}</span>
                                    </div>
                                    <div className="pricing-type">
                                        {agent.pricingModel === 'RECURRING' ? 'RECURRING_COMMITMENT' : 'LIFETIME_LICENSE'}
                                    </div>
                                </div>

                                <div className="acquisition-actions">
                                    {!isOwner ? (
                                        <button
                                            className={`btn-primary-glow ${hasBought ? 'btn-success' : ''}`}
                                            onClick={agent.pricingModel === 'RECURRING' ? handleSubscribe : handlePurchase}
                                            disabled={isPurchasing || (hasBought && agent.pricingModel !== 'RECURRING')}
                                        >
                                            {isPurchasing ? 'EXECUTING...' : (hasBought ? 'PROTOCOL_ACQUIRED' : 'Buy Agent')}
                                        </button>
                                    ) : (
                                        <div className="owner-action-group">
                                            <div className="owner-badge primary"><Info size={14} /> AUTHORIZED_CHAIRMAN</div>
                                            <button className="btn-danger-outline" onClick={() => deleteAgent(agent.id)}>PURGE_REGISTRY</button>
                                        </div>
                                    )}
                                </div>

                                {hasBought && (
                                    <div className="success-access-panel">
                                        <div className="access-info">
                                            <CheckCircle2 size={16} color="#00ff88" />
                                            <span>Authority established. Registry access granted.</span>
                                        </div>
                                        {agent.deliveryType === 'API' && (
                                            <div className="api-generation">
                                                {apiKey ? (
                                                    <div className="secure-key-display">
                                                        <code>{apiKey}</code>
                                                        <button onClick={() => {
                                                            navigator.clipboard.writeText(apiKey);
                                                        }}><BarChart3 size={14} /></button>
                                                    </div>
                                                ) : (
                                                    <button className="btn-key-gen" onClick={handleGenerateKey} disabled={isGeneratingKey}>
                                                        {isGeneratingKey ? 'GENERATING...' : 'GENERATE_ACCESS_KEY'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {agent.deliveryType === 'DOWNLOAD' && (
                                            <button className="btn-download-full" onClick={() => {
                                                window.open(`${API_URL}/api/agents/${agent.id}/download?account=${account}`, '_blank');
                                            }}>
                                                <Rocket size={16} /> DOWNLOAD_SOURCE_CODE
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* CONNECTIVITY */}
                            <div className="glass-card links-panel">
                                <h4 className="sidebar-group-title">CONNECTIVITY</h4>
                                <div className="nav-links-stack">
                                    {agent.github && (
                                        <a href={agent.github} target="_blank" rel="noreferrer" className="refined-link">
                                            <Github size={18} />
                                            <span>Repository</span>
                                            <ArrowUpRight size={14} className="icon-end" />
                                        </a>
                                    )}
                                    {agent.docs && (
                                        <a href={agent.docs} target="_blank" rel="noreferrer" className="refined-link">
                                            <FileCode size={18} />
                                            <span>Documentation</span>
                                            <ArrowUpRight size={14} className="icon-end" />
                                        </a>
                                    )}
                                    {agent.website && (
                                        <a href={agent.website} target="_blank" rel="noreferrer" className="refined-link">
                                            <Globe size={18} />
                                            <span>Deployment Demo</span>
                                            <ArrowUpRight size={14} className="icon-end" />
                                        </a>
                                    )}
                                    {agent.discord && (
                                        <a href={agent.discord} target="_blank" rel="noreferrer" className="refined-link">
                                            <MessageCircle size={18} />
                                            <span>Community Node</span>
                                            <ArrowUpRight size={14} className="icon-end" />
                                        </a>
                                    )}
                                    {agent.telegram && (
                                        <a href={agent.telegram.startsWith('http') ? agent.telegram : `https://t.me/${agent.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="refined-link">
                                            <MessageCircle size={18} />
                                            <span>Telegram Feed</span>
                                            <ArrowUpRight size={14} className="icon-end" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* VERIFICATION */}
                            <div className="verification-card-refined">
                                <div className="verified-status">
                                    <ShieldCheck size={20} color="#00ff88" />
                                    <div className="status-text">
                                        <span className="main">SECURE_REGISTRY_VERIFIED</span>
                                        <span className="sub">On-chain identity confirmed by protocol</span>
                                    </div>
                                </div>
                                {agent.artifactHash && (
                                    <div className="hash-display">
                                        <label>ARTIFACT_INTEGRITY_HASH</label>
                                        <code>{agent.artifactHash.slice(0, 32)}...</code>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* SIMILAR AGENTS */}
                {similarAgents.length > 0 && (
                    <footer className="suggestions-footer">
                        <div className="footer-header">
                            <div className="label-set">
                                <div className="dot"></div>
                                <span>SIMILAR_NODES_DISCOVERED</span>
                            </div>
                            <h2 className="footer-title">Explore Related Entities</h2>
                        </div>
                        <div className="suggestions-grid">
                            {similarAgents.map(a => (
                                <AgentCard key={a.id} agent={a} />
                            ))}
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default AgentDetails;
