import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Megaphone } from 'lucide-react';

interface AnnouncementCardProps {
  title: string;
  content: string;
  date: string;
  isActive: boolean;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  content,
  date,
  isActive
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsDialogOpen(true)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? 'Aktif' : 'Tidak Aktif'}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(date).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="prose prose-sm max-w-none dark:prose-invert line-clamp-3"
            dangerouslySetInnerHTML={{ 
              __html: content.length > 150 ? content.substring(0, 150) + '...' : content 
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl">{title}</DialogTitle>
            </div>
            <DialogDescription className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div 
              className="prose prose-base max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnnouncementCard;