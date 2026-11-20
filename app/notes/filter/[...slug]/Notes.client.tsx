'use client';

import { useState } from 'react';
import NoteList from '@/components/NoteList/NoteList';
import css from './notes.module.css';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebounce } from 'use-debounce';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

interface NotesClientProps {
  slug: string[];
}

const NotesClient = ({ slug }: NotesClientProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const [value] = useDebounce(search, 500);
  const notesQuery = useQuery({
    queryKey: ['notes', { value, page, perPage, slug }],
    queryFn: () =>
      fetchNotes({
        search: value,
        page,
        perPage,
        tag: slug[0] === 'all' ? undefined : slug[0],
      }),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });
  const notes = notesQuery.data?.notes ?? [];

  const totalPages = notesQuery.data?.totalPages ?? 1;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={search} setSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm
              onCreated={() => {
                setPage(1);
                closeModal();
              }}
              onClose={closeModal}
            />
          </Modal>
        )}
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
};

export default NotesClient;
