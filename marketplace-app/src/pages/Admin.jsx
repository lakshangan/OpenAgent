import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import {
    ShieldCheck,
    Trash2,
    BarChart3,
    Users,
    Bot,
    Settings,
    Search,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const { isConnected, account, username, marketplaceAgents, deleteAgent } = useWallet();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        totalVolume: '142.5 ETH',
        activeUsers: '1,240',
        totalAgents: marketplaceAgents.length,
        platformFees: '3.56 ETH'
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this entity from the registry? This action is permanent.')) {
            const result = await deleteAgent(id);
            if (!result.success) alert(`Failed to remove agent: ${result.error}`);
        }
    };

    // Mock Admin Authentication (In a real app, this would check against a list of admin addresses)
    const isAdmin = true; // For demo purposes

    if (!isConnected || !isAdmin) {
        return (
            <div className="container" style={{ padding: '200px 0', textAlign: 'center' }}>
                <Lock size={64} color="#333" style={{ margin: '0 auto 24px' }} />
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>Restricted Access</h2>
                <p style={{ color: '#666', marginBottom: '32px' }}>This terminal is reserved for platform administrators.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in-up" style={{ paddingTop: '160px', paddingBottom: '140px' }}>

            <div style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#555', fontSize: '12px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                        <ShieldCheck size={14} />
                        <span>ADMIN COMMAND CENTER</span>
                    </div>
                    <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '16px' }}>The Core.</h1>
                    <p style={{ color: '#666', maxWidth: '500px' }}>
                        Manage the collective's registry, monitor network health, and maintain platform integrity.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ padding: '20px 32px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', marginBottom: '8px' }}>GAS PRICE</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#4CAF50' }}>14 Gwei</div>
                    </div>
                    <div style={{ padding: '20px 32px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', marginBottom: '8px' }}>HEALTH</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>100%</div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '80px' }}>
                {[
                    { label: 'Total Volume', value: stats.totalVolume, icon: <BarChart3 size={18} /> },
                    { label: 'Active Spirits', value: stats.activeUsers, icon: <Users size={18} /> },
                    { label: 'Registry Size', value: stats.totalAgents, icon: <Bot size={18} /> },
                    { label: 'Protocol Revenue', value: stats.platformFees, icon: <ShieldCheck size={18} /> }
                ].map((stat, i) => (
                    <div key={i} style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ color: '#444' }}>{stat.icon}</div>
                            <ArrowUpRight size={14} color="#333" />
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: '#444', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}>{stat.label}</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Registry Management */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '32px', overflow: 'hidden' }}>
                <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Registry Management</h3>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
                        <input
                            type="text"
                            placeholder="Filter registry..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                background: '#000',
                                border: '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '12px 16px 12px 44px',
                                color: '#fff',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Table Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1.5fr 120px', padding: '20px 40px', background: 'rgba(255,255,255,0.02)', fontSize: '11px', fontWeight: '900', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <span>Autonomous Entity</span>
                        <span>Creator</span>
                        <span>Status</span>
                        <span>Visibility</span>
                        <span style={{ textAlign: 'right' }}>Actions</span>
                    </div>

                    {/* Table Rows */}
                    {marketplaceAgents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((agent, i) => (
                        <div key={agent.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1fr 1.5fr 120px', padding: '24px 40px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    <img src={agent.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <span style={{ fontWeight: '700', color: '#fff' }}>{agent.name}</span>
                            </div>
                            <span style={{ fontSize: '13px', color: '#666', fontFamily: 'var(--font-mono)' }}>{agent.creator || '@builder'}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50' }}></div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>Active</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', color: '#555' }}>FEATURED</span>
                                <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 8px', background: 'rgba(255,77,77,0.05)', borderRadius: '4px', color: '#ff4d4d' }}>HOT</span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#333'}>
                                    <Settings size={18} />
                                </button>
                                <button
                                    style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.color = '#ff4d4d'}
                                    onMouseLeave={(e) => e.target.style.color = '#333'}
                                    onClick={() => handleDelete(agent.id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '64px', display: 'flex', justifyContent: 'center' }}>
                <p style={{ fontSize: '12px', color: '#222', fontWeight: '700', letterSpacing: '0.1em' }}>
                    SECURE SHELL v1.0.4 - ALL ACTIONS ARE PERMANENT AND RECORDED.
                </p>
            </div>
        </div>
    );
};

export default Admin;
