import { useForm } from 'react-hook-form';
import Input from '../../common/Input';
import Textarea from '../../common/Textarea';
import Select from '../../common/Select';
import Button from '../../common/Button';

export default function AdminLectureForm({
    topics = [],
    defaultValues = null,
    onSubmit,
    onCancel,
}) {
    const topicOptions = topics.map((topic) => ({
        value: topic.id,
        label: topic.title,
    }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: defaultValues || {
            title: '',
            topicId: '',
            date: '',
            meetUrl: '',
            description: '',
        },
    });

    const submitForm = async (formData) => {
        await onSubmit?.({
            title: formData.title.trim(),
            topicId: formData.topicId,
            date: formData.date,
            meetUrl: formData.meetUrl.trim(),
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
                label="Lecture Title"
                name="title"
                placeholder="Example: Introduction to React Components"
                required
                error={errors.title?.message}
                {...register('title', {
                    required: 'Lecture title is required',
                    minLength: {
                        value: 3,
                        message: 'Lecture title must contain at least 3 characters',
                    },
                    maxLength: {
                        value: 120,
                        message: 'Lecture title cannot exceed 120 characters',
                    },
                })}
            />

            <Select
                label="Topic"
                name="topicId"
                options={[
                    {
                        value: '',
                        label: 'Select a topic',
                    },
                    ...topicOptions,
                ]}
                required
                error={errors.topicId?.message}
                {...register('topicId', {
                    required: 'Please select a topic',
                })}
            />

            <Input
                label="Lecture Date and Time"
                name="date"
                type="datetime-local"
                required
                error={errors.date?.message}
                {...register('date', {
                    required: 'Lecture date and time are required',
                })}
            />

            <Input
                label="Google Meet URL"
                name="meetUrl"
                type="url"
                placeholder="https://meet.google.com/abc-defg-hij"
                required
                error={errors.meetUrl?.message}
                {...register('meetUrl', {
                    required: 'Google Meet URL is required',
                    pattern: {
                        value: /^https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+\/?$/,
                        message: 'Enter a valid Google Meet URL',
                    },
                })}
            />

            <Textarea
                label="Description"
                name="description"
                placeholder="Add lecture agenda, learning objectives, or instructions"
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
                            ? 'Update Lecture'
                            : 'Schedule Lecture'}
                </Button>
            </div>
        </form>
    );
}