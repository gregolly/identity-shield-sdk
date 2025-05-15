
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointer, Keyboard, Eye, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const UserBehavior = () => {
  const [behaviorData, setBehaviorData] = useState({
    timeOnPage: 0,
    mouseMovements: 0,
    keyPresses: 0,
    clicks: 0,
    scrollPercentage: 0,
    tabFocusChanges: 0,
  });
  
  useEffect(() => {
    // Update the component with the latest behavior data every second
    const interval = setInterval(() => {
      if (window.nexFraudData?.behavior) {
        setBehaviorData({
          timeOnPage: window.nexFraudData.behavior.timeOnPage,
          mouseMovements: window.nexFraudData.behavior.mouseMovements,
          keyPresses: window.nexFraudData.behavior.keyPresses,
          clicks: window.nexFraudData.behavior.clicks,
          scrollPercentage: window.nexFraudData.behavior.scrollPercentage,
          tabFocusChanges: window.nexFraudData.behavior.tabFocusChanges,
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MousePointer className="h-5 w-5" />
          User Behavior
        </CardTitle>
        <CardDescription>Real-time interaction metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Time on page:</span>
              </div>
              <span>{formatTime(behaviorData.timeOnPage)}</span>
            </div>
            <Progress value={Math.min(behaviorData.timeOnPage / 3, 100)} className="h-2" />
          </div>
          
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <MousePointer className="h-3 w-3" />
                <span>Mouse movements:</span>
              </div>
              <span>{behaviorData.mouseMovements}</span>
            </div>
            <Progress value={Math.min(behaviorData.mouseMovements / 2, 100)} className="h-2" />
          </div>
          
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <Keyboard className="h-3 w-3" />
                <span>Key presses:</span>
              </div>
              <span>{behaviorData.keyPresses}</span>
            </div>
            <Progress value={Math.min(behaviorData.keyPresses / 0.5, 100)} className="h-2" />
          </div>
          
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Scroll depth:</span>
              <span>{behaviorData.scrollPercentage}%</span>
            </div>
            <Progress value={behaviorData.scrollPercentage} className="h-2" />
          </div>
          
          <div className="pt-2 text-xs text-muted-foreground border-t flex justify-between">
            <span>Tab switches: {behaviorData.tabFocusChanges}</span>
            <span>Clicks: {behaviorData.clicks}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBehavior;
