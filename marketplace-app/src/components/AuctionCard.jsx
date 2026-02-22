import React from 'react';
import { Timer, Gavel } from 'lucide-react';
import './AuctionCard.css';
import agent3 from '../assets/agent3.png'; // Using the Muse agent as the auction item

const AuctionCard = () => {
    return (
        <div className="auction-card">
            <div className="auction-image">
                <img src={agent3} alt="Auction Item" />
                <div className="live-badge">
                    <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></span>
                    Live Bidding
                </div>
            </div>

            <div className="auction-info">
                <h3 className="auction-title">Muse V4: The Creative Sovereign</h3>
                <p className="auction-desc">
                    An autonomous creative director agent capable of generating complete brand identities, copy, and visual assets. Highly rare logic core.
                </p>

                <div className="bid-grid">
                    <div className="bid-item">
                        <h4>Current Bid</h4>
                        <div className="bid-value">12.5 ETH</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>$42,350 USD</div>
                    </div>
                    <div className="bid-item">
                        <h4>Auction Ends In</h4>
                        <div className="bid-value countdown">04h 12m 30s</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="btn btn-primary" style={{ flex: 1 }}>
                        Place Bid <Gavel size={18} />
                    </button>
                    <button className="btn btn-outline">
                        View History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuctionCard;
