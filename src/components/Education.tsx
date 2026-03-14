import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export function Education({ education }: { education: any[] }) {
    return (
        <Card className="shadow-lg bg-card/50">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Education</CardTitle>
                <CardDescription>My academic background.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative border-l-2 border-primary/20 pl-8 space-y-8">
                    {education.map((edu, index) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-primary/20 border-4 border-background" />
                             <div className="p-1 rounded-md bg-background/0">
                                <p className="text-sm text-muted-foreground">{edu.duration}</p>
                                <h3 className="text-lg font-semibold mt-1">{edu.degree}</h3>
                                <p className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <GraduationCap className="h-4 w-4" />
                                    {edu.school}
                                </p>
                             </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
