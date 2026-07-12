import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button, { IconButton } from '../common/Button';

export default function TopicForm({ onSubmit, onCancel, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      estimatedHours: defaultValues?.estimatedHours ?? 0,
    }
  });

  const [objectives, setObjectives] = useState(defaultValues?.learningObjectives || ['']);

  const handleAddObjective = () => {
    if (objectives.length < 10) {
      setObjectives([...objectives, '']);
    }
  };

  const handleRemoveObjective = (index) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, idx) => idx !== index));
    }
  };

  const handleObjectiveChange = (index, value) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      learningObjectives: objectives.filter(o => o.trim() !== ''),
      estimatedHours: Number(data.estimatedHours),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-md)' }}>
        <Input
          label="Topic Title"
          name="title"
          required
          error={errors.title?.message}
          {...register('title', { required: 'Required' })}
        />
        <Input
          label="Estimated Hours"
          name="estimatedHours"
          type="number"
          step="0.1"
          required
          error={errors.estimatedHours?.message}
          {...register('estimatedHours', {
            required: 'Required',
            min: { value: 0, message: 'Must be non-negative' }
          })}
        />
      </div>

      <Textarea
        label="Description / Syllabus Details"
        name="description"
        required
        error={errors.description?.message}
        {...register('description', { required: 'Required' })}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)' }}>
          Learning Objectives (1 to 10)
        </label>
        
        {objectives.map((obj, index) => (
          <div key={index} style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
            <input
              type="text"
              placeholder={`Objective ${index + 1}`}
              value={obj}
              onChange={(e) => handleObjectiveChange(index, e.target.value)}
              required
              style={{
                flex: 1,
                padding: 'var(--space-xs) var(--space-sm)',
                border: '2px solid var(--color-neutral)',
                backgroundColor: 'var(--color-surface)',
                fontFamily: 'inherit',
                fontSize: 'var(--text-sm)'
              }}
            />
            {objectives.length > 1 && (
              <IconButton
                icon={Trash2}
                variant="danger"
                size="sm"
                label="Remove objective"
                onClick={() => handleRemoveObjective(index)}
              />
            )}
          </div>
        ))}

        {objectives.length < 10 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddObjective}
            style={{ alignSelf: 'flex-start', marginTop: 'var(--space-xxs)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={14} /> Add Objective
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">
          {defaultValues ? 'Update' : 'Create'} Topic
        </Button>
      </div>
    </form>
  );
}
