import { QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';

const Notes = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', ''],
    queryFn: () => fetchNotes({ search: '' }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
};

export default Notes;
