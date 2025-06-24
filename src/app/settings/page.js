'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useProjectContext } from '@/app/context/ProjectContext';

export default function SettingsPage() {
  const { statuses, addStatus, deleteStatus, isLoading } = useProjectContext();
  const [newStatus, setNewStatus] = useState('');

  const handleAddStatus = async () => {
    if (!newStatus.trim()) return;

    const success = await addStatus(newStatus.trim());
    if (success) {
      setNewStatus('');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Task Statuses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter new status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddStatus()}
            />
            <Button onClick={handleAddStatus}>
              <Plus className="w-4 h-4 mr-2" />
              Add Status
            </Button>
          </div>
          
          <div className="space-y-4">
            {statuses.map((status) => (
              <div key={status.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <span>{status.name}</span>
                <Button variant="destructive" size="icon" onClick={() => deleteStatus(status.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
