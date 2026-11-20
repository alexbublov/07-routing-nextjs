import { QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

const Notes = async ({ params }: NotesProps) => {
  const queryClient = new QueryClient();
  const { slug } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['notes', { value: '', page: 1, perPage: 12, slug }],
    queryFn: () =>
      fetchNotes({
        search: '',
        page: 1,
        perPage: 12,
        tag: slug[0] === 'all' ? undefined : slug[0],
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient slug={slug} />
    </HydrationBoundary>
  );
};

export default Notes;
