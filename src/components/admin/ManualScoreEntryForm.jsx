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

export default function ManualScoreEntryForm({
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

  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Fetch submissions dynamically when student is selected
  useEffect(() => {
    if (!selectedStudentId) {
      setSubmissions([]);
      setValue('submissionId', '');
      return;
    }

    let isMounted = true;
    setLoadingSubmissions(true);
    setSubmissions([]);
    setValue('submissionId', '');

    apiClient
      .get(`/assignment-submissions/student/${selectedStudentId}`)
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setSubmissions(list);
      })
      .catch((err) => {
        console.error('Failed to fetch student submissions:', err);
        if (isMounted) setSubmissions([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSubmissions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedStudentId, setValue]);

  const studentOptions = students.map((student) => ({
    value: student._id || student.id,
    label: `${getStudentName(student)} — ${student.enrollementNo || student.enrollmentNo || 'No ID'}`,
  }));

  const submissionOptions = submissions.map((sub) => {
    const title = sub.assignmentId?.title || 'Assignment Submission';
    const dateStr = sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '';
    return {
      value: sub._id || sub.id,
      label: `${title} ${dateStr ? `(Submitted: ${dateStr})` : ''}`,
    };
  });

  const submitForm = async (data) => {
    await onSubmit?.({
      studentId: data.studentId,
      submissionId: data.submissionId.trim(),
      manualScore: Number(data.manualScore),
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
            searchPlaceholder="Type student name or enrollment ID..."
            options={studentOptions}
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.studentId?.message}
            required
          />
        )}
      />

      <Controller
        name="submissionId"
        control={control}
        rules={{ required: 'Submission is required' }}
        render={({ field }) => (
          <SearchableSelect
            label="Assignment Submission"
            placeholder={
              !selectedStudentId
                ? 'Select a student first...'
                : loadingSubmissions
                ? 'Loading student submissions...'
                : submissions.length === 0
                ? 'No submissions found for this student'
                : 'Search and select assignment submission...'
            }
            searchPlaceholder="Type assignment title..."
            options={submissionOptions}
            value={field.value || ''}
            onChange={field.onChange}
            disabled={!selectedStudentId || loadingSubmissions || submissions.length === 0}
            error={errors.submissionId?.message}
            required
          />
        )}
      />

      <Input
        label="Manual Score (0–10)"
        type="number"
        min="0"
        max="10"
        step="0.1"
        error={errors.manualScore?.message}
        {...register('manualScore', {
          required: 'Manual score is required',
          valueAsNumber: true,
          min: {
            value: 0,
            message: 'Score cannot be below 0',
          },
          max: {
            value: 10,
            message: 'Score cannot exceed 10',
          },
        })}
      />

      <Textarea
        label="Reason"
        rows={3}
        placeholder="Explain why a manual score is required"
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
          {loading ? 'Saving...' : 'Enter Score'}
        </Button>
      </div>
    </form>
  );
}