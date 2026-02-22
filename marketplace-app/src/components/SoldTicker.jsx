import React from 'react';
import { useWallet } from '../context/WalletContext';
import './SoldTicker.css';

const SoldTicker = () => {
    const { marketplaceAgents } = useWallet();
    // Duplicate list to create seamless loop
    const agents = [...marketplaceAgents, ...marketplaceAgents, ...marketplaceAgents];

    return (
        <div className="sold-slider-container">
            <div className="sold-track">
                {agents.map((agent, index) => (
                    <div key={`${agent.id}-${index}`} className="sold-card">
                        <div className="sold-avatar">
                            <img src={agent.image} alt={agent.name} />
                        </div>
                        <div className="sold-info">
                            <span className="sold-name">{agent.name}</span>
                            <span className="sold-price">{agent.price} ETH</span>
                        </div>
                        <span className="sold-label">SOLD</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SoldTicker;
