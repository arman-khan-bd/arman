import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export function Experience({ workExperience }: { workExperience: any[] }) {
  return (
    <Card className="shadow-lg bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Work Experience</CardTitle>
        <CardDescription>My professional journey.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-primary/20 pl-8 space-y-8">
          {workExperience.map((exp, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-primary/20 border-4 border-background" />
              <div className="p-1 rounded-md bg-background/0">
                <p className="text-sm text-muted-foreground">{exp.duration}</p>
                <h3 className="text-lg font-semibold mt-1">{exp.role}</h3>
                <p className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Building2 className="h-4 w-4" />
                  {exp.company}
                </p>
                <p className="mt-2 text-sm">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
