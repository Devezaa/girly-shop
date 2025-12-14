
import React from 'react';
import CampaignGrid from '../components/CampaignGrid';

const Promotions = () => {
    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CampaignGrid showTitle={true} />
            </div>
        </div>
    );
};

export default Promotions;
