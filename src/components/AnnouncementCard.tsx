import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  return (
    <Card className="w-full">
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
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;