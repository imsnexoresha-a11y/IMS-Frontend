import { useForm } from 'react-hook-form';
import Input from '../../common/Input';
import Textarea from '../../common/Textarea';
import Button from '../../common/Button';

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
        defaultValues: defaultValues || {
            title: '',
            description: '',
        },
    });

    const submitForm = async (formData) => {
        await onSubmit?.({
            title: formData.title.trim(),
            description: formData.description?.trim() || '',
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

            <Textarea
                label="Description"
                name="description"
                placeholder="Enter a short description or learning objective"
                rows={4}
                error={errors.description?.message}
                {...register('description', {
                    maxLength: {
                        value: 500,
                        message: 'Description cannot exceed 500 characters',
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