import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Link } from 'react-router-dom';
import './AgentRanking.css';

const AgentRanking = () => {
    const { marketplaceAgents } = useWallet();

    return (
        <div className="rankings-table-container">
            <table className="rankings-table">
                <thead>
                    <tr>
                        <th>Agent</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>24h Vol</th>
                        <th>Owners</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {marketplaceAgents.map((agent, index) => (
                        <tr key={agent.id}>
                            <td>
                                <Link to={`/agent/${agent.id}`} className="agent-cell">
                                    <span className="rank-index">{index + 1}</span>
                                    <div className="table-avatar">
                                        <img src={agent.image} alt={agent.name} />
                                    </div>
                                    <span className="agent-name-cell">{agent.name}</span>
                                </Link>
                            </td>
                            <td>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{agent.role}</span>
                            </td>
                            <td>
                                <span style={{ fontWeight: '600' }}>{agent.price}</span> <span className="eth-icon">ETH</span>
                            </td>
                            <td>
                                {agent.volume24h} <span className="eth-icon">ETH</span>
                            </td>
                            <td>{agent.owners}</td>
                            <td>
                                <span className={`status-badge ${agent.status ? agent.status.toLowerCase() : ''}`}>{agent.status}</span>
                            </td>
                            <td>
                                <Link to={`/agent/${agent.id}`} className="buy-btn">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AgentRanking;
