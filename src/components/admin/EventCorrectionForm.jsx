import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import apiClient from '../../api/apiClient';

import SearchableSelect from '../common/SearchableSelect';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

function getStudentName(student) {
  return (
    student?.userId?.name ||
    student?.user?.name ||
    student?.name ||
    'Unnamed student'
  );
}

export default function EventCorrectionForm({
  students = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedStudentId = watch('studentId');

  const [ledgerEvents, setLedgerEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Fetch ledger events dynamically when student is selected
  useEffect(() => {
    if (!selectedStudentId) {
      setLedgerEvents([]);
      setValue('ledgerEventId', '');
      return;
    }

    let isMounted = true;
    setLoadingEvents(true);
    setLedgerEvents([]);
    setValue('ledgerEventId', '');

    apiClient
      .get(`/marks/ledger/${selectedStudentId}`)
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setLedgerEvents(list);
      })
      .catch((err) => {
        console.error('Failed to fetch student ledger events:', err);
        if (isMounted) setLedgerEvents([]);
      })
      .finally(() => {
        if (isMounted) setLoadingEvents(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedStudentId, setValue]);

  const studentOptions = students.map((student) => ({
    value: student._id || student.id,
    label: `${getStudentName(student)} — ${student.enrollementNo || student.enrollmentNo || 'No ID'}`,
  }));

  const ledgerOptions = ledgerEvents.map((evt) => {
    const typeLabel = (evt.sourceType || 'EVENT').toUpperCase();
    const desc = evt.description || 'Ledger entry';
    const pts = evt.points !== undefined ? `${evt.points >= 0 ? '+' : ''}${evt.points} pts` : '';
    const dateStr = evt.createdAt ? new Date(evt.createdAt).toLocaleDateString() : '';
    return {
      value: evt._id || evt.id,
      label: `[${typeLabel}] ${desc} (${pts} — ${dateStr})`,
    };
  });

  const submitForm = async (data) => {
    await onSubmit?.({
      studentId: data.studentId,
      ledgerEventId: data.ledgerEventId.trim(),
      newMark: Number(data.newMark),
      reason: data.reason.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}
    >
      <Controller
        name="studentId"
        control={control}
        rules={{ required: 'Student is required' }}
        render={({ field }) => (
          <SearchableSelect
            label="Student"
            placeholder="Search and select student..."
            searchPlaceholder="Type student name or ID..."
            options={studentOptions}
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.studentId?.message}
            required
          />
        )}
      />

      <Controller
        name="ledgerEventId"
        control={control}
        rules={{ required: 'Ledger event is required' }}
        render={({ field }) => (
          <SearchableSelect
            label="Ledger Event"
            placeholder={
              !selectedStudentId
                ? 'Select a student first...'
                : loadingEvents
                ? 'Loading student ledger events...'
                : ledgerEvents.length === 0
                ? 'No ledger events found for this student'
                : 'Search and select ledger event to correct...'
            }
            searchPlaceholder="Type event description or type..."
            options={ledgerOptions}
            value={field.value || ''}
            onChange={field.onChange}
            disabled={!selectedStudentId || loadingEvents || ledgerEvents.length === 0}
            error={errors.ledgerEventId?.message}
            required
          />
        )}
      />

      <Input
        label="Corrected Mark"
        type="number"
        step="0.1"
        placeholder="Enter corrected score"
        error={errors.newMark?.message}
        {...register('newMark', {
          required: 'Corrected mark is required',
          valueAsNumber: true,
          validate: (value) =>
            Number.isFinite(value) || 'Enter a valid number',
        })}
      />

      <Textarea
        label="Reason"
        rows={3}
        placeholder="Explain why the event is being corrected"
        error={errors.reason?.message}
        {...register('reason', {
          required: 'Reason is required',
          minLength: {
            value: 20,
            message: 'Reason must contain at least 20 characters',
          },
        })}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--space-sm)',
        }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Correcting...' : 'Apply Correction'}
        </Button>
      </div>
    </form>
  );
}