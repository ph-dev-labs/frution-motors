import { StatCard } from '@/util/types';
import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard: React.FC<StatCard> = ({ title, value, icon: Icon, color }) => {
  return (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center gap-4">
          <div className="py-2">
            <h6 className="text-muted mb-2 fs-6">{title}</h6>
            <h6 className="mb-0 fw-bold">{value}</h6>
          </div>
          <div className={`bg-${color} bg-opacity-10 p-4 rounded-3`}>
            <Icon size={28} className={`text-${color}`} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;