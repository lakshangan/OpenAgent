import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Zap, Activity } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import AgentAvatar from './AgentAvatar';
import './AgentCard.css';

const AgentCard = ({ agent }) => {
    const { username, account } = useWallet();

    const isOwner = agent.owner === account || agent.owner === username;
    const ownerName = isOwner && username ? `@${username}` : (agent.owner ? `@${agent.owner.slice(0, 8)}` : '@builder');

    // Mocked details for "Detailed" effect
    const supports = React.useMemo(() => Math.floor(Math.random() * 80) + 12, []);
    const uptime = React.useMemo(() => (98 + Math.random() * 2).toFixed(2), []);
    const modelType = agent.model || 'GPT-4o';

    return (
        <Link to={`/agent/${agent.id}`} className="agent-item-card">
            <div className="agent-image-container">
                <AgentAvatar image={agent.image} name={agent.name} size="80%" />
                <div className="agent-badge-system">
                    <div className="badge-item active" style={{ backgroundColor: agent.trustTier === 'VERIFIED' ? '#10b981' : agent.trustTier === 'REVIEWED' ? '#3b82f6' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', color: 'white', fontWeight: 'bold' }}>
                        <ShieldCheck size={12} />
                        <span>{agent.trustTier} • {agent.trustScore || agent.creatorTrust || 10}</span>
                    </div>
                </div>
            </div>

            <div className="agent-content-area">
                <div className="agent-meta-top">
                    <span className="agent-id">ID #{(agent.id % 1000).toString().padStart(3, '0')}</span>
                    <span className="agent-model-tag">{modelType}</span>
                </div>

                <div className="agent-main-title">
                    <h3 className="agent-display-name">{agent.name}</h3>
                    <div className="agent-creator-line">
                        <ShieldCheck size={12} className="verified-icon" />
                        <span>{ownerName}</span>
                    </div>
                </div>

                <p className="agent-brief-description">
                    {agent.description || "Autonomous agent optimized for specialized task execution and logic processing."}
                </p>

                <div className="agent-stats-grid">
                    <div className="stat-unit">
                        <span className="stat-label">UPTIME</span>
                        <span className="stat-data">{uptime}%</span>
                    </div>
                    <div className="stat-unit" title="Trust Score reflects the total reliability.">
                        <span className="stat-label">TRUST</span>
                        <span className="stat-data">{agent.trustScore || agent.creatorTrust || 10}</span>
                    </div>
                </div>

                <div className="agent-pricing-footer">
                    <div className="price-container">
                        <span className="price-desc">Current List</span>
                        <div className="price-amount">
                            <Zap size={14} className="zap-icon" fill="currentColor" />
                            <span>{agent.price} {agent.currency || 'ETH'} {agent.pricingModel === 'RECURRING' && <span style={{ fontSize: '10px', color: '#94a3b8' }}>/mo</span>}</span>
                        </div>
                    </div>
                    <div className="agent-role-pill">{agent.role}</div>
                </div>
            </div>
        </Link>
    );
};

export default AgentCard;

