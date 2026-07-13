import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

const EMPTY_VALUES = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
};

function formatDateForInput(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

export default function CreateBatchForm({
  onSubmit,
  onCancel,
  teachers = [],
  defaultValues = null,
}) {
  const isEditing = Boolean(defaultValues);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: EMPTY_VALUES,
  });

  const selectedTeacherIds =
    watch('teacherIds') || [];

  useEffect(() => {
    reset(
      defaultValues
        ? {
          name: defaultValues.name || '',
          description:
            defaultValues.description || '',
          startDate: formatDateForInput(
            defaultValues.startDate
          ),
          endDate: formatDateForInput(
            defaultValues.endDate
          ),
          teacherIds:
            defaultValues.teacherIds?.map(
              (teacher) =>
                typeof teacher === 'object'
                  ? teacher._id || teacher.id
                  : teacher
            ) || [],
        }
        : {
          ...EMPTY_VALUES,
          teacherIds: [],
        }
    );
  }, [defaultValues, reset]);

  const toggleTeacher = (teacherId) => {
    const currentIds = Array.isArray(
      selectedTeacherIds
    )
      ? selectedTeacherIds
      : [];

    const nextIds = currentIds.includes(
      teacherId
    )
      ? currentIds.filter(
        (id) => id !== teacherId
      )
      : [...currentIds, teacherId];

    setValue('teacherIds', nextIds, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleFormSubmit = async (formData) => {
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <
      new Date(formData.startDate)
    ) {
      throw new Error(
        'End date cannot be before start date.'
      );
    }

    await onSubmit?.({
      name: formData.name.trim(),
      description:
        formData.description?.trim() || '',
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      teacherIds: formData.teacherIds || [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }}
    >
      <Input
        label="Batch Name"
        name="name"
        required
        placeholder="e.g. Full-Stack Batch 2026"
        error={errors.name?.message}
        {...register('name', {
          required: 'Batch name is required',
        })}
      />

      <Textarea
        label="Description"
        name="description"
        placeholder="Describe the batch"
        {...register('description')}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-md)',
        }}
      >
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate')}
        />

        <Input
          label="End Date"
          name="endDate"
          type="date"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      <div>
        <div
          style={{
            marginBottom: 'var(--space-sm)',
            fontWeight: 'var(--font-bold)',
          }}
        >
          Assign Teachers
        </div>

        {teachers.length === 0 ? (
          <p
            style={{
              color:
                'var(--color-text-secondary)',
              fontSize: 'var(--text-sm)',
            }}
          >
            No teachers are currently available.
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-xs)',
              maxHeight: '180px',
              overflowY: 'auto',
              padding: 'var(--space-sm)',
              border: 'var(--border)',
            }}
          >
            {teachers.map((teacher) => {
              const teacherId =
                teacher.id || teacher._id;

              return (
                <label
                  key={teacherId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTeacherIds.includes(
                      teacherId
                    )}
                    onChange={() =>
                      toggleTeacher(teacherId)
                    }
                  />

                  <span>
                    <strong>
                      {teacher.name}
                    </strong>
                    {teacher.designation
                      ? ` — ${teacher.designation}`
                      : ''}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : isEditing
              ? 'Update Batch'
              : 'Create Batch'}
        </Button>
      </div>
    </form>
  );
}