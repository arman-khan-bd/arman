import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export function Articles({ articles }: { articles: any[] }) {
  return (
    <Card className="shadow-lg bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Articles</CardTitle>
        <CardDescription>My thoughts on technology and development.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {articles.map((article, index) => (
            <Card key={index} className="transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl">
               <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-muted/50 rounded-lg">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {article.title}
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
