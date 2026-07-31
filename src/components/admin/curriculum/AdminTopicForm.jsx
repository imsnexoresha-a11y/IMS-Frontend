import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../../common/Input';
import Textarea from '../../common/Textarea';
import Button, { IconButton } from '../../common/Button';

export default function AdminTopicForm({
    onSubmit,
    onCancel,
    defaultValues = null,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: defaultValues?.title || '',
            description: defaultValues?.description || '',
            estimatedHours: defaultValues?.estimatedHours ?? 0,
        },
    });

    const [objectives, setObjectives] = useState(
        Array.isArray(defaultValues?.learningObjectives) && defaultValues.learningObjectives.length > 0
            ? defaultValues.learningObjectives
            : ['']
    );

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

    const submitForm = async (formData) => {
        const cleanObjectives = objectives.map((o) => o.trim()).filter(Boolean);
        await onSubmit?.({
            title: formData.title.trim(),
            description: formData.description?.trim() || '',
            estimatedHours: Number(formData.estimatedHours || 0),
            learningObjectives: cleanObjectives,
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-md)' }}>
                <Input
                    label="Topic Title"
                    name="title"
                    placeholder="Example: React Components and JSX"
                    required
                    error={errors.title?.message}
                    {...register('title', {
                        required: 'Topic title is required',
                        minLength: {
                            value: 3,
                            message: 'Topic title must contain at least 3 characters',
                        },
                        maxLength: {
                            value: 100,
                            message: 'Topic title cannot exceed 100 characters',
                        },
                    })}
                />

                <Input
                    label="Estimated Hours"
                    name="estimatedHours"
                    type="number"
                    step="0.5"
                    placeholder="2.5"
                    error={errors.estimatedHours?.message}
                    {...register('estimatedHours', {
                        min: { value: 0, message: 'Must be non-negative' },
                    })}
                />
            </div>

            <Textarea
                label="Description"
                name="description"
                placeholder="Enter a short description of the topic syllabus"
                rows={3}
                error={errors.description?.message}
                {...register('description', {
                    maxLength: {
                        value: 500,
                        message: 'Description cannot exceed 500 characters',
                    },
                })}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)' }}>
                    Learning Objectives
                </label>

                {objectives.map((obj, index) => (
                    <div key={index} style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder={`Objective ${index + 1}`}
                            value={obj}
                            onChange={(e) => handleObjectiveChange(index, e.target.value)}
                            style={{
                                flex: 1,
                                padding: 'var(--space-xs) var(--space-sm)',
                                border: '2px solid var(--color-neutral)',
                                backgroundColor: 'var(--color-surface)',
                                fontFamily: 'inherit',
                                fontSize: 'var(--text-sm)',
                            }}
                        />
                        {objectives.length > 1 && (
                            <IconButton
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveObjective(index)}
                                title="Remove objective"
                            >
                                <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                            </IconButton>
                        )}
                    </div>
                ))}

                {objectives.length < 10 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAddObjective}
                        style={{ alignSelf: 'flex-start', marginTop: 'var(--space-xs)' }}
                    >
                        <Plus size={14} /> Add Objective
                    </Button>
                )}
            </div>

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
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? 'Saving...'
                        : defaultValues
                            ? 'Update Topic'
                            : 'Create Topic'}
                </Button>
            </div>
        </form>
    );
}