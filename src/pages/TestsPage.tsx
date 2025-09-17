import React from 'react';
import PageTitle from '../components/PageTitle';

const TestsPage: React.FC = () => {
    return (
        <div>
            <PageTitle title="Self-Assessment Tests" subtitle="Gain insights into your mental well-being." />
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h3 className="text-2xl font-semibold text-gray-700">Coming Soon!</h3>
                <p className="mt-2 text-gray-500">We are developing a set of tools to help you understand yourself better. Please check back later.</p>
            </div>
        </div>
    );
};

export default TestsPage;
